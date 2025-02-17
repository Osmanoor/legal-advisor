// src/features/landing/components/FooterSection.tsx
import { useLanguage } from "@/hooks/useLanguage";

export function FooterSection() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">
              {t('procurement.communityName')}
            </h3>
            <p className="text-gray-400">© {new Date().getFullYear()} All rights reserved</p>
          </div>
          {/* Add more footer content as needed */}
        </div>
      </div>
    </footer>
  );
}