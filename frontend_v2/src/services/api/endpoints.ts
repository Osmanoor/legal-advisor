// src/services/api/endpoints.ts
export const endpoints = {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      profile: '/auth/profile',
    },
    chat: {
      send: '/chat',
      history: '/chat/history',
    },
    library: {
      list: '/library/list-folder-contents',
      search: '/library/search-files',
      download: '/library/download',
    },
    search: {
      resources: '/search',
    },
    language: {
      set: '/language',
      get: '/language',
    },
  } as const;