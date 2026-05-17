# Import the FastAPI framework for building APIs
import os
import requests
import json
import uuid
import resend
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
# Try local then parent directories to find the project root .env
if os.path.exists(".env.local"):
    load_dotenv(".env.local")
elif os.path.exists("../../.env.local"):
    load_dotenv("../../.env.local")
else:
    load_dotenv()

# Initialize the FastAPI application with a custom title
app = FastAPI(title="The Propels API")

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Supabase credentials missing. Client initialization skipped.")
    supabase = None
else:
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

# In-memory OTP storage
otp_storage = {}

# Models for OTP and Auth
class OTPRequest(BaseModel):
    email: str = None
    mobile: str = None

class OTPVerifyRequest(BaseModel):
    email: str = None
    mobile: str = None
    otp: str

# Define a data model for checkout requests
class CheckoutRequest(BaseModel):
    tool_ids: list[str]
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


@app.post("/api/auth/send-otp")
async def send_otp(req: OTPRequest):
    import random
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    if req.email:
        try:
            resend.Emails.send({
                "from": "The Propels <auth@resend.dev>",
                "to": [req.email],
                "subject": "Your Verification Code",
                "html": f"Your verification code is: <strong>{otp}</strong>"
            })
            otp_storage[req.email] = otp
            return {"status": "success", "message": f"OTP sent to {req.email}"}
        except Exception as e:
            print(f"[WARN] Resend email send failed: {str(e)}. Falling back to mock email OTP.")
            otp_storage[req.email] = otp
            return {
                "status": "success", 
                "message": f"OTP sent to {req.email} (Mock Fallback)", 
                "debug_otp": otp,
                "warning": "Resend API failed. Check server logs/response for code."
            }
    if req.mobile:
        print(f"MOCK SMS: OTP for {req.mobile} is {otp}")
        otp_storage[req.mobile] = otp
        return {"status": "success", "message": f"OTP sent to {req.mobile} (Mocked)", "debug_otp": otp}
    raise HTTPException(status_code=400, detail="Either email or mobile must be provided")

@app.post("/api/auth/verify-otp")
async def verify_otp(req: OTPVerifyRequest):
    identifier = req.email or req.mobile
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier missing")
    if identifier in otp_storage and otp_storage[identifier] == req.otp:
        return {"status": "success", "message": "OTP verified"}
    raise HTTPException(status_code=400, detail="Invalid or expired OTP")

@app.post("/api/auth/check-email")
async def check_email(req: OTPRequest):
    if not req.email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    try:
        # Query Supabase profiles table
        res = supabase.table("profiles").select("id").eq("email", req.email).execute()
        return {"exists": len(res.data) > 0}
    except Exception as e:
        print(f"SUPABASE ERROR (check_email): {str(e)}")
        # If table doesn't exist yet, we treat it as "not exists" to allow registration
        return {"exists": False, "warning": "Profiles table may not be initialized"}

# Root endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/tools")
async def get_tools():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    
    try:
        # Fetch all tools from the tools_cards table
        resp = supabase.table("tools_cards").select("*").order("created_at", desc=True).execute()
        return resp.data
    except Exception as e:
        print(f"Error fetching tools: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Welcome to The Propels API. All systems nominal."}

# Endpoint to initiate a Cashfree checkout session
@app.post("/api/checkout")
async def create_checkout_session(req: CheckoutRequest):
    # Verify tools exist
    tools_resp = supabase.table("tools_cards").select("*").in_("id", req.tool_ids).execute()
    if not tools_resp.data:
        raise HTTPException(status_code=404, detail="No valid tools found")
    
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    
    # Create order in database
    order_data_insert = {
        "cashfree_order_id": order_id,
        "user_email": req.user_email,
        "total_amount": req.amount,
        "status": "pending"
    }
    
    try:
        order_res = supabase.table("orders").insert(order_data_insert).execute()
        db_order_id = order_res.data[0]["id"]
        
        # Create order items
        order_items = []
        for tool in tools_resp.data:
            order_items.append({
                "order_id": db_order_id,
                "tool_id": tool["id"],
                "amount": tool.get("discount_price") or tool["price"]
            })
        
        supabase.table("order_items").insert(order_items).execute()
        
    except Exception as e:
        print(f"DB ERROR: Failed to create order: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error during order creation")

    # Call Cashfree to create payment order
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
        cf_order_data = response.json()
    except Exception as e:
        print(f"ERROR: Cashfree Order Creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")
    
    return {
        "payment_session_id": cf_order_data.get("payment_session_id"),
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
        # 1. Update Order status
        order_resp = supabase.table("orders").select("*").eq("cashfree_order_id", order_id).execute()
        if not order_resp.data:
            return {"status": "ignored"}
        
        db_order = order_resp.data[0]
        if db_order["status"] == "paid":
            return {"status": "already_processed"}
            
        # 2. Get Order Items
        items_resp = supabase.table("order_items").select("*, tool_id(*)").eq("order_id", db_order["id"]).execute()
        
        email_items = []
        
        for item in items_resp.data:
            tool = item["tool_id"]
            pool = tool.get("voucher_pool", [])
            
            if pool:
                assigned_link = pool.pop(0)
                # Update voucher pool
                supabase.table("tools_cards").update({"voucher_pool": pool}).eq("id", tool["id"]).execute()
                # Update order item with assigned link
                supabase.table("order_items").update({"assigned_link": assigned_link}).eq("id", item["id"]).execute()
                
                email_items.append({
                    "title": tool["title"],
                    "link": assigned_link
                })
        
        # 3. Mark Order as Paid
        supabase.table("orders").update({"status": "paid"}).eq("id", db_order["id"]).execute()
        
        # 4. SEND CONSOLIDATED EMAIL
        tool_names = ", ".join([i["title"] for i in email_items])
        html_list = "".join([f"<li><strong>{i['title']}</strong>: <a href='{i['link']}'>{i['link']}</a></li>" for i in email_items])
        
        try:
            resend.Emails.send({
                "from": "The Propels <onboarding@resend.dev>",
                "to": [db_order["user_email"]],
                "subject": f"Access Granted: Your {len(email_items)} Tools are Ready!",
                "html": f"""
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px;">
                        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Order Confirmed!</h2>
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Thank you for your purchase. Your premium access for the following tools is now active:</p>
                        
                        <ul style="color: #0f172a; font-size: 14px; line-height: 1.8; margin-bottom: 32px;">
                            {html_list}
                        </ul>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                            <tr>
                                <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Order ID</td>
                                <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{order_id}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: #94a3b8; font-size: 14px;">Total Paid</td>
                                <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">₹{db_order['total_amount']}</td>
                            </tr>
                        </table>
                        
                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">If you have any issues, please contact support.</p>
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;">
                        <p style="color: #0f172a; font-size: 14px; font-weight: 700;">The Propels Team</p>
                    </div>
                """
            })
        except Exception as e:
            print(f"RESEND ERROR: {str(e)}")
            
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
