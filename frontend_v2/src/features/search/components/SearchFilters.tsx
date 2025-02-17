// src/features/search/components/SearchFilters.tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { ResourceType } from "@/types";

interface SearchFiltersProps {
  selectedType?: ResourceType;
  onTypeChange: (type: ResourceType) => void;
}

export function SearchFilters({
  selectedType,
  onTypeChange,
}: SearchFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">
          {t('search.filterByType')}
        </h3>
        <RadioGroup
          value={selectedType}
          onValueChange={(value) => onTypeChange(value as ResourceType)}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Both" id="both" />
              <Label htmlFor="both">{t('search.types.both')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="System" id="system" />
              <Label htmlFor="system">{t('search.types.system')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Regulation" id="regulation" />
              <Label htmlFor="regulation">{t('search.types.regulation')}</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}