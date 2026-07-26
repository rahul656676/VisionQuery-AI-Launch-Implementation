from fastapi import APIRouter, HTTPException, Depends
from app.services.supabase_service import supabase_service
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/me")
def get_user_profile(current_user = Depends(get_current_user)):
    try:
        profile_res = supabase_service.client.table("profiles").select("*").eq("id", current_user.id).execute()
        if not profile_res.data:
            # If trigger failed or slow, return default
            return {
                "id": current_user.id,
                "role": "user",
                "credits_remaining": 10
            }
        return profile_res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
