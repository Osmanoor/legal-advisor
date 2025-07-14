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

const iconMap: { [key: string]: React.ElementType } = {
  analytics: BarChart2,
  users: Users,
  feedback: MessageSquare,
  contacts: Mail,
};

export const AdminSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { logout } = useAuthStore(); // This now calls the live API function
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { isDesktop } = useBreakpoint();

  const mainNavItems = [
    { path: '/admin/analytics', textAr: 'الأحصائيات', iconName: 'analytics' },
    { path: '/admin/users', textAr: 'إدارة المستخدمين', iconName: 'users' },
    { path: '/admin/feedback', textAr: 'إدارة التقييم', iconName: 'feedback' },
    { path: '/admin/contacts', textAr: 'رسائل التواصل', iconName: 'contacts' },
  ];

  const secondaryNavItems = [
    { path: '/settings', textAr: 'الاعدادات', icon: Settings },
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
    // No navigation is needed here. The protected route component will automatically
    // detect the change in authentication state and redirect the user to the login page.
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
                  {t('auth.logout')}
                </span>
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            </button>
        </div>
      </nav>
    </aside>
  );
};