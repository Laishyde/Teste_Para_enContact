/**
 * Tipos TypeScript para a aplicação enContact
 * Define interfaces para garantir type safety e melhorar a experiência de desenvolvimento
 */

// Interface para submenus dentro dos menus principais
export interface SubMenu {
  id: number;
  name: string;
}

// Interface para menus principais da aplicação
export interface MenuItem {
  id: number;
  name: string;
  subMenus: SubMenu[];
}

// Interface para itens/mensagens que serão exibidos na lista
export interface MessageItem {
  id: number;
  name: string;
  subject: string;
  owner: string;
  users: string[];
  time?: string;
  date?: string;
  read?: boolean;
}

// Interface para props do componente Login
export interface LoginProps {
  onLogin: () => void;
  lang: 'pt' | 'en';
  theme: 'light' | 'dark';
  setLang: (lang: 'pt' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Interface para props do componente Header
export interface HeaderProps {
  lang: 'pt' | 'en';
  theme: 'light' | 'dark';
  setLang: (lang: 'pt' | 'en') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

// Interface para props do componente Sidebar
export interface SidebarProps {
  menus: MenuItem[];
  selectedSubMenuId: number | null;
  setSelectedSubMenuId: (id: number | null) => void;
  openMenus: Record<number, boolean>;
  toggleMenu: (id: number) => void;
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

// Interface para props do componente Toolbar
export interface ToolbarProps {
  selectedIds: number[];
  onArchive: () => void;
  theme: 'light' | 'dark';
}

// Interface para props do componente MessageList
export interface MessageListProps {
  items: MessageItem[];
  selectedIds: number[];
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  loading: boolean;
  selectedSubMenuId: number | null;
  theme: 'light' | 'dark';
}

// Interface para props do componente MessageCard
export interface MessageCardProps {
  item: MessageItem;
  selectedIds: number[];
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  isAnySelected: boolean;
  theme: 'light' | 'dark';
}

// Interface para o hook useFetch
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Interface para o contexto de tema
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Interface para o contexto de idioma
export interface LangContextType {
  lang: 'pt' | 'en' | 'es';
  toggleLang: () => void;
  t: (key: string, options?: any) => string;
}
