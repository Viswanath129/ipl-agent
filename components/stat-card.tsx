"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone?: "blue" | "orange" | "white";
};

const toneClasses = {
  blue: "text-cyan-300 bg-cyan-400/10 border-cyan-300/20",
  orange: "text-orange-300 bg-orange-400/10 border-orange-300/20",
  white: "text-white bg-white/10 border-white/15",
};

export function StatCard({ title, value, delta, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className={cn("rounded-lg border p-2.5", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm text-cyan-200">
        <ArrowUpRight className="h-4 w-4" />
        <span>{delta}</span>
      </div>
    </motion.div>
  );
}
