from fastapi import APIRouter, HTTPException, Depends
from app.services.supabase_service import supabase_service
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/{upload_id}")
async def get_analysis_results(upload_id: str, current_user = Depends(get_current_user)):
    try:
        # Fetch the processing job linked to this upload_id
        # We also want to verify the user owns the upload via RLS
        # Or implicitly by checking user_id
        upload_res = supabase_service.client.table("uploads").select("user_id, file_path").eq("id", upload_id).execute()
        if not upload_res.data:
            raise HTTPException(status_code=404, detail="Upload not found.")

        file_path = upload_res.data[0]["file_path"]
        file_url = supabase_service.client.storage.from_("media").get_public_url(file_path)

        res = supabase_service.client.table("processing_jobs").select("*").eq("upload_id", upload_id).execute()
        
        if not res.data:
            return {"status": "pending", "results": {}, "file_url": file_url}
            
        job = res.data[0]
        return {
            "status": job["status"],
            "results": job.get("results", {}),
            "file_url": file_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
