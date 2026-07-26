from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.supabase_service import supabase_service

router = APIRouter()

@router.get("/")
def search_jobs(query: Optional[str] = None):
    """
    Searches processing_jobs results for the query string using Postgres native JSONB querying.
    """
    try:
        if not query:
            # Just return latest 10 jobs
            res = supabase_service.client.table("processing_jobs").select("*").order("created_at", desc=True).limit(10).execute()
            return res.data
            
        # Simplistic text search inside the JSONB results column using Supabase API
        # Supabase API provides textSearch for text columns, but for jsonb we can use ilike on casted text
        # Because supabase-py doesn't have a direct cast operator easily, we fetch and filter in python for this MVP
        # In production, create a Postgres function or view for full-text search on JSONB.
        res = supabase_service.client.table("processing_jobs").select("*").order("created_at", desc=True).execute()
        
        filtered = []
        for job in res.data:
            if not job.get("results"): continue
            results_str = str(job["results"]).lower()
            if query.lower() in results_str:
                filtered.append(job)
                
        return filtered
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
