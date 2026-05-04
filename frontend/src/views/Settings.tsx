import React, { useState } from 'react';
import { Bell, Shield, Database, Moon, Sun, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [apiKey, setApiKey] = useState('********************************');

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "Configuration updated across all agents."
    });
  };

  const handleReset = () => {
    toast.warning("Confirm reset?", {
      description: "This will clear all local cache and API keys.",
      action: {
        label: "Reset",
        onClick: () => toast.error("System reset complete")
      }
    });
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Settings</h2>
        <p className="text-sm text-gray-400">Manage preferences, API integrations, and security.</p>
      </div>

      {/* Profile */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-gray-500">Enterprise · Member since 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name</label>
            <input
              type="text"
              defaultValue="IPL Influence Admin"
              className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              defaultValue="admin@iplengine.ai"
              className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-white">API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-500 font-medium">Google ADK API Key</label>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Shield size={10} /> Validated
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 pr-16 text-sm font-mono text-white outline-none focus:border-blue-500/50 transition-colors"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Reveal
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-white/10">
            <div>
              <p className="text-sm font-medium text-white">Real-time Streaming</p>
              <p className="text-xs text-gray-500">WebSocket connection for live match data</p>
            </div>
            <button
              onClick={() => setStreaming(!streaming)}
              className={`w-11 h-6 rounded-full relative transition-colors ${streaming ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${streaming ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Preferences</h3>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={16} className="text-gray-400" /> : <Sun size={16} className="text-yellow-400" />}
              <span className="text-sm text-white">Theme</span>
            </div>
            <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  theme === 'dark' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  theme === 'light' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                Light
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-gray-400" />
              <span className="text-sm text-white">Push Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 h-10 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save size={14} />
          <span>Save Settings</span>
        </button>
        <button
          onClick={handleReset}
          className="h-10 px-4 bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
