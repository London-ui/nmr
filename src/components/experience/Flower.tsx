import { motion } from "framer-motion";

/**
 * Animated flower drawn with SVG strokes.
 * Petals fade-in one by one, stem grows, then center blooms.
 */
export function Flower() {
  const petalPaths = [
    "M100 100 C 80 60, 70 30, 100 20 C 130 30, 120 60, 100 100 Z",
    "M100 100 C 140 80, 170 70, 180 100 C 170 130, 140 120, 100 100 Z",
    "M100 100 C 120 140, 130 170, 100 180 C 70 170, 80 140, 100 100 Z",
    "M100 100 C 60 120, 30 130, 20 100 C 30 70, 60 80, 100 100 Z",
    "M100 100 C 70 70, 50 50, 70 30 C 90 40, 100 70, 100 100 Z",
    "M100 100 C 130 70, 150 50, 170 70 C 160 90, 130 100, 100 100 Z",
    "M100 100 C 130 130, 150 150, 130 170 C 110 160, 100 130, 100 100 Z",
    "M100 100 C 70 130, 50 150, 30 130 C 40 110, 70 100, 100 100 Z",
  ];

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-[radial-gradient(circle,oklch(0.6_0.2_300/0.6),transparent_60%)]" />
      <svg
        viewBox="0 0 200 280"
        className="w-72 h-96 sm:w-96 sm:h-[28rem]"
        fill="none"
      >
        {/* Stem */}
        <motion.path
          d="M100 110 C 95 150, 105 200, 100 270"
          stroke="oklch(0.55 0.18 145)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
        {/* Leaf */}
        <motion.path
          d="M100 200 C 130 195, 150 180, 155 165 C 135 165, 110 175, 100 200 Z"
          stroke="oklch(0.6 0.18 145)"
          strokeWidth="1.5"
          fill="oklch(0.4 0.12 145 / 0.3)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        />
        {/* Petals */}
        {petalPaths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="oklch(0.78 0.16 305)"
            strokeWidth="1.2"
            fill="oklch(0.55 0.18 305 / 0.25)"
            initial={{ pathLength: 0, opacity: 0, scale: 0.6 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            style={{ transformOrigin: "100px 100px" }}
            transition={{ duration: 1.4, delay: 1.8 + i * 0.18, ease: "easeOut" }}
          />
        ))}
        {/* Center */}
        <motion.circle
          cx="100"
          cy="100"
          r="14"
          fill="oklch(0.85 0.14 85)"
          stroke="oklch(0.7 0.16 60)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.6, ease: "backOut" }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="6"
          fill="oklch(0.95 0.1 90)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 4 }}
        />
      </svg>
    </div>
  );
}