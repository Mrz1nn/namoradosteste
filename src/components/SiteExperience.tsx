import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
import FloatingParticles from "./FloatingParticles";
import Hero from "./Hero";
import StoryStart from "./StoryStart";
import Timeline from "./Timeline";
import LoveCards from "./LoveCards";
import LoveLetter from "./LoveLetter";
import MemoriesGallery from "./MemoriesGallery";
import LoveCounter from "./LoveCounter";
import Promises from "./Promises";
import FinalSection from "./FinalSection";
import Footer from "./Footer";
import AudioPlayer from "./AudioPlayer";

/** A experiência completa do site de um casal (todas as seções). */
export default function SiteExperience() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* 1. Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Background Ambient Audio */}
      <AudioPlayer hideUI={isLoading} />

      {/* Main Experience Page */}
      {!isLoading && (
        <main className="relative min-h-screen bg-background overflow-x-hidden text-brancoQuente selection:bg-rosa/30 selection:text-brancoQuente">
          {/* Cinematic noise texture overlay */}
          <div className="noise-overlay" />

          {/* Background Ambient Particles */}
          <FloatingParticles />

          {/* 2. Hero Section */}
          <Hero />

          {/* 3. Seção "Onde tudo começou" */}
          <StoryStart />

          {/* 4. Linha do Tempo */}
          <Timeline />

          {/* 5. Seção "Coisas que eu amo em você" */}
          <LoveCards />

          {/* 6. Seção "Carta para você" */}
          <LoveLetter />

          {/* 7. Galeria de Memórias */}
          <MemoriesGallery />

          {/* 8. Seção "Contador do nosso amor" */}
          <LoveCounter />

          {/* 9. Seção "Promessas" */}
          <Promises />

          {/* 10. Seção Final / CTA emocional */}
          <FinalSection />

          {/* 11. Footer */}
          <Footer />
        </main>
      )}
    </>
  );
}
