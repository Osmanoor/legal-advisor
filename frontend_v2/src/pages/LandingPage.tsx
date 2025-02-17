// src/pages/LandingPage.tsx
import { HeroSection } from '@/features/landing/components/HeroSection';
import { SearchSection } from '@/features/landing/components/SearchSection';
import { FeatureCard } from '@/features/landing/components/FeatureCard';
import { FaqSection } from '@/features/landing/components/FaqSection';
import { StatsSection } from '@/features/landing/components/StatsSection';
import { ContactSection } from '@/features/landing/components/ContactSection';
import { FooterSection } from '@/features/landing/components/FooterSection';
import { useLanguage } from '@/hooks/useLanguage';
import { Search, MessageSquare, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: t('landing.features.search.title'),
      description: t('landing.features.search.description'),
      onClick: () => navigate('/search'),
    },
    {
      icon: MessageSquare,
      title: t('landing.features.assistant.title'),
      description: t('landing.features.assistant.description'),
      onClick: () => navigate('/chat'),
    },
    {
      icon: Book,
      title: t('landing.features.library.title'),
      description: t('landing.features.library.description'),
      onClick: () => navigate('/library'),
    },
  ];

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <HeroSection />
      <SearchSection />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={feature.onClick}
            />
          ))}
        </div>
      </div>

      <StatsSection />
      <FaqSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}