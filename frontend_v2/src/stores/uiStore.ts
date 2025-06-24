// File: src/stores/uiStore.ts

import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void; // Added for more control
  toggleSearch: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }), // Added setter
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));