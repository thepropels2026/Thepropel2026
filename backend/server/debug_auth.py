import os
from supabase import create_client

SUPABASE_URL = "https://mjwadwxwnwkbcfndvnfy.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qd2Fkd3h3bndrYmNmbmR2bmZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzMwODczNiwiZXhwIjoyMDkyODg0NzM2fQ.y_Qv4mO5Yg1Pz_rO8Xo8L8qF5G1Vw_u3g3_R5Xv6o2A")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

try:
    print("Attempting to create user via Admin API...")
    res = supabase.auth.admin.create_user({
        "email": "test_debug_trigger123@example.com",
        "password": "Password123!",
        "email_confirm": True,
        "user_metadata": {
            "first_name": "Test",
            "last_name": "User",
            "dob": None,
            "gender": None,
            "mobile": "9999999999"
        }
    })
    print("SUCCESS! User created:", res)
except Exception as e:
    print("ERROR:")
    print(repr(e))
    if hasattr(e, 'message'):
        print("Message:", e.message)
    if hasattr(e, 'code'):
        print("Code:", e.code)
    if hasattr(e, 'details'):
        print("Details:", e.details)
