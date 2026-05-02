"use client";

import { motion } from "framer-motion";
import { Share2, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

const matchups = [
  { a: "Dhoni", b: "Rohit", aVote: 54, verdict: "Dhoni leads tactics. Rohit pressures outcomes through title velocity." },
  { a: "Kohli", b: "ABD", aVote: 61, verdict: "Kohli owns volume and chases. ABD owns shot ceiling and format elasticity." },
  { a: "CSK", b: "MI", aVote: 49, verdict: "CSK wins continuity. MI wins peak-cycle dominance and recruitment aggression." },
];

export function DebateCard() {
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<"a" | "b">("a");
  const matchup = matchups[active];
  const voteA = useMemo(() => (picked === "a" ? matchup.aVote + 3 : matchup.aVote - 3), [matchup, picked]);
  const voteB = 100 - voteA;

  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-orange-300">Debate Arena</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{matchup.a} vs {matchup.b}</h3>
        </div>
        <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
          {matchups.map((item, index) => (
            <button
              key={`${item.a}-${item.b}`}
              onClick={() => setActive(index)}
              className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                active === index ? "bg-cyan-400 text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              {item.a} / {item.b}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {(["a", "b"] as const).map((side) => {
          const name = side === "a" ? matchup.a : matchup.b;
          const value = side === "a" ? voteA : voteB;
          return (
            <motion.button
              key={side}
              whileHover={{ y: -3 }}
              onClick={() => setPicked(side)}
              className={`rounded-lg border p-5 text-left transition ${
                picked === side
                  ? "border-cyan-300/45 bg-cyan-400/10 glow-border"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">{name}</span>
                <Trophy className={picked === side ? "h-5 w-5 text-cyan-300" : "h-5 w-5 text-slate-500"} />
              </div>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-orange-400" style={{ width: `${value}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{value}% live vote</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-orange-300/20 bg-orange-400/10 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-orange-300" />
          <div>
            <p className="text-sm font-semibold text-white">AI verdict</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{matchup.verdict}</p>
          </div>
        </div>
      </div>

      <button className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10">
        <Share2 className="h-4 w-4" />
        Export carousel
      </button>
    </div>
  );
}
