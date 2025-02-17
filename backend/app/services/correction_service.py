# services/correction_service.py
import os
import google.generativeai as genai
from typing import Dict, Optional

class CorrectionService:
    def __init__(self):
        """Initialize the correction service with Gemini configuration"""
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=self.generation_config,
        )
        
    def _get_correction_prompt(self, language: str) -> str:
        """Get the appropriate correction prompt based on language"""
        if language == 'ar':
            return """أنت أداة لتصحيح النصوص. مهمتك هي تصحيح أي أخطاء إملائية ونحوية ولغوية في النص المقدم.

القواعد:
1. قم بإرجاع النص المصحح فقط بدون أي شروحات أو تعليقات
2. حافظ على بنية النص الأصلي وتنسيقه
3. حافظ على المعنى والقصد الأصلي للنص
4. لا تضف أو تحذف محتوى بخلاف تصحيحات الأخطاء
5. حافظ على جميع فواصل الأسطر وهيكل الفقرات الأصلية
6. إذا كان النص مثالياً بالفعل، قم بإرجاعه دون تغيير

النص المدخل:
{text}"""
        else:
            return """You are a text correction tool. Your task is to correct any spelling, grammar, and linguistic errors in the provided text.

Rules:
1. Return ONLY the corrected text without any explanations, comments, or annotations
2. Preserve the original text's structure and formatting
3. Maintain the original meaning and intent of the text
4. Do not add or remove content beyond error corrections
5. Keep all original line breaks and paragraph structure
6. If the text is already perfect, return it unchanged

Input text:
{text}"""

    def correct_text(self, text: str, language: str = 'en') -> Dict[str, str]:
        """
        Correct text using Gemini AI
        
        Args:
            text (str): Text to be corrected
            language (str): Language of the text ('en' or 'ar')
            
        Returns:
            Dict containing the corrected text or error message
        """
        try:
            prompt = self._get_correction_prompt(language).format(text=text)
            chat = self.model.start_chat(history=[])
            response = chat.send_message(prompt)
            
            return {
                'corrected_text': response.text,
                'status': 'success'
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'status': 'error'
            }