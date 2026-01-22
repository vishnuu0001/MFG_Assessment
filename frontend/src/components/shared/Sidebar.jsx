import React from 'react';
import { Home, Factory, Star, Grid, MapPin } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'Dashboard', label: 'Dashboard', icon: Home },
  { id: 'Smart Factory', label: 'Smart Factory Assessment', icon: Factory },
  { id: 'Rating Scales', label: 'Rating Scales', icon: Star },
  { id: 'Matrices', label: 'Matrices', icon: Grid },
  { id: 'Road Map', label: 'Road Map', icon: MapPin },
];

const Sidebar = ({ active, setActive, onBackToDashboard }) => (
  <nav className="w-64 bg-slate-900 flex flex-col shadow-2xl overflow-y-auto flex-shrink-0">
    <div className="flex items-center gap-3 mb-8 px-8 pt-6">
      <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white italic text-xl shadow-lg">S</div>
      <h2 className="font-black text-white italic uppercase tracking-tighter">STRAT.IQ</h2>
    </div>
    
    <div className="space-y-2 flex-1 px-6">
      {MENU_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = active === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-bold text-sm ${
              isActive
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <IconComponent size={18} />
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        );
      })}
    </div>
    
    <div className="border-t border-slate-800 pt-6 mt-6 pb-6 px-6">
      <button 
        onClick={() => {
          setActive('Dashboard');
        }}
        className="flex items-center gap-4 text-slate-500 font-bold text-sm hover:text-white transition-colors px-4 w-full"
      >
        <Home size={20} /> Dashboard Home
      </button>
    </div>
  </nav>
);

export default Sidebar;