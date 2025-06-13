// src/features/landing/components/SolutionsSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

// ... (Icon components and iconSpecificBlurClasses remain the same)
const IconSolutionTemplates = () => <img src="/src/assets/icons/icon-solution-templates.svg" alt="Templates Icon" className="w-[138px] h-[138px]" />;
const IconSolutionAI = () => <img src="/src/assets/icons/icon-solution-ai.svg" alt="AI Icon" className="w-[138px] h-[138px]" />;
const IconSolutionSearch = () => <img src="/src/assets/icons/icon-solution-search.svg" alt="Search Icon" className="w-[138px] h-[138px]" />;
const IconSolutionText = () => <img src="/src/assets/icons/icon-solution-text.svg" alt="Text Processing Icon" className="w-[138px] h-[138px]" />;
const IconSolutionCalculator = () => <img src="/src/assets/icons/icon-solution-calculator.svg" alt="Calculator Icon" className="w-[138px] h-[138px]" />;

const iconSpecificBlurClasses: { [key: number]: string } = {
  1: 'blur-[15px]', 2: 'blur-[7.5px]', 3: 'blur-[26.5px]', 4: 'blur-[10.5px]', 5: 'blur-[15px]',
};


export const SolutionsSection = () => {
  const { t, direction } = useLanguage(); // Direction might not be needed here anymore if title is always centered

  // UPDATED KEYS with 'landingPage.solutions.' prefix
  const solutions = [
    { id: 1, icon: IconSolutionTemplates, titleKey: 'landingPage.solutions.procurementSystem.title', descriptionKey: 'landingPage.solutions.procurementSystem.description' },
    { id: 2, icon: IconSolutionAI, titleKey: 'landingPage.solutions.aiAssistant.title', descriptionKey: 'landingPage.solutions.aiAssistant.description' },
    { id: 3, icon: IconSolutionSearch, titleKey: 'landingPage.solutions.advancedSearch.title', descriptionKey: 'landingPage.solutions.advancedSearch.description' },
    { id: 4, icon: IconSolutionText, titleKey: 'landingPage.solutions.textCorrection.title', descriptionKey: 'landingPage.solutions.textCorrection.description' },
    { id: 5, icon: IconSolutionCalculator, titleKey: 'landingPage.solutions.calculator.title', descriptionKey: 'landingPage.solutions.calculator.description' },
  ];

  const smGap = "2rem"; 
  const lgGap = "2.5rem"; 

  return (
    <section className="py-16 md:py-24 bg-background-body">
      {/* Overall text alignment for the section wrapper based on language direction */}
      <div className={`max-w-7xl mx-auto px-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h2
          // Title is now always centered
          className="text-design-48-tight font-normal text-text-on-light-strong mb-12 md:mb-16 text-center"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}
        >
          {t('landingPage.solutionsTitle')}
        </h2>

        <div className="flex flex-wrap justify-center sm:gap-8 md:gap-10">
          {solutions.map(solution => (
            <div
              key={solution.id}
              className={`flex flex-col items-center
                          w-full sm:basis-[calc(50%_-_1rem)] lg:basis-[calc(33.333%_-_1.666rem)] 
                          mb-8 md:mb-10`}
            >
              {/* Visual Part */}
              <div
                className="w-full h-[295px] rounded-3xl flex items-center justify-center relative overflow-hidden mb-6"
                style={{
                  backgroundImage: "url('/images/hero-background.jpg')",
                  backgroundColor: 'var(--color-primary-dark)',
                  backgroundBlendMode: "luminosity, normal",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div
                  className="absolute bg-cta rounded-full opacity-50 filter blur-[110px]"
                  style={{ width: '300px', height: '300px', left: '42px', top: '145px' }}
                ></div>
                <div
                  className={`absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                              mix-blend-overlay ${iconSpecificBlurClasses[solution.id] || 'blur-md'}`}
                  style={{ width: '138px', height: '138px' }}
                >
                  <solution.icon />
                </div>
                <div
                  className={`absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                              mix-blend-overlay`}
                  style={{ width: '138px', height: '138px' }}
                >
                  <solution.icon />
                </div>
              </div>

              {/* Text Content Block */}
              <div className="w-full text-center">
                <h3
                  className="text-design-22 text-text-on-light-strong mb-2"
                  style={{ 
                    fontFamily: 'var(--font-primary-arabic)', 
                    fontWeight: 500, 
                    lineHeight: '24px'
                  }}
                >
                  {t(solution.titleKey)}
                </h3>
                <p
                  className="text-lg text-text-on-light-muted leading-[28px] max-w-xs mx-auto"
                  style={{ 
                    fontFamily: 'var(--font-primary-arabic)', 
                    fontWeight: 300, 
                    letterSpacing: '0.18px',
                    color: '#4C5259' // Kept direct color from previous step as it worked
                  }}
                >
                  {t(solution.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};