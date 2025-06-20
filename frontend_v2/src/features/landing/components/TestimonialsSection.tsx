// src/features/landing/components/TestimonialsSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

// Sample data for testimonials with varying text lengths
const testimonialData = [
  {
    id: 1,
    nameKey: "landingPage.testimonials.person1.name",
    titleKey: "landingPage.testimonials.person1.title",
    quoteKey: "landingPage.testimonials.person1.quote", // Longer quote
    avatar: "/images/avatars/avatar1.png" // Replace with your actual avatar paths
  },
  {
    id: 2,
    nameKey: "landingPage.testimonials.person2.name",
    titleKey: "landingPage.testimonials.person2.title",
    quoteKey: "landingPage.testimonials.person2.quote", // Shorter quote
    avatar: "/images/avatars/avatar2.png"
  },
  {
    id: 3,
    nameKey: "landingPage.testimonials.person3.name",
    titleKey: "landingPage.testimonials.person3.title",
    quoteKey: "landingPage.testimonials.person3.quote",
    avatar: "/images/avatars/avatar3.png"
  },
  {
    id: 4,
    nameKey:  "landingPage.testimonials.person4.name",
    titleKey: "landingPage.testimonials.person4.title",
    quoteKey: "landingPage.testimonials.person4.quote", // Medium quote
    avatar: "/images/avatars/avatar4.png"
  },
  {
    id: 5,
    nameKey:  "landingPage.testimonials.person5.name",
    titleKey: "landingPage.testimonials.person5.title",
    quoteKey: "landingPage.testimonials.person5.quote",
    avatar: "/images/avatars/avatar5.png"
  },
  {
    id: 6,
    nameKey:  "landingPage.testimonials.person6.name",
    titleKey: "landingPage.testimonials.person6.title",
    quoteKey: "landingPage.testimonials.person6.quote",
    avatar: "/images/avatars/avatar6.png"
  },
  {
    id: 7,
    nameKey:  "landingPage.testimonials.person7.name",
    titleKey: "landingPage.testimonials.person7.title",
    quoteKey: "landingPage.testimonials.person7.quote", // Another long one
    avatar: "/images/avatars/avatar1.png" // Reusing avatar for example
  },
  {
    id: 8,
    nameKey:  "landingPage.testimonials.person8.name",
    titleKey: "landingPage.testimonials.person8.title",
    quoteKey: "landingPage.testimonials.person8.quote", // Short
    avatar: "/images/avatars/avatar2.png"
  },
  {
    id: 9,
    nameKey:  "landingPage.testimonials.person9.name",
    titleKey: "landingPage.testimonials.person9.title",
    quoteKey: "landingPage.testimonials.person9.quote",
    avatar: "/images/avatars/avatar3.png"
  },
  {
    id: 10,
    nameKey:  "landingPage.testimonials.person10.name",
    titleKey: "landingPage.testimonials.person10.title",
    quoteKey: "landingPage.testimonials.person10.quote",
    avatar: "/images/avatars/avatar4.png"
  },
  {
    id: 11,
    nameKey:  "landingPage.testimonials.person10.name",
    titleKey: "landingPage.testimonials.person10.title",
    quoteKey: "landingPage.testimonials.person10.quote",
    avatar: "/images/avatars/avatar4.png"
  },
  {
    id: 12,
    nameKey:  "landingPage.testimonials.person10.name",
    titleKey: "landingPage.testimonials.person10.title",
    quoteKey: "landingPage.testimonials.person10.quote",
    avatar: "/images/avatars/avatar4.png"
  },
];

interface TestimonialsSectionProps {
  id?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ id }) => {
  const { t } = useLanguage();

  return (
    <section id={id} className="py-16 md:py-24 bg-background-body relative">
      {/* This div creates the gradient fade at the bottom of the section */}
      <div
        className="absolute bottom-20 left-0 right-0 h-64 z-10 pointer-events-none" // Increased height for a more gradual fade
        style={{
          background: 'linear-gradient(to top, var(--color-background-body) 60%, transparent 100%)'
          // CSS from design: linear-gradient(0deg, #FFFFFF 2.03%, rgba(255, 255, 255, 0) 34.89%)
          // This gradient starts solid white at the bottom and fades to transparent upwards.
        }}
      ></div>

      <div className="relative z-0 max-w-7xl mx-auto px-6"> {/* z-0 to be behind the fade */}
        <h2
          className="text-design-48-tight font-normal text-text-on-light-strong text-center mb-12 md:mb-16"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }} // fontWeight 400 from CSS
        >
          {t('landingPage.testimonialsTitle')}
        </h2>
        {/* Masonry Grid - using CSS columns. Might need a JS library for perfect height balancing. */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 pb-16"> {/* Added pb-16 to give space for the fade */}
          {testimonialData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="break-inside-avoid p-4 md:p-5 mb-6 bg-white border border-border-default rounded-xl shadow-sm"
              // CSS: width: 282px; padding: 16px 20px; border-radius: 10px;
              // Tailwind: rounded-xl is 0.75rem (12px), design is 10px. Can define custom 'rounded-10px' or accept 12px.
              // p-5 is 20px, p-4 is 16px.
              style={{ width: '100%' }} // Let the column width dictate, or set a fixed width if needed. CSS implies fixed.
                                         // If fixed width is desired: style={{ width: '282px' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={testimonial.avatar} // Ensure this path is correct, e.g., /images/avatars/avatar1.png
                  alt={t(testimonial.nameKey)}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0" // 40x40px avatar
                />
                <div>
                  <p
                    className="font-semibold text-sm text-text-on-light-body leading-snug" // leading-snug for tighter line height
                    style={{ fontFamily: 'var(--font-primary-latin)', fontWeight: 600 }} // Inter, 14px, Semibold
                  >
                    {t(testimonial.nameKey)}
                  </p>
                  <p
                    className="text-xs text-text-on-light-placeholder leading-snug" // color: #A9A9A9
                    style={{ fontFamily: 'var(--font-primary-latin)', fontWeight: 600 }} // Inter, 12px, Semibold
                  >
                    {t(testimonial.titleKey)}
                  </p>
                </div>
              </div>
              <p
                className="text-sm text-text-on-light-faint leading-[1.6]" // Base/80 color: #626262, leading-relaxed is 1.625
                style={{ fontFamily: 'var(--font-primary-latin)', fontWeight: 400 }} // Inter, 14px, Regular
              >
                {t(testimonial.quoteKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};