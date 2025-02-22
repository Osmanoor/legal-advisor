import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Search, MessageSquare, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Hero Section
const Hero = () => {
  const { t, direction } = useLanguage();
  
  return (
    <div className="relative mt-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 gap-12 items-center">
        <div className={`${direction === 'rtl' ? 'order-2' : 'order-1'}`}>
          <h1 className="text-5xl font-medium tracking-wide leading-tight text-indigo-950">
            {t('landing.hero.title')}
          </h1>
          <p className="mt-6 text-lg text-indigo-900">
            {t('landing.hero.description')}
          </p>
          <button className="mt-8 px-8 py-3 border-2 border-indigo-950 text-indigo-950 rounded-sm font-medium">
            {t('landing.hero.learnMore')}
          </button>
        </div>
        <div className={`${direction === 'rtl' ? 'order-1' : 'order-2'}`}>
          <img
            src="src/assets/designer_1.png"
            alt="Hero illustration"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Feature Section
interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  reverse?: boolean;
}

const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, description, reverse = false }) => {
  const { direction } = useLanguage();
  
  return (
    <div className="mt-32 px-6 max-w-7xl mx-auto">
      <div className={`grid grid-cols-2 gap-12 items-center ${reverse ? 'direction-rtl' : ''}`}>
        <div className={`${reverse ? 'order-2' : 'order-1'}`}>
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
            <Icon className="w-6 h-6 text-indigo-950" />
          </div>
          <h2 className="text-4xl font-medium text-indigo-950 mb-4">{title}</h2>
          <p className="text-lg text-indigo-900">{description}</p>
        </div>
        <div className={`${reverse ? 'order-1' : 'order-2'}`}>
          <img
            src="src/assets/design_2.png"
            alt="Feature illustration"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

// Price Section
const Pricing = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-32 px-6 py-12 text-center">
      <h2 className="text-4xl font-medium text-indigo-950 mb-6">
        {t('landing.pricing.title')}
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-indigo-900 mb-8">
        {t('landing.pricing.description')}
      </p>
      <div className="text-5xl font-medium text-indigo-950 mb-4">
        {t('landing.pricing.price')}
      </div>
      <button className="mt-8 px-8 py-3 bg-indigo-950 text-white rounded-sm font-medium">
        {t('landing.pricing.cta')}
      </button>
    </div>
  );
};


// Main Landing Page
const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: t('landing.features.search.title'),
      description: t('landing.features.search.description'),
    },
    {
      icon: MessageSquare,
      title: t('landing.features.assistant.title'),
      description: t('landing.features.assistant.description'),
      reverse: true,
    },
    {
      icon: Book,
      title: t('landing.features.library.title'),
      description: t('landing.features.library.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      {features.map((feature, index) => (
        <Feature key={index} {...feature} />
      ))}
      <Pricing />
    </div>
  );
};

export default LandingPage;