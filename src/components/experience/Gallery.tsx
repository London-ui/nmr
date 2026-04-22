import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { loadPhotos, TOTAL_PHOTOS, type Photo } from "./photos";

function PhotoFrame({ photo }: { photo: Photo }) {
  if (photo.src) {
    return (
      <img
        src={photo.src}
        alt={`memória ${photo.index}`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/70">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="mt-3 text-[10px] tracking-[0.3em] uppercase">foto {photo.index}</span>
      </div>
    </>
  );
}

export function Gallery({ onBack }: { onBack: () => void }) {
  const [photos, setPhotos] = useState<Photo[]>(() =>
    Array.from({ length: TOTAL_PHOTOS }, (_, k) => ({ index: k + 1, src: null })),
  );
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    let cancel = false;
    loadPhotos().then((list) => {
      if (!cancel) setPhotos(list);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const activePhoto = active != null ? photos.find((p) => p.index === active) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="min-h-[100dvh] w-full px-4 sm:px-8 py-16 relative"
    >
      <div className="aurora-bg" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">nossa galeria</p>
          <h2 className="font-display text-5xl sm:text-7xl text-foreground text-glow mt-3">
            Memórias
          </h2>
          <p className="text-muted-foreground mt-4 text-sm italic font-display">
            cada foto, um pedaço do nosso tempo
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {photos.map((p, i) => (
            <motion.button
              key={p.index}
              onClick={() => setActive(p.index)}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-card border border-border/40 cursor-zoom-in"
            >
              <PhotoFrame photo={p} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 ring-0 ring-primary/0 group-hover:ring-1 group-hover:ring-primary/40 transition-all" />
            </motion.button>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={onBack}
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-border/40 pb-1"
          >
            ← voltar ao início
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl aspect-[3/4] bg-card border border-primary/30 rounded-sm overflow-hidden shadow-[0_0_120px_oklch(0.55_0.18_300/0.45)]"
            >
              <PhotoFrame photo={activePhoto} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}