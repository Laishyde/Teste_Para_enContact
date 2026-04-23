import React from 'react';
import { LogOut } from 'lucide-react';

interface UserMenuProps {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  logout: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ isUserMenuOpen, setIsUserMenuOpen, onLogout, theme, logout }) => {
  return (
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
            onClick={onLogout}
            className="w-full px-4 py-2 text-left flex items-center gap-3 text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <LogOut size={16} />
            <span>{logout}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
