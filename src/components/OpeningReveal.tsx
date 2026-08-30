import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Activity } from "lucide-react";

interface OpeningRevealProps {
  onStartJourney: () => void;
  onJumpToConstellation?: () => void;
  onStartJudgeDemo?: () => void;
}

export const OpeningReveal: React.FC<OpeningRevealProps> = ({
  onStartJourney,
  onJumpToConstellation,
  onStartJudgeDemo,
}) => {
  const [step, setStep] = useState<number>(0);
  const [isHoveringPoint, setIsHoveringPoint] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    // Sequence the opening lines
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2600);
    const t3 = setTimeout(() => setStep(3), 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleClickPoint = () => {
    if (hasClicked) return;
    setHasClicked(true);
    // Trigger smooth transition
    setTimeout(() => {
      onStartJourney();
    }, 900);
  };

  return (
    <div id="opening-reveal-screen" className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 select-none">
      {/* Background ambient starfield & gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111827]/40 via-[#07090e] to-[#040507]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-950/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Top quick-access */}
      <div className="absolute top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-20 flex items-center justify-between sm:justify-end gap-2">
        {onStartJudgeDemo && (
          <button
            id="quick-tour-btn"
            onClick={onStartJudgeDemo}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono tracking-wide bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Living Tour</span>
          </button>
        )}
        {onJumpToConstellation && (
          <button
            id="quick-constellation-skip-btn"
            onClick={onJumpToConstellation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] sm:text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900/70 transition-colors"
          >
            <span>Explore Universe</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main Narrative Block */}
      <div className="relative z-10 max-w-3xl text-center flex flex-col items-center">
        {/* Line 1 */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.h1
              id="reveal-text-line-1"
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-3xl sm:text-5xl md:text-6xl font-light text-slate-300 tracking-tight font-editorial leading-tight"
            >
              The internet feels weightless.
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Line 2 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              id="reveal-text-line-2"
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight font-editorial"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-300">
                It isn’t.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Line 3: The interactive seed point */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              id="interactive-seed-container"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.2 }}
              className="mt-16 sm:mt-20 flex flex-col items-center"
            >
              <p className="text-xs sm:text-sm font-mono tracking-widest text-cyan-300/80 uppercase mb-6 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                One Website Visit
              </p>

              {/* The glowing point button */}
              <div className="relative group cursor-pointer" onClick={handleClickPoint}>
                {/* Outward pulsing rings */}
                <div className="absolute -inset-6 rounded-full bg-cyan-500/20 blur-xl animate-pulse-subtle pointer-events-none" />
                <motion.div
                  animate={{
                    scale: hasClicked ? [1, 3, 20] : isHoveringPoint ? [1, 1.3, 1] : [1, 1.15, 1],
                    opacity: hasClicked ? [1, 0.8, 0] : [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: hasClicked ? 0.9 : 2.5,
                    repeat: hasClicked ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -inset-4 rounded-full border border-cyan-400/40 pointer-events-none"
                />

                {/* Core interactive photon */}
                <button
                  id="start-photon-point"
                  onMouseEnter={() => setIsHoveringPoint(true)}
                  onMouseLeave={() => setIsHoveringPoint(false)}
                  aria-label="Click to reveal the hidden physical journey of one click"
                  className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    hasClicked
                      ? "bg-cyan-200 scale-150 shadow-[0_0_60px_#38bdf8]"
                      : isHoveringPoint
                      ? "bg-cyan-400/20 border-2 border-cyan-300 scale-110 shadow-[0_0_35px_rgba(56,189,248,0.6)]"
                      : "bg-slate-900/90 border border-cyan-500/60 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:border-cyan-300"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] group-hover:scale-125 transition-transform" />
                </button>
              </div>

              {/* Prompt instruction */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: hasClicked ? 0 : 0.8 }}
                transition={{ duration: 0.5 }}
                className="mt-6 text-xs text-slate-400 font-mono tracking-wider flex items-center gap-1.5"
              >
                <span>Click the point to trace the physical current</span>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom context caption */}
      <div className="absolute bottom-6 text-center text-[11px] font-mono text-slate-500 max-w-lg leading-relaxed">
        CARBON CONSTELLATION &bull; Revealing the invisible physical infrastructure behind digital activity.
      </div>
    </div>
  );
};
