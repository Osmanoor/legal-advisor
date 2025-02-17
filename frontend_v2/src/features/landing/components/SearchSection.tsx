// src/features/landing/components/SearchSection.tsx
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SearchSection() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate('/chat', { state: { initialQuestion: query } });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleSearch}
          placeholder={t('landing.search.placeholder')}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          className="text-lg"
          dir={direction}
        />
      </div>
    </div>
  );
}
