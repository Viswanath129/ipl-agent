"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardProps = {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  variant?: "default" | "orange" | "subtle";
  trendUp?: boolean;
};

const variantClasses = {
  default: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  subtle: "text-zinc-300 bg-zinc-500/10 border-zinc-500/20",
};

export function StatCard({ title, value, trend, icon: Icon, variant = "default", trendUp = true }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-panel p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div className={cn("rounded-lg border p-2", variantClasses[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className={cn("mt-4 flex items-center gap-1.5 text-xs", trendUp ? "text-cyan-400" : "text-orange-400")}>
        <ArrowUpRight className={cn("h-3.5 w-3.5", !trendUp && "rotate-90")} />
        <span>{trend}</span>
      </div>
    </motion.div>
  );
}
