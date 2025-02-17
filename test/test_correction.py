# test_correction_api.py
import unittest
import requests
import json
import os
from typing import Dict, Any

class TestCorrectionAPI(unittest.TestCase):
    def setUp(self):
        """Set up test configuration"""
        self.base_url = "http://127.0.0.1:8080"
        self.headers = {
            'Content-Type': 'application/json'
        }
        
    def make_request(self, text: str, language: str) -> Dict[str, Any]:
        """Helper method to make requests to the correction API"""
        url = f"{self.base_url}/api/correction"
        payload = {
            "text": text,
            "language": language
        }
        response = requests.post(url, json=payload, headers=self.headers)
        return response

    def test_english_correction(self):
        """Test English text correction"""
        # Test case 1: Basic spelling and grammar errors
        response = self.make_request(
            text="i want to go their tommorow and their going to meet me",
            language="en"
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('corrected_text', data)
        print("\nEnglish Test 1 - Original:", "i want to go their tommorow and their going to meet me")
        print("English Test 1 - Corrected:", data['corrected_text'])
        
        # Test case 2: Multiple paragraph text
        response = self.make_request(
            text="here is a paragrph with errors.\n\nand here is another paragrph.",
            language="en"
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('corrected_text', data)
        self.assertTrue('\n\n' in data['corrected_text'])
        print("\nEnglish Test 2 - Original:", "here is a paragrph with errors.\n\nand here is another paragrph.")
        print("English Test 2 - Corrected:", data['corrected_text'])

    def test_arabic_correction(self):
        """Test Arabic text correction"""
        # Test case 1: Basic Arabic text with errors
        response = self.make_request(
            text='''النص التالي هو نص تجريبي، ووجود الأخطاء فيه متعمّد، وذلك لتوضيح الكيفية التي يعمل قلم بها خلال فترة التجربة.

 قلم
 مساعد الكتابة الذكي للغه العربيه

 عن قلم:

  قلم واحدة من شركات مجموعة شركة موضوع، وهي الراءدة في تطبيقات الذكاء الإصطناعي باللغة العربية داخل المجموعة. وبعد نجاح إستخدام هذه التطبيقات داخليا ولدى بعض عملاءنا المقربون ، قررنا مشاركة التجربة مع الشركات، و المؤسسات، والوزارات الأخرى محليا داخل الأردنوخارجها. 

يعمل على تطوير قلم نخبة من الأخصائيون والخبراء في اللغة العربيه وحوسبتها، وفي علم البيانات والذكاء الاصطناعي، اضافه إلى مهندسو البرمجيات والحاسوب. جميعهم يعملون معاً لصناعة منتج ذكي ، يخدم الكتابة بلغة الضاد.

 لماذا قلم؟

 نعلم أن كتابة المحتوي، وتدقيقه، والمحافظة على أسلوب الكتابة والنسق المتبع في شركتكم مهمة ليست بالهلة، خاصة حين يكون بصيغ مختلفة، وفي حجم كبير، مثل:
- التقارير بشتا أنواعها
- الأبحاث والنشر
- العروض الفنية و المالية
- المراسلاة والخطابات
- الإيميلات
- وغيرها

  ومن هنا جاءت المهمه التي اضطلع بها قلم أن يكون عوناً لكم في التخفيف من عبئ تدقيق المحتوى بشتى أنواعه، ومساعدة الكتّاب/الموظفين حتى ينتجون محتوى سليماً من الأخطائ الإملائية واللغوية والقواعدية، وتحسين الصياغة في اللغة العربية، بالاضافة إلى مساعدتهم في اتباع النسق وأسلوب الكتابة الخاص بالشركه.''',
            language="ar"
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('corrected_text', data)
        print("\nArabic Test 1 - Original:", "انا ذاهب الي المدرسه غدا")
        print("Arabic Test 1 - Corrected:", data['corrected_text'])
        
        # Test case 2: Multiple paragraph Arabic text
        # response = self.make_request(
        #     text="هذا نص عربي به اخطاء.\n\nوهذا ايضا به بعظ الاخطاء.",
        #     language="ar"
        # )
        
        # self.assertEqual(response.status_code, 200)
        # data = response.json()
        # self.assertIn('corrected_text', data)
        # self.assertTrue('\n\n' in data['corrected_text'])
        # print("\nArabic Test 2 - Original:", "هذا نص عربي به اخطاء.\n\nوهذا ايضا به بعظ الاخطاء.")
        # print("Arabic Test 2 - Corrected:", data['corrected_text'])

    def test_validation_errors(self):
        """Test input validation"""
        # Test case 1: Empty text
        response = self.make_request(
            text="",
            language="en"
        )
        
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data['status'], 'error')
        self.assertIn('error', data)
        print("\nValidation Test 1 - Empty text error:", data['error'])
        
        # Test case 2: Invalid language
        response = self.make_request(
            text="Some text",
            language="fr"
        )
        
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data['status'], 'error')
        self.assertIn('error', data)
        print("\nValidation Test 2 - Invalid language error:", data['error'])
        
        # Test case 3: Default language behavior
        response = requests.post(
            f"{self.base_url}/api/correction",
            json={"text": "Some text with errors"},  # No language specified
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        print("\nValidation Test 3 - Default language result:", data['corrected_text'])

    def test_large_text(self):
        """Test correction of large text"""
        large_text = "This is a paragrph with errors.\n\n" * 5
        response = self.make_request(
            text=large_text,
            language="en"
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertIn('corrected_text', data)
        print("\nLarge Text Test - Sample of result:", data['corrected_text'][:100] + "...")

if __name__ == '__main__':
    # Check if the server is running before starting tests
    try:
        requests.get("http://127.0.0.1:8080")
    except requests.exceptions.ConnectionError:
        print("Error: Please make sure the Flask server is running on http://127.0.0.1:8080")
        exit(1)
        
    unittest.main()