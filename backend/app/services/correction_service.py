# app/services/correction_service.py
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

    # --- NEW: Enhancement Prompt ---
    def _get_enhancement_prompt(self, language: str) -> str:
        """Get the appropriate text enhancement prompt based on language."""
        if language == 'ar':
            return """أنت خبير في تحسين الكتابة باللغة العربية. مهمتك هي إعادة صياغة النص المقدم لجعله أكثر احترافية ووضوحًا وتأثيرًا.

القواعد:
1. قم بإرجاع النص المحسّن فقط بدون أي شروحات أو تعليقات.
2. حسّن اختيار الكلمات والعبارات لتكون أكثر بلاغة وقوة.
3. أعد تنظيم الجمل إذا كان ذلك يحسن من تدفق النص ووضوحه.
4. حافظ على المعنى الأساسي والقصد الأصلي للنص.
5. حافظ على بنية الفقرات وفواصل الأسطر الأصلية قدر الإمكان.
6. لا تضف معلومات جديدة، ركز فقط على تحسين الصياغة الحالية.

النص المدخل:
{text}"""
        else:
            return """You are an expert writing enhancement tool. Your task is to rewrite the provided text to be more professional, clear, and impactful.

Rules:
1. Return ONLY the enhanced text without any explanations, comments, or annotations.
2. Improve word choice and phrasing for better clarity and impact.
3. Reorganize sentences if it improves the flow and readability.
4. Maintain the core meaning and original intent of the text.
5. Preserve the original paragraph structure and line breaks as much as possible.
6. Do not add new information; focus solely on improving the existing wording.

Input text:
{text}"""

    # --- MODIFIED: Added 'mode' parameter ---
    def correct_text(self, text: str, language: str = 'en', mode: str = 'correct') -> Dict[str, str]:
        """
        Correct or enhance text using Gemini AI.
        
        Args:
            text (str): Text to be processed.
            language (str): Language of the text ('en' or 'ar').
            mode (str): The operation to perform ('correct' or 'enhance').
            
        Returns:
            Dict containing the processed text or error message.
        """
        try:
            if mode == 'enhance':
                prompt = self._get_enhancement_prompt(language).format(text=text)
            else: # Default to 'correct'
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