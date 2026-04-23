import React, { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon, Globe, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useApp, useAppActions } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
import '../styles/globals.css';

const Header: React.FC = () => {
  const { state } = useApp();
  const { toggleSidebar, changeTheme, setLogin } = useAppActions();
  const { language, setLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setLogin(false);
  };

  const handleLanguageChange = (lang: 'pt' | 'en' | 'es') => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      className="h-16 px-4 flex items-center justify-between border-b shrink-0"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="btn btn-icon show-mobile"
          aria-label="Toggle menu"
        >
          <MenuIcon size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="eC Logo" 
            className="w-8 h-8 rounded-lg shadow-md"
          />
          <span className="font-bold text-lg hide-mobile">enContact</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="btn btn-ghost btn-icon flex items-center gap-1"
            aria-label="Change language"
          >
            <Globe size={18} />
            <span className="text-xs uppercase" data-no-translate="true">
              {languages.find(lang => lang.code === language)?.flag || '🌐'}
            </span>
            <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as 'pt' | 'en' | 'es')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    language === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span data-no-translate="true">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={changeTheme} 
          className="btn btn-ghost btn-icon"
          aria-label="Toggle theme"
        >
          {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button 
          onClick={handleLogout}
          className="btn btn-ghost btn-icon"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
