import { useState, useEffect, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { Scene, SoftButton } from "./Scene";
import { Counter } from "./Counter";
import { Flower } from "./Flower";
import { Gallery } from "./Gallery";
import { GlassCard } from "./GlassCard";
import { loadPhotos, type Photo } from "./photos";

type Step =
  | "intro"
  | "q1"
  | "q1-correct"
  | "q2"
  | "story-1"
  | "story-2"
  | "story-3"
  | "transition"
  | "counter"
  | "declaration"
  | "flower-button"
  | "flower"
  | "choice"
  | "gallery";

function ImageSlot({ photo, caption }: { photo?: Photo; caption: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="my-10 w-full max-w-md mx-auto"
    >
      <div className="relative aspect-[4/5] bg-card border border-border/40 rounded-sm overflow-hidden shadow-[0_20px_80px_-20px_oklch(0_0_0/0.7)]">
        {photo?.src ? (
          <img
            src={photo.src}
            alt={caption}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/60">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="mt-3 text-[10px] tracking-[0.3em] uppercase">{caption}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Continue({ onClick, label = "continuar" }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1.2 }}
      className="mt-10 group flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="text-[10px] tracking-[0.4em] uppercase">{label}</span>
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </motion.svg>
    </motion.button>
  );
}

export function Experience() {
  const [step, setStep] = useState<Step>("intro");
  const [introTextDone, setIntroTextDone] = useState(false);
  const [showStartBtn, setShowStartBtn] = useState(false);
  const [q1, setQ1] = useState("");
  const [q1Error, setQ1Error] = useState(false);
  const [q1Done, setQ1Done] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    loadPhotos().then(setPhotos);
  }, []);

  const photoAt = (i: number): Photo | undefined => photos.find((p) => p.index === i);

  // Initial delay for intro typewriter
  const [introReady, setIntroReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setIntroReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // After intro text done, reveal the Start button after a beat
  useEffect(() => {
    if (introTextDone) {
      const t = setTimeout(() => setShowStartBtn(true), 700);
      return () => clearTimeout(t);
    }
  }, [introTextDone]);

  // After Q1 transition (dark + writing) -> Q2 after delay
  useEffect(() => {
    // (transitions handled by Typewriter onDone with built-in postDelay)
  }, [step]);

  function handleQ1Submit(e: FormEvent) {
    e.preventDefault();
    const normalized = q1.trim().replace(/\s/g, "").replace(/-/g, "/");
    const ok =
      normalized === "24/12" ||
      normalized === "24/12/2024" ||
      normalized === "24/12/2025" ||
      normalized === "2412";
    if (ok) {
      setQ1Error(false);
      setStep("q1-correct");
    } else {
      setQ1Error(true);
    }
  }

  function reset() {
    setStep("intro");
    setIntroTextDone(false);
    setShowStartBtn(false);
    setIntroReady(false);
    setQ1("");
    setQ1Error(false);
    setQ1Done(false);
    setTimeout(() => setIntroReady(true), 1200);
  }

  return (
    <main className="relative bg-background text-foreground">
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <Scene key="intro">
            <div className="text-center min-h-[40vh] flex flex-col items-center justify-center">
              {introReady && (
                <h1 className="font-display italic text-3xl sm:text-5xl text-foreground/90 text-glow">
                  <Typewriter
                    text="Eu fiz isso pra ti..."
                    speed={130}
                    postDelay={1400}
                    onDone={() => setIntroTextDone(true)}
                  />
                </h1>
              )}
              <div className="mt-16 h-12">
                {showStartBtn && (
                  <SoftButton variant="primary" onClick={() => setStep("q1")}>
                    começar
                  </SoftButton>
                )}
              </div>
            </div>
          </Scene>
        )}

        {step === "q1" && (
          <Scene key="q1">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              pergunta 01
            </p>
            <h2 className="font-display text-2xl sm:text-4xl text-center text-foreground/95">
              Qual foi o dia da nossa primeira mensagem?
            </h2>
            <form onSubmit={handleQ1Submit} className="mt-12 w-full max-w-sm flex flex-col items-center gap-6">
              <input
                value={q1}
                onChange={(e) => {
                  setQ1(e.target.value);
                  setQ1Error(false);
                }}
                placeholder="dd/mm"
                autoFocus
                className="w-full bg-transparent border-0 border-b border-border/60 focus:border-primary outline-none text-center font-display text-3xl sm:text-4xl py-3 tracking-widest placeholder:text-muted-foreground/30 transition-colors"
              />
              <AnimatePresence>
                {q1Error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs italic text-muted-foreground"
                  >
                    pensa de novo... tu lembras 🤍
                  </motion.p>
                )}
              </AnimatePresence>
              <SoftButton type="submit" variant="primary">
                responder
              </SoftButton>
            </form>
          </Scene>
        )}

        {step === "q1-correct" && (
          <motion.div
            key="q1c"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="min-h-[100dvh] w-full flex items-center justify-center bg-black px-6"
          >
            <h2 className="font-display italic text-2xl sm:text-4xl text-foreground/90 text-center text-glow">
              <Typewriter
                text="Nossa primeira mensagem..."
                speed={120}
                delay={1400}
                postDelay={2400}
                onDone={() => setStep("q2")}
              />
            </h2>
          </motion.div>
        )}

        {step === "q2" && (
          <Scene key="q2">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              pergunta 02
            </p>
            <h2 className="font-display text-2xl sm:text-4xl text-center text-foreground/95">
              Quem mandou a primeira mensagem mesmo?
            </h2>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button
                onClick={() => {/* wrong */}}
                className="flex-1 px-6 py-4 rounded-sm border border-border/50 hover:border-destructive/50 text-foreground/70 hover:text-foreground transition-all font-display text-2xl"
              >
                Lolo
              </button>
              <button
                onClick={() => setStep("story-1")}
                className="flex-1 px-6 py-4 rounded-sm border border-border/50 hover:border-primary hover:shadow-[0_0_30px_oklch(0.6_0.2_295/0.3)] text-foreground/70 hover:text-foreground transition-all font-display text-2xl"
              >
                Manu
              </button>
            </div>
          </Scene>
        )}

        {step === "story-1" && (
          <Scene key="s1">
            <GlassCard>
              <p className="font-display italic text-lg sm:text-2xl leading-relaxed text-center text-foreground/90">
                <Typewriter
                  text="Desde o dia em que a gente começou a se falar eu percebi que era algo diferente, não só uma simples amizade ou algo passageiro, tu era especial de uma forma que eu não sabia explicar."
                  onDone={() => setQ1Done(true)}
                />
              </p>
            </GlassCard>
            <ImageSlot photo={photoAt(1)} caption="momento 01" />
            {q1Done && <Continue onClick={() => { setQ1Done(false); setStep("story-2"); }} />}
          </Scene>
        )}

        {step === "story-2" && (
          <Scene key="s2">
            <GlassCard>
              <p className="font-display italic text-lg sm:text-2xl leading-relaxed text-center text-foreground/90">
                <Typewriter
                  text="Conforme a gente foi se conhecendo, a gente percebeu que tinhamos muito em comum, muito mesmo, e isso nos aproximou bastante até demais kakkaak, mas a gente percebeu que os dois buscam a mesma coisa no fim..."
                  onDone={() => setQ1Done(true)}
                />
              </p>
            </GlassCard>
            <ImageSlot photo={photoAt(2)} caption="momento 02" />
            {q1Done && <Continue onClick={() => { setQ1Done(false); setStep("story-3"); }} />}
          </Scene>
        )}

        {step === "story-3" && (
          <Scene key="s3">
            <GlassCard>
              <p className="font-display italic text-lg sm:text-2xl leading-relaxed text-center text-foreground/90">
                <Typewriter
                  text="eu sei que a minha declaração não foi das melhores e tals, mas aquele foi o unico jeito que eu tive coragem pra dizer que eu não via só amizade e que eu estava disposto a tudo por ti."
                  onDone={() => setQ1Done(true)}
                />
              </p>
            </GlassCard>
            <ImageSlot photo={photoAt(3)} caption="momento 03" />
            {q1Done && <Continue onClick={() => { setQ1Done(false); setStep("transition"); }} />}
          </Scene>
        )}

        {step === "transition" && (
          <motion.div
            key="trans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="min-h-[100dvh] w-full flex items-center justify-center bg-black px-6"
          >
            <h2 className="font-display italic text-xl sm:text-3xl text-foreground/90 text-center text-glow max-w-2xl leading-relaxed">
              <Typewriter
                text="Quem diria que estaríamos aqui hoje, não como amigos, mas sim como casal..."
                speed={95}
                delay={1400}
                postDelay={2600}
                onDone={() => setStep("counter")}
              />
            </h2>
          </motion.div>
        )}

        {step === "counter" && (
          <Scene key="counter">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3"
            >
              desde 22 · 02 · 2026
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.2 }}
              className="font-display italic text-3xl sm:text-5xl text-center text-foreground/95 mb-12 text-glow"
            >
              nosso tempo juntos
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.5 }}
            >
              <Counter />
            </motion.div>
            <Continue onClick={() => setStep("declaration")} label="prossiga" />
          </Scene>
        )}

        {step === "declaration" && (
          <Scene key="dec">
            <ImageSlot photo={photoAt(4)} caption="nós dois" />
            <GlassCard intense>
              <p className="font-display italic text-xl sm:text-2xl leading-[1.7] text-center text-foreground/95">
                <Typewriter
                  text="eu te amo como nunca amei ninguém, eu falo com sinceridade isto, eu sinto um ciúmes incontrolável eu sei... Mas eu só queria dizer que tu é quem eu mais amo e sempre vou amar, alguém especial que faz os meus dias mais especiais, eu te amo demais..."
                  intense
                  postDelay={2800}
                  onDone={() => setQ1Done(true)}
                />
              </p>
            </GlassCard>
            {q1Done && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="mt-12"
              >
                <button
                  onClick={() => { setQ1Done(false); setStep("flower"); }}
                  className="group relative flex items-center gap-3 px-8 py-4 rounded-full border border-primary/40 hover:border-primary text-foreground hover:shadow-[0_0_50px_oklch(0.6_0.2_295/0.5)] transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 22s-1-4-1-7c0-3 1-5 1-5s1 2 1 5c0 3-1 7-1 7z" />
                    <circle cx="12" cy="8" r="3" />
                    <circle cx="7" cy="10" r="2.5" />
                    <circle cx="17" cy="10" r="2.5" />
                    <circle cx="12" cy="4" r="2.5" />
                  </svg>
                  <span className="text-xs tracking-[0.3em] uppercase">para ti, uma flor</span>
                </button>
              </motion.div>
            )}
          </Scene>
        )}

        {step === "flower" && (
          <Scene key="flower">
            <Flower />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 5 }}
              className="font-display italic text-lg sm:text-xl text-foreground/80 text-center mt-6"
            >
              eternamente tua.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 6 }}
              className="mt-12"
            >
              <Continue onClick={() => setStep("choice")} label="continuar" />
            </motion.div>
          </Scene>
        )}

        {step === "choice" && (
          <Scene key="choice">
            <GlassCard>
              <h2 className="font-display italic text-2xl sm:text-4xl text-center text-foreground/95 text-glow">
                <Typewriter
                  text="Meu amor, tu deseja rever tudo ou ver nossa galeria?"
                  speed={85}
                  postDelay={1200}
                />
              </h2>
            </GlassCard>
            <div className="mt-16 flex flex-col sm:flex-row gap-4">
              <SoftButton onClick={reset}>rever tudo</SoftButton>
              <SoftButton variant="primary" onClick={() => setStep("gallery")}>
                ver galeria
              </SoftButton>
            </div>
          </Scene>
        )}

        {step === "gallery" && (
          <motion.div key="gal">
            <Gallery onBack={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}