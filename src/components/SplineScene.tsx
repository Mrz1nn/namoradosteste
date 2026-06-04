import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

interface Point3D {
  x: number;
  y: number;
  z: number;
  origX: number;
  origY: number;
  origZ: number;
  color: string;
  size: number;
}

export default function SplineScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadSpline = false; // Mudar para true se quiser tentar carregar cena do Spline
  const [splineError, setSplineError] = useState(false);

  // Mouse coordinates for rotation interactive physics
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // If we want to test loading a real Spline scene, we can toggle loadSpline.
    // For now, our premium interactive math canvas fallback is active.
    if (loadSpline && !splineError) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point3D[] = [];
    const numPoints = 350;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate 3D Heart coordinates
    // Mathematical heart formulas:
    // x = 16 * sin^3(t)
    // y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
    for (let i = 0; i < numPoints; i++) {
      const t = Math.random() * Math.PI * 2;
      // We vary the size and volume of the heart
      const scale = Math.random() * 0.4 + 0.6; // Scale variance for volume
      
      // Base heart shape
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
      // Z coordinate gives depth (3D effect)
      const z = (Math.random() - 0.5) * 15 * scale;

      // Color palette (mix of gold and hot/dark pinks)
      const r = Math.random();
      const color = r < 0.4 
        ? "rgba(199, 121, 139, " + (Math.random() * 0.6 + 0.4) + ")" // Rose
        : r < 0.8
        ? "rgba(216, 178, 110, " + (Math.random() * 0.6 + 0.4) + ")" // Dourado
        : "rgba(255, 247, 242, " + (Math.random() * 0.6 + 0.4) + ")"; // Branco

      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        color,
        size: Math.random() * 2 + 1,
      });
    }

    // Add some random floating dust particles around the heart
    for (let i = 0; i < 100; i++) {
      const radius = Math.random() * 12 + 6;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 20;

      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        color: "rgba(216, 178, 110, " + (Math.random() * 0.3) + ")",
        size: Math.random() * 1.5,
      });
    }

    let angleX = 0;
    let angleY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.current.targetX = (x - canvas.width / 2) * 0.005;
      mouse.current.targetY = (y - canvas.height / 2) * 0.005;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse tracking
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

      // Base auto rotation + mouse interaction
      angleY = mouse.current.x + Date.now() * 0.0005;
      angleX = mouse.current.y + Math.sin(Date.now() * 0.0002) * 0.3;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Projected points
      const projected = points.map((p) => {
        // Rotate around Y axis
        let x1 = p.origX * cosY - p.origZ * sinY;
        let z1 = p.origX * sinY + p.origZ * cosY;

        // Rotate around X axis
        let y2 = p.origY * cosX - z1 * sinX;
        let z2 = p.origY * sinX + z1 * cosX;

        // Perspective projection
        const cameraDistance = 60;
        const scale = 300 / (cameraDistance + z2);
        
        // Translate to canvas center
        const screenX = canvas.width / 2 + x1 * scale * 10;
        const screenY = canvas.height / 2 + y2 * scale * 10;

        return {
          x: screenX,
          y: screenY,
          zDepth: z2,
          size: p.size * scale,
          color: p.color,
        };
      });

      // Sort by depth (painters algorithm) for correct transparency overlay
      projected.sort((a, b) => b.zDepth - a.zDepth);

      // Draw lines between nearby points to create the "constellation" web effect
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.zDepth > 20) continue; // Don't connect background dust

        let connections = 0;
        for (let j = i + 1; j < projected.length && connections < 2; j++) {
          const p2 = projected[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if close enough in 2D space
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Fade lines based on distance
            const alpha = (1 - dist / 40) * 0.15;
            ctx.strokeStyle = `rgba(199, 121, 139, ${alpha})`;
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw points
      projected.forEach((p) => {
        // Edge fading logic
        const margin = 20;
        let edgeAlpha = 1;
        if (p.x < margin) edgeAlpha = p.x / margin;
        else if (p.x > canvas.width - margin) edgeAlpha = (canvas.width - p.x) / margin;

        if (p.y < margin) edgeAlpha = Math.min(edgeAlpha, p.y / margin);
        else if (p.y > canvas.height - margin) edgeAlpha = Math.min(edgeAlpha, (canvas.height - p.y) / margin);

        edgeAlpha = Math.max(0, Math.min(1, edgeAlpha));
        if (edgeAlpha <= 0) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        let drawColor = p.color;
        if (edgeAlpha < 1) {
          drawColor = p.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (_, r, g, b, a) => {
            const newAlpha = parseFloat(a) * edgeAlpha;
            return `rgba(${r},${g},${b},${newAlpha})`;
          });
        }
        ctx.fillStyle = drawColor;
        ctx.fill();

        // Extra subtle glow for larger star points
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          const glowAlpha = 0.1 * edgeAlpha;
          ctx.fillStyle = p.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, `rgba($1,$2,$3,${glowAlpha})`);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loadSpline, splineError]);

  if (loadSpline && !splineError) {
    return (
      <div className="w-full h-full relative">
        <Spline
          scene="https://prod.spline.design/your-spline-id/scene.splinecode"
          onError={() => setSplineError(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
