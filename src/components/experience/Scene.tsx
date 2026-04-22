import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Scene({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(24px)", scale: 1.015 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(24px)", scale: 0.985 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 py-16 ${className}`}
    >
      <div className="aurora-bg" />
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        {children}
      </div>
    </motion.div>
  );
}

export function SoftButton({
  children,
  onClick,
  variant = "ghost",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "px-8 py-3 rounded-full text-sm tracking-[0.25em] uppercase transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-primary/90 text-primary-foreground hover:bg-primary hover:shadow-[0_0_40px_oklch(0.6_0.2_295/0.5)]"
      : "border border-border/60 text-foreground/80 hover:text-foreground hover:border-primary/60 hover:shadow-[0_0_30px_oklch(0.6_0.2_295/0.25)] backdrop-blur-sm";
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.button>
  );
}