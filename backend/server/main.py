# Import the FastAPI framework for building APIs
import os
import requests
import json
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the FastAPI application with a custom title
app = FastAPI(title="The Propels API")

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
# Create Supabase client instance
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cashfree Configuration
CASHFREE_APP_ID = os.getenv("CASHFREE_APP_ID", "TEST104193478b056158097b69335f6374391401")
CASHFREE_SECRET_KEY = os.getenv("CASHFREE_SECRET_KEY", "cfsk_ma_test_9567990497554f76cc39247f005691e8_95a049d5")
CASHFREE_MODE = os.getenv("CASHFREE_MODE", "sandbox")
# Determine Cashfree base URL based on mode
CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg" if CASHFREE_MODE == "sandbox" else "https://api.cashfree.com/pg"

# Configure CORS middleware settings
app.add_middleware(
    CORSMiddleware,
    # Allow requests from all origins (useful for development/testing)
    allow_origins=["*"],
    # Allow sending credentials such as cookies or authorization headers
    allow_credentials=True,
    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_methods=["*"],
    # Allow all HTTP headers in the request
    allow_headers=["*"],
)

# Define a data model for checkout requests
class CheckoutRequest(BaseModel):
    tool_id: str
    user_email: str
    amount: float

# Root endpoint to verify if the API is running
@app.get("/")
def read_root():
    return {"message": "Welcome to The Propels API. All systems nominal."}

# Endpoint to initiate a Cashfree checkout session
@app.post("/api/checkout")
async def create_checkout_session(req: CheckoutRequest):
    # 1. Fetch tool details from Supabase to verify existence
    tool_resp = supabase.table("tools_cards").select("*").eq("id", req.tool_id).execute()
    if not tool_resp.data:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    tool = tool_resp.data[0]
    
    # 2. Generate a unique Order ID for tracking
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    
    # 3. Request Order creation from Cashfree
    url = f"{CASHFREE_BASE_URL}/orders"
    headers = {
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "order_id": order_id,
        "order_amount": req.amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": req.user_email.replace("@", "_").replace(".", "_"),
            "customer_email": req.user_email,
            "customer_phone": "9999999999" # Required by Cashfree
        },
        "order_meta": {
            # Redirect user back to the activation page after payment
            "return_url": f"http://localhost:3000/activate/{order_id}"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        order_data = response.json()
    except Exception as e:
        print(f"ERROR: Cashfree Order Creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")
    
    # 4. Record the pending transaction in Supabase
    supabase.table("transactions").insert({
        "cashfree_order_id": order_id,
        "user_email": req.user_email,
        "tool_id": req.tool_id,
        "amount": req.amount,
        "status": "pending"
    }).execute()
    
    return {
        "payment_session_id": order_data.get("payment_session_id"),
        "order_id": order_id
    }

# Webhook endpoint to handle Cashfree payment notifications
@app.post("/api/payment-webhook")
async def payment_webhook(request: Request):
    payload = await request.body()
    # Parse the webhook notification data
    data = json.loads(payload)
    
    event_type = data.get("type")
    order_data = data.get("data", {}).get("order", {})
    order_id = order_data.get("order_id")
    
    # Process only successful payment completions
    if event_type == "PAYMENT_SUCCESS_COMPLETED":
        # 1. Retrieve the corresponding transaction
        trans_resp = supabase.table("transactions").select("*").eq("cashfree_order_id", order_id).execute()
        if not trans_resp.data:
            return {"status": "ignored"}
        
        transaction = trans_resp.data[0]
        # Avoid duplicate processing
        if transaction["status"] == "completed":
            return {"status": "already_processed"}
            
        # 2. Fetch the tool to access its voucher pool
        tool_resp = supabase.table("tools_cards").select("*").eq("id", transaction["tool_id"]).execute()
        tool = tool_resp.data[0]
        pool = tool.get("voucher_pool", [])
        
        if not pool:
            print(f"CRITICAL: Voucher Pool Empty for tool {tool['id']}")
            return {"status": "error", "message": "No vouchers available"}
            
        # 3. Assign the next available voucher link
        assigned_link = pool.pop(0)
        
        # 4. Update the tool's remaining vouchers in the database
        supabase.table("tools_cards").update({"voucher_pool": pool}).eq("id", tool["id"]).execute()
        
        # 5. Finalize the transaction with the assigned link
        supabase.table("transactions").update({
            "status": "completed",
            "assigned_link": assigned_link
        }).eq("cashfree_order_id", order_id).execute()
        
        return {"status": "success"}
    
    return {"status": "received"}

# Redirection endpoint to mask the actual coupon/promo URL
@app.get("/api/activate/{order_id}")
async def activate_premium(order_id: str):
    # 1. Fetch transaction details to get the assigned link
    trans_resp = supabase.table("transactions").select("*").eq("cashfree_order_id", order_id).execute()
    if not trans_resp.data:
        raise HTTPException(status_code=404, detail="Order not found")
        
    transaction = trans_resp.data[0]
    # Ensure the order is paid and a link is assigned
    if transaction["status"] != "completed" or not transaction["assigned_link"]:
        # Fallback if webhook hasn't processed yet
        raise HTTPException(status_code=400, detail="Payment not yet verified. Please wait a few seconds and refresh.")
        
    # 2. Server-Side Redirect to the official site with the coupon
    # This keeps the long promo URL out of the user's browser history/status bar
    return RedirectResponse(url=transaction["assigned_link"])

# Execution block to run the server locally
if __name__ == "__main__":
    import uvicorn
    # Start the server on 0.0.0.0:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
