import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, BarChart3, Users, HelpCircle, GitBranch, ChevronDown, ChevronRight, Building2, Factory, FileText, CheckSquare, Star, Grid } from 'lucide-react';

const MENU_STRUCTURE = [
  {
    id: 'techm-digital-cockpit',
    label: 'Tech M Digital Cock Pit',
    icon: LayoutDashboard,
    children: [
      {
        id: 'm-and-m',
        label: 'M & M',
        icon: Factory,
        children: [
          { id: 'Reports', icon: FileText },
          { id: 'Smart Factory Checksheet', icon: CheckSquare },
          { id: 'Rating Scales', icon: Star },
          { id: 'Matrices', icon: Grid },
        ],
      },
    ],
  },
];

const MenuItem = ({ item, active, setActive, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = active === item.id;
  const isParentOfActive = hasChildren && item.children.some(
    child => child.id === active || (child.children && child.children.some(subChild => subChild.id === active))
  );

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      setActive(item.id);
    }
  };

  const paddingLeft = `${level * 0.75 + 1}rem`;

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-bold text-sm ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : isParentOfActive
            ? 'bg-slate-800 text-blue-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
        style={{ paddingLeft }}
      >
        {item.icon && <item.icon size={18} />}
        <span className="flex-1 text-left">{item.label || item.id}</span>
        {hasChildren && (
          isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
      </button>
      {hasChildren && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              active={active}
              setActive={setActive}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ active, setActive }) => (
  <nav className="w-64 bg-slate-900 h-screen fixed flex flex-col p-6 shadow-2xl overflow-y-auto">
    <div className="flex items-center gap-3 mb-8 px-2">
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic text-xl shadow-lg">S</div>
      <h2 className="font-black text-white italic uppercase tracking-tighter">STRAT.IQ</h2>
    </div>
    <div className="space-y-2 flex-1">
      {MENU_STRUCTURE.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          active={active}
          setActive={setActive}
          level={0}
        />
      ))}
    </div>
    <div className="border-t border-slate-800 pt-6 mt-6">
      <button className="flex items-center gap-4 text-slate-500 font-bold text-sm hover:text-white transition-colors px-4">
        <HelpCircle size={20} /> Support
      </button>
    </div>
  </nav>
);

export default Sidebar;