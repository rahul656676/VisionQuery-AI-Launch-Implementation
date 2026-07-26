from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class UploadBase(BaseModel):
    file_path: str
    status: str = "pending"

class UploadCreate(UploadBase):
    pass

class UploadResponse(UploadBase):
    id: UUID
    user_id: UUID
    created_at: datetime

class ProcessingJobBase(BaseModel):
    job_type: str
    status: str = "pending"
    results: Optional[Dict[str, Any]] = None

class ProcessingJobResponse(ProcessingJobBase):
    id: UUID
    upload_id: UUID
    created_at: datetime
    updated_at: datetime

class ChatSessionBase(BaseModel):
    title: Optional[str] = None
    upload_id: Optional[UUID] = None

class ChatSessionResponse(ChatSessionBase):
    id: UUID
    user_id: UUID
    created_at: datetime

class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessageResponse(ChatMessageBase):
    id: UUID
    session_id: UUID
    created_at: datetime
