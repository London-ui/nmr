import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET = new Date("2026-02-22T00:00:00-03:00").getTime();

function diff(now: number) {
  let delta = Math.max(0, now - TARGET);
  const sign = now >= TARGET ? 1 : -1;
  if (sign < 0) delta = TARGET - now;

  const seconds = Math.floor(delta / 1000) % 60;
  const minutes = Math.floor(delta / (1000 * 60)) % 60;
  const hours = Math.floor(delta / (1000 * 60 * 60)) % 24;
  const totalDays = Math.floor(delta / (1000 * 60 * 60 * 24));

  // approximate months / remaining days
  const months = Math.floor(totalDays / 30.4375);
  const days = totalDays - Math.floor(months * 30.4375);

  return { months, days, hours, minutes, seconds };
}

function Cell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center min-w-[64px] sm:min-w-[88px]">
      <div className="relative h-[1.2em] overflow-hidden font-display text-4xl sm:text-6xl text-foreground text-glow tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function Counter() {
  const [t, setT] = useState(() => diff(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setT(diff(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      <Cell value={t.months} label="meses" />
      <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40">·</span>
      <Cell value={t.days} label="dias" />
      <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40">·</span>
      <Cell value={t.hours} label="horas" />
      <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40">·</span>
      <Cell value={t.minutes} label="min" />
      <span className="font-display text-3xl sm:text-5xl text-muted-foreground/40">·</span>
      <Cell value={t.seconds} label="seg" />
    </div>
  );
}