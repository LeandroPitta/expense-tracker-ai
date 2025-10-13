import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Expense, Theme } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * UI State Store - manages global UI state
 */
interface UIStore {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Modal states
  expenseDialogOpen: boolean;
  setExpenseDialogOpen: (open: boolean) => void;
  
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  
  // Current expense being edited
  currentExpense: Expense | null;
  setCurrentExpense: (expense: Expense | null) => void;
  
  // Selected expenses for bulk operations
  selectedExpenses: string[];
  setSelectedExpenses: (ids: string[]) => void;
  addSelectedExpense: (id: string) => void;
  removeSelectedExpense: (id: string) => void;
  clearSelectedExpenses: () => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

      // Modals
      expenseDialogOpen: false,
      setExpenseDialogOpen: (open) => set({ expenseDialogOpen: open }),
      
      deleteDialogOpen: false,
      setDeleteDialogOpen: (open) => set({ deleteDialogOpen: open }),

      // Current expense
      currentExpense: null,
      setCurrentExpense: (expense) => set({ currentExpense: expense }),

      // Selected expenses
      selectedExpenses: [],
      setSelectedExpenses: (ids) => set({ selectedExpenses: ids }),
      addSelectedExpense: (id) => {
        const { selectedExpenses } = get();
        if (!selectedExpenses.includes(id)) {
          set({ selectedExpenses: [...selectedExpenses, id] });
        }
      },
      removeSelectedExpense: (id) => {
        const { selectedExpenses } = get();
        set({ selectedExpenses: selectedExpenses.filter(expId => expId !== id) });
      },
      clearSelectedExpenses: () => set({ selectedExpenses: [] }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: STORAGE_KEYS.sidebarState,
      partialize: (state) => ({ 
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);

/**
 * Theme Store - manages theme state
 */
interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system' as Theme,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
      },
    }),
    {
      name: STORAGE_KEYS.theme,
    }
  )
);

/**
 * Preferences Store - manages user preferences
 */
interface PreferencesStore {
  currency: string;
  dateFormat: string;
  notifications: boolean;
  setCurrency: (currency: string) => void;
  setDateFormat: (format: string) => void;
  setNotifications: (enabled: boolean) => void;
  resetPreferences: () => void;
}

const defaultPreferences = {
  currency: 'BRL',
  dateFormat: 'dd/MM/yyyy',
  notifications: true,
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setNotifications: (notifications) => set({ notifications }),
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: STORAGE_KEYS.userPreferences,
    }
  )
);