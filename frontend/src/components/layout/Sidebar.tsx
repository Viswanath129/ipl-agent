import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Shirt,
  Swords,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Ask AI', path: '/ask-ai', icon: Sparkles },
  { name: 'Sponsor ROI', path: '/sponsor-roi', icon: TrendingUp },
  { name: '3D Jerseys', path: '/jerseys', icon: Shirt },
  { name: 'Debate Arena', path: '/debate', icon: Swords },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#020617] border-r border-white/10 flex flex-col flex-shrink-0 transition-[width] duration-200 z-50 ${
        isOpen ? 'w-60' : 'w-[72px]'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-white/10 ${isOpen ? 'px-5' : 'justify-center px-0'}`}>
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Zap className="text-white" size={18} />
        </div>
        {isOpen && (
          <span className="ml-3 text-sm font-semibold text-white tracking-tight">IPL Engine</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${!isOpen ? 'justify-center px-2' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/10">
        {isOpen && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">Enterprise</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
