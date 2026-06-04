import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Image as ImageIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MemoryItem {
  id: number;
  src: string;
  legend: string;
  aspect: string;
  speed: number;
}

const memories: MemoryItem[] = [
  {
    id: 1,
    src: "/images/memoria-1.jpg",
    legend: "Um dos nossos momentos",
    aspect: "aspect-[3/4]",
    speed: -0.15,
  },
  {
    id: 2,
    src: "/images/memoria-2.jpg",
    legend: "Um pedacinho da nossa história",
    aspect: "aspect-[4/3]",
    speed: 0.1,
  },
  {
    id: 3,
    src: "/images/memoria-3.jpg",
    legend: "Nós dois",
    aspect: "aspect-square",
    speed: -0.05,
  },
  {
    id: 4,
    src: "/images/memoria-4.jpg",
    legend: "Memória favorita",
    aspect: "aspect-[3/4]",
    speed: 0.15,
  },
  {
    id: 5,
    src: "/images/memoria-5.jpg",
    legend: "Sempre você",
    aspect: "aspect-[4/3]",
    speed: -0.1,
  },
  {
    id: 6,
    src: "/images/memoria-6.jpg",
    legend: "Mais um capítulo",
    aspect: "aspect-square",
    speed: 0.05,
  },
];

export default function MemoriesGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, idx) => {
        if (!item) return;

        const memory = memories[idx];
        const img = item.querySelector(".parallax-img");

        if (img) {
          // GSAP Parallax Animation
          gsap.fromTo(
            img,
            { yPercent: -15 * memory.speed },
            {
              yPercent: 15 * memory.speed,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full py-16 md:py-24 bg-background overflow-hidden"
    >
      {/* Background Soft Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] radial-glow-vinho opacity-30 z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] radial-glow-rosa opacity-15 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 select-none">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-rosa font-medium mb-3 block">
            Álbum de Fotos
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-light tracking-tight text-brancoQuente">
            Nossa Galeria de <span className="italic text-dourado font-normal font-serif">Memórias</span>
          </h2>
          <div className="w-12 h-[1px] bg-dourado/50 mx-auto mt-6" />
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.map((memory, idx) => {
            const hasError = imageErrors[memory.id];

            return (
              <div
                key={memory.id}
                ref={(el) => {
                  itemsRef.current[idx] = el;
                }}
                className="flex flex-col group select-none"
              >
                {/* Photo container */}
                <div
                  className={`w-full ${memory.aspect} rounded-2xl overflow-hidden glass-card border border-white/10 relative shadow-[0_15px_40px_rgba(8,6,7,0.6)]`}
                >
                  {/* Photo or placeholder */}
                  {!hasError ? (
                    <img
                      src={memory.src}
                      alt={memory.legend}
                      onError={() => handleImageError(memory.id)}
                      className="parallax-img w-full h-[120%] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-vinho-dark via-vinho to-background flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-rosa/60">
                        <ImageIcon className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-xs text-brancoQuente/40 tracking-wider">
                        Espaço para foto
                      </span>
                      <code className="text-[10px] text-dourado/60 bg-black/40 px-2 py-1 rounded mt-2 border border-white/5 font-mono">
                        memoria-{memory.id}.jpg
                      </code>
                    </div>
                  )}

                  {/* Dark premium vignetting gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 to-transparent opacity-60 pointer-events-none" />

                  {/* Camera Icon Overlay on Hover */}
                  <div className="absolute inset-0 bg-vinho/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-background/80 border border-dourado/40 flex items-center justify-center text-dourado">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Subtitle Legend under each photo */}
                <div className="mt-4 px-2 flex flex-col">
                  <span className="text-xs md:text-sm font-title italic text-rosa tracking-wide">
                    {memory.legend}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brancoQuente/30 mt-1 font-mono">
                    Memória 0{memory.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
