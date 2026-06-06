import { Heart, Settings } from "lucide-react";
import { Link } from "../lib/router";

export default function Landing() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background text-brancoQuente px-6 text-center overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute inset-0 radial-glow-vinho opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] radial-glow-rosa opacity-15 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-dourado font-medium mb-6">
          <Heart className="w-4 h-4 fill-dourado/20 stroke-dourado animate-pulse" />
          Site do Namorado
        </span>

        <h1 className="text-4xl md:text-6xl font-title font-light tracking-tight leading-[1.1] mb-6">
          Um site para eternizar a{" "}
          <span className="italic text-rosa text-glow-rosa">história de vocês</span>.
        </h1>

        <p className="text-brancoQuente/60 font-light text-sm md:text-base max-w-md mb-10">
          Cada casal ganha um endereço único, como{" "}
          <span className="font-mono text-dourado">/joaoxmaria</span>, com datas,
          memórias e uma carta personalizada.
        </p>

        <Link
          to="/admin"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-vinho border border-rosa/30 text-sm md:text-base font-medium hover:border-dourado/60 transition-all duration-300 shadow-[0_4px_30px_rgba(59,10,24,0.4)] active:scale-95"
        >
          <Settings className="w-4 h-4 text-dourado" />
          Área do criador
        </Link>
      </div>
    </main>
  );
}
