import { motion } from "framer-motion";
import { Sparkles, Smile, Compass, Heart, Zap, Anchor } from "lucide-react";
import { useContent } from "../content/ContentContext";

// Ícones e tamanhos fixos por posição (os textos vêm do conteúdo editável).
const icons = [Sparkles, Smile, Compass, Heart, Zap, Anchor];
const classNames = [
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function LoveCards() {
  const { loveCards } = useContent();
  const cards = loveCards.map((card, idx) => ({
    ...card,
    icon: icons[idx % icons.length],
    className: classNames[idx % classNames.length],
  }));

  return (
    <section className="relative min-h-screen w-full py-16 md:py-24 bg-background overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] radial-glow-vinho opacity-40 z-0 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[30vw] h-[30vw] radial-glow-rosa opacity-10 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 select-none">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-rosa font-medium mb-3 block">
            Qualidades Singulares
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-light tracking-tight text-brancoQuente">
            Coisas que eu <span className="italic text-glow-rosa text-rosa font-normal">amo</span> em você
          </h2>
          <div className="w-12 h-[1px] bg-rosa/50 mx-auto mt-6" />
        </div>

        {/* Bento Grid / Mobile Carousel */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-4 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:auto-rows-[minmax(180px,auto)] md:overflow-visible md:pb-0 scrollbar-hide -mx-4 md:mx-0"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-[0_15px_35px_rgba(8,6,7,0.4)] border border-white/5 glass-card-hover group relative min-w-[85vw] snap-center sm:min-w-[60vw] md:min-w-0 ${card.className}`}
              >
                {/* Background light glow on card hover */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-rosa/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-2xl pointer-events-none" />

                {/* Card Icon & Header */}
                <div className="flex items-start justify-between mb-8 select-none">
                  <div className="p-3 rounded-xl bg-vinho/50 border border-rosa/15 text-rosa group-hover:text-dourado group-hover:border-dourado/30 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-brancoQuente/30 font-mono">
                    Item 0{idx + 1}
                  </span>
                </div>

                {/* Card Texts */}
                <div className="select-none">
                  <h3 className="text-lg md:text-xl font-title text-brancoQuente font-light mb-3">
                    {card.title}
                  </h3>
                  <p className="text-brancoQuente/70 font-light text-xs md:text-sm leading-relaxed max-w-lg">
                    {card.description}
                  </p>
                </div>

                {/* Interactive Glowing Border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-dourado/20 rounded-2xl pointer-events-none transition-colors duration-500" />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
