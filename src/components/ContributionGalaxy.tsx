'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface ContributionGalaxyProps {
  weeks: any[];
}

export function ContributionGalaxy({ weeks }: ContributionGalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !weeks.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      twinkle: number;
      contributionCount: number;
    }> = [];

    // Generate stars from contribution data
    weeks.forEach((week, weekIdx) => {
      if (!week.contributionDays) return;
      
      week.contributionDays.forEach((day: any, dayIdx: number) => {
        const contribution = day.contributionCount || 0;
        if (contribution > 0) {
          const x = (weekIdx / weeks.length) * canvas.width;
          const y = (dayIdx / 7) * canvas.height;
          const radius = Math.min(1 + (contribution / 10), 3);
          
          stars.push({
            x,
            y,
            radius,
            opacity: Math.min(0.3 + (contribution / 20), 1),
            twinkle: Math.random() * Math.PI * 2,
            contributionCount: contribution,
          });
        }
      });
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;

      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw stars with twinkling effect
      stars.forEach((star) => {
        const twinkleValue = Math.sin(star.twinkle + time) * 0.5 + 0.5;
        const alpha = star.opacity * twinkleValue;

        // Draw glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        gradient.addColorStop(0, `rgba(168, 85, 247, ${alpha * 0.6})`);
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          star.x - star.radius * 3,
          star.y - star.radius * 3,
          star.radius * 6,
          star.radius * 6
        );

        // Draw core
        ctx.fillStyle = `rgba(196, 181, 253, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw label
      ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.font = '12px system-ui';
      ctx.fillText('52 weeks • Real contribution history', 10, 20);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [weeks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">Contribution Galaxy</h3>
          <p className="text-slate-400 text-sm">Your 52-week contribution activity visualized as stars</p>
        </div>
        
        <canvas
          ref={canvasRef}
          className="w-full border border-slate-700/30 rounded-lg bg-gradient-to-b from-slate-900/50 to-slate-950/50"
        />

        <div className="mt-4 text-xs text-slate-400">
          Brighter stars indicate more contributions. Hover over the visualization for details.
        </div>
      </div>
    </motion.div>
  );
}
