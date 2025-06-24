// File: src/components/dashboard/DashboardHeader.tsx

import React, { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import UserAvatar from '/public/images/avatars/avatar1.png';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';

export const DashboardHeader = () => {
  const { t, direction } = useLanguage();
  const { toggleSidebar } = useUIStore();
  const { isDesktop } = useBreakpoint();
  const [isMobileSearchVisible, setMobileSearchVisible] = useState(false);

  // Flags for cleaner conditional rendering
  const showDefaultMobileHeader = !isDesktop && !isMobileSearchVisible;
  const showActiveMobileSearch = !isDesktop && isMobileSearchVisible;

  return (
    <header className="h-[86px] bg-white flex items-center px-4 sm:px-6 lg:px-[58px] border-b border-border-default">
      <div className="flex justify-between items-center w-full gap-4">

        {/* Hamburger Menu (Mobile default view) */}
        {showDefaultMobileHeader && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-600"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </Button>
        )}

        {/* Active Mobile Search Bar (takes up most of the space) */}
        {showActiveMobileSearch && (
          <div className="flex items-center gap-2 w-full">
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchVisible(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </Button>
            <Input
              type="text"
              placeholder={t('common.search') + "..."}
              className="h-[34px] flex-grow bg-gray-100 border-gray-300 focus:ring-1 focus:ring-cta"
              dir={direction}
              style={{ fontFamily: 'var(--font-primary-latin)' }}
              autoFocus
            />
          </div>
        )}

        {/* Spacer for Desktop view to align right-side content correctly */}
        {isDesktop && <div className="flex-grow"></div>}

        {/* Right-side content (Profile/Search) */}
        <div className={cn("flex items-center gap-3", direction === 'rtl' ? 'mr-auto' : 'ml-auto')}>

          {/* DESKTOP VIEW: Always show full search and profile */}
          {isDesktop && (
            <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-1`}>
                <img src={UserAvatar} alt={t('user.avatarAlt') || "User Avatar"} className="w-10 h-10 rounded-full" />
                <ChevronDown className="w-4 h-4 text-gray-800" />
              </div>
              <div className={`flex items-center border border-gray-300 rounded-md px-3 h-[34px] w-[240px]`}>
                <Search className={`w-5 h-5 text-gray-500 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                <Input
                  type="text"
                  placeholder={t('common.search') + "..."}
                  className="border-none focus:ring-0 h-full p-0 text-sm placeholder-gray-400 flex-grow bg-transparent"
                  dir={direction}
                  style={{ fontFamily: 'var(--font-primary-latin)' }}
                />
              </div>
            </div>
          )}

          {/* MOBILE/TABLET VIEW (Default): Show search icon and profile */}
          {showDefaultMobileHeader && (
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setMobileSearchVisible(true)}>
                  <Search className="w-5 h-5 text-gray-600" />
                </Button>
                <div className={`flex items-center gap-1`}>
                  <img src={UserAvatar} alt={t('user.avatarAlt') || "User Avatar"} className="w-10 h-10 rounded-full" />
                  <ChevronDown className="w-4 h-4 text-gray-800" />
                </div>
              </div>
          )}
        </div>

      </div>
    </header>
  );
};