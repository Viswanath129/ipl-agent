import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/ask-ai': 'Ask AI',
  '/sponsor-roi': 'Sponsor ROI',
  '/jerseys': '3D Jerseys',
  '/debate': 'Debate Arena',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const Topbar: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  const notifications = [
    { id: 1, title: 'New ROI Report', body: 'Dream11 vs MI analysis is ready.', time: '2m ago' },
    { id: 2, title: 'Live Debate Alert', body: 'Dhoni vs Rohit debate is trending.', time: '15m ago' },
    { id: 3, title: 'System Update', body: 'AI Engine v4.0 deployed.', time: '1h ago' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Searching for "${searchQuery}"...`);
  };

  return (
    <header className="h-14 bg-[#020617] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Page Title */}
      <h1 className="text-lg font-semibold text-white sm:min-w-[160px]">{pageTitle}</h1>

      {/* Center: Search */}
      <form onSubmit={handleSearch} className="mx-6 hidden max-w-[400px] flex-1 sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search sponsors, debates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </form>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-4">
        {/* Live Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-xs text-blue-400 font-medium">3 new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="text-sm font-medium text-white">{n.title}</span>
                    <span className="text-xs text-gray-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-400">{n.body}</p>
                </div>
              ))}
              <button
                onClick={() => { setShowNotifications(false); toast.success("Notifications cleared"); }}
                className="w-full px-4 py-2.5 text-xs text-blue-400 hover:text-blue-300 transition-colors text-center"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Upgrade */}
        <button
          onClick={() => toast.info("Upgrade to Pro for unlimited API access.")}
          className="hidden h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors sm:block"
        >
          Upgrade
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-gray-300">
          AD
        </div>
      </div>
    </header>
  );
};

export default Topbar;
