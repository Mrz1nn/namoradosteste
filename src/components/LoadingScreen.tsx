import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onFinished: () => void;
}

const phrases = [
  "08/10/2022",
  "O dia em que tudo começou",
  "Da escola para a vida",
  "Nossa história",
];

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Rotate phrases based on progress
  useEffect(() => {
    if (progress < 25) {
      setPhraseIndex(0);
    } else if (progress < 50) {
      setPhraseIndex(1);
    } else if (progress < 75) {
      setPhraseIndex(2);
    } else {
      setPhraseIndex(3);
    }
  }, [progress]);

  // Handle counter progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        // Random increments for organic feel
        const increment = Math.floor(Math.random() * 4) + 1;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080607] text-[#FFF7F2] select-none"
    >
      {/* Noise filter */}
      <div className="noise-overlay" />

      {/* Floating particles background strictly inside the loading screen */}
      <div className="absolute inset-0 radial-glow-vinho opacity-60" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        {/* Animated Phrase */}
        <div className="h-16 flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            {!isComplete && (
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl font-title tracking-wide text-rosa"
              >
                {phrases[phraseIndex]}
              </motion.p>
            )}
            {isComplete && (
              <motion.p
                initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-2xl font-title tracking-wide text-dourado text-glow-dourado font-light italic"
              >
                Para você, meu amor.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Display: Counter or Enter Button */}
        <div className="h-32 flex items-center justify-center mb-8 relative w-full">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="counter"
                exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="relative inline-block mb-4">
                  <span className="text-6xl md:text-8xl font-title font-light text-dourado text-glow-dourado tabular-nums">
                    {progress}
                  </span>
                  <span className="text-xl md:text-2xl font-title text-rosa ml-1">%</span>
                </div>
                {/* Cinematic Bar */}
                <div className="w-64 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${progress}%` }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-vinho-light via-rosa to-dourado shadow-[0_0_8px_rgba(216,178,110,0.5)] transition-all duration-300"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={onFinished}
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-vinho border border-rosa/30 text-brancoQuente text-sm md:text-base font-medium tracking-wide overflow-hidden shadow-[0_10px_40px_rgba(59,10,24,0.6)] active:scale-95 transition-all hover:border-dourado/60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-vinho-light to-rosa opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <span className="relative z-10 flex items-center gap-2">
                  Abrir com Amor
                  <Heart className="w-4 h-4 fill-rosa/20 group-hover:fill-rosa text-rosa transition-colors duration-300 animate-pulse" />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Small details */}
        {!isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.2 }}
            className="block text-[10px] uppercase tracking-[0.25em] text-brancoQuente/50"
          >
            Carregando Memórias
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
