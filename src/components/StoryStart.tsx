import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import { useContent } from "../content/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export default function StoryStart() {
  const { storyStart } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text block
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50, filter: "blur(10px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate premium school-notebook card
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0)",
          duration: 1.2,
          ease: "power3.out",
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
      id="onde-tudo-comecou"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center py-16 md:py-24 bg-background overflow-hidden"
    >
      {/* Background Glowing Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-vinho-light/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-rosa/5 rounded-full pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] radial-glow-vinho opacity-40 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10">
        
        {/* Left Side: Story Text */}
        <div ref={textRef} className="lg:col-span-6 flex flex-col justify-center select-none">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] text-rosa font-medium mb-6">
            <GraduationCap className="w-4 h-4 text-rosa" />
            {storyStart.eyebrow}
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-title font-light tracking-tight text-brancoQuente leading-tight mb-8">
            {storyStart.titlePrefix} <span className="italic text-dourado font-normal">{storyStart.titleHighlight}</span>.
          </h2>

          <div className="space-y-6 text-brancoQuente/80 font-light text-base md:text-lg leading-relaxed max-w-xl">
            <p>{storyStart.paragraph1}</p>
            <p className="text-brancoQuente/60 text-sm md:text-base">
              {storyStart.paragraph2}
            </p>
          </div>
        </div>

        {/* Right Side: Notebook Style Premium Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <div
            ref={cardRef}
            className="w-full max-w-[460px] glass-card rounded-2xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(8,6,7,0.8)] border border-white/10 group"
          >
            {/* Subtle Dourado Highlight corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-dourado/10 to-transparent rounded-tr-2xl pointer-events-none" />

            {/* School elements: Thin lines drawing graph coordinates */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="10%" x2="90%" y2="10%" stroke="#FFF7F2" strokeWidth="1" strokeDasharray="4" />
              <line x1="15%" y1="0" x2="15%" y2="100%" stroke="#C7798B" strokeWidth="1.5" />
              <circle cx="15%" cy="10%" r="4" fill="#C7798B" />
              <line x1="50%" y1="40%" x2="80%" y2="40%" stroke="#FFF7F2" strokeWidth="1.5" />
              <line x1="80%" y1="40%" x2="75%" y2="35%" stroke="#FFF7F2" strokeWidth="1.5" />
              <line x1="80%" y1="40%" x2="75%" y2="45%" stroke="#FFF7F2" strokeWidth="1.5" />
            </svg>

            {/* Notebook Margin Line simulation */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-rosa/20" />

            <div className="relative z-10 pl-6 select-none">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <BookOpen className="w-5 h-5 text-brancoQuente/40" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-dourado/75">Registro de Memória</span>
              </div>

              {/* Big date display with beautiful serif font */}
              <div className="mb-8">
                <span className="block text-[11px] uppercase tracking-[0.2em] text-rosa mb-2 font-medium">Data do Encontro</span>
                <span className="text-4xl md:text-5xl font-title text-dourado text-glow-dourado font-light tracking-wide">
                  {storyStart.cardBigDate}
                </span>
              </div>

              {/* Card Content with Notebook line pattern */}
              <div className="notebook-lines text-brancoQuente/70 font-light text-sm md:text-base space-y-7 leading-[28px] mb-4">
                <p className="border-b border-white/5 pb-1">
                  Matéria: {storyStart.cardSubject}
                </p>
                <p className="border-b border-white/5 pb-1">
                  Local: {storyStart.cardPlace}
                </p>
                <p className="border-b border-white/5 pb-1">
                  Anotação: {storyStart.cardNote}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-brancoQuente/40 mt-8 pt-4 border-t border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{storyStart.cardFooter}</span>
              </div>
            </div>
            
            {/* Glowing border hover effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-rosa/20 rounded-2xl pointer-events-none transition-colors duration-500" />
          </div>
        </div>

      </div>
    </section>
  );
}
