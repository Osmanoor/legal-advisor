// src/features/templates/components/TemplateCard.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { Template } from "@/hooks/api/useTemplates";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const { t, language } = useLanguage();
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <CardHeader>
        <CardTitle>{template.display_name[language]}</CardTitle>
        <CardDescription>
          {template.description[language]}
        </CardDescription>
        <div className="text-sm text-gray-500 mt-2">
          {t('templates.fields')}: {template.placeholders.length}
        </div>
      </CardHeader>
    </Card>
  );
}