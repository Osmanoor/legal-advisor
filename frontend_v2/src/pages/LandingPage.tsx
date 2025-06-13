// src/pages/LandingPage.tsx
import React from 'react';
import { LandingPageHeader } from '@/features/landing/components/LandingPageHeader'; // New Import
import { NewHeroSection } from '@/features/landing/components/HeroSection';
import { SolutionsSection } from '@/features/landing/components/SolutionsSection';
import { StickyCardsSection } from '@/features/landing/components/StickyCardsSection';
import { TestimonialsSection } from '@/features/landing/components/TestimonialsSection';
import { FaqSection } from '@/features/landing/components/FaqSection';
import { LandingPageFooter } from '@/features/landing/components/LandingPageFooter'; // New Import

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background-body flex flex-col"> {/* Added flex flex-col for footer */}
      <LandingPageHeader /> {/* Use landing page specific header */}
      <div className="flex-grow"> {/* Wrapper for content to push footer down */}
        <NewHeroSection />
        <SolutionsSection />
        <StickyCardsSection />
        <TestimonialsSection />
        <FaqSection />
      </div>
      <LandingPageFooter /> {/* Use landing page specific footer */}
    </div>
  );
};

export default LandingPage;