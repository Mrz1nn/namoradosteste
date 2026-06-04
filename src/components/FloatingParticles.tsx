import { useEffect, useRef } from "react";

interface CanvasElement {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: "dust" | "petal";
  rotation: number;
  rotationSpeed: number;
  rotationY: number;
  rotationYSpeed: number;
  swing: number;
  swingSpeed: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let elements: CanvasElement[] = [];
    const maxElements = 75;

    const dustColors = [
      "rgba(216, 178, 110, 0.35)", // Dourado suave
      "rgba(255, 247, 242, 0.3)",  // Branco quente
    ];

    const petalColors = [
      "rgba(199, 121, 139, 0.65)", // Rosa queimado
      "rgba(163, 92, 109, 0.75)",  // Rosa escuro
      "rgba(59, 10, 24, 0.6)",     // Vinho profundo
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createElement = (init = false): CanvasElement => {
      const type = Math.random() < 0.65 ? "dust" : "petal";
      const size = type === "dust" ? Math.random() * 2 + 0.8 : Math.random() * 8 + 6;
      
      return {
        x: Math.random() * canvas.width,
        y: init ? Math.random() * canvas.height : -20,
        size,
        speedX: type === "dust" ? (Math.random() - 0.5) * 0.3 : (Math.random() - 0.3) * 0.5,
        speedY: type === "dust" ? -(Math.random() * 0.3 + 0.1) : Math.random() * 0.8 + 0.5, // Dust floats up, petals fall down
        opacity: Math.random() * 0.5 + 0.2,
        color: type === "dust" 
          ? dustColors[Math.floor(Math.random() * dustColors.length)]
          : petalColors[Math.floor(Math.random() * petalColors.length)],
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        rotationY: Math.random() * Math.PI * 2,
        rotationYSpeed: Math.random() * 0.02 + 0.01,
        swing: Math.random() * 20 + 10,
        swingSpeed: Math.random() * 0.015 + 0.005,
      };
    };

    // Initialize elements
    for (let i = 0; i < maxElements; i++) {
      elements.push(createElement(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      elements.forEach((el, idx) => {
        // Physics update
        if (el.type === "dust") {
          el.y += el.speedY; // Upward
          el.x += el.speedX;
          el.x += Math.sin(el.y * 0.01 + el.size) * 0.1; // Slow drift
          
          // Render glowing dust
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, el.size * 2);
          gradient.addColorStop(0, el.color);
          gradient.addColorStop(1, "rgba(8, 6, 7, 0)");
          ctx.fillStyle = gradient;
          ctx.arc(el.x, el.y, el.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Recycle dust if it floats off-screen top or side
          if (el.y < -20 || el.x < -20 || el.x > canvas.width + 20) {
            elements[idx] = createElement();
          }
        } else {
          // Petal physics
          el.y += el.speedY; // Downward
          el.x += el.speedX;
          // Swing side-to-side
          el.x += Math.sin(el.y * el.swingSpeed) * (el.swing * 0.05);
          
          el.rotation += el.rotationSpeed;
          el.rotationY += el.rotationYSpeed;

          // Render Petal with simulated 3D folding
          ctx.save();
          ctx.translate(el.x, el.y);
          ctx.rotate(el.rotation);
          ctx.scale(Math.sin(el.rotationY), 1); // 3D Y-axis rotation simulation

          ctx.beginPath();
          ctx.moveTo(0, -el.size);
          ctx.quadraticCurveTo(-el.size * 1.2, -el.size * 0.2, 0, el.size);
          ctx.quadraticCurveTo(el.size * 1.2, -el.size * 0.2, 0, -el.size);
          
          ctx.fillStyle = el.color;
          ctx.fill();

          // Delicate petal fold highlight line
          ctx.beginPath();
          ctx.moveTo(0, -el.size);
          ctx.lineTo(0, el.size);
          ctx.strokeStyle = "rgba(255, 247, 242, 0.12)";
          ctx.lineWidth = 0.5;
          ctx.stroke();

          ctx.restore();

          // Recycle petal if it falls off-screen bottom or side
          if (el.y > canvas.height + 20 || el.x < -20 || el.x > canvas.width + 20) {
            elements[idx] = createElement();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
