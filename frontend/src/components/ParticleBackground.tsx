import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const particleCount = 135;
    const fov = 400; // Field of view for 3D depth projection
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      for (let i = 0; i < particleCount; i++) {
        // Generate coordinates uniformly distributed on a 3D sphere surface
        const theta = Math.acos(Math.random() * 2 - 1);
        const phi = Math.random() * Math.PI * 2;
        
        particles.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(theta),
          ox: radius * Math.sin(theta) * Math.cos(phi),
          oy: radius * Math.sin(theta) * Math.sin(phi),
          oz: radius * Math.cos(theta),
        });
      }
    };

    // Base idle rotation speeds - decreased for slow cinematic feel
    let angleX = 0.0003;
    let angleY = 0.0004;

    // Track mouse to rotate the sphere slightly based on cursor coords - decreased sensitivity
    let mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX - canvas.width / 2) * 0.000015;
      mouse.y = (e.clientY - canvas.height / 2) * 0.000015;
    };

    // Track scroll to apply rotation momentum - set to 0.00000000002 for extremely subtle scroll drift
    let scrollOffset = 0;
    const handleScroll = () => {
      scrollOffset = window.scrollY * 0.00000000002; // Very small scroll multiplier
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Combine base idle rotation with mouse inputs and absolute page scroll offset
      const currentAngleX = angleX + mouse.y + scrollOffset;
      const currentAngleY = angleY + mouse.x + scrollOffset * 0.8;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // 1. Rotate & Project particles
      const projected = particles.map(p => {
        // Rotate X axis
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.z * cosX + p.y * sinX;
        
        // Rotate Y axis
        let x2 = p.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + p.x * sinY;
        
        // Save rotated coordinates back for next frame
        p.x = x2;
        p.y = y1;
        p.z = z2;

        // Project to 2D screen space using perspective fov scale
        const scale = fov / (fov + z2);
        const screenX = centerX + x2 * scale;
        const screenY = centerY + y1 * scale;
        
        return {
          sx: screenX,
          sy: screenY,
          sz: z2,
          scale
        };
      });

      // 2. Draw connections (synapse lines) between nearby projected nodes in 3D
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        
        // Skip drawing connection lines for nodes very far in the back
        if (p1.sz > 220) continue;

        let connections = 0;
        for (let j = i + 1; j < projected.length; j++) {
          if (connections > 2) break; // Keep connections clean

          const p2 = projected[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if close on screen and in relative depth
          if (dist < 110 && Math.abs(p1.sz - p2.sz) < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            
            // Fades lines based on distance and depth
            const alpha = (1 - dist / 110) * 0.14 * (1 - p1.sz / fov);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.stroke();
            connections++;
          }
        }

        // Draw particle dot (glowing neuron cell body) - reduced size
        ctx.beginPath();
        // Reduced size: max radius 1.1 down from 2.2
        ctx.arc(p1.sx, p1.sy, Math.max(0.6, p1.scale * 1.2), 0, Math.PI * 2);
        
        // Fades dot based on depth
        const dotAlpha = (1 - p1.sz / fov) * 0.7;
        ctx.fillStyle = `rgba(167, 139, 250, ${dotAlpha})`;
        ctx.shadowBlur = p1.scale * 3;
        ctx.shadowColor = 'rgba(167, 139, 250, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
