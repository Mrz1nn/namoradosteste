import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer({ hideUI = false }: { hideUI?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Attempt to load the user's custom local audio file
    const audio = new Audio("/audio/musica.mp3");
    audio.loop = true;
    audio.volume = 0.4; // Soft background volume
    audioRef.current = audio;

    // Handle fallback if the custom file doesn't exist
    const handleAudioError = () => {
      console.log("Custom local audio not found. Falling back to Satie's Gymnopédie.");
      if (audioRef.current) {
        audioRef.current.src = "https://upload.wikimedia.org/wikipedia/commons/3/3e/Erik_Satie_-_Gymnop%C3%A9die_No._1_-_recording_by_Accou.mp3";
        // Play fallback
        audioRef.current.play().catch((err) => console.log("Playback failed:", err));
      }
    };

    audio.addEventListener("error", handleAudioError);

    // Autoplay bypass: try to play on the first user interaction on the page
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            cleanUpListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked by browser. Awaiting manual trigger.", err);
          });
      }
    };

    const cleanUpListeners = () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      cleanUpListeners();
      if (audioRef.current) {
        audioRef.current.removeEventListener("error", handleAudioError);
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering any scroll click events
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Failed to play audio:", err);
        });
    }
  };

  if (hideUI) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <button
        onClick={togglePlay}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full border bg-vinho/80 backdrop-blur-md text-[#FFF7F2] shadow-[0_8px_30px_rgba(59,10,24,0.4)] transition-all duration-300 active:scale-90 hover:scale-105 ${
          isPlaying 
            ? "border-rosa/60 text-rosa animate-[spin_10s_linear_infinite]" 
            : "border-white/10 text-brancoQuente/60 hover:text-brancoQuente hover:border-rosa/30"
        }`}
        title={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {/* Animated wave lines in the background when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-rosa/30 animate-ping opacity-75 pointer-events-none" />
        )}

        {/* Dynamic Icon */}
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}

        {/* Small floating note icon when playing */}
        {isPlaying && (
          <Music className="w-3.5 h-3.5 absolute -top-1 -right-1 text-dourado animate-bounce" />
        )}
      </button>
    </div>
  );
}
