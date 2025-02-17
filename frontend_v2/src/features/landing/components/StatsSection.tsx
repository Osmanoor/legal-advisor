// src/features/landing/components/StatsSection.tsx
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from "@/hooks/useLanguage";
import { Card } from "@/components/ui/card";
import { CountUp } from '@/components/ui/counter';

interface StatsItem {
  value: number;
  label: string;
  suffix?: string;
}

export function StatsSection() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatsItem[] = [
    { value: 1000, label: t('landing.stats.articles'), suffix: '+' },
    { value: 5000, label: t('landing.stats.users'), suffix: '+' },
    { value: 99, label: t('landing.stats.accuracy'), suffix: '%' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 text-center bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {isVisible ? (
                  <CountUp 
                    end={stat.value} 
                    suffix={stat.suffix}
                  />
                ) : '0'}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}