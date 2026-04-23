import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu as MenuIcon, 
  Search, 
  Archive, 
  Calendar, 
  UserPlus, 
  Filter,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Square,
  LogOut
} from 'lucide-react';
import { MenuItem, MessageItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp, useAppActions } from '../context/AppContext';

interface DashboardProps {
  onLogout: () => void;
}

// Translations
const translations = {
  pt: {
    search: "Pesquisar",
    assign: "Atribuir",
    archive: "Arquivar",
    schedule: "Agendar",
    favorites: "Favoritas",
    logout: "Sair",
    empty: "Selecione uma pasta para ver as mensagens",
    noItems: "Nenhuma mensagem encontrada",
    theme: "Alternar Tema",
    lang: "Idioma",
    footer: "Redimensionável",
    loading: "Carregando...",
    itemsArchived: "itens arquivados"
  },
  en: {
    search: "Search",
    assign: "Assign",
    archive: "Archive",
    schedule: "Schedule",
    favorites: "Favorites",
    logout: "Logout",
    empty: "Select a folder to view messages",
    noItems: "No messages found",
    theme: "Toggle Theme",
    lang: "Language",
    footer: "Resizable",
    loading: "Loading...",
    itemsArchived: "items archived"
  },
  es: {
    search: "Buscar",
    assign: "Asignar",
    archive: "Archivar",
    schedule: "Programar",
    favorites: "Favoritas",
    logout: "Salir",
    empty: "Seleccione una carpeta para ver mensajes",
    noItems: "No se encontraron mensajes",
    theme: "Alternar Tema",
    lang: "Idioma",
    footer: "Redimensionable",
    loading: "Cargando...",
    itemsArchived: "ítems archivados"
  }
};

const API_BASE = "https://my-json-server.typicode.com/EnkiGroup/DesafioFrontEnd2026Jr";

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Usar LanguageContext em vez de estado local
  const { language, setLanguage } = useLanguage();
  const { state } = useApp();
  const { changeTheme } = useAppActions();
  
  // Theme state (mantido local por enquanto)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'scheduled' | 'archived' | 'trash'>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Data State
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<number | null>(null);
  const [items, setItems] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

  const t = translations[language];

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSelectOpen) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSelectOpen]);

  // Trigger translation when language changes
  useEffect(() => {
    if (window.autoTranslator) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const currentLang = window.autoTranslator.getCurrentLanguage();
        if (currentLang !== language) {
          window.autoTranslator.setLanguage(language);
        } else if (language !== 'pt') {
          window.autoTranslator.translatePage();
        }
      }, 100);
    }
  }, [language]);

  // Persist theme (language é gerenciado pelo LanguageContext)
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sincronizar tema com AppContext
  useEffect(() => {
    if (state.theme !== theme) {
      setTheme(state.theme);
    }
  }, [state.theme, theme]);

  // Fetch menus
  useEffect(() => {
    fetch(`${API_BASE}/menus`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMenus(data);
          if (data.length > 0) {
            setOpenMenus({ [data[0].id]: true });
          }
        }
      })
      .catch(err => console.error("Error loading menus:", err));
  }, []);

  // Fetch items when submenu is selected
  useEffect(() => {
    if (selectedSubMenuId !== null) {
      setLoading(true);
      fetch(`${API_BASE}/items/${selectedSubMenuId}`)
        .then(res => res.json())
        .then(data => {
          const normalizedData = Array.isArray(data) ? data : (data && typeof data === 'object' ? [data] : []);
          const safeData = normalizedData.map((item: any) => ({
            ...item,
            id: item.id || Math.random(),
            users: Array.isArray(item.users) ? item.users : []
          }));
          setItems(safeData);
          setLoading(false);
          setSelectedIds([]);
        })
        .catch(() => {
          setItems([]);
          setLoading(false);
        });
    }
  }, [selectedSubMenuId]);

  // Filter items based on search and filter selection
  const filteredItems = items.filter(item => {
    // Text search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    let matchesFilter = true;
    switch (filter) {
      case 'unread':
        matchesFilter = !item.read;
        break;
      case 'read':
        matchesFilter = !!item.read;
        break;
      case 'scheduled':
        matchesFilter = !!(item.date && item.time);
        break;
      case 'archived':
        matchesFilter = false; // Archived items are in archivedItems array
        break;
      case 'trash':
        matchesFilter = false; // Trashed items are in deletedItems array
        break;
      case 'all':
      default:
        matchesFilter = true;
        break;
    }
    
    return matchesSearch && matchesFilter;
  });
  
  // Get items based on current filter
  const getDisplayItems = () => {
    switch (filter) {
      case 'scheduled':
        return items.filter(item => !!(item.date && item.time));
      case 'archived':
        return [];
      case 'trash':
        return [];
      default:
        return items;
    }
  };
  
  const displayItems = filter === 'all' ? filteredItems : getDisplayItems().filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle menu
  const toggleMenu = useCallback((id: number) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Handle item selection (Outlook-style)
  const handleSelectItem = useCallback((id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  // Archive selected items
  const archiveSelected = useCallback(() => {
    const count = selectedIds.length;
    setItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    
    // Show toast feedback
    setToastMessage(`${count} ${t.itemsArchived}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [selectedIds, t.itemsArchived]);

  // Schedule selected items
  const scheduleSelected = useCallback(() => {
    const count = selectedIds.length;
    // Add scheduled date/time to items
    setItems(prev => prev.map(item => {
      if (selectedIds.includes(item.id)) {
        return {
          ...item,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5)
        };
      }
      return item;
    }));
    setSelectedIds([]);
    
    // Show toast feedback
    setToastMessage(`${count} ${language === 'pt' ? 'itens agendados' : language === 'en' ? 'items scheduled' : 'ítems programados'}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, [selectedIds, language]);

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsUserMenuOpen(false);
    onLogout();
  }, [onLogout]);

  const isAnySelected = selectedIds.length > 0;

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`h-16 px-4 flex items-center justify-between border-b shrink-0 ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <MenuIcon size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">eC</div>
            <span className="font-bold text-lg hidden sm:block">enContact</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage(language === 'pt' ? 'en' : language === 'en' ? 'es' : 'pt')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-sm transition-colors">
            <Globe size={18} />
            <span className="uppercase" data-no-translate="true">{language}</span>
          </button>
          <button onClick={() => changeTheme()} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-3 rounded-full border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
            >
              <span className="text-sm font-medium hidden sm:block">Admin</span>
              <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-xs relative">
                OA
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border py-2 z-50 animate-in fade-in zoom-in duration-100 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <LogOut size={16} />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          absolute inset-y-0 left-0 z-40 w-64 border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        `}>
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium w-full shadow-sm transition-colors">
                <span>+ New</span>
                <ChevronDown size={14} className="ml-auto" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              <div className="px-2 py-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
                <div className="flex items-center gap-2">
                   <MoreVertical size={14} />
                   <span>{t.favorites}</span>
                </div>
                <span>30</span>
              </div>

              {menus.map(menu => (
                <div key={menu.id} className="space-y-1">
                  <button 
                    onClick={() => toggleMenu(menu.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors group"
                  >
                    {openMenus[menu.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className="flex-1 text-left font-medium text-sm">{menu.name}</span>
                    <span className="text-xs opacity-50">15</span>
                  </button>
                  
                  {openMenus[menu.id] && (
                    <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
                      {menu.subMenus?.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedSubMenuId(sub.id);
                            if(window.innerWidth < 1024) setIsSidebarOpen(false);
                          }}
                          className={`
                            w-full text-left px-3 py-1.5 rounded-md text-sm transition-all
                            ${selectedSubMenuId === sub.id 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold' 
                              : 'hover:bg-slate-200 dark:hover:bg-slate-800'}
                          `}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
          
          {/* TopBar */}
          <div className={`p-4 border-b flex flex-wrap gap-4 items-center justify-between ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex-1 min-w-[200px] max-w-2xl relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:text-blue-500 transition-colors" size={18} />
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSelectOpen(true)}
                  className={`w-full pl-10 pr-20 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}
                >
                  {filter === 'all' ? (language === 'pt' ? 'Todos' : language === 'en' ? 'All' : 'Todos') :
                   filter === 'unread' ? (language === 'pt' ? 'Não lidos' : language === 'en' ? 'Unread' : 'No leídos') :
                   filter === 'read' ? (language === 'pt' ? 'Lidos' : language === 'en' ? 'Read' : 'Leídos') :
                   filter === 'scheduled' ? (language === 'pt' ? 'Agendados' : language === 'en' ? 'Scheduled' : 'Programados') :
                   filter === 'archived' ? (language === 'pt' ? 'Arquivados' : language === 'en' ? 'Archived' : 'Archivados') :
                   filter === 'trash' ? (language === 'pt' ? 'Lixeira' : language === 'en' ? 'Trash' : 'Papelera') : filter}
                  <ChevronDown className={`inline-block ml-1 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                
                {isSelectOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border z-50 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <button
                      type="button"
                      onClick={() => { setFilter('all'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Todos' : language === 'en' ? 'All' : 'Todos'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('unread'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Não lidos' : language === 'en' ? 'Unread' : 'No leídos'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('read'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'read' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Lidos' : language === 'en' ? 'Read' : 'Leídos'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('scheduled'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'scheduled' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Agendados' : language === 'en' ? 'Scheduled' : 'Programados'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('archived'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'archived' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Arquivados' : language === 'en' ? 'Archived' : 'Archivados'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setFilter('trash'); setIsSelectOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${filter === 'trash' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      {language === 'pt' ? 'Lixeira' : language === 'en' ? 'Trash' : 'Papelera'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
               <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
                 <CheckSquare size={16} className="text-blue-500" />
                 <span>{t.assign}</span>
               </button>
               <button 
                 onClick={archiveSelected}
                 disabled={selectedIds.length === 0}
                 className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
               >
                 <Archive size={16} className="text-orange-500" />
                 <span>{t.archive}</span>
               </button>
               <button 
                 onClick={scheduleSelected}
                 disabled={selectedIds.length === 0}
                 className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
               >
                 <Calendar size={16} className="text-purple-500" />
                 <span>{t.schedule}</span>
               </button>
               <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
               <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" role="img" aria-label="Filter">
                 <Filter size={18} />
               </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto relative p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">{t.loading}</p>
              </div>
            ) : selectedSubMenuId === null ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40 text-center p-8">
                <div className="w-24 h-24 mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                   <ChevronRight size={48} />
                </div>
                <p className="text-lg font-medium">{t.empty}</p>
              </div>
            ) : displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <p>{t.noItems}</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-1">
                {displayItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <div 
                      key={item.id}
                      className={`
                        group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer relative
                        ${isSelected 
                          ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' 
                          : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'}
                      `}
                      onClick={(e) => handleSelectItem(item.id, e)}
                    >
                      {/* Avatar / Checkbox Logic */}
                      <div className="relative w-12 h-12 shrink-0">
                        {/* Display Checkbox on Hover OR if Any Selected */}
                        <div className={`
                          absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full transition-opacity
                          ${isAnySelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                          {isSelected ? (
                            <CheckSquare className="text-blue-600" size={24} />
                          ) : (
                            <Square className="opacity-30" size={24} />
                          )}
                        </div>

                        {/* Large Avatar */}
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                          {item.owner || "OA"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-sm truncate">{item.name}</h3>
                          <span className="text-xs opacity-50 shrink-0">Hoje, 11:42</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                           <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded text-blue-500">
                              <span className="text-[10px] font-bold">6</span>
                           </div>
                           <p className={`text-sm truncate ${isSelected ? 'font-medium' : 'opacity-70'}`}>
                             {item.subject}
                           </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-60">
                           <div className="flex items-center gap-1">
                             <div className="w-4 h-4 bg-green-500/20 text-green-600 rounded flex items-center justify-center">
                               <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                             </div>
                             <span>Caixa de entrada</span>
                           </div>
                        </div>
                      </div>

                      {/* Users / Right Info */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                         <span className="text-[10px] uppercase font-bold opacity-40">-2 horas</span>
                         <div className="flex -space-x-1">
                           {item.users && item.users.length > 0 ? (
                             item.users.map((u, i) => (
                               <div 
                                 key={i} 
                                 className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold"
                               >
                                 {u}
                               </div>
                             ))
                           ) : (
                             <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                               <UserPlus size={12} className="opacity-30" />
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 flex justify-center relative">
            <div className="bg-yellow-200 dark:bg-yellow-600/40 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded shadow-sm border border-yellow-300/50 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-2 bg-red-400/30"></div>
               <span className="text-sm font-bold flex items-center gap-2">
                 {t.footer}
                 <div className="w-3 h-3 border-r-2 border-b-2 border-current opacity-30 transform translate-y-0.5"></div>
               </span>
               <div className="absolute -top-12 -left-12 w-24 h-24 border-2 border-slate-400 dark:border-slate-500 rounded-full opacity-20 pointer-events-none transition-transform group-hover:scale-110"></div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2 duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Dashboard;