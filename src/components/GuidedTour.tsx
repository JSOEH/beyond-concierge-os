import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useTour, tourSteps } from "@/store/useTour";

export function TourLauncher() {
  const start = useTour((s) => s.start);
  const open = useTour((s) => s.open);
  if (open) return null;
  return (
    <button
      onClick={start}
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-3 text-sm font-semibold text-white shadow-card-hover transition hover:bg-charcoal-800 animate-pulse-gold"
    >
      <Play className="h-4 w-4 text-gold-300" />
      <span className="hidden sm:inline">Take the tour</span>
    </button>
  );
}

export function GuidedTour() {
  const { open, step, next, prev, stop } = useTour();
  const navigate = useNavigate();
  const current = tourSteps[step];

  useEffect(() => {
    if (open && current) navigate(current.route);
  }, [open, step]); // eslint-disable-line

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, stop]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal-950/30 backdrop-blur-[2px]"
            onClick={stop}
          />
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-x-4 bottom-5 z-50 mx-auto max-w-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-deep text-white shadow-card-hover">
              <div className="h-1 w-full bg-white/10">
                <div className="h-full bg-gold-sheen transition-all duration-500" style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }} />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-gold-200">
                    <Sparkles className="h-3 w-3" /> {current.tag}
                  </span>
                  <button onClick={stop} className="grid h-7 w-7 place-items-center rounded-lg text-charcoal-300 hover:bg-white/10 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{current.title}</h3>
                <p className="mt-1.5 text-sm leading-snug text-charcoal-100">{current.body}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {tourSteps.map((_, i) => (
                      <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-5 bg-gold-400" : "w-1.5 bg-white/20"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {step > 0 && (
                      <button onClick={prev} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-charcoal-200 hover:text-white">
                        <ArrowLeft className="h-3.5 w-3.5" /> Back
                      </button>
                    )}
                    <button onClick={next} className="inline-flex items-center gap-1.5 rounded-lg bg-gold-sheen px-3.5 py-1.5 text-xs font-bold text-charcoal-900 hover:brightness-105">
                      {step === tourSteps.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-center text-[10px] text-charcoal-400">Use ← → arrow keys · Esc to exit · Step {step + 1} of {tourSteps.length}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
