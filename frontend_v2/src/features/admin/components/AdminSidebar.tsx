// src/features/admin/components/AdminSidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Users, MessageSquare, Settings, HelpCircle, LogOut, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dash.svg';
import { useUIStore } from '@/stores/uiStore';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/types/user';

const iconMap: { [key: string]: React.ElementType } = {
  analytics: BarChart2,
  users: Users,
  feedback: MessageSquare,
  contacts: Mail,
  settings: Settings, // <-- ADD ICON FOR SETTINGS
};

export const AdminSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Get user to check permissions
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { isDesktop } = useBreakpoint();
  const { canAccess } = usePermission();
  
  // --- NEW: Check for super admin permission ---
  const canManageSettings = user?.permissions.includes('manage_global_settings');

  const mainNavItems: { path: string; textAr: string; iconName: string; permission: Permission }[] = [
    { path: '/admin/analytics', textAr: 'الأحصائيات', iconName: 'analytics', permission: 'view_analytics' },
    { path: '/admin/users', textAr: 'إدارة المستخدمين', iconName: 'users', permission: 'manage_users' },
    { path: '/admin/feedback', textAr: 'إدارة التقييم', iconName: 'feedback', permission: 'manage_feedback' },
    { path: '/admin/contacts', textAr: 'رسائل التواصل', iconName: 'contacts', permission: 'manage_contacts' },
  ];
  
  // --- NEW: Add settings to secondary nav, conditionally ---
  const secondaryNavItems = [
    { path: '/admin/settings', textAr: 'الإعدادات العامة', icon: Settings, permission: 'manage_global_settings' },
    { path: '/help', textAr: 'المساعدة', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLinkClick = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={cn(
        "w-[277px] h-screen bg-white border-l border-border-default flex flex-col fixed right-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "translate-x-full",
        "lg:translate-x-0"
      )}
      style={{ direction: 'ltr' }}
    >
      <div className="h-[86px] flex items-center justify-end px-6 border-b border-border-default shrink-0">
        <Link to="/" onClick={handleLinkClick}>
          <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
        </Link>
      </div>

      <nav className="flex-grow pt-8 px-6 flex flex-col">
        <ul className="space-y-4 mb-8">
          {mainNavItems.map(item => {
            const IconComponent = iconMap[item.iconName];
            const active = isActive(item.path);
            if (!canAccess(item.permission)) return null; // Don't render the link if user lacks permission
            return (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-end gap-3 p-3 h-[40px] font-bold rounded-md transition-colors group ${active ? 'bg-[#F5F8FE] text-cta' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <span className={`font-medium text-lg ${active ? 'font-semibold' : 'font-normal'} text-right`} style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                    {item.textAr}
                  </span>
                  {IconComponent && <IconComponent className={`w-5 h-5 ${active ? 'text-cta' : 'text-gray-400'}`} />}
                  {active && <div className="w-1 h-full bg-cta rounded-l-sm absolute right-0 top-0 bottom-0"></div>}
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="border-gray-200 my-8" />

        <ul className="space-y-4">
          {secondaryNavItems.map(item => {
            const IconComponent = item.icon;
            if (item.permission && !canAccess(item.permission as Permission)) return null; // Don't render if user lacks permission
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className="flex items-center justify-end gap-3 p-3 h-[40px] rounded-md text-gray-500 hover:bg-gray-100 group"
                >
                  <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                    {item.textAr}
                  </span>
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-400" />}
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto pb-8">
            <button
                onClick={handleLogout}
                className="flex items-center justify-end gap-3 p-3 h-[40px] w-full rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 group transition-colors"
            >
                <span className="font-normal text-lg text-right" style={{ fontFamily: 'var(--font-primary-arabic)' }}>
                  تسجيل الخروج
                </span>
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            </button>
        </div>
      </nav>
    </aside>
  );
};