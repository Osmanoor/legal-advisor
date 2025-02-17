// src/features/landing/components/FaqSection.tsx
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const { t, direction } = useLanguage();

  // Get FAQ items from translations
  const faqItems = t('landing.faq.items', undefined, true) as FaqItem[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-center mb-12">{t('landing.faq.title')}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {faqItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}