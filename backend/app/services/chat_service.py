from groq import Groq
from app.core.config import settings

class ChatService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.1-8b-instant"

    def generate_response(self, context_results: dict, chat_history: list, user_message: str) -> str:
        """
        Generates a chat response using Groq based on the image analysis context and chat history.
        """
        system_prompt = f"""
        You are VisionQuery AI, a helpful assistant. You are chatting with a user about an image they uploaded.
        Here is the AI analysis of the image:
        {context_results}
        
        Answer the user's questions based ONLY on this analysis context. Be concise and helpful.
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Append chat history (list of dicts with 'role' and 'content')
        for msg in chat_history:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Append current user message
        messages.append({"role": "user", "content": user_message})

        try:
            response = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in Groq Chat: {e}")
            return "I'm sorry, I encountered an error while trying to generate a response."

chat_service = ChatService()
