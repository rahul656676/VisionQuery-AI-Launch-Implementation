import os
from supabase import create_client, Client
from app.core.config import settings

class SupabaseService:
    def __init__(self):
        url = settings.SUPABASE_URL
        # Using Service Role Key so backend can bypass RLS for now and act as admin
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
        self.client: Client = create_client(url, key)

    def upload_file(self, file_bytes: bytes, file_name: str, content_type: str) -> str:
        """Uploads a file to Supabase storage and returns the public URL."""
        bucket_name = "media"
        # Ensure unique file name
        import uuid
        unique_name = f"{uuid.uuid4()}-{file_name}"
        
        # Upload the file
        res = self.client.storage.from_(bucket_name).upload(
            unique_name, 
            file_bytes, 
            {"content-type": content_type}
        )
        
        return unique_name

    def create_upload_record(self, user_id: str, file_path: str):
        """
        Creates a record in the uploads table.
        """
        try:
            # We are now using real user IDs from Supabase Auth
            response = self.client.table("uploads").insert({
                "user_id": user_id,
                "file_path": file_path,
                "status": "pending"
            }).execute()
            
            if not response.data:
                raise Exception("Failed to insert upload record.")
                
            return response.data[0]
        except Exception as e:
            print(f"DB Insert Error: {e}")
            raise Exception("Failed to insert upload record. Ensure your Supabase Auth is correctly configured.")

    def create_processing_job(self, upload_id: str, job_type: str):
        """
        Creates a record in the processing_jobs table.
        """
        try:
            response = self.client.table("processing_jobs").insert({
                "upload_id": upload_id,
                "job_type": job_type,
                "status": "pending"
            }).execute()
            
            if not response.data:
                raise Exception("Failed to create processing job.")
                
            return response.data[0]
        except Exception as e:
            print(f"DB Job Insert Error: {e}")
            raise Exception("Failed to create processing job.")

supabase_service = SupabaseService()
