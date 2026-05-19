import random
import os
import requests
import resend
from datetime import datetime, timedelta
from supabase import Client
from core.security import hash_otp

# Resend Configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
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

        if SMTP_EMAIL and SMTP_PASSWORD:
            try:
                import smtplib
                from email.mime.text import MIMEText
                from email.mime.multipart import MIMEMultipart
                
                msg = MIMEMultipart()
                msg['From'] = f"The Propels <{SMTP_EMAIL}>"
                msg['To'] = email
                msg['Subject'] = "Your Verification Code"
                msg.attach(MIMEText(f"Your verification code is: <strong>{otp}</strong>", 'html'))
                
                with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                    server.starttls()
                    server.login(SMTP_EMAIL, SMTP_PASSWORD)
                    server.send_message(msg)
                
                email_sent = True
                return True, "SMTP OTP email sent"
            except Exception as e:
                print(f"[WARN] SMTP email send failed: {str(e)}")

        if not email_sent and RESEND_API_KEY:
            try:
                resend.Emails.send({
                    "from": "The Propels <onboarding@resend.dev>",
                    "to": [email],
                    "subject": "Your Verification Code",
                    "html": f"Your verification code is: <strong>{otp}</strong>"
                })
                email_sent = True
                return True, "Resend OTP email sent"
            except Exception as e:
                print(f"[WARN] Resend email send failed: {str(e)}")
        
        return False, "Failed to send email OTP"

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
                response = requests.post(url, auth=auth, data=data)
                response.raise_for_status()
                return True, "Twilio SMS sent"
            except Exception as e:
                print(f"[WARN] Twilio SMS send failed: {str(e)}")
        
        return False, "Failed to send SMS OTP"
