// src/features/landing/components/FaqSection.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
// FaqToggleIcon component remains the same as provided previously

const FaqToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300
                  ${isOpen ? 'bg-cta' : 'bg-cta'}`}
    >
      <div className="relative w-3 h-3">
        <motion.div
          className="absolute top-1/2 left-0 w-full h-0.5 bg-text-on-dark"
          style={{ y: '-50%' }}
          animate={{ rotate: isOpen ? 90 : 0, transition: { duration: 0.3 } }}
        ></motion.div>
        <motion.div
          className="absolute left-1/2 top-0 w-0.5 h-full bg-text-on-dark"
          style={{ x: '-50%' }}
          animate={{ rotate: isOpen ? 180 : 0, opacity: isOpen ? 0 : 1, transition: { duration: 0.3, opacity: {duration: 0.15} } }}
        ></motion.div>
      </div>
    </div>
  );
};

interface FaqSectionProps {
  id?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ id }) => {
  const { t, direction } = useLanguage();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs = [
    { qKey: "landingPage.faq.q1.question", aKey: "landingPage.faq.q1.answer" },
    { qKey: "landingPage.faq.q2.question", aKey: "landingPage.faq.q2.answer" },
    { qKey: "landingPage.faq.q3.question", aKey: "landingPage.faq.q3.answer" },
    { qKey: "landingPage.faq.q4.question", aKey: "landingPage.faq.q4.answer" },
    { qKey: "landingPage.faq.q5.question", aKey: "landingPage.faq.q5.answer" },
  ];

  const midPoint = Math.ceil(faqs.length / 2);
  const faqsCol1 = faqs.slice(0, midPoint);
  const faqsCol2 = faqs.slice(midPoint);

  const cardVariants = {
    closed: {
      backgroundColor: "var(--color-background-body)", // White
      borderColor: "var(--border-color-subtle)",   // rgba(0, 0, 0, 0.1)
      boxShadow: "var(--tw-shadow, 0 0 #0000)", // Default "no shadow" or Tailwind's 'shadow-sm'
                                                // Or directly '0 1px 2px 0 rgb(0 0 0 / 0.05)' for shadow-sm
      height: "auto",
      zIndex: 1, // Ensure closed cards are below open ones if they overlap during animation
    },
    open: {
      backgroundColor: "var(--color-primary-light)", // #EDFFEC
      borderColor: "var(--color-primary-cta)",   // #51B749
      // Using Tailwind's shadow-lg definition for a black shadow.
      // You can replace this with a custom shadow string if needed.
      boxShadow: "0 20px 30px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // This is 'shadow-lg'
      height: "auto",
      zIndex: 10, // Bring open card to front
    }
  };

  const answerVariants = {
    closed: { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, height: "auto", marginTop: "1rem", transition: { duration: 0.3, ease: "easeInOut" } }
  };

  return (
    <section id={id} className="py-16 md:py-24 bg-background-body">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-design-48-tight font-normal text-text-on-light-strong text-center mb-12 md:mb-16"
          style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 400 }}
        >
          {t('landingPage.faqTitle')}
        </h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          {[faqsCol1, faqsCol2].map((col, colIndex) => (
            <div key={colIndex} className="space-y-6">
              {col.map((faq, index) => {
                const globalIndex = colIndex === 0 ? index : index + faqsCol1.length;
                const isOpen = openIndex === globalIndex;
                return (
                  <motion.div
                    key={faq.qKey}
                    variants={cardVariants}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    // Initial shadow can be shadow-sm if you want one by default on closed cards
                    className="p-6 rounded-3xl border shadow-sm cursor-pointer overflow-hidden relative" // Added relative for z-index
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                  >
                    <div
                      className="w-full flex justify-between items-start text-right gap-4"
                    >
                      <span
                        className={`text-lg font-medium ${isOpen ? 'text-primary-dark' : 'text-text-on-light-strong'} flex-1`}
                        style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 500, lineHeight: '1.2' }}
                      >
                        {t(faq.qKey)}
                      </span>
                      <FaqToggleIcon isOpen={isOpen} />
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          variants={answerVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className={`overflow-hidden ${direction === 'rtl' ? 'pr-0 pl-8' : 'pl-0 pr-8'}`}
                        >
                          <p
                            className="text-base text-text-on-light-muted leading-relaxed"
                            style={{ fontFamily: 'var(--font-primary-arabic)', fontWeight: 300, lineHeight: '150%' }}
                          >
                            {t(faq.aKey)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};