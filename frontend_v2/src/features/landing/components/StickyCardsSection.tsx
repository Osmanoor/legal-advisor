// src/features/landing/components/StickyCardsSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

// Interface for the data, even though we're only using imageSrc and altTextKey now
interface StickySectionDetail {
  // titleKey: string; // No longer needed for individual card
  // descriptionKey: string; // No longer needed for individual card
  imageSrc: string;
  altTextKey: string; // Still good for accessibility
}

interface StickyCardsSectionProps {
  id?: string;
}

export const StickyCardsSection: React.FC<StickyCardsSectionProps> = ({ id }) => {
  const { t, direction } = useLanguage();

  const sections: StickySectionDetail[] = [
    {
      // titleKey: "landingPage.features.aiAssistant.title", // Removed
      // descriptionKey: "landingPage.features.aiAssistant.description", // Removed
      imageSrc: "/images/sticky-cards/sticky-card-visual-1.png",
      altTextKey: "landingPage.features.aiAssistant.alt" // Keep for image alt text
    },
    {
      // titleKey: "landingPage.features.calculator.title", // Removed
      // descriptionKey: "landingPage.features.calculator.description", // Removed
      imageSrc: "/images/sticky-cards/sticky-card-visual-2.png",
      altTextKey: "landingPage.features.calculator.alt"
    },
    {
      // titleKey: "landingPage.features.everythingInOnePlace.title", // Removed
      // descriptionKey: "landingPage.features.everythingInOnePlace.description", // Removed
      imageSrc: "/images/sticky-cards/sticky-card-visual-3.png",
      altTextKey: "landingPage.features.everythingInOnePlace.alt"
    }
  ];

  return (
    <section id={id} className="py-16 md:py-24 bg-background-body">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main flex container for the two columns */}
        <div className={`flex flex-col md:flex-row ${direction === 'rtl' ? 'md:flex-row' : ''} gap-12 md:gap-20 lg:gap-32`}>

          {/* Text Column (Right for RTL, Left for LTR) - This will be sticky */}
          <div className={`md:w-1/3 ${direction === 'rtl' ? 'md:text-right' : 'md:text-left'} 
                           md:sticky md:top-28 self-start h-fit`}>
            <h2
              className="text-design-48-tight font-normal text-text-on-light-strong mb-6"
              style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}
            >
              {t('landingPage.featuresTitle')} {/* ما يميزنا */}
            </h2>
            <p
              className="text-lg text-text-on-light-faint leading-[26px]"
              style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300 }}
            >
              {t('landingPage.featuresDescription')} {/* نؤمن بالوضوح... */}
            </p>
          </div>

          {/* Visuals/Images Column (Left for RTL, Right for LTR) - This will scroll */}
          {/* For RTL, this column (md:w-2/3) will be on the left */}
          <div className="md:w-2/3 space-y-16 md:space-y-24 lg:space-y-32">
            {sections.map((sec, index) => (
              <div key={index} className="w-full"> {/* Each image item in the scrolling column */}
                <div className="bg-background-section-alt rounded-xl shadow-lg overflow-hidden border border-border-default">
                  <img
                    src={sec.imageSrc}
                    alt={t(sec.altTextKey)} // Use alt text from translation
                    className="w-full h-auto object-contain max-h-[340px] md:max-h-[400px] rounded-xl"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};