from app.services.supabase_service import supabase_service
import json

res = supabase_service.client.table("processing_jobs").select("*").limit(1).execute()
if res.data:
    print("Columns:", list(res.data[0].keys()))
else:
    print("No data, checking uploads table")
    res2 = supabase_service.client.table("uploads").select("*").limit(1).execute()
    if res2.data:
         print("Uploads Columns:", list(res2.data[0].keys()))
    else:
         print("No data in either table.")
