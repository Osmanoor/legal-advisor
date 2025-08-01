import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';

export default function HelpPage() {
  const { language, direction } = useLanguage();

  const content = {
    ar: {
      title: 'مركز المساعدة',
      intro: 'مرحباً بك في مركز المساعدة الخاص بشبكة المشتريات الحكومية. تجد هنا إجابات للأسئلة الشائعة ومعلومات حول كيفية استخدام أدواتنا بفعالية.',
      sections: [
        {
          title: 'المساعد الذكي (الدردشة)',
          text: 'المساعد الذكي مصمم للإجابة على أسئلتك المتعلقة بنظام المنافسات والمشتريات الحكومية. ببساطة اكتب سؤالك في مربع الإدخال، وسيقوم المساعد بالبحث في المستندات الرسمية لتقديم إجابة دقيقة مع ذكر المصادر.'
        },
        {
          title: 'الحاسبة',
          text: 'توفر صفحة الحاسبة أدوات متعددة مثل حاسبة ضريبة القيمة المضافة، وحساب النسب المئوية، وتحويل التواريخ بين الهجري والميلادي. اختر نوع الحاسبة التي تحتاجها من الأعلى، وأدخل القيم المطلوبة للحصول على نتيجة فورية.'
        },
        {
          title: 'معالج النصوص',
          text: 'هذه الأداة تساعدك على تحسين كتاباتك الرسمية. يمكنك لصق النص للحصول على تصحيحات إملائية ونحوية، أو استخدام ميزة "تحسين النص" للحصول على صياغة أكثر احترافية. كما توفر أداة التفقيط لتحويل الأرقام إلى كلمات.'
        },
        {
          title: 'نظام الطرح (تحديد المنافسات)',
          text: 'بناءً على مدخلات مثل نوع العمل والميزانية، تقوم هذه الأداة بإنشاء تقرير مفصل يوضح نوع المنافسة المناسب، والجدول الزمني المقترح، والمتطلبات النظامية المتعلقة بها.'
        },
        {
          title: 'التواصل معنا',
          text: 'إذا لم تجد إجابة لسؤالك هنا، يمكنك دائمًا التواصل معنا عبر صفحة "اتصل بنا" الموجودة في الصفحة الرئيسية، أو إرسال تقييمك وملاحظاتك عبر صفحة "قيمنا" في لوحة التحكم.'
        }
      ]
    },
    en: {
      title: 'Help Center',
      intro: 'Welcome to the Government Procurement Network Help Center. Here you will find answers to common questions and information on how to use our tools effectively.',
      sections: [
        {
          title: 'AI Assistant (Chat)',
          text: 'The AI Assistant is designed to answer your questions regarding the Government Tenders and Procurement Law. Simply type your question in the input box, and the assistant will search the official documents to provide an accurate answer with sources.'
        },
        {
          title: 'Calculator',
          text: 'The Calculator page provides multiple tools such as a VAT calculator, percentage calculations, and date conversion between Hijri and Gregorian calendars. Select the type of calculator you need from the top, and enter the required values to get an instant result.'
        },
        {
          title: 'Text Processor',
          text: 'This tool helps you improve your official writing. You can paste text to get spelling and grammar corrections, or use the "Enhance Text" feature for more professional wording. It also offers a tool to convert numbers into words (Tafqit).'
        },
        {
          title: 'Procurement System (Tender Mapping)',
          text: 'Based on inputs like the type of work and budget, this tool generates a detailed report outlining the appropriate competition type, a suggested timeline, and the related regulatory requirements.'
        },
        {
          title: 'Contacting Us',
          text: 'If you can\'t find an answer to your question here, you can always contact us via the "Contact Us" page on the homepage, or send your feedback via the "Feedback" page in your dashboard.'
        }
      ]
    }
  };

  const pageContent = content[language];

  return (
    <div className="p-4 md:p-6 lg:p-8" dir={direction}>
      <div className="max-w-4xl mx-auto">
        <div className={`mb-8 flex items-center gap-4 ${direction === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
          <LifeBuoy className="w-8 h-8 text-cta" />
          <h1 className="text-3xl font-bold">{pageContent.title}</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <p className="text-lg text-gray-700">{pageContent.intro}</p>
            <hr />
            {pageContent.sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-xl font-semibold text-cta">{section.title}</h2>
                <p className="leading-relaxed text-gray-600">{section.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}