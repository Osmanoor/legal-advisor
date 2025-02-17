// src/features/landing/components/FeatureCard.tsx
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isAvailable?: boolean;
  onClick?: () => void;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  isAvailable = true,
  onClick,
}: FeatureCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      className={`relative transition-all duration-300 transform hover:-translate-y-2 ${
        isAvailable ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={isAvailable ? onClick : undefined}
    >
      {!isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/50 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-100 rounded-xl">
          <span className="text-white text-lg font-semibold">
            {t('common.comingSoon')}
          </span>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}