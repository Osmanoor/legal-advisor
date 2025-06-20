// src/features/landing/components/SolutionsSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

import iconSolutionTemplatesUrl from '@/assets/icons/icon-solution-templates.svg';
import iconSolutionAiUrl from '@/assets/icons/icon-solution-ai.svg';
import iconSolutionSearchUrl from '@/assets/icons/icon-solution-search.svg';
import iconSolutionTextUrl from '@/assets/icons/icon-solution-text.svg';
import iconSolutionCalculatorUrl from '@/assets/icons/icon-solution-calculator.svg';

// ... (Icon components remain the same)
const IconSolutionTemplates = () => <img src={iconSolutionTemplatesUrl} alt="Templates Icon" className="w-[138px] h-[138px]" />;
const IconSolutionAI = () => <img src={iconSolutionAiUrl} alt="AI Icon" className="w-[138px] h-[138px]" />;
const IconSolutionSearch = () => <img src={iconSolutionSearchUrl} alt="Search Icon" className="w-[138px] h-[138px]" />;
const IconSolutionText = () => <img src={iconSolutionTextUrl} alt="Text Processing Icon" className="w-[138px] h-[138px]" />;
const IconSolutionCalculator = () => <img src={iconSolutionCalculatorUrl} alt="Calculator Icon" className="w-[138px] h-[138px]" />;

interface SolutionsSectionProps {
  id?: string;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ id }) => {
  const { t, direction } = useLanguage();

  const solutions = [
    { id: 1, icon: IconSolutionTemplates, titleKey: 'landingPage.solutions.procurementSystem.title', descriptionKey: 'landingPage.solutions.procurementSystem.description' },
    { id: 2, icon: IconSolutionAI, titleKey: 'landingPage.solutions.aiAssistant.title', descriptionKey: 'landingPage.solutions.aiAssistant.description' },
    { id: 3, icon: IconSolutionSearch, titleKey: 'landingPage.solutions.advancedSearch.title', descriptionKey: 'landingPage.solutions.advancedSearch.description' },
    { id: 4, icon: IconSolutionText, titleKey: 'landingPage.solutions.textCorrection.title', descriptionKey: 'landingPage.solutions.textCorrection.description' },
    { id: 5, icon: IconSolutionCalculator, titleKey: 'landingPage.solutions.calculator.title', descriptionKey: 'landingPage.solutions.calculator.description' },
  ];

  return (
    <section id={id} className="py-16 md:py-24 bg-background-body">
      <div className={`max-w-7xl mx-auto px-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        <h2
          className="text-design-48-tight font-normal text-text-on-light-strong mb-12 md:mb-16 text-center"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}
        >
          {t('landingPage.solutionsTitle')}
        </h2>

        <div className="flex flex-wrap justify-center sm:gap-8 md:gap-10">
          {solutions.map(solution => (
            <div
              key={solution.id}
              className={`group flex flex-col items-center
                          w-full sm:basis-[calc(50%_-_1rem)] lg:basis-[calc(33.333%_-_1.666rem)] 
                          mb-8 md:mb-10`}
            >
              {/* Visual Part */}
              <div
                className="w-full h-[295px] rounded-[20px] flex items-center justify-center relative overflow-hidden mb-6 
                           transition-transform duration-300 ease-in-out group-hover:scale-105"
                style={{
                  backgroundImage: "url('/images/hero-background-.jpg')",
                  backgroundColor: 'var(--color-primary-dark)', // #296436
                  backgroundBlendMode: "luminosity, normal",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Ellipse */}
                <div
                  className="absolute bg-cta rounded-full filter blur-[70px]"
                  style={{ width: '300px', height: '300px', top: '145px' }} 
                ></div>
                {/* Non-blurred Icon (Top Layer) */}
                <div
                  className="absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-overlay 
                             transition-transform duration-300 ease-in-out group-hover:scale-110"
                  style={{ width: '138px', height: '138px' }}
                >
                  <solution.icon />
                </div>
                {/* Blurred Icon (Bottom Layer) */}
                <div
                  className="absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-overlay filter blur-[15px]"
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