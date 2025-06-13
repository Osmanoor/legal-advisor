// src/components/dashboard/DashboardSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Calculator, Edit3, FileText, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewLogoDark from '@/assets/logo-new-dash.svg';

const iconMap: { [key: string]: React.ElementType } = {
  chat: MessageSquare,
  calculator: Calculator,
  correction: Edit3,
  templates: FileText,
};

export const DashboardSidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const mainNavItems = [
    { path: '/chat', labelKey: 'navigation.chat', textAr: 'المساعد الذكي', iconName: 'chat' },
    { path: '/calculator', labelKey: 'navigation.calculator', textAr: 'الالة الحاسبة', iconName: 'calculator' },
    { path: '/correction', labelKey: 'navigation.correction', textAr: 'معالج النصوص', iconName: 'correction' },
    { path: '/templates', labelKey: 'navigation.templates', textAr: 'نظام الطرح', iconName: 'templates' },
  ];

  const secondaryNavItems = [
    { path: '/settings', labelKey: 'navigation.settings', textAr: 'الاعدادات', icon: Settings },
    { path: '/help', labelKey: 'navigation.help', textAr: 'المساعدة', icon: HelpCircle },
    { path: '/logout', labelKey: 'navigation.logout', textAr: 'تسجيل خروج', icon: LogOut },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside 
      className="w-[277px] h-screen bg-white border-l border-border-default flex flex-col fixed right-0 top-0 overflow-y-auto"
      // The sidebar's overall structure is RTL
      style={{ direction: 'ltr' }}
    >
      {/* Logo Area */}
      <div className="h-[86px] flex items-center justify-end px-6 border-b border-border-default shrink-0">
        <Link to="/">
          <img src={NewLogoDark} alt={t('procurement.communityName')} className="h-[42.9px] w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow pt-8 px-6"> {/* Content within nav will also flow RTL */}
        {/* Main Navigation */}
        <ul className="space-y-4 mb-8">
          {mainNavItems.map(item => {
            const IconComponent = iconMap[item.iconName];
            const active = isActive(item.path);
            return (
              <li key={item.path} className="relative"> {/* For absolute positioning of active bar */}
                <Link
                  to={item.path}
                  // We want Icon on Left, Text on Right (visually) even in RTL sidebar.
                  // So, inside the link, it's an LTR-like visual flow.
                  // `justify-end` will push content to the right edge of the link area.
                  // `gap-3` provides spacing between icon and text.
                  className={`flex items-center justify-end gap-3 p-3 h-[40px] font-bold rounded-md transition-colors group
                              ${active ? 'bg-[#F5F8FE] text-cta' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                >
                  {/* Text is first in code, so it appears on the right due to parent RTL and justify-end */}
                  <span 
                    className={`font-medium text-lg ${active ? 'font-semibold' : 'font-normal'} text-right`} // Ensure text itself is right-aligned
                    style={{fontFamily: 'var(--font-primary-arabic)'}}
                  >
                    {item.textAr}
                  </span>
                  {/* Icon is second in code, so it appears to the left of the text */}
                  {IconComponent && <IconComponent className={`w-5 h-5 ${active ? 'text-cta' : 'text-gray-400 group-hover:text-gray-500'}`} />}
                  
                  {/* Active indicator bar (on the right side of the item for RTL) */}
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
                  className="flex items-center justify-end gap-3 p-3 h-[40px] rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 group transition-colors"
                >
                   <span className="font-normal text-lg text-right" style={{fontFamily: 'var(--font-primary-arabic)'}}>
                     {item.textAr}
                   </span>
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};