import time
import requests
import json
import google.generativeai as genai

class AnalysisService:
    def __init__(self):
        # Configure Gemini with the user-provided API key from env
        from app.core.config import settings
        api_key = settings.GEMINI_API_KEY
        if api_key:
            genai.configure(api_key=api_key)
        # Use gemini-flash-latest for fast and accurate vision
        self.model = genai.GenerativeModel('gemini-flash-latest')

    def analyze_image(self, image_url: str) -> dict:
        print(f"Real analyzing image via Gemini: {image_url}")
        
        try:
            # 1. Download the image bytes
            response = requests.get(image_url)
            if response.status_code != 200:
                raise Exception(f"Failed to download image. Status: {response.status_code}")
            
            # 2. Prepare the prompt requesting JSON
            prompt = """
            Analyze this image in detail and extract the following information.
            You MUST return ONLY a valid JSON object matching this exact schema:
            {
                "scene_summary": "A detailed 2-3 sentence description of the overall scene.",
                "objects": [
                    {"label": "object name", "confidence": "high/medium/low", "bounding_box_approximate": "e.g., center, top-left"}
                ],
                "ocr_text": "Any readable text found in the image. If none, return empty string.",
                "people": [
                    {
                        "description": "General description (e.g., A person in a blue jacket)",
                        "position": "e.g., center, background",
                        "count_approximate": "1"
                    }
                ]
            }
            Do not include Markdown formatting blocks like ```json. Just return the raw JSON string.
            CRITICAL: Do NOT refuse to detect people. Describe them by their clothing and action.
            """
            
            image_parts = [
                {
                    "mime_type": response.headers.get("Content-Type", "image/jpeg"),
                    "data": response.content
                }
            ]
            
            # 3. Call Gemini
            result = self.model.generate_content([prompt, image_parts[0]])
            
            # 4. Parse the JSON response
            text = result.text.strip()
            if text.startswith("```json"):
                text = text.replace("```json", "", 1)
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            parsed = json.loads(text)
            return parsed
        except Exception as e:
            print(f"Gemini Analysis Error: {e}")
            return {"error": str(e)}

analysis_service = AnalysisService()
