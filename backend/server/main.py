# Import the FastAPI framework for building APIs
import os
import requests
import json
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr
from supabase import create_client, Client
from dotenv import load_dotenv

# Security Imports
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
import time

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
# Falling back to hardcoded NEXT_PUBLIC values if environment variables are missing (useful for unconfigured cloud deployments)
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://mjwadwxwnwkbcfndvnfy.supabase.co")
_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qd2Fkd3h3bndrYmNmbmR2bmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDg3MzYsImV4cCI6MjA5Mjg4NDczNn0.p4gTvhvl2KEhN6fcUXL64VCa1oCcJ6eV-e0s2n8HLt0"
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", _anon_key))

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("WARNING: Supabase credentials missing. Client initialization skipped.")
    supabase = None
else:
    # Create Supabase client instance

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Cashfree Configuration
CASHFREE_APP_ID = os.getenv("CASHFREE_APP_ID", "TEST104193478b056158097b69335f6374391401")
CASHFREE_SECRET_KEY = os.getenv("CASHFREE_SECRET_KEY", "cfsk_ma_test_9567990497554f76cc39247f005691e8_95a049d5")
CASHFREE_MODE = os.getenv("CASHFREE_MODE", "sandbox")
# Determine Cashfree base URL based on mode
CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg" if CASHFREE_MODE == "sandbox" else "https://api.cashfree.com/pg"



# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

def send_email_via_smtp(to_email, subject, html_content, from_name="The Propels"):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print(f"[WARN] SMTP credentials not configured. Cannot send email to {to_email}")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = f"{from_name} <{SMTP_EMAIL}>"
        if isinstance(to_email, list):
            msg['To'] = ", ".join(to_email)
        else:
            msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))
        
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
        return True
    except Exception as e:
        print(f"[WARN] SMTP email send failed: {str(e)}")
        return False

# Configure CORS middleware settings securely
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://thepropels.com",
    "https://www.thepropels.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Security: Rate Limiting Setup ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- Security: Active Attack Alerting Middleware ---
ADMIN_ALERT_EMAIL = os.getenv("ADMIN_ALERT_EMAIL", "admin@thepropels.com")

class SecurityAlertMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.ip_failures = defaultdict(lambda: {"count": 0, "last_alert": 0})
        self.FAILURE_THRESHOLD = 15 # 15 bad requests
        self.ALERT_COOLDOWN = 600 # 10 minutes

    async def dispatch(self, request: Request, call_next):
        client_ip = get_remote_address(request)
        response = await call_next(request)
        
        # Track 429 Too Many Requests, 401 Unauthorized, 403 Forbidden, 404 Not Found (Scanning)
        if response.status_code in [401, 403, 404, 429]:
            self.ip_failures[client_ip]["count"] += 1
            
            if self.ip_failures[client_ip]["count"] >= self.FAILURE_THRESHOLD:
                current_time = time.time()
                # Check cooldown to prevent spamming admin email
                if current_time - self.ip_failures[client_ip]["last_alert"] > self.ALERT_COOLDOWN:
                    self.ip_failures[client_ip]["last_alert"] = current_time
                    self.send_admin_alert(client_ip, request.url.path, response.status_code)
        else:
            # Reset on successful request if you only want to track consecutive failures, 
            # but for scanning, tracking total failures is better. We'll decrement slowly or just leave as is for strictness.
            pass
            
        return response

    def send_admin_alert(self, ip, path, status_code):
        try:
            success = send_email_via_smtp(to_email=[ADMIN_ALERT_EMAIL], subject="CRITICAL: Suspicious Activity Detected on The Propels API", html_content=f"""
                    <div style="background: #fff1f2; padding: 20px; border: 1px solid #fda4af; border-radius: 8px; font-family: sans-serif;">
                        <h2 style="color: #e11d48;">🚨 Security Alert Triggered</h2>
                        <p>Multiple suspicious requests or rate-limit violations were detected.</p>
                        <ul>
                            <li><strong>Attacker IP:</strong> {ip}</li>
                            <li><strong>Target Path:</strong> {path}</li>
                            <li><strong>Last Status Code:</strong> {status_code}</li>
                            <li><strong>Violations Triggered:</strong> {self.FAILURE_THRESHOLD}</li>
                        </ul>
                        <p><em>Please review server logs immediately.</em></p>
                    </div>
                """, from_name="Security")
            if success:  # dummy check to maintain indent block
            print(f"SECURITY ALERT SENT TO ADMIN FOR IP: {ip}")
        except Exception as e:
            print(f"FAILED TO SEND SECURITY ALERT: {e}")

app.add_middleware(SecurityAlertMiddleware)

from services.otp_service import OTPService
from core.security import hash_otp

# Initialize OTP Service
otp_service = OTPService(supabase)

# Models for OTP and Auth with strict Pydantic validation
class OTPRequest(BaseModel):
    email: EmailStr = None
    mobile: str = None # Can be enhanced with regex constr(pattern=r'^\+?[1-9]\d{1,14}$')

class OTPVerifyRequest(BaseModel):
    email: EmailStr = None
    mobile: str = None
    otp: constr(min_length=6, max_length=6)

class PhoneRequest(BaseModel):
    phone: str

# Define a data model for checkout requests
class CheckoutRequest(BaseModel):
    tool_ids: list[str]
    user_email: str
    amount: float

# Utility function to send credentials email
def send_credentials_email(email, tool_name, assigned_link, amount, order_id):
    try:
        success = send_email_via_smtp(to_email=[email], subject=f"Access Granted: {tool_name} Credentials Inside!", html_content=f"""
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
            """, from_name="The Propels")
        print(f"SUCCESS: Credentials email sent to {email}")
    except Exception as e:
        print(f"SMTP ERROR: {str(e)}")


@app.post("/api/auth/send-otp")
@limiter.limit("3/minute")
async def send_otp(request: Request, req: OTPRequest):
    otp = otp_service.generate_otp()
    
    if req.email:
        success, msg = otp_service.send_email_otp(req.email, otp)
        if success:
            otp_service.store_otp(req.email, otp)
            return {"status": "success", "message": f"OTP sent to {req.email}"}
        else:
            raise HTTPException(status_code=500, detail=f"Failed to send email OTP: {msg}. Please check the server logs or ensure SMTP_EMAIL and SMTP_PASSWORD are correct in your environment variables.")

    if req.mobile:
        success, msg = otp_service.send_sms_otp(req.mobile, otp)
        if success:
            otp_service.store_otp(req.mobile, otp)
            return {"status": "success", "message": f"OTP sent to {req.mobile}"}
        else:
            raise HTTPException(status_code=500, detail=f"Failed to send SMS OTP: {msg}. Please ensure your Twilio credentials are correct.")
            
    raise HTTPException(status_code=400, detail="Either email or mobile must be provided")

@app.post("/api/auth/verify-otp")
@limiter.limit("5/minute")
async def verify_otp(request: Request, req: OTPVerifyRequest):
    identifier = req.email or req.mobile
    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier missing")
        
    if supabase is None:
        raise HTTPException(status_code=500, detail="Backend configuration error: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.")
    
    # Query Supabase for the OTP record
    try:
        resp = supabase.table("otps").select("*").eq("identifier", identifier).order("created_at", desc=True).limit(1).execute()
        if not resp.data:
            raise HTTPException(status_code=400, detail="No OTP requested for this identifier")
            
        record = resp.data[0]
        
        # Check expiry
        expiry_str = record["otp_expiry"]
        # Handle ISO format from Postgres
        if expiry_str.endswith("Z"):
            expiry_str = expiry_str[:-1] + "+00:00"
        
        expiry_time = datetime.fromisoformat(expiry_str)
        if datetime.now(expiry_time.tzinfo) > expiry_time:
            raise HTTPException(status_code=400, detail="OTP has expired")
            
        # Check hash
        if record["otp_hash"] == hash_otp(req.otp):
            # Mark verified in otps table
            supabase.table("otps").update({"is_verified": True}).eq("id", record["id"]).execute()
            
            # Update profile if it exists
            column_to_update = "is_email_verified" if req.email else "is_phone_verified"
            profile_field = "email" if req.email else "mobile"
            
            profile = None
            try:
                profile_resp = supabase.table("profiles").select("*").eq(profile_field, identifier).execute()
                if profile_resp.data:
                    supabase.table("profiles").update({column_to_update: True}).eq("id", profile_resp.data[0]["id"]).execute()
                    profile = profile_resp.data[0]
            except Exception as pe:
                print(f"Non-fatal error updating profile: {pe}")
                
            return {
                "status": "success", 
                "message": "OTP verified successfully",
                "profile": profile
            }
            
        raise HTTPException(status_code=400, detail="Invalid OTP")
    except HTTPException as he:
        raise he
    except Exception as e:
        error_msg = str(e)
        print(f"OTP verification error: {error_msg}")
        if "Could not find the table" in error_msg or "PGRST205" in error_msg:
            raise HTTPException(status_code=500, detail="Database schema missing. Please run sql/otp_schema.sql in your Supabase SQL Editor.")
        raise HTTPException(status_code=500, detail="Internal server error during verification")

@app.post("/api/auth/get-profile-by-phone")
async def get_profile_by_phone(req: PhoneRequest):
    if not req.phone:
        raise HTTPException(status_code=400, detail="Phone number is required")
    
    phone_clean = req.phone.strip()
    phone_variants = [phone_clean]
    if not phone_clean.startsWith("+"):
        phone_variants.append(f"+{phone_clean}")
        phone_variants.append(f"+91{phone_clean}")
    else:
        phone_variants.append(phone_clean.replace("+", ""))
        if phone_clean.startswith("+91"):
            phone_variants.append(phone_clean.replace("+91", "").strip())
            phone_variants.append(phone_clean.replace("+91", "0").strip())

    try:
        # Fetch all profiles
        res = supabase.table("profiles").select("*").execute()
        matched_profile = None
        for row in res.data:
            row_mobile = str(row.get("mobile", "")).strip()
            # Compare variants
            if any(v in row_mobile or row_mobile in v for v in phone_variants if v):
                matched_profile = row
                break
        
        if not matched_profile:
            # Also check directly matching with filter
            res_direct = supabase.table("profiles").select("*").in_("mobile", phone_variants).execute()
            if res_direct.data:
                matched_profile = res_direct.data[0]

        if not matched_profile:
            raise HTTPException(status_code=404, detail="No registered account found with this phone number. Please register first.")
            
        return {"status": "success", "profile": matched_profile}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"SUPABASE ERROR (get_profile_by_phone): {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

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

class CreateOrderRequest(BaseModel):
    order_amount: float
    customer_id: str
    customer_email: str
    customer_phone: str

@app.post("/api/create-order")
async def create_order(req: CreateOrderRequest):
    order_id = f"order_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}"
    
    url = f"{CASHFREE_BASE_URL}/orders"
    headers = {
        "x-api-version": "2023-08-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "order_id": order_id,
        "order_amount": req.order_amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": req.customer_id,
            "customer_email": req.customer_email,
            "customer_phone": req.customer_phone
        },
        "order_meta": {
            # Usually the frontend handles redirect when redirectTarget is _self, 
            # but Cashfree API accepts return_url for redirect mode.
            "return_url": "http://localhost:3000/checkout/success?order_id={order_id}"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"ERROR: Cashfree Order Creation failed: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Cashfree details: {e.response.text}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

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
    
    # SECURITY FIX: Calculate true amount from database to prevent client-side manipulation
    subtotal = sum(tool.get("discount_price") or tool["price"] for tool in tools_resp.data)
    platform_fee = round(subtotal * 0.10, 2)
    gst = round((subtotal + platform_fee) * 0.18, 2)
    calculated_amount = round(subtotal + platform_fee + gst, 2)
    
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    
    # Create order in database
    order_data_insert = {
        "cashfree_order_id": order_id,
        "user_email": req.user_email,
        "total_amount": calculated_amount,
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
                "amount": tool.get("discount_price") or tool["price"],
                "status": "pending"
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
        "order_amount": calculated_amount,
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

# Simulation endpoint to support offline payment flow and custom methods UI
@app.post("/api/checkout/simulate-success")
async def simulate_success(req: dict):
    order_id = req.get("order_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="Missing order_id")
        
    # 1. Update Order status
    order_resp = supabase.table("orders").select("*").eq("cashfree_order_id", order_id).execute()
    if not order_resp.data:
        raise HTTPException(status_code=404, detail="Order not found")
        
    db_order = order_resp.data[0]
    if db_order["status"] == "paid":
        return {"status": "already_processed"}
        
    # 2. Get Order Items
    items_resp = supabase.table("order_items").select("*, tool_id(*)").eq("order_id", db_order["id"]).execute()
    email_items = []
    
    for item in items_resp.data:
        tool = item["tool_id"]
        pool = tool.get("voucher_pool", [])
        
        assigned_link = None
        if pool and len(pool) > 0:
            assigned_link = pool.pop(0)
            # Update voucher pool
            supabase.table("tools_cards").update({"voucher_pool": pool}).eq("id", tool["id"]).execute()
            # Update order item with assigned link
            supabase.table("order_items").update({"assigned_link": assigned_link}).eq("id", item["id"]).execute()
        else:
            # Fallback mock voucher link if pool is empty
            assigned_link = f"https://thepropels.in/vouchers/{tool['id']}"
            supabase.table("order_items").update({"assigned_link": assigned_link}).eq("id", item["id"]).execute()
            
        email_items.append({
            "item_id": item["id"],
            "title": tool["title"],
            "link": assigned_link,
            "amount": item["amount"]
        })
    
    # 3. Mark Order as Paid
    supabase.table("orders").update({"status": "paid"}).eq("id", db_order["id"]).execute()
    
    # 4. SEND CONSOLIDATED EMAIL RECEIPT
    receipt_rows = ""
    for i in email_items:
        receipt_rows += f"""
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><strong>{i['title']}</strong><br><a href='{i['link']}' style='font-size: 12px; color: #0891b2;'>Access Link</a></td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">₹{i['amount']}</td>
        </tr>
        """
    
    try:
        success = send_email_via_smtp(to_email=[db_order["user_email"]], subject=f"Receipt & Access: Your Tool Purchase Confirmation", html_content=f"""
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px;">
                    <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Payment Receipt</h2>
                    <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Thank you for your purchase! Your payment is confirmed and your premium access credentials are below.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding: 0 0 12px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Tool Details & Links</th>
                                <th style="text-align: right; padding: 0 0 12px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipt_rows}
                        </tbody>
                    </table>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                        <tr>
                            <td style="padding: 16px; color: #64748b; font-size: 14px;">Order ID</td>
                            <td style="padding: 16px; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{order_id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 800;">Total Paid</td>
                            <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 800; text-align: right;">₹{db_order['total_amount']}</td>
                        </tr>
                    </table>
                    
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">If you have any issues with your access, please reply to this email or contact our support team.</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;">
                    <p style="color: #0f172a; font-size: 14px; font-weight: 700;">The Propels Team</p>
                </div>
            """, from_name="The Propels")
        for i in email_items:
            supabase.table("order_items").update({"status": "submitted"}).eq("id", i["item_id"]).execute()
    except Exception as e:
        print(f"SMTP ERROR: {str(e)}")
        
    return {"status": "success"}

import hmac
import hashlib
import base64

# Webhook endpoint to handle Cashfree payment notifications
@app.post("/api/payment-webhook")
async def payment_webhook(request: Request):
    payload = await request.body()
    
    # Cryptographic signature verification against x-webhook-signature
    # using the secret key before processing the webhook
    signature = request.headers.get("x-webhook-signature")
    timestamp = request.headers.get("x-webhook-timestamp")
    
    if signature and timestamp:
        # Cashfree v3 signature verification format:
        # signatureData = timestamp + payload
        signature_data = timestamp.encode('utf-8') + payload
        expected_signature = base64.b64encode(
            hmac.new(CASHFREE_SECRET_KEY.encode('utf-8'), signature_data, hashlib.sha256).digest()
        ).decode('utf-8')
        
        if signature != expected_signature:
            print("SECURITY ALERT: Invalid Cashfree webhook signature detected!")
            raise HTTPException(status_code=400, detail="Invalid signature")
    else:
        print("SECURITY ALERT: Missing Cashfree webhook signature or timestamp!")
        raise HTTPException(status_code=400, detail="Missing signature headers")

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
            
            assigned_link = None
            if pool and len(pool) > 0:
                assigned_link = pool.pop(0)
                # Update voucher pool
                supabase.table("tools_cards").update({"voucher_pool": pool}).eq("id", tool["id"]).execute()
                # Update order item with assigned link
                supabase.table("order_items").update({"assigned_link": assigned_link}).eq("id", item["id"]).execute()
            else:
                # Fallback mock voucher link if pool is empty
                assigned_link = f"https://thepropels.in/vouchers/{tool['id']}"
                supabase.table("order_items").update({"assigned_link": assigned_link}).eq("id", item["id"]).execute()
                
            email_items.append({
                "item_id": item["id"],
                "title": tool["title"],
                "link": assigned_link,
                "amount": item["amount"]
            })
        
        # 3. Mark Order as Paid
        supabase.table("orders").update({"status": "paid"}).eq("id", db_order["id"]).execute()
        
        # 4. SEND CONSOLIDATED EMAIL RECEIPT
        tool_names = ", ".join([i["title"] for i in email_items])
        
        # Build Receipt Table Rows
        receipt_rows = ""
        for i in email_items:
            receipt_rows += f"""
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><strong>{i['title']}</strong><br><a href='{i['link']}' style='font-size: 12px; color: #0891b2;'>Access Link</a></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">₹{i['amount']}</td>
            </tr>
            """
        
        try:
            success = send_email_via_smtp(to_email=[db_order["user_email"]], subject=f"Receipt & Access: Your Tool Purchase Confirmation", html_content=f"""
                    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px;">
                        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Payment Receipt</h2>
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Thank you for your purchase! Your payment is confirmed and your premium access credentials are below.</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
                            <thead>
                                <tr>
                                    <th style="text-align: left; padding: 0 0 12px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Tool Details & Links</th>
                                    <th style="text-align: right; padding: 0 0 12px 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #e2e8f0;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipt_rows}
                            </tbody>
                        </table>
                        
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                            <tr>
                                <td style="padding: 16px; color: #64748b; font-size: 14px;">Order ID</td>
                                <td style="padding: 16px; color: #0f172a; font-size: 14px; font-weight: 600; text-align: right;">{order_id}</td>
                            </tr>
                            <tr>
                                <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 800;">Total Paid</td>
                                <td style="padding: 16px; border-top: 1px solid #e2e8f0; color: #0f172a; font-size: 16px; font-weight: 800; text-align: right;">₹{db_order['total_amount']}</td>
                            </tr>
                        </table>
                        
                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">If you have any issues with your access, please reply to this email or contact our support team.</p>
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;">
                        <p style="color: #0f172a; font-size: 14px; font-weight: 700;">The Propels Team</p>
                    </div>
                """, from_name="The Propels")
            
            # 5. On successful email send, update the order_items status to 'submitted'
            for i in email_items:
                supabase.table("order_items").update({"status": "submitted"}).eq("id", i["item_id"]).execute()
                
        except Exception as e:
            print(f"SMTP ERROR: {str(e)}")
            
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
