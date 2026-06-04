import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, HeartHandshake, Sparkles, TrendingUp, Sun } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface PromiseItem {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const promises: PromiseItem[] = [
  {
    id: 1,
    title: "Continuar escolhendo você",
    description: "Em todos os amanheceres, em todas as escolhas cotidianas, continuar decidindo que meu coração pertence a você.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Cuidar da nossa história",
    description: "Proteger o que construímos, guardar nossas piadas internas e fazer com que nossos momentos juntos continuem sendo preciosos.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Estar presente",
    description: "Tanto nos dias de sol e sorrisos bobos quanto nas tempestades difíceis, oferecendo meu colo e minha escuta.",
    icon: HeartHandshake,
  },
  {
    id: 4,
    title: "Crescer ao seu lado",
    description: "Evoluir como pessoa, apoiar seus sonhos individuais e aprender com cada lição que a vida nos trouxer como casal.",
    icon: TrendingUp,
  },
  {
    id: 5,
    title: "Lembrar você do seu valor",
    description: "Dizer todos os dias o quanto você é inteligente, forte, linda e, acima de tudo, o quanto você é amada por mim.",
    icon: Sun,
  },
];

export default function Promises() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade in for promise cards
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0)",
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full py-16 md:py-24 bg-background overflow-hidden"
    >
      {/* Decorative details */}
      <div className="absolute top-1/4 right-1/4 w-[30vw] h-[30vw] radial-glow-vinho opacity-40 z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[35vw] h-[35vw] radial-glow-dourado opacity-10 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 select-none">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-rosa font-medium mb-3 block">
            Compromissos do Coração
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-light tracking-tight text-brancoQuente">
            Minhas <span className="italic text-rosa text-glow-rosa font-normal">promessas</span> para nós dois
          </h2>
          <div className="w-12 h-[1px] bg-rosa/50 mx-auto mt-6" />
        </div>

        {/* Promises Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promises.map((promise, idx) => {
            const Icon = promise.icon;
            // The 5th item will span 2 columns on large screen to center nicely
            const isLast = idx === promises.length - 1;

            return (
              <div
                key={promise.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className={`glass-card rounded-2xl p-8 border border-white/5 shadow-[0_15px_30px_rgba(8,6,7,0.4)] transition-all duration-300 hover:border-rosa/20 group relative flex flex-col justify-between ${
                  isLast ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Number index */}
                <span className="absolute top-6 right-8 text-xs font-mono text-dourado/40 group-hover:text-dourado transition-colors">
                  0{promise.id}
                </span>

                <div>
                  {/* Icon */}
                  <div className="text-rosa mb-6 p-2 w-fit rounded-lg bg-vinho/40 group-hover:text-dourado transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-title text-brancoQuente font-light mb-4">
                    {promise.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-brancoQuente/70 font-light text-xs md:text-sm leading-relaxed">
                  {promise.description}
                </p>

                {/* Corner border hover glow */}
                <div className="absolute inset-0 border border-transparent group-hover:border-rosa/25 rounded-2xl pointer-events-none transition-colors duration-500" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
