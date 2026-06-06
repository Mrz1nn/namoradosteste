import { HeartCrack } from "lucide-react";
import { Link } from "../lib/router";

export default function NotFound({ slug }: { slug?: string }) {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background text-brancoQuente px-6 text-center overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute inset-0 radial-glow-vinho opacity-60 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-vinho border border-rosa/30 flex items-center justify-center mb-6">
          <HeartCrack className="w-6 h-6 text-rosa" />
        </div>
        <h1 className="text-3xl md:text-4xl font-title font-light mb-3">
          Site não encontrado
        </h1>
        <p className="text-sm text-brancoQuente/50 max-w-sm mb-8">
          {slug ? (
            <>
              Não existe um site em{" "}
              <span className="font-mono text-dourado">/{slug}</span> ainda.
            </>
          ) : (
            "Esta página não existe."
          )}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-vinho border border-rosa/40 text-sm hover:border-dourado/60 transition"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
