import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  intense = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  intense?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)", y: 16 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-2xl mx-auto ${className}`}
    >
      {/* Outer glow */}
      <div
        className={`absolute -inset-4 rounded-[2rem] pointer-events-none ${
          intense
            ? "bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.2_300/0.35),transparent_70%)] blur-2xl"
            : "bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.18_300/0.18),transparent_70%)] blur-xl"
        }`}
      />
      <div
        className={`relative rounded-3xl border backdrop-blur-2xl px-6 sm:px-10 py-8 sm:py-12 ${
          intense
            ? "bg-[oklch(0.06_0.02_295/0.55)] border-primary/30 shadow-[0_30px_120px_-20px_oklch(0.55_0.2_300/0.55),inset_0_1px_0_oklch(1_0_0/0.06)]"
            : "bg-[oklch(0.06_0.015_290/0.45)] border-border/50 shadow-[0_20px_80px_-20px_oklch(0_0_0/0.7),inset_0_1px_0_oklch(1_0_0/0.05)]"
        }`}
      >
        {/* subtle top sheen */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {children}
      </div>
    </motion.div>
  );
}