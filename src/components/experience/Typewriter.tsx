import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  /** ms per character. Default 75 for a contemplative human pace. */
  speed?: number;
  /** initial delay before typing starts (ms) */
  delay?: number;
  /** delay AFTER the text fully completes before onDone fires (ms). Default 2000. */
  postDelay?: number;
  /** when true, pause between sentences with a random 1.5–3s breath. */
  sentencePauses?: boolean;
  /** intensified emotional pacing — slower + longer breaths. */
  intense?: boolean;
  onDone?: () => void;
  className?: string;
  showCaret?: boolean;
}

const SENTENCE_END = /[.!?…]/;
const COMMA_LIKE = /[,;:]/;

export function Typewriter({
  text,
  speed,
  delay = 0,
  postDelay = 2000,
  sentencePauses = true,
  intense = false,
  onDone,
  className = "",
  showCaret = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    const baseSpeed = speed ?? (intense ? 95 : 75);
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    let i = 0;

    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) {
        schedule(() => {
          setDone(true);
          onDoneRef.current?.();
        }, postDelay);
        return;
      }
      i++;
      setDisplayed(text.slice(0, i));

      const justTyped = text[i - 1];
      const next = text[i];
      let nextDelay = baseSpeed;

      // tiny human jitter ±25%
      nextDelay *= 0.75 + Math.random() * 0.5;

      if (sentencePauses && next && SENTENCE_END.test(justTyped) && next === " ") {
        // breath between sentences: 1.5–3s (intense: 2–3.5s)
        const min = intense ? 2000 : 1500;
        const max = intense ? 3500 : 3000;
        nextDelay = min + Math.random() * (max - min);
      } else if (sentencePauses && COMMA_LIKE.test(justTyped) && next === " ") {
        nextDelay = (intense ? 600 : 380) + Math.random() * 220;
      } else if (justTyped === " ") {
        nextDelay = baseSpeed * 1.4;
      }

      schedule(tick, nextDelay);
    };

    schedule(tick, delay);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [text, speed, delay, postDelay, sentencePauses, intense]);

  return (
    <span className={className}>
      {displayed}
      {showCaret && !done && <span className="caret" />}
    </span>
  );
}