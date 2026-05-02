"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

type SentimentMeterProps = {
  value: number;
  label: string;
};

export function SentimentMeter({ value, label }: SentimentMeterProps) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Live Fan Sentiment</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">{label}</h3>
        </div>
        <div className="rounded-lg border border-orange-300/20 bg-orange-400/10 p-2.5 text-orange-300">
          <Activity className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 h-3 rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-orange-400 shadow-[0_0_24px_rgba(22,184,255,0.35)]"
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate-400">
        <span>Cold</span>
        <span>{value}% positive</span>
        <span>Electric</span>
      </div>
    </div>
  );
}
