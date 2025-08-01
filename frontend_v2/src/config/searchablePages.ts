import { Permission } from '@/types/user';

export interface SearchablePage {
  path: string;
  nameKey: string;
  keywordsKey: string;
  permission: Permission | null; // null for pages accessible to any authenticated user
}

export const searchablePages: SearchablePage[] = [
  // User Dashboard
  { path: '/chat', nameKey: 'navigation.chat', keywordsKey: 'searchKeywords.chat', permission: 'access_chat' },
  { path: '/search', nameKey: 'navigation.search', keywordsKey: 'searchKeywords.search', permission: 'access_search_tool' },
  { path: '/calculator', nameKey: 'navigation.calculator', keywordsKey: 'searchKeywords.calculator', permission: 'access_calculator' },
  { path: '/correction', nameKey: 'navigation.correction', keywordsKey: 'searchKeywords.correction', permission: 'access_text_corrector' },
  { path: '/tender-mapping', nameKey: 'navigation.tenderMapping', keywordsKey: 'searchKeywords.tenderMapping', permission: 'access_report_generator' },
  { path: '/feedback', nameKey: 'navigation.feedback', keywordsKey: 'searchKeywords.feedback', permission: 'access_feedback' },
  { path: '/settings', nameKey: 'dashboard.sidebar.settings', keywordsKey: 'searchKeywords.settings', permission: null },
  
  // Admin Dashboard
  { path: '/admin/analytics', nameKey: 'admin.sidebar.analytics', keywordsKey: 'searchKeywords.adminAnalytics', permission: 'view_analytics' },
  { path: '/admin/users', nameKey: 'admin.sidebar.userManagement', keywordsKey: 'searchKeywords.adminUsers', permission: 'manage_users' },
  { path: '/admin/feedback', nameKey: 'admin.sidebar.feedbackManagement', keywordsKey: 'searchKeywords.adminFeedback', permission: 'manage_feedback' },
  { path: '/admin/contacts', nameKey: 'admin.sidebar.contactMessages', keywordsKey: 'searchKeywords.adminContacts', permission: 'manage_contacts' },
  { path: '/admin/settings', nameKey: 'admin.sidebar.generalSettings', keywordsKey: 'searchKeywords.adminSettings', permission: 'manage_global_settings' },
];