import random
import os
import requests
from datetime import datetime, timedelta
from supabase import Client
from core.security import hash_otp

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp-relay.brevo.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

class OTPService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def generate_otp(self) -> str:
        """Generates a random 6-digit OTP."""
        return "".join([str(random.randint(0, 9)) for _ in range(6)])

    def store_otp(self, identifier: str, plain_otp: str) -> None:
        """Hashes and stores the OTP in the database with a 5-minute expiration."""
        otp_hash = hash_otp(plain_otp)
        # Expiry time (5 minutes from now)
        expiry_time = datetime.utcnow() + timedelta(minutes=5)
        
        # Insert or update the OTP in the database
        data = {
            "identifier": identifier,
            "otp_hash": otp_hash,
            "otp_expiry": expiry_time.isoformat(),
            "is_verified": False
        }
        
        # We can delete old OTPs for this identifier first to keep it clean
        try:
            self.supabase.table("otps").delete().eq("identifier", identifier).execute()
        except Exception as e:
            print(f"Failed to delete old OTPs (maybe table doesn't exist yet): {e}")

        try:
            self.supabase.table("otps").insert(data).execute()
        except Exception as e:
            print(f"Failed to insert new OTP (run SQL schema first): {e}")

    def send_email_otp(self, email: str, otp: str) -> tuple[bool, str]:
        """Sends the OTP via Email."""
        email_sent = False
        message = f"Your verification code is: {otp}"

        html_content = f"""
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #ea580c; font-size: 28px; font-weight: 900; letter-spacing: -0.02em; margin: 0;">The Propels</h1>
                <p style="color: #64748b; font-size: 14px; font-weight: 500; margin-top: 8px;">System Authentication</p>
            </div>
            
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Verify Your Identity</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">You are attempting to access The Propels Node. Please use the following 6-digit authorization code to verify your email address and complete the handshake protocol.</p>
            
            <div style="background: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center; margin-bottom: 32px;">
                <p style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; margin-top: 0;">Your OTP Code</p>
                <div style="font-family: monospace; color: #0f172a; font-size: 36px; font-weight: 800; letter-spacing: 0.2em;">{otp}</div>
            </div>
            
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">This code will expire in 5 minutes. If you did not request this verification, please ignore this email to maintain sovereign identity protection.</p>
            
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;">
            <p style="color: #0f172a; font-size: 12px; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">The Propels Engineering</p>
        </div>
        """

        brevo_api_key = os.getenv("BREVO_API_KEY")
        
        if brevo_api_key and SMTP_EMAIL:
            try:
                import requests
                url = "https://api.brevo.com/v3/smtp/email"
                headers = {
                    "api-key": brevo_api_key,
                    "content-type": "application/json",
                    "accept": "application/json"
                }
                payload = {
                    "sender": {"email": SMTP_EMAIL, "name": "The Propels"},
                    "to": [{"email": email}],
                    "subject": "The Propels Verification Code",
                    "htmlContent": html_content
                }
                response = requests.post(url, json=payload, headers=headers, timeout=10)
                
                if response.status_code in [200, 201, 202]:
                    return True, "OTP email sent via Brevo REST API"
                else:
                    error_msg = f"Brevo API error: {response.text}"
                    print(f"[WARN] Brevo API email send failed: {error_msg}")
                    return False, f"FAILED TO SEND EMAIL OTP: BREVO API ERROR: {response.text} . PLEASE CHECK THE SERVER LOGS OR ENSURE BREVO_API_KEY IS CORRECT."
            except Exception as e:
                error_msg = f"API request error: {str(e)}"
                print(f"[WARN] Brevo API request failed: {error_msg}")
                return False, error_msg

        elif SMTP_EMAIL and SMTP_PASSWORD:
            try:
                import smtplib
                from email.mime.text import MIMEText
                from email.mime.multipart import MIMEMultipart

                msg = MIMEMultipart()
                msg['From'] = f"The Propels <{SMTP_EMAIL}>"
                msg['To'] = email
                msg['Subject'] = "The Propels Verification Code"
                msg.attach(MIMEText(html_content, 'html'))

                # Connect to Brevo SMTP
                server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
                server.starttls()
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
                server.quit()
                
                return True, "OTP email sent via standard SMTP"
            except Exception as e:
                error_msg = f"SMTP error: {str(e)}"
                print(f"[WARN] SMTP email send failed: {error_msg}")
                return False, f"FAILED TO SEND EMAIL OTP VIA SMTP: {str(e)}. PLEASE ENSURE SMTP_EMAIL AND SMTP_PASSWORD ARE CORRECT."
        else:
            return False, "Email credentials not configured. Please set BREVO_API_KEY, or SMTP_EMAIL and SMTP_PASSWORD."

    def send_sms_otp(self, mobile: str, otp: str) -> tuple[bool, str]:
        """Sends the OTP via SMS."""
        if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER:
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
                auth = (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                data = {
                    "From": TWILIO_PHONE_NUMBER,
                    "To": mobile,
                    "Body": f"Your The Propels verification code is: {otp}"
                }
                response = requests.post(url, auth=auth, data=data, timeout=10)
                response.raise_for_status()
                return True, "Twilio SMS sent"
            except Exception as e:
                print(f"[WARN] Twilio SMS send failed: {str(e)}")
        
        return False, "Failed to send SMS OTP"
