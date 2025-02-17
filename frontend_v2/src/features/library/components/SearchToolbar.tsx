// src/features/library/components/SearchToolbar.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  isDeepSearch: boolean;
  onDeepSearchChange: (checked: boolean) => void;
  onSearch: () => void;
}

export function SearchToolbar({
  query,
  onQueryChange,
  isDeepSearch,
  onDeepSearchChange,
  onSearch,
}: SearchToolbarProps) {
  const { t, direction } = useLanguage();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('library.searchPlaceholder')}
          icon={<Search className="w-4 h-4" />}
          dir={direction}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="deepSearch"
          checked={isDeepSearch}
          onCheckedChange={onDeepSearchChange}
        />
        <Label htmlFor="deepSearch" className="text-sm text-gray-300">
          {t('library.deepSearch')}
        </Label>
      </div>
    </div>
  );
}