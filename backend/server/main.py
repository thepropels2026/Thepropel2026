# Import the FastAPI framework for building APIs
import os
import requests
import json
import uuid
import resend
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

# Resend Configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY

# Configure CORS middleware settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a data model for checkout requests
class CheckoutRequest(BaseModel):
    tool_id: str
    user_email: str
    amount: float

# Utility function to send credentials email
def send_credentials_email(email, tool_name, assigned_link, amount, order_id):
    try:
        resend.Emails.send({
            "from": "The Propels <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Access Granted: {tool_name} Credentials Inside!",
            "html": f"""
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px;">
                    <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Order Confirmed!</h2>
                    <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Thank you for your purchase. Your premium access for <strong>{tool_name}</strong> is now active.</p>
                    
                    <div style="background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                        <p style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Your Activation Link</p>
                        <a href="{assigned_link}" style="color: #0891b2; font-size: 14px; font-weight: 700; text-decoration: none; word-break: break-all;">{assigned_link}</a>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                        <tr>
                            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Order ID</td>
                            <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{order_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Total Paid</td>
                            <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">₹{amount}</td>
                        </tr>
                    </table>
                    
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">If you have any issues with your access, please reply to this email or contact support.</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;">
                    <p style="color: #0f172a; font-size: 14px; font-weight: 700;">The Propels Team</p>
                </div>
            """
        })
        print(f"SUCCESS: Credentials email sent to {email}")
    except Exception as e:
        print(f"RESEND ERROR: {str(e)}")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to The Propels API. All systems nominal."}

# Endpoint to initiate a Cashfree checkout session
@app.post("/api/checkout")
async def create_checkout_session(req: CheckoutRequest):
    tool_resp = supabase.table("tools_cards").select("*").eq("id", req.tool_id).execute()
    if not tool_resp.data:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    
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
            "customer_phone": "9999999999"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        order_data = response.json()
    except Exception as e:
        print(f"ERROR: Cashfree Order Creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")
    
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
    data = json.loads(payload)
    
    event_type = data.get("type")
    order_data = data.get("data", {}).get("order", {})
    order_id = order_data.get("order_id")
    
    if event_type == "PAYMENT_SUCCESS_COMPLETED":
        trans_resp = supabase.table("transactions").select("*").eq("cashfree_order_id", order_id).execute()
        if not trans_resp.data:
            return {"status": "ignored"}
        
        transaction = trans_resp.data[0]
        if transaction["status"] == "completed":
            return {"status": "already_processed"}
            
        tool_resp = supabase.table("tools_cards").select("*").eq("id", transaction["tool_id"]).execute()
        tool = tool_resp.data[0]
        pool = tool.get("voucher_pool", [])
        
        if not pool:
            print(f"CRITICAL: Voucher Pool Empty for tool {tool['id']}")
            return {"status": "error", "message": "No vouchers available"}
            
        assigned_link = pool.pop(0)
        
        supabase.table("tools_cards").update({"voucher_pool": pool}).eq("id", tool["id"]).execute()
        
        supabase.table("transactions").update({
            "status": "completed",
            "assigned_link": assigned_link
        }).eq("cashfree_order_id", order_id).execute()
        
        # SEND EMAIL WITH CREDENTIALS
        send_credentials_email(
            email=transaction["user_email"],
            tool_name=tool["title"],
            assigned_link=assigned_link,
            amount=transaction["amount"],
            order_id=order_id
        )
        
        return {"status": "success"}
    
    return {"status": "received"}

# Redirection endpoint to mask the actual coupon/promo URL
@app.get("/api/activate/{order_id}")
async def activate_premium(order_id: str):
    trans_resp = supabase.table("transactions").select("*").eq("cashfree_order_id", order_id).execute()
    if not trans_resp.data:
        raise HTTPException(status_code=404, detail="Order not found")
        
    transaction = trans_resp.data[0]
    if transaction["status"] != "completed" or not transaction["assigned_link"]:
        raise HTTPException(status_code=400, detail="Payment not verified.")
        
    return RedirectResponse(url=transaction["assigned_link"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
