import os
from supabase import create_client

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://zwidqcfhwgmrxtiovovz.supabase.co")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3aWRxY2Zod2dtcnh0aW92b3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1MTI4NDgsImV4cCI6MjAzNjA4ODg0OH0.dummy") # We'll replace the key with the actual one from .env

# Read from .env
with open("frontend/.env.local", "r") as f:
    for line in f:
        if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            url = line.split("=")[1].strip()
        if line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
            key = line.split("=")[1].strip()

supabase = create_client(url, key)
try:
    res = supabase.auth.sign_up({
        "email": "guest@visionquery.com",
        "password": "guestpassword123"
    })
    print("Guest user created or already exists!")
except Exception as e:
    print(f"Error: {e}")
