// src/components/dashboard/DashboardHeader.tsx
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import UserAvatar from '/public/images/avatars/avatar1.png';

export const DashboardHeader = () => {
  const { t, direction } = useLanguage(); // Get page direction

  const profileSearchBlock = (
    <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
      {/* User Profile (Visually on the Left for RTL page within this block) */}
      <div className={`flex items-center gap-1`}>
        <img src={UserAvatar} alt={t('user.avatarAlt') || "User Avatar"} className="w-10 h-10 rounded-full" />
        <ChevronDown className="w-4 h-4 text-gray-800" />
      </div>

      {/* Search Bar (Visually to the Right of Profile for RTL page within this block) */}
      <div className={`flex items-center border border-gray-300 rounded-md px-3 h-[34px] w-[240px]`}>
        <Search className={`w-5 h-5 text-gray-500 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`} /> {/* Adjusted margin for icon */}
        <Input
          type="text"
          placeholder={t('common.search') + "..."}
          className="border-none focus:ring-0 h-full p-0 text-sm placeholder-gray-400 flex-grow bg-transparent" // Added bg-transparent
          dir={direction}
          style={{ fontFamily: 'var(--font-primary-latin)' }}
        />
      </div>
    </div>
  );

  return (
    <header className="h-[86px] bg-white flex items-center px-[58px] border-b border-border-default">
      <div className="flex justify-between items-center w-full">
        {direction === 'rtl' ? (
          <>
            <div>{/* Potentially other elements or empty for spacing */}</div>
            {profileSearchBlock}
          </>
        ) : (
          <>
            {profileSearchBlock}
            <div>{/* Potentially other elements or empty for spacing */}</div>
          </>
        )}
      </div>
    </header>
  );
};