// src/features/search/components/SearchBar.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  isLoading = false
}: SearchBarProps) {
  const { t, direction } = useLanguage();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('search.placeholder')}
          icon={<Search className="h-4 w-4 text-gray-400" />}
          disabled={isLoading}
          dir={direction}
        />
      </div>
      <Button
        onClick={onSearch}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        {isLoading ? t('common.loading') : t('common.search')}
      </Button>
    </div>
  );
}
