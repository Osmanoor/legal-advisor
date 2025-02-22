// src/features/templates/components/TemplateCard.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { Template } from "@/hooks/api/useTemplates";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <CardHeader>
        <CardTitle>{template.display_name}</CardTitle>
        <CardDescription>
          {t('templates.fields')}: {template.placeholders.length}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}