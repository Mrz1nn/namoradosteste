import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import FloatingParticles from "./components/FloatingParticles";
import Hero from "./components/Hero";
import StoryStart from "./components/StoryStart";
import Timeline from "./components/Timeline";
import LoveCards from "./components/LoveCards";
import LoveLetter from "./components/LoveLetter";
import MemoriesGallery from "./components/MemoriesGallery";
import LoveCounter from "./components/LoveCounter";
import Promises from "./components/Promises";
import FinalSection from "./components/FinalSection";
import Footer from "./components/Footer";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* 1. Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onFinished={() => setIsLoading(false)} />
        )}
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

export default App;
