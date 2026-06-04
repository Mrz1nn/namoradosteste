import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full py-12 bg-background border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 radial-glow-vinho opacity-20 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10 select-none">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Logo / Heart */}
          <div className="flex items-center gap-1.5 text-xs text-rosa/60 uppercase tracking-[0.2em] font-light">
            <span>Feito com amor</span>
            <Heart className="w-3.5 h-3.5 fill-rosa/10 stroke-rosa animate-pulse" />
            <span>para você</span>
          </div>

          <div className="w-6 h-[1px] bg-white/10" />

          {/* Dates */}
          <span className="text-[10px] uppercase tracking-[0.25em] text-brancoQuente/30 font-mono">
            Desde 08/10/2022.
          </span>
        </div>
      </div>
    </footer>
  );
}
