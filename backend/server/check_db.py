import os
from supabase import create_client
from dotenv import load_dotenv

# Load from root .env.local
load_dotenv(dotenv_path='../../.env.local')

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

print(f"URL: {url}")
if not url or not key:
    print("Missing credentials")
    exit(1)

supabase = create_client(url, key)

try:
    res = supabase.table("tools_cards").select("*").execute()
    print(f"Found {len(res.data)} tools")
    for tool in res.data:
        print(f"- {tool.get('title')}")
except Exception as e:
    print(f"Error: {e}")
