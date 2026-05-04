import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './views/Dashboard';
import AskAI from './views/AskAI';
import SponsorROI from './views/SponsorROI';
import JerseyEngineView from './views/JerseyEngineView';
import DebateArena from './views/DebateArena';
import Reports from './views/Reports';
import Settings from './views/Settings';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      <Toaster position="top-right" richColors theme="dark" />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ask-ai" element={<AskAI />} />
            <Route path="/sponsor-roi" element={<SponsorROI />} />
            <Route path="/jerseys" element={<JerseyEngineView />} />
            <Route path="/debate" element={<DebateArena />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
