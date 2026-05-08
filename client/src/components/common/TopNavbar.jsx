import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const TopNavbar = ({ setIsMobileOpen }) => {
  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center relative">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="glass-input pl-10 py-2 w-64 text-sm bg-dark-900/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
