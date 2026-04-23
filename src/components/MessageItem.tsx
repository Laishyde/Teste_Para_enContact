import React from 'react';
import { CheckSquare, Square, UserPlus } from 'lucide-react';
import { MessageItem } from '../types';

interface MessageItemProps {
  item: MessageItem;
  selectedIds: number[];
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  isAnySelected: boolean;
  theme: 'light' | 'dark';
}

const MessageItemComponent: React.FC<MessageItemProps> = ({ item, selectedIds, setSelectedIds, isAnySelected, theme }) => {
  const isSelected = selectedIds.includes(item.id);

  const handleSelectItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev: number[]) => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div 
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
};

export default MessageItemComponent;
