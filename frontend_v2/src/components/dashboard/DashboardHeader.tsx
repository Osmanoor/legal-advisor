// src/components/dashboard/DashboardHeader.tsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Menu, X, User as UserIcon, LogOut, Shield, LogIn, Repeat } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import UserAvatar from '/public/images/avatars/avatar1.png';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Permission } from '@/types/user';
import { HeaderSearch } from '@/features/search/components/HeaderSearch';

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
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

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
              isAdminPage ? (
                <Link to="/chat" className="flex items-center gap-2 w-full p-2 rounded-md text-sm hover:bg-gray-100 text-cta font-medium">
                  <Repeat className="w-4 h-4" />
                  <span>{t('dashboard.header.switchToUser')}</span>
                </Link>
              ) : (
                <Link to="/admin" className="flex items-center gap-2 w-full p-2 rounded-md text-sm hover:bg-gray-100 text-cta font-medium">
                  <Shield className="w-4 h-4" />
                  <span>{t('dashboard.header.switchToAdmin')}</span>
                </Link>
              )
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
        {/* <LogIn className="mr-2 h-4 w-8" /> */}
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
            <HeaderSearch className="flex-grow" />
          </div>
        )}

        {isDesktop && <div className="flex-grow"></div>}

        <div className={cn("flex items-center gap-3", direction === 'rtl' ? 'mr-auto' : 'ml-auto')}>
          {isDesktop && (
            <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {isAuthenticated ? <UserProfileDropdown /> : <GuestActions />}
              <HeaderSearch />
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