from app.services.analysis_service import analysis_service
from app.services.supabase_service import supabase_service
from app.services.video_analysis_service import video_analysis_service

def process_image(job_id: str, file_path: str):
    """
    Downloads the image from Supabase, analyzes it via Gemini,
    and updates the processing_jobs table.
    """
    print(f"Starting background processing for job {job_id}...")
    try:
        file_url = supabase_service.client.storage.from_("media").get_public_url(file_path)
        
        # Perform real analysis
        results = analysis_service.analyze_image(file_url)
        
        if "error" in results:
            status = "failed"
        else:
            status = "completed"
            
        supabase_service.client.table("processing_jobs").update({
            "status": status,
            "results": results
        }).eq("id", job_id).execute()
        
        print(f"Background processing completed for job {job_id}. Status: {status}")
        
    except Exception as e:
        print(f"Background Job Error: {e}")
        supabase_service.client.table("processing_jobs").update({
            "status": "failed",
            "results": {"error": str(e)}
        }).eq("id", job_id).execute()

def process_video(job_id: str, file_path: str):
    """
    Downloads the video from Supabase, analyzes it via Gemini Video API,
    and updates the processing_jobs table.
    """
    print(f"Starting background processing for video job {job_id}...")
    try:
        # 1. Get Public URL
        file_url = supabase_service.client.storage.from_("media").get_public_url(file_path)
        
        # 2. Perform Analysis
        results = video_analysis_service.analyze_video(file_url)
        
        # 3. Update the job record in DB
        if "error" in results:
            status = "failed"
        else:
            status = "completed"
            
        supabase_service.client.table("processing_jobs").update({
            "status": status,
            "results": results
        }).eq("id", job_id).execute()
            
        print(f"Background processing completed for video job {job_id}. Status: {status}")
        
    except Exception as e:
        print(f"Background Video Job Error: {e}")
        supabase_service.client.table("processing_jobs").update({
            "status": "failed",
            "results": {"error": str(e)}
        }).eq("id", job_id).execute()
