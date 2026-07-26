from fastapi import APIRouter, HTTPException, Depends
from app.services.supabase_service import supabase_service
from app.api.auth import get_current_user

router = APIRouter()

def get_admin_user(current_user = Depends(get_current_user)):
    profile_res = supabase_service.client.table("profiles").select("role").eq("id", current_user.id).execute()
    if not profile_res.data or profile_res.data[0]["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    return current_user

@router.get("/stats")
def get_platform_stats(admin_user = Depends(get_admin_user)):
    try:
        # Get total users (we can count profiles)
        users_res = supabase_service.client.table("profiles").select("id", count="exact").execute()
        total_users = users_res.count if hasattr(users_res, 'count') else len(users_res.data)
        
        # Get total uploads
        uploads_res = supabase_service.client.table("uploads").select("id", count="exact").execute()
        total_uploads = uploads_res.count if hasattr(uploads_res, 'count') else len(uploads_res.data)
        
        # Get failed jobs
        failed_res = supabase_service.client.table("processing_jobs").select("id", count="exact").eq("status", "failed").execute()
        total_failed = failed_res.count if hasattr(failed_res, 'count') else len(failed_res.data)
        
        return {
            "total_users": total_users,
            "total_uploads": total_uploads,
            "total_failed_jobs": total_failed,
            "status": "healthy"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
