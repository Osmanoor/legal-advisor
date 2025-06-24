// File: src/features/landing/components/HeroSection.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Slider from "react-slick";

import HeroVectorLeft from '@/assets/vectors/hero-vector-left.svg';
import HeroVectorRight from '@/assets/vectors/hero-vector-right.svg';

// Import company logos
import databricksLogo from '@/assets/company-logos/databricks.svg';
import linearLogo from '@/assets/company-logos/linear.svg';
import circusLogo from '@/assets/company-logos/circus.svg';
import mercuryLogo from '@/assets/company-logos/mercury.svg';
import remoteoLogo from '@/assets/company-logos/remoteo.svg';
import bbLogo from '@/assets/company-logos/bb.svg';
import otherLogo from '@/assets/company-logos/other.svg';

const companyLogosData = [
  { name: "DATABRICKS", src: databricksLogo }, { name: "LINEAR", src: linearLogo }, { name: "CIRCUS", src: circusLogo }, { name: "MERCURY", src: mercuryLogo }, { name: "REMOTEO", src: remoteoLogo }, { name: "BB", src: bbLogo }, { name: "OTHER_LOGO", src: otherLogo },
];

interface NewHeroSectionProps {
  id?: string;
}

export const NewHeroSection: React.FC<NewHeroSectionProps> = ({ id }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState('');
  const headerHeight = 80;

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/chat', { state: { initialQuestion: prompt } });
    }
  };

  const sliderSettings = {
    dots: false, arrows: false, infinite: true, speed: 4000, autoplay: true, autoplaySpeed: 0, cssEase: 'linear', variableWidth: true, slidesToScroll: 1, pauseOnHover: true, swipeToSlide: true,
  };

  return (
    <div
      id={id}
      className="relative w-full min-h-[800px] md:h-[900px] bg-primary-600 flex flex-col items-center text-center overflow-hidden"
      style={{
        paddingTop: `${headerHeight}px`,
        backgroundImage: "url('/images/hero-background.jpg')",
        backgroundColor: 'var(--color-primary-dark)',
        backgroundBlendMode: "luminosity, normal",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img src={HeroVectorLeft} alt="" aria-hidden="true" className="absolute -left-[20%] top-[55%] w-[60vw] h-[60vw] md:w-[450px] md:h-[450px] lg:w-[650px] lg:h-[650px] opacity-100 pointer-events-none" />
      <img src={HeroVectorRight} alt="" aria-hidden="true" className="absolute -right-[35%] top-[10%] w-[60vw] h-[60vw] md:w-[450px] md:h-[450px] lg:w-[650px] lg:h-[650px] opacity-100 pointer-events-none" />

      {/* MODIFICATION: Changed vertical alignment for mobile */}
      <div className="relative z-10 flex flex-col items-center justify-start lg:justify-center flex-grow w-full max-w-5xl px-4 pb-16 pt-10 sm:pt-16 md:pb-28 lg:pt-0">
        <div className="w-full">
          {/* MODIFICATION: Adjusted font size and line height for mobile */}
          <h1
            className="font-semibold text-4xl leading-snug sm:text-5xl md:text-design-48 text-text-on-dark max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 600 }}
          >
            {t('landingPage.hero.title')}
          </h1>
          {/* MODIFICATION: Increased margin-top for more space */}
          <p
            className="mt-6 text-base md:text-lg leading-relaxed md:leading-[34px] text-text-subtle-on-dark max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}
          >
            {t('landingPage.hero.description')}
          </p>
          <div className="mt-8 sm:mt-10 md:mt-12 w-full max-w-[492px] mx-auto">
            <p className="text-lg leading-[34px] text-text-subtle-on-dark mb-3" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 500 }}>
              {t('landingPage.hero.aiAssistantTitle')}
            </p>
            <div className="relative w-full">
              <Input
                type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(); } }}
                placeholder={t('landingPage.hero.aiAssistantPlaceholder')}
                className="w-full h-[58px] bg-white border border-border-input rounded-2xl shadow-md pr-5 pl-16 text-right text-sm placeholder:text-text-on-light-placeholder focus:ring-0 leading-[21px]"
                dir="rtl" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}
              />
              <Button onClick={handleSubmit} className="absolute left-[8px] top-1/2 -translate-y-1/2 bg-cta hover:opacity-90 w-[42px] h-[42px] p-0 rounded-lg flex items-center justify-center border border-primary-dark shadow-md">
                <Send className="w-5 h-5 text-text-on-dark" fill="currentColor" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full py-5 z-10 overflow-hidden">
        <p className="text-lg md:text-xl text-white/65 px-4 py-4 md:py-6 text-center" style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}>
          {t('landingPage.hero.trustedBy')}
        </p>
        <div className="relative w-full max-w-full sm:max-w-[1200px] mx-auto h-[48px]">
          <Slider {...sliderSettings}>
            {companyLogosData.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="px-4">
                <img src={logo.src} alt={logo.name} className="h-5 md:h-8 max-w-[150px] object-contain brightness-0 invert mx-auto" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};