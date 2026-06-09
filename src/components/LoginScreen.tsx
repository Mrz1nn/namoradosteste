import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_APP_PASSWORD;
    
    if (!correctPassword || password === correctPassword) {
      setError(false);
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080607] text-[#FFF7F2] select-none">
      <div className="noise-overlay" />
      <div className="absolute inset-0 radial-glow-vinho opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-vinho/30 border border-rosa/30 flex items-center justify-center shadow-[0_0_30px_rgba(216,178,110,0.15)] mb-4">
            {error ? (
              <Lock className="w-8 h-8 text-rosa animate-pulse" />
            ) : (
              <Unlock className="w-8 h-8 text-dourado text-glow-dourado" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-title tracking-wide text-dourado text-glow-dourado">
              Acesso Restrito
            </h1>
            <p className="text-sm text-brancoQuente/70 font-light">
              Por favor, insira a senha para visualizar esta memória.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha..."
                className={`w-full bg-black/40 border ${
                  error ? "border-rosa/60 text-rosa" : "border-white/10 focus:border-dourado/50"
                } rounded-xl px-4 py-3 outline-none transition-colors text-center font-light placeholder:text-white/20`}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-6 left-0 right-0 text-xs text-rosa"
                >
                  Senha incorreta
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full group relative flex items-center justify-center gap-2 py-3 rounded-xl bg-vinho border border-rosa/30 text-brancoQuente text-sm font-medium tracking-wide overflow-hidden transition-all hover:border-dourado/60 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-vinho-light to-rosa opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <span className="relative z-10 flex items-center gap-2">
                Entrar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
