"use client";

import {
  BarChart3,
  Calendar,
  FileDown,
  Flame,
  LayoutDashboard,
  Megaphone,
  Radio,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Sponsor ROI", icon: BarChart3 },
  { label: "Debate Arena", icon: Flame },
  { label: "Viral Studio", icon: Megaphone },
  { label: "Match Intel", icon: Calendar },
  { label: "Reports", icon: FileDown },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">IPL Influence</p>
            <p className="text-xs text-zinc-500">Command Center</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                item.active
                  ? "bg-cyan-500 text-black"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* AI Signal Card */}
        <div className="mt-auto rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex items-center gap-2 text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">AI Signal</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Dream11 visibility is pacing 18% above matchday baseline.
          </p>
        </div>
      </div>
    </aside>
  );
}
