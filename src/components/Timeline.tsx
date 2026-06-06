import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, MessageCircle, Star } from "lucide-react";
import { useContent } from "../content/ContentContext";

gsap.registerPlugin(ScrollTrigger);

// Ícones fixos por posição (o texto vem do conteúdo editável).
const icons = [Sparkles, MessageCircle, Heart, Star];

export default function Timeline() {
  const { timeline } = useContent();
  const items = timeline.map((item, idx) => ({
    ...item,
    icon: icons[idx % icons.length],
  }));

  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Scroll-linked growing line effect
    const lineAnim = gsap.fromTo(
      progressLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: true,
        },
      }
    );

    // Fade and reveal each item cards on scroll
    const itemsCtx = gsap.context(() => {
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;

        const isEven = idx % 2 === 0;

        // Card entry animation
        gsap.fromTo(
          item.querySelector(".timeline-card"),
          {
            opacity: 0,
            x: isEven ? -40 : 40,
            y: 20,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Dot pulse animation
        gsap.fromTo(
          item.querySelector(".timeline-dot"),
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      lineAnim.scrollTrigger?.kill();
      itemsCtx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-16 md:py-24 bg-background overflow-hidden"
    >
      {/* Background Lights */}
      <div className="absolute top-1/3 right-0 w-[45vw] h-[45vw] radial-glow-vinho opacity-30 z-0 pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[40vw] h-[40vw] radial-glow-dourado opacity-10 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Title */}
        <div className="text-center mb-20 select-none">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-rosa font-medium mb-3 block">
            Memórias Compartilhadas
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-light tracking-tight text-brancoQuente">
            Nossa história começou <span className="italic text-dourado font-normal font-serif">assim…</span>
          </h2>
          <div className="w-12 h-[1px] bg-dourado/50 mx-auto mt-6" />
        </div>

        {/* Timeline Path */}
        <div ref={triggerRef} className="relative w-full">
          {/* Base background line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 rounded-full pointer-events-none" />
          
          {/* Animated active path line */}
          <div
            ref={progressLineRef}
            className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-rosa via-dourado to-rosa-light origin-top rounded-full shadow-[0_0_10px_rgba(199,121,139,0.3)] pointer-events-none"
          />

          {/* Timeline Items */}
          <div className="space-y-16 md:space-y-24">
            {items.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    itemsRef.current[idx] = el;
                  }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Anchor Point (Dot) */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-[7px] md:-translate-x-1/2 z-20">
                    <div className="timeline-dot w-[16px] h-[16px] rounded-full bg-background border-2 border-dourado flex items-center justify-center shadow-[0_0_8px_rgba(216,178,110,0.5)]">
                      <div className="w-[6px] h-[6px] rounded-full bg-rosa" />
                    </div>
                  </div>

                  {/* Spacer for desktop centering grid alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card Side */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <div className="timeline-card glass-card p-6 md:p-8 rounded-2xl border border-white/5 hover:border-rosa/20 shadow-[0_10px_35px_rgba(8,6,7,0.5)] transition-all duration-300 relative group">
                      
                      {/* Date label with glow effect */}
                      <span className="inline-block text-xs uppercase tracking-[0.2em] font-medium text-dourado text-glow-dourado mb-3 font-mono">
                        {item.date}
                      </span>
                      
                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-title text-brancoQuente font-light mb-3 flex items-center gap-3">
                        <Icon className="w-4 h-4 text-rosa" />
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-brancoQuente/70 font-light text-xs md:text-sm leading-relaxed">
                        {item.description}
                      </p>

                      {/* Small border glow on hover */}
                      <div className="absolute inset-0 border border-transparent group-hover:border-rosa/20 rounded-2xl pointer-events-none transition-colors duration-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
