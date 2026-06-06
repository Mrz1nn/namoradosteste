import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useContent } from "../content/ContentContext";

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  swing: number;
  swingSpeed: number;
}

export default function FinalSection() {
  const { finalSection } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Generate vector falling hearts for the modal
  useEffect(() => {
    if (!isModalOpen) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      setHearts([]);
      return;
    }

    const count = 35;
    const initialHearts: FallingHeart[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -Math.random() * window.innerHeight - 20,
      size: Math.random() * 16 + 8,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      swing: Math.random() * 15 + 5,
      swingSpeed: Math.random() * 0.02 + 0.01,
    }));

    setHearts(initialHearts);

    const updateHearts = () => {
      setHearts((prevHearts) =>
        prevHearts.map((heart) => {
          let nextY = heart.y + heart.speed;
          let nextX = heart.x + Math.sin(nextY * heart.swingSpeed) * 0.5;

          // Recycle heart if it falls off screen
          if (nextY > window.innerHeight + 20) {
            nextY = -40;
            nextX = Math.random() * window.innerWidth;
          }

          return {
            ...heart,
            y: nextY,
            x: nextX,
            rotation: heart.rotation + heart.rotationSpeed,
          };
        })
      );

      animationFrameId.current = requestAnimationFrame(updateHearts);
    };

    animationFrameId.current = requestAnimationFrame(updateHearts);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isModalOpen]);

  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center bg-background overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute inset-0 radial-glow-vinho opacity-70 z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] radial-glow-rosa opacity-15 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-3xl text-center relative z-10 select-none">
        
        {/* Quote Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className="w-10 h-10 rounded-full bg-vinho border border-dourado/20 flex items-center justify-center mb-6">
            <Heart className="w-4 h-4 text-dourado fill-dourado/10" />
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-title font-light tracking-tight text-brancoQuente leading-tight">
            {finalSection.title}
          </h2>
        </motion.div>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-rosa text-lg md:text-xl font-title italic tracking-wide max-w-xl mx-auto mb-12"
        >
          {finalSection.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-vinho border border-rosa/30 text-brancoQuente text-base md:text-lg font-medium tracking-wide overflow-hidden transition-all duration-300 hover:border-dourado/60 shadow-[0_10px_35px_rgba(59,10,24,0.5)] hover:shadow-[0_10px_35px_rgba(216,178,110,0.2)] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-vinho-light to-rosa opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
            <span className="relative z-10 flex items-center gap-2">
              {finalSection.buttonText}
              <Heart className="w-5 h-5 fill-rosa/20 group-hover:fill-rosa transition-colors duration-300" />
            </span>
          </button>
        </motion.div>

      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            {/* Falling Vector Hearts Container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              {hearts.map((heart) => (
                <svg
                  key={heart.id}
                  viewBox="0 0 24 24"
                  fill="#C7798B"
                  className="absolute pointer-events-none"
                  style={{
                    left: heart.x,
                    top: heart.y,
                    width: heart.size,
                    height: heart.size,
                    opacity: heart.opacity,
                    transform: `rotate(${heart.rotation}deg)`,
                  }}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ))}
            </div>

            {/* Modal Card Content */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-lg glass-card rounded-3xl p-8 md:p-12 text-center border border-white/10 shadow-[0_30px_70px_rgba(8,6,7,0.9)] z-10 select-none overflow-hidden"
            >
              {/* Gold Top Light Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-dourado to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Fechar"
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-brancoQuente/60 hover:text-brancoQuente hover:bg-white/10 transition-all duration-200 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Large Heart Icon */}
              <div className="inline-flex p-4 rounded-full bg-vinho/60 border border-rosa/30 text-rosa mb-6 shadow-md animate-pulse">
                <Heart className="w-8 h-8 fill-rosa/20" />
              </div>

              {/* Title & Message */}
              <h3 className="text-xl md:text-2xl font-title text-dourado text-glow-dourado mb-6 font-normal">
                {finalSection.modalTitle}
              </h3>

              <p className="text-brancoQuente/90 text-base md:text-lg font-light leading-relaxed mb-8">
                “{finalSection.modalQuote}”
              </p>

              <div className="w-12 h-[1px] bg-white/10 mx-auto mb-8" />

              {/* Close subtitle */}
              <p className="text-rosa font-title italic text-lg font-normal tracking-wide">
                {finalSection.modalFooter}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
