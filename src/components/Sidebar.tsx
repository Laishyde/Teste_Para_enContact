import React from 'react';
import { ChevronDown, Star, Inbox, Send, FileText, Trash2, X } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import { MenuItem } from '../types';
import logo from '../assets/logo.png';
import '../styles/globals.css';

const Sidebar: React.FC = () => {
  const { state } = useApp();
  const { setSelectedMenu, toggleMenu, toggleSidebar } = useAppActions();

  const getMenuIcon = (menuName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Inbox': <Inbox size={18} />,
      'Enviados': <Send size={18} />,
      'Rascunhos': <FileText size={18} />,
      'Lixeira': <Trash2 size={18} />,
      'Favoritos': <Star size={18} />,
    };
    return icons[menuName] || <Inbox size={18} />;
  };

  const handleMenuClick = (menuId: number) => {
    // Se o menu tiver submenus, apenas expandir/retrair
    const menu = state.menus.find(m => m.id === menuId);
    if (menu && menu.subMenus.length > 0) {
      toggleMenu(menuId);
    } else {
      setSelectedMenu(menuId);
      // Fechar sidebar apenas no mobile após selecionar um item
      // Verificar se está realmente no mobile (não apenas viewport width)
      const isMobile = window.innerWidth <= 768;
      if (isMobile && state.isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  const handleSubMenuClick = (e: React.MouseEvent, subMenuId: number) => {
    e.stopPropagation();
    setSelectedMenu(subMenuId);
    // Fechar sidebar apenas no mobile após selecionar um item
    const isMobile = window.innerWidth <= 768;
    if (isMobile && state.isSidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {state.isSidebarOpen && (
        <div 
          className="overlay show-mobile hide-desktop"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${!state.isSidebarOpen ? 'collapsed' : ''} ${state.isSidebarOpen ? 'open' : ''}`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header do Sidebar */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={logo} 
                  alt="eC Logo" 
                  className="w-8 h-8 rounded-lg shadow-md"
                />
                {state.isSidebarOpen && (
                  <span className="font-bold text-lg hide-mobile">enContact</span>
                )}
              </div>
              
              {/* Botão para fechar sidebar - visível apenas no mobile */}
              <button 
                onClick={toggleSidebar}
                className="btn btn-icon show-mobile"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-auto p-2">
            {state.menus.map((menu: MenuItem) => (
              <div key={menu.id} className="mb-1">
                {/* Menu Principal */}
                <div
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    state.selectedMenuId === menu.id
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    backgroundColor: state.selectedMenuId === menu.id 
                      ? 'var(--color-primary)20'
                      : 'transparent'
                  }}
                  onClick={() => handleMenuClick(menu.id)}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                      {getMenuIcon(menu.name)}
                    </div>
                    <span 
                      className={`font-medium ${!state.isSidebarOpen ? 'hide-mobile' : ''}`}
                      style={{ 
                        color: state.selectedMenuId === menu.id 
                          ? 'var(--color-primary)' 
                          : 'var(--color-text-primary)' 
                      }}
                    >
                      {menu.name}
                    </span>
                  </div>
                  
                  {menu.subMenus && menu.subMenus.length > 0 && (
                    <button
                      onClick={(e) => handleSubMenuClick(e, menu.id)}
                      className={`p-1 rounded transition-transform duration-200 ${
                        state.openMenus[menu.id] ? 'rotate-180' : ''
                      } ${!state.isSidebarOpen ? 'hide-mobile' : ''}`}
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>

                {/* Submenus */}
                {menu.subMenus && 
                 menu.subMenus.length > 0 && 
                 state.openMenus[menu.id] && 
                 state.isSidebarOpen && (
                  <div className="ml-6 mt-1 space-y-1 animate-slide-in">
                    {menu.subMenus.map((subMenu) => (
                      <div
                        key={subMenu.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                          state.selectedMenuId === subMenu.id
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        style={{
                          backgroundColor: state.selectedMenuId === subMenu.id 
                            ? 'var(--color-primary)20'
                            : 'transparent'
                        }}
                        onClick={(e) => handleSubMenuClick(e, subMenu.id)}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: state.selectedMenuId === subMenu.id 
                              ? 'var(--color-primary)' 
                              : 'var(--color-text-muted)' 
                          }}
                        />
                        <span 
                          className="text-sm"
                          style={{ 
                            color: state.selectedMenuId === subMenu.id 
                              ? 'var(--color-primary)' 
                              : 'var(--color-text-secondary)' 
                          }}
                        >
                          {subMenu.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer do Sidebar */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  U
                </div>
                {/* Green online indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              {state.isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <div 
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      Usuário
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div 
                    className="text-xs truncate"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Online
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
