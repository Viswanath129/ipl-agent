"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GlassChartCardProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function GlassChartCard({ title, eyebrow, action, children }: GlassChartCardProps) {
  return (
    <motion.section
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p> : null}
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}
