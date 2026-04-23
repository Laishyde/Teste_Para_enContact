import React from 'react';

interface FooterProps {
  theme: 'light' | 'dark';
  footer: string;
}

const Footer: React.FC<FooterProps> = ({ theme, footer }) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 flex justify-center relative">
      <div className="bg-yellow-200 dark:bg-yellow-600/40 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded shadow-sm border border-yellow-300/50 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-2 bg-red-400/30"></div>
         <span className="text-sm font-bold flex items-center gap-2">
           {footer}
           <div className="w-3 h-3 border-r-2 border-b-2 border-current opacity-30 transform translate-y-0.5"></div>
         </span>
         <div className="absolute -top-12 -left-12 w-24 h-24 border-2 border-slate-400 dark:border-slate-500 rounded-full opacity-20 pointer-events-none transition-transform group-hover:scale-110"></div>
      </div>
    </div>
  );
};

export default Footer;
