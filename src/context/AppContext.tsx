import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { MenuItem, MessageItem } from '../types';

// Interface para Toast
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Estado da aplicação
interface AppState {
  selectedMenuId: number | null;
  selectedItems: number[];
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'pt' | 'en' | 'es';
  isLoggedIn: boolean;
  menus: MenuItem[];
  items: MessageItem[];
  deletedItems: MessageItem[];
  scheduledItems: MessageItem[];
  archivedItems: MessageItem[];
  loading: boolean;
  searchQuery: string;
  filter: 'all' | 'unread' | 'read' | 'scheduled' | 'archived' | 'trash';
  openMenus: Record<number, boolean>;
  toasts: Toast[];
}

//  tipo de Ações possíveis 
type AppAction = 
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_ITEM_SELECTION'; itemId: number }
  | { type: 'SELECT_ALL_ITEMS'; itemIds: number[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ARCHIVE_ITEMS' }
  | { type: 'DELETE_ITEMS' }
  | { type: 'SCHEDULE_ITEMS'; scheduledData: { date: string; time: string; title: string; description?: string } }
  | { type: 'PERMANENTLY_DELETE_ITEMS' }
  | { type: 'SET_DELETED_ITEMS'; items: MessageItem[] }
  | { type: 'SET_SCHEDULED_ITEMS'; items: MessageItem[] }
  | { type: 'SET_ARCHIVED_ITEMS'; items: MessageItem[] }
  | { type: 'CHANGE_THEME' }
  | { type: 'CHANGE_LANGUAGE'; language?: 'pt' | 'en' | 'es' }
  | { type: 'SET_LOGIN'; isLoggedIn: boolean }
  | { type: 'SET_MENUS'; menus: MenuItem[] }
  | { type: 'SET_SELECTED_MENU'; menuId: number | null }
  | { type: 'SET_ITEMS'; items: MessageItem[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_FILTER'; filter: 'all' | 'unread' | 'read' | 'scheduled' | 'archived' | 'trash' }
  | { type: 'TOGGLE_MENU'; menuId: number }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; toastId: string }
  | { type: 'INITIALIZE_FROM_STORAGE'; payload: Partial<AppState> };

// Estado inicial
const initialState: AppState = {
  selectedMenuId: null,
  selectedItems: [],
  isSidebarOpen: false, // Fechado por padrão (aberto via CSS no desktop)
  theme: 'light',
  language: 'pt',
  isLoggedIn: false,
  menus: [],
  items: [],
  deletedItems: [],
  scheduledItems: [],
  archivedItems: [],
  loading: false,
  searchQuery: '',
  filter: 'all',
  openMenus: {},
  toasts: [],
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    
    case 'TOGGLE_ITEM_SELECTION':
      const isSelected = state.selectedItems.includes(action.itemId);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter(id => id !== action.itemId)
          : [...state.selectedItems, action.itemId]
      };
    
    case 'SELECT_ALL_ITEMS':
      return { ...state, selectedItems: action.itemIds };
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedItems: [] };
    
    case 'ARCHIVE_ITEMS':
      const itemsToArchive = state.items.filter(item => state.selectedItems.includes(item.id));
      return {
        ...state,
        items: state.items.filter(item => !state.selectedItems.includes(item.id)),
        archivedItems: [...state.archivedItems, ...itemsToArchive],
        selectedItems: []
      };
    
    case 'DELETE_ITEMS':
      const itemsToDelete = state.items.filter(item => state.selectedItems.includes(item.id));
      return {
        ...state,
        items: state.items.filter(item => !state.selectedItems.includes(item.id)),
        deletedItems: [...state.deletedItems, ...itemsToDelete],
        selectedItems: []
      };
    
    case 'SCHEDULE_ITEMS':
      const itemsToSchedule = state.items.filter(item => state.selectedItems.includes(item.id));
      const scheduledItemsWithDate = itemsToSchedule.map(item => ({
        ...item,
        date: action.scheduledData.date,
        time: action.scheduledData.time,
        subject: action.scheduledData.title
      }));
      return {
        ...state,
        items: state.items.filter(item => !state.selectedItems.includes(item.id)),
        scheduledItems: [...state.scheduledItems, ...scheduledItemsWithDate],
        selectedItems: []
      };
    
    case 'PERMANENTLY_DELETE_ITEMS':
      return {
        ...state,
        deletedItems: state.deletedItems.filter(item => !state.selectedItems.includes(item.id)),
        selectedItems: []
      };
    
    case 'SET_DELETED_ITEMS':
      return { ...state, deletedItems: action.items };
    
    case 'SET_SCHEDULED_ITEMS':
      return { ...state, scheduledItems: action.items };
    
    case 'SET_ARCHIVED_ITEMS':
      return { ...state, archivedItems: action.items };
    
    case 'CHANGE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case 'CHANGE_LANGUAGE':
      return { ...state, language: action.language || (state.language === 'pt' ? 'en' : state.language === 'en' ? 'es' : 'pt') };
    
    case 'SET_LOGIN':
      return { ...state, isLoggedIn: action.isLoggedIn };
    
    case 'SET_MENUS':
      return { ...state, menus: action.menus };
    
    case 'SET_SELECTED_MENU':
      return { ...state, selectedMenuId: action.menuId, selectedItems: [] };
    
    case 'SET_ITEMS':
      return { ...state, items: action.items };
    
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    
    case 'TOGGLE_MENU':
      return {
        ...state,
        openMenus: {
          ...state.openMenus,
          [action.menuId]: !state.openMenus[action.menuId]
        }
      };
    
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.toastId)
      };
    
    case 'INITIALIZE_FROM_STORAGE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar estado do localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('appState');
    if (storedState) {
      try {
        const parsed = JSON.parse(storedState);
        // No mobile, garantir que sidebar comece fechada
        if (window.innerWidth <= 768) {
          parsed.isSidebarOpen = false;
        }
        dispatch({ type: 'INITIALIZE_FROM_STORAGE', payload: parsed });
      } catch (error) {
        console.error('Erro ao carregar estado do localStorage:', error);
      }
    }
  }, []);

  // Listen for language change events from LanguageContext
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      dispatch({ type: 'CHANGE_LANGUAGE', language: event.detail });
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener);
  }, []);

  // Salvar estado no localStorage
  useEffect(() => {
    const stateToSave = {
      theme: state.theme,
      language: state.language,
      isSidebarOpen: state.isSidebarOpen,
      isLoggedIn: state.isLoggedIn,
      items: state.items,
      deletedItems: state.deletedItems,
      scheduledItems: state.scheduledItems,
      archivedItems: state.archivedItems,
      selectedMenuId: state.selectedMenuId,
      menus: state.menus,
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
  }, [
    state.theme, 
    state.language, 
    state.isSidebarOpen,
    state.isLoggedIn,
    state.items,
    state.deletedItems,
    state.scheduledItems,
    state.archivedItems,
    state.selectedMenuId,
    state.menus,
  ]);

  // Aplicar idioma ao documento
  useEffect(() => {
    document.documentElement.lang = state.language;
  }, [state.language]);

  // Aplicar tema ao documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.className = state.theme;
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

// Actions helper
export const useAppActions = () => {
  const { dispatch } = useApp();

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', toast: { ...toast, id } });
  }, [dispatch]);

  return {
    toggleSidebar: useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), [dispatch]),
    toggleItemSelection: useCallback((itemId: number) => dispatch({ type: 'TOGGLE_ITEM_SELECTION', itemId }), [dispatch]),
    selectAllItems: useCallback((itemIds: number[]) => dispatch({ type: 'SELECT_ALL_ITEMS', itemIds }), [dispatch]),
    clearSelection: useCallback(() => dispatch({ type: 'CLEAR_SELECTION' }), [dispatch]),
    archiveItems: useCallback(() => dispatch({ type: 'ARCHIVE_ITEMS' }), [dispatch]),
    deleteItems: useCallback(() => dispatch({ type: 'DELETE_ITEMS' }), [dispatch]),
    scheduleItems: useCallback((scheduledData: { date: string; time: string; title: string; description?: string }) => dispatch({ type: 'SCHEDULE_ITEMS', scheduledData }), [dispatch]),
    permanentlyDeleteItems: useCallback(() => dispatch({ type: 'PERMANENTLY_DELETE_ITEMS' }), [dispatch]),
    setDeletedItems: useCallback((items: MessageItem[]) => dispatch({ type: 'SET_DELETED_ITEMS', items }), [dispatch]),
    setScheduledItems: useCallback((items: MessageItem[]) => dispatch({ type: 'SET_SCHEDULED_ITEMS', items }), [dispatch]),
    setArchivedItems: useCallback((items: MessageItem[]) => dispatch({ type: 'SET_ARCHIVED_ITEMS', items }), [dispatch]),
    changeTheme: useCallback(() => dispatch({ type: 'CHANGE_THEME' }), [dispatch]),
    changeLanguage: useCallback((language?: 'pt' | 'en' | 'es') => dispatch({ type: 'CHANGE_LANGUAGE', language }), [dispatch]),
    setLogin: useCallback((isLoggedIn: boolean) => dispatch({ type: 'SET_LOGIN', isLoggedIn }), [dispatch]),
    setMenus: useCallback((menus: MenuItem[]) => dispatch({ type: 'SET_MENUS', menus }), [dispatch]),
    setSelectedMenu: useCallback((menuId: number | null) => dispatch({ type: 'SET_SELECTED_MENU', menuId }), [dispatch]),
    setItems: useCallback((items: MessageItem[]) => dispatch({ type: 'SET_ITEMS', items }), [dispatch]),
    setLoading: useCallback((loading: boolean) => dispatch({ type: 'SET_LOADING', loading }), [dispatch]),
    setSearch: useCallback((query: string) => dispatch({ type: 'SET_SEARCH', query }), [dispatch]),
    setFilter: useCallback((filter: 'all' | 'unread' | 'read' | 'scheduled' | 'archived' | 'trash') => dispatch({ type: 'SET_FILTER', filter }), [dispatch]),
    toggleMenu: useCallback((menuId: number) => dispatch({ type: 'TOGGLE_MENU', menuId }), [dispatch]),
    addToast,
    removeToast: useCallback((toastId: string) => dispatch({ type: 'REMOVE_TOAST', toastId }), [dispatch]),
  };
};
