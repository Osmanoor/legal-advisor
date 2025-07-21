// src/pages/LandingPage.tsx
import React from 'react';
import { LandingPageHeader } from '@/features/landing/components/LandingPageHeader';
import { NewHeroSection } from '@/features/landing/components/HeroSection';
import { SolutionsSection } from '@/features/landing/components/SolutionsSection';
import { StickyCardsSection } from '@/features/landing/components/StickyCardsSection';
import { TestimonialsSection } from '@/features/landing/components/TestimonialsSection';
import { FaqSection } from '@/features/landing/components/FaqSection';
import { ContactSection } from '@/features/landing/components/ContactSection'; 
import { LandingPageFooter } from '@/features/landing/components/LandingPageFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background-body flex flex-col">
      <LandingPageHeader />
      <div className="flex-grow">
        <NewHeroSection id="home" />
        <SolutionsSection id="solutions" />
        <StickyCardsSection id="features" />
        <TestimonialsSection id="reviews" />
        <FaqSection id="faq" />
        <ContactSection />
      </div>
      <LandingPageFooter />
    </div>
  );
};

export default LandingPage;