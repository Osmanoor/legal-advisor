// src/features/landing/components/HeroSection.tsx
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight hero-title">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('landing.hero.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/chat')}
              >
                {t('landing.hero.cta')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {t('landing.hero.learnMore')}
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-700/20 rounded-3xl" />
            <img
              src="/images/logo192.png"
              alt="System Interface"
              className="rounded-3xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}