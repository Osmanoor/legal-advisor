// src/components/dashboard/DashboardHeader.tsx
// Updated for i18n

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, User as UserIcon, LogOut, Shield, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import UserAvatar from '/public/images/avatars/avatar1.png';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Permission } from '@/types/user';

const ADMIN_PAGE_PERMISSIONS: Permission[] = [
  'view_analytics',
  'manage_users',
  'manage_feedback',
  'manage_contacts',
  'manage_global_settings',
];

export const DashboardHeader = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { toggleSidebar } = useUIStore();
  const { isDesktop } = useBreakpoint();
  const [isMobileSearchVisible, setMobileSearchVisible] = useState(false);

  const { user, logout, isAuthenticated } = useAuthStore();
  
  const canAccessAdmin = user?.permissions.some(p => ADMIN_PAGE_PERMISSIONS.includes(p));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const showDefaultMobileHeader = !isDesktop && !isMobileSearchVisible;
  const showActiveMobileSearch = !isDesktop && isMobileSearchVisible;

  const UserProfileDropdown = () => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer" role="button">
          <img src={user?.profile_picture_url || UserAvatar} alt={user?.fullName || "User Avatar"} className="w-10 h-10 rounded-full" />
          <ChevronDown className="w-4 h-4 text-gray-800" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56" align={direction === 'rtl' ? 'start' : 'end'}>
        <div className="p-2">
          <div className="mb-2 border-b pb-2">
            <p className="font-semibold text-sm">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.email || user?.phoneNumber}</p>
          </div>
          <div className="space-y-1">
            <Link to="/settings" className="flex items-center gap-2 w-full p-2 rounded-md text-sm hover:bg-gray-100">
              <UserIcon className="w-4 h-4" />
              <span>{t('dashboard.header.profile')}</span>
            </Link>
            
            {canAccessAdmin && (
              <Link to="/admin" className="flex items-center gap-2 w-full p-2 rounded-md text-sm hover:bg-gray-100 text-cta font-medium">
                <Shield className="w-4 h-4" />
                <span>{t('dashboard.header.adminDashboard')}</span>
              </Link>
            )}

            <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 rounded-md text-sm hover:bg-red-50 text-red-600">
              <LogOut className="w-4 h-4" />
              <span>{t('dashboard.header.logout')}</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const GuestActions = () => (
    <Button asChild>
      <Link to="/login">
        <LogIn className="mr-2 h-4 w-4" />
        {t('dashboard.header.login')}
      </Link>
    </Button>
  );

  return (
    <header className="h-[86px] bg-white flex items-center px-4 sm:px-6 lg:px-[58px] border-b border-border-default">
      <div className="flex justify-between items-center w-full gap-4">

        {showDefaultMobileHeader && (
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-600" onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </Button>
        )}

        {showActiveMobileSearch && (
          <div className="flex items-center gap-2 w-full">
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchVisible(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </Button>
            <Input
              type="text"
              placeholder={`${t('common.search')}...`}
              className="h-[34px] flex-grow bg-gray-100 border-gray-300 focus:ring-1 focus:ring-cta"
              dir={direction}
              style={{ fontFamily: 'var(--font-primary-latin)' }}
              autoFocus
            />
          </div>
        )}

        {isDesktop && <div className="flex-grow"></div>}

        <div className={cn("flex items-center gap-3", direction === 'rtl' ? 'mr-auto' : 'ml-auto')}>
          {isDesktop && (
            <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {isAuthenticated ? <UserProfileDropdown /> : <GuestActions />}
              <div className={`flex items-center border border-gray-300 rounded-md px-3 h-[34px] w-[240px]`}>
                <Search className={`w-5 h-5 text-gray-500 ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                <Input
                  type="text"
                  placeholder={`${t('common.search')}...`}
                  className="border-none focus:ring-0 h-full p-0 text-sm placeholder-gray-400 flex-grow bg-transparent"
                  dir={direction}
                  style={{ fontFamily: 'var(--font-primary-latin)' }}
                />
              </div>
            </div>
          )}

          {showDefaultMobileHeader && (
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setMobileSearchVisible(true)}>
                  <Search className="w-5 h-5 text-gray-600" />
                </Button>
                {isAuthenticated ? <UserProfileDropdown /> : <GuestActions />}
              </div>
          )}
        </div>

      </div>
    </header>
  );
};