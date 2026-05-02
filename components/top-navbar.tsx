"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  Bell,
  Bot,
  Command as CommandIcon,
  Menu,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const commands = [
  "Open Sponsor ROI",
  "Generate Debate Export",
  "View Match Intelligence",
  "Download Sponsor PDF",
];

export function TopNavbar() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur-xl lg:ml-72 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium text-cyan-400">Live Command View</p>
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
          </div>

          <div className="hidden flex-1 justify-center px-8 md:flex">
            <button
              onClick={() => setCommandOpen(true)}
              className="flex w-full max-w-md items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-400"
            >
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search sponsors, debates...
              </span>
              <span className="flex items-center gap-1 rounded border border-zinc-700 px-1.5 py-0.5 text-xs">
                <CommandIcon className="h-3 w-3" /> K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 transition hover:text-zinc-200">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
            </button>
            <button className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 sm:flex">
              <User className="h-4 w-4" />
              Analyst
            </button>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <Dialog.Root open={commandOpen} onOpenChange={setCommandOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[min(92vw,640px)] -translate-x-1/2 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
            <Command className="rounded-lg bg-transparent text-zinc-200">
              <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-3">
                <Search className="h-4 w-4 text-cyan-400" />
                <Command.Input
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                />
              </div>
              <Command.List className="max-h-64 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-sm text-zinc-500">
                  No results found.
                </Command.Empty>
                {commands.map((item) => (
                  <Command.Item
                    key={item}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 aria-selected:bg-cyan-500/10 aria-selected:text-cyan-400"
                  >
                    <Bot className="h-4 w-4" />
                    {item}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Mobile Drawer */}
      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl border border-zinc-800 bg-zinc-900 p-4 lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-sm font-semibold text-white">Menu</Dialog.Title>
              <Dialog.Close className="rounded-lg border border-zinc-800 p-2 text-zinc-400">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <nav className="space-y-1">
              {["Dashboard", "Sponsor ROI", "Debate Arena", "Reports"].map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-800/50"
                >
                  {item}
                </button>
              ))}
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
