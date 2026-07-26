from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Depends, Request
from typing import Optional
from app.services.supabase_service import supabase_service
from app.services.background_jobs import process_image, process_video
from app.api.auth import get_current_user
import uuid
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.post("/")
@limiter.limit("5/minute")
async def create_upload(request: Request, background_tasks: BackgroundTasks, file: UploadFile = File(...), current_user = Depends(get_current_user)):
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp", "video/mp4"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, WEBP, and MP4 are allowed.")

        # Read file bytes and validate size (Max 50MB)
        file_bytes = await file.read()
        if len(file_bytes) > 50 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds the 50MB limit.")

        user_id = current_user.id
            
        # 1. Upload to Supabase Storage
        file_path = supabase_service.upload_file(
            file_bytes=file_bytes,
            file_name=file.filename,
            content_type=file.content_type
        )
        
        # 2. Insert into uploads table
        upload_record = supabase_service.create_upload_record(
            user_id=user_id,
            file_path=file_path
        )
        
        # 3. Create processing job
        job_type = "video_analysis" if "video" in file.content_type else "image_analysis"
        job_record = supabase_service.create_processing_job(
            upload_id=upload_record["id"],
            job_type=job_type
        )
        
        # 4. Trigger background processing
        if job_record:
            if job_type == "image_analysis":
                background_tasks.add_task(process_image, job_record["id"], file_path)
            elif job_type == "video_analysis":
                background_tasks.add_task(process_video, job_record["id"], file_path)
        
        return {
            "message": "Upload successful",
            "upload": upload_record,
            "job": job_record
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{upload_id}")
def get_upload(upload_id: str):
    # Placeholder
    return {"message": f"Get upload {upload_id} placeholder"}
