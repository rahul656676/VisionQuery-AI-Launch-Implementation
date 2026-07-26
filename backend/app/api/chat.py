from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.supabase_service import supabase_service
from app.services.chat_service import chat_service

router = APIRouter()

class CreateSessionRequest(BaseModel):
    user_id: str
    upload_id: str

class SendMessageRequest(BaseModel):
    user_id: str
    content: str

@router.post("/sessions")
def create_session(req: CreateSessionRequest):
    """Creates a new chat session for an upload context."""
    try:
        # Dummy bypass for testing
        if req.user_id == "00000000-0000-0000-0000-000000000000":
            return {"id": "dummy-session-id", "upload_id": req.upload_id, "user_id": req.user_id}
            
        res = supabase_service.client.table("chat_sessions").insert({
            "user_id": req.user_id,
            "upload_id": req.upload_id,
            "title": "Chat about Image"
        }).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# In-memory store for dummy messages
dummy_messages = []

@router.post("/sessions/{session_id}/messages")
def send_message(session_id: str, req: SendMessageRequest):
    """Sends a user message, calls Groq AI, and saves both to DB."""
    try:
        # 1. Save user message
        if session_id == "dummy-session-id":
            user_msg = {"id": f"msg-u-{len(dummy_messages)}", "session_id": session_id, "role": "user", "content": req.content}
            dummy_messages.append(user_msg)
        else:
            res_user = supabase_service.client.table("chat_messages").insert({
                "session_id": session_id,
                "role": "user",
                "content": req.content
            }).execute()
            user_msg = res_user.data[0]

        # 2. Get Analysis Context
        context_results = {}
        if session_id == "dummy-session-id":
            # Just mock a context since we don't have real DB linking
            context_results = {"scene_summary": "A mock scene for dummy chat."}
            chat_history = dummy_messages[:-1] # Exclude just added
        else:
            # Fetch upload_id from session
            session_res = supabase_service.client.table("chat_sessions").select("upload_id").eq("id", session_id).execute()
            if session_res.data:
                upload_id = session_res.data[0]["upload_id"]
                job_res = supabase_service.client.table("processing_jobs").select("results").eq("upload_id", upload_id).execute()
                if job_res.data:
                    context_results = job_res.data[0].get("results", {})
            
            # Fetch chat history
            history_res = supabase_service.client.table("chat_messages").select("role, content").eq("session_id", session_id).order("created_at").execute()
            chat_history = history_res.data if history_res.data else []
            chat_history = [m for m in chat_history if m["role"] != "user" or m["content"] != req.content] # approximate past

        # 3. Call AI Service
        ai_response = chat_service.generate_response(context_results, chat_history, req.content)

        # 4. Save AI response
        if session_id == "dummy-session-id":
            ai_msg = {"id": f"msg-a-{len(dummy_messages)}", "session_id": session_id, "role": "assistant", "content": ai_response}
            dummy_messages.append(ai_msg)
        else:
            res_ai = supabase_service.client.table("chat_messages").insert({
                "session_id": session_id,
                "role": "assistant",
                "content": ai_response
            }).execute()
            ai_msg = res_ai.data[0]

        return {"user_message": user_msg, "ai_message": ai_msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/messages")
def get_messages(session_id: str):
    try:
        if session_id == "dummy-session-id" or session_id == "undefined":
            return dummy_messages
        res = supabase_service.client.table("chat_messages").select("*").eq("session_id", session_id).order("created_at").execute()
        return res.data
    except Exception as e:
        if "invalid input syntax for type uuid" in str(e):
            return []
        raise HTTPException(status_code=500, detail=str(e))
