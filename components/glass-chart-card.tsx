"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type GlassChartCardProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function GlassChartCard({ title, eyebrow, subtitle, action, children }: GlassChartCardProps) {
  const label = eyebrow || subtitle;
  return (
    <motion.section
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-panel p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          {label ? <p className="text-xs font-medium text-cyan-400">{label}</p> : null}
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
