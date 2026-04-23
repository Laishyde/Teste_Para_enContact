import React from 'react';
import { Search, ChevronDown, CheckSquare, Archive, Calendar, Filter } from 'lucide-react';

interface TopBarProps {
  theme: 'light' | 'dark';
  search: string;
  assign: string;
  archive: string;
  schedule: string;
  selectedIds: number[];
  onArchive: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ theme, search, assign, archive, schedule, selectedIds, onArchive }) => {
  return (
    <div className={`p-4 border-b flex flex-wrap gap-4 items-center justify-between ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
      <div className="flex-1 min-w-[200px] max-w-2xl relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder={search}
          className={`w-full pl-10 pr-10 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
      </div>

      <div className="flex items-center gap-2">
         <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
           <CheckSquare size={16} className="text-blue-500" />
           <span>{assign}</span>
         </button>
         <button 
           onClick={onArchive}
           disabled={selectedIds.length === 0}
           className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
         >
           <Archive size={16} className="text-orange-500" />
           <span>{archive}</span>
         </button>
         <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}>
           <Calendar size={16} className="text-purple-500" />
           <span>{schedule}</span>
         </button>
         <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
           <Filter size={18} />
         </button>
      </div>
    </div>
  );
};

export default TopBar;
