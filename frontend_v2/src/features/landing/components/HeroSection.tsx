// src/features/landing/components/NewHeroSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Import your SVG vectors - ensure these paths are correct
// Assuming you've edited the SVGs to remove top-level width/height attributes
import HeroVectorLeft from '@/assets/vectors/hero-vector-left.svg';
import HeroVectorRight from '@/assets/vectors/hero-vector-right.svg';

const companyLogosData = [
  // ... (company logos data remains the same)
  { name: "DATABRICKS", src: "/src/assets/company-logos/databricks.svg" },
  { name: "LINEAR", src: "/src/assets/company-logos/linear.svg" },
  { name: "CIRCUS", src: "/src/assets/company-logos/circus.svg" },
  { name: "MERCURY", src: "/src/assets/company-logos/mercury.svg" },
  { name: "REMOTEO", src: "/src/assets/company-logos/remoteo.svg" },
  { name: "BB", src: "/src/assets/company-logos/bb.svg" },
  { name: "OTHER_LOGO", src: "/src/assets/company-logos/other.svg" },
];

export const NewHeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState('');
  const headerHeight = 76;

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/chat', { state: { initialQuestion: prompt } });
    }
  };

  const duplicatedLogos = [...companyLogosData, ...companyLogosData, ...companyLogosData];

  return (
    <div
      className="relative w-full h-[900px] bg-primary-600 flex flex-col items-center text-center overflow-hidden"
      style={{
        paddingTop: `${headerHeight}px`,
        backgroundImage: "url('/images/hero-background.jpg')",
        backgroundColor: 'var(--color-primary-dark)',
        backgroundBlendMode: "luminosity, normal",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative SVG Vectors */}
      {/* Vector 1: Bottom Left */}
      <img
        src={HeroVectorLeft} // Make sure this SVG has width/height attributes removed
        alt=""
        aria-hidden="true"
        // Increased size: e.g., w-[300px] h-[300px] up to w-[500px] h-[500px] or more
        // The CSS was for an element of 426x386 (original SVG size).
        // Let's try a larger base size and make it responsive.
        className="absolute -left-[10%] sm:-left-[13%] top-[50%] sm:top-[55%] 
                   w-[40vw] h-[40vw] sm:w-[35vw] sm:h-[35vw] md:w-[450px] md:h-[450px] lg:w-[650px] lg:h-[650px]
                   opacity-100 pointer-events-none"
                                                  
      />
      {/* Vector 2: Center Right */}
      <img
        src={HeroVectorRight} // Make sure this SVG has width/height attributes removed
        alt=""
        aria-hidden="true"
        className="absolute -right-[30%] sm:right-auto sm:left-[70%] md:left-[65%] top-[10%] sm:top-[15%] 
                   w-[40vw] h-[40vw] sm:w-[35vw] sm:h-[35vw] md:w-[450px] md:h-[450px] lg:w-[650px] lg:h-[650px]
                   opacity-100 pointer-events-none" // Opacity is handled by SVG's <g opacity="0.1">
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow w-full max-w-5xl px-4 pb-28">
        {/* ... (rest of the text and prompt box code remains the same as the previous version) ... */}
        <div className="w-full">
          <h1
            className="font-semibold text-4xl sm:text-5xl md:text-design-48 text-text-on-dark max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 600, lineHeight: '59px' }}
          >
            {t('landingPage.hero.title')}
          </h1>
          <p
            className="mt-5 text-base leading-[34px] text-text-subtle-on-dark max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}
          >
            {t('landingPage.hero.description')}
          </p>

          <div className="mt-8 sm:mt-10 md:mt-12 w-full max-w-[492px] mx-auto">
            <p
              className="text-lg leading-[34px] text-text-subtle-on-dark mb-3"
              style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 500 }}
            >
              {t('landingPage.hero.aiAssistantTitle')}
            </p>
            <div className="relative w-full h-[58px] bg-white border border-border-input shadow-md rounded-2xl flex items-center 
                            pl-2 pr-4 ">
              <Input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(); } }}
                placeholder={t('landingPage.hero.aiAssistantPlaceholder')}
                className="w-full h-full bg-transparent border-none focus:ring-0
                           text-right placeholder-text-on-light-placeholder text-[14px] leading-[21px]"
                dir="rtl"
                style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}
              />
              <Button
                onClick={handleSubmit}
                className="absolute left-[8px] top-1/2 -translate-y-1/2 
                           bg-cta hover:opacity-90
                           w-[42px] h-[42px] p-0 rounded-lg 
                           flex items-center justify-center 
                           border border-primary-dark shadow-md"
              >
                <Send className="w-5 h-5 text-text-on-dark" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Logos Scroller */}
      <div className="absolute bottom-0 left-0 w-full py-5 z-10 overflow-hidden">
        {/* ... (logo scroller code remains the same as the previous version) ... */}
        <p
          className="text-xl md:text-[22px] text-white/65 mb-4 text-center"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300, letterSpacing: '-0.44px', lineHeight: '26px' }}
        >
          {t('landingPage.hero.trustedBy')}
        </p>
        <div className="relative w-full max-w-[1200px] mx-auto h-[48px] overflow-hidden px-10 md:px-16">
          <div className="animate-continuous-marquee flex whitespace-nowrap h-full">
            {duplicatedLogos.map((logo, index) => (
              <div key={`logo-set-${index}-${logo.name}`} className="inline-flex items-center justify-center mx-8 h-full flex-shrink-0">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-6 md:h-8 max-w-[150px] object-contain brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};