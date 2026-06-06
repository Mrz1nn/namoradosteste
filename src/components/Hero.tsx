import { motion } from "framer-motion";
import { ArrowDown, Heart } from "lucide-react";
import SplineScene from "./SplineScene";
import { useContent } from "../content/ContentContext";

export default function Hero() {
  const { hero } = useContent();

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("onde-tudo-comecou");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 radial-glow-vinho opacity-75 z-0" />
      <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] radial-glow-rosa opacity-30 z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[35vw] h-[35vw] radial-glow-dourado opacity-20 z-0 pointer-events-none" />

      {/* Hero Content layout */}
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center h-full relative z-20 pt-16 lg:pt-0">
        
        {/* Texts Column */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left mt-16 lg:mt-0 select-none order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] text-dourado font-medium mb-4">
              <Heart className="w-4 h-4 fill-dourado/20 stroke-dourado animate-pulse" />
              {hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-title font-light tracking-tight text-brancoQuente leading-[1.1] mb-6"
          >
            Desde <span className="text-rosa text-glow-rosa font-normal italic">{hero.titleHighlight}</span>,<br />
            {hero.titleSuffix}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-brancoQuente/75 text-sm md:text-lg max-w-xl font-light leading-relaxed mb-8"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={scrollToNextSection}
              className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-4 rounded-full bg-vinho border border-rosa/30 text-brancoQuente text-sm md:text-base font-medium tracking-wide overflow-hidden transition-all duration-300 hover:border-dourado/60 shadow-[0_4px_30px_rgba(59,10,24,0.4)] hover:shadow-[0_4px_30px_rgba(216,178,110,0.15)] active:scale-95"
            >
              {/* Button gradient highlight effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-vinho-light to-rosa opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              
              <span className="relative z-10">{hero.buttonText}</span>
              <ArrowDown className="relative z-10 w-4 h-4 text-dourado transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </motion.div>
        </div>

        {/* 3D Visual Element Column */}
        <div className="lg:col-span-5 h-[35vh] lg:h-[55vh] flex items-center justify-center relative order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0)" }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative"
          >
            {/* Decorative background glow for the heart */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] radial-glow-rosa opacity-20 filter blur-xl animate-pulse-glow" />
            </div>
            
            <SplineScene />
          </motion.div>
        </div>

      </div>

      {/* Down indicator at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1 select-none pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brancoQuente font-light">Role para explorar</span>
        <ArrowDown className="w-3 h-3 text-dourado animate-bounce" />
      </div>
    </section>
  );
}
