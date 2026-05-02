"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const prompts = [
  "Why is Dream11 exposure spiking today?",
  "Package CSK vs MI into 5 slides",
  "Find the best player-brand pairing",
];

export function AiChatPanel() {
  const [input, setInput] = useState("");

  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 p-2.5 text-cyan-300">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Copilot</h3>
          <p className="text-sm text-slate-400">Sponsor intelligence assistant</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10"
          >
            <Sparkles className="h-4 w-4 text-orange-300" />
            {prompt}
          </button>
        ))}
      </div>
      <div className="mt-5 flex gap-2 rounded-lg border border-white/10 bg-slate-950/50 p-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask the engine"
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button className="rounded-md bg-cyan-400 p-2 text-slate-950 transition hover:bg-cyan-300">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
