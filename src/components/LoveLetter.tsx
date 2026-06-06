import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Heart } from "lucide-react";
import { useContent } from "../content/ContentContext";

gsap.registerPlugin(ScrollTrigger);

export default function LoveLetter() {
  const { loveLetter } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Envelope entrance
      gsap.fromTo(
        letterRef.current,
        {
          opacity: 0,
          y: 60,
          rotateX: 10,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0)",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Sequenced paragraph fade-in-up on scroll
      const paragraphs = letterRef.current?.querySelectorAll("p");
      if (paragraphs) {
        gsap.fromTo(
          paragraphs,
          { opacity: 0, y: 20, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0)",
            duration: 1.2,
            stagger: 0.25,
            ease: "power2.out",
            scrollTrigger: {
              trigger: letterRef.current,
              start: "top 65%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center py-16 md:py-24 bg-background overflow-hidden"
    >
      {/* Background soft lighting */}
      <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] radial-glow-vinho opacity-50 z-0 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] radial-glow-dourado opacity-10 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        
        {/* Envelope Indicator */}
        <div className="flex flex-col items-center justify-center mb-10 select-none">
          <div className="w-12 h-12 rounded-full bg-vinho border border-rosa/30 flex items-center justify-center shadow-lg mb-4">
            <Mail className="w-5 h-5 text-rosa" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-dourado font-medium">Uma carta para você</span>
        </div>

        {/* The Letter */}
        <div
          ref={letterRef}
          className="w-full bg-[#130d0f]/80 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 border border-white/5 shadow-[0_30px_70px_rgba(8,6,7,0.9)] relative overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          {/* Subtle paper line watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(#C7798B_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          {/* Letter layout styling */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-rosa/5 pointer-events-none" />

          <div className="relative z-10 pl-4 md:pl-6 text-[#FFF7F2] select-none font-light">
            {/* Date line */}
            <div className="flex justify-between items-center mb-12 text-xs md:text-sm text-dourado font-mono">
              <span>{loveLetter.placeLine}</span>
              <span>{loveLetter.dateLine}</span>
            </div>

            {/* Letter Content */}
            <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed text-brancoQuente/90">
              <p className="font-title italic text-rosa text-xl md:text-2xl font-normal">{loveLetter.greeting}</p>

              {loveLetter.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <div className="pt-8">
                <p className="font-title text-xl text-rosa font-normal italic mb-2">{loveLetter.closing1}</p>
                <p className="font-title text-2xl text-dourado font-normal tracking-wide flex items-center gap-2">
                  {loveLetter.closing2}
                  <Heart className="w-5 h-5 fill-rosa stroke-rosa animate-pulse" />
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
