'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Language {
  name: string;
  count: number;
  color: string;
}

interface DeveloperRadarProps {
  topLanguages: Language[];
}

export function DeveloperRadar({ topLanguages }: DeveloperRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !topLanguages.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = Math.min(canvas.offsetWidth, 500);
    canvas.height = Math.min(canvas.offsetHeight, 500);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      rotation += 0.5; // Slow rotation speed

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw radar circles
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < topLanguages.length; i++) {
        const angle = (Math.PI * 2 * i) / topLanguages.length;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw language data
      const totalCount = topLanguages.reduce((sum, lang) => sum + lang.count, 0);

      topLanguages.forEach((lang, i) => {
        const percentage = lang.count / totalCount;
        const dataRadius = radius * (0.3 + percentage * 0.7); // Vary radius based on percentage
        const angle = (Math.PI * 2 * i) / topLanguages.length + (rotation * Math.PI / 180);

        const x = centerX + Math.cos(angle) * dataRadius;
        const y = centerY + Math.sin(angle) * dataRadius;

        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, lang.color + '80');
        gradient.addColorStop(1, lang.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw point
        ctx.fillStyle = lang.color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw labels
      ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';

      topLanguages.forEach((lang, i) => {
        const angle = (Math.PI * 2 * i) / topLanguages.length;
        const labelRadius = radius + 30;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;

        ctx.fillText(lang.name, x, y);
      });

      // Draw center label
      ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('Languages', centerX, centerY + 5);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [topLanguages]);

  const totalCount = topLanguages.reduce((sum, lang) => sum + lang.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Developer Radar</h3>
          <p className="text-slate-400 text-sm">Your language proficiency rotation</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <canvas
              ref={canvasRef}
              className="w-full border border-slate-700/30 rounded-lg bg-gradient-to-b from-slate-900/50 to-slate-950/50"
            />
          </div>

          {/* Legend */}
          <div className="lg:w-48 space-y-3">
            {topLanguages.map((lang) => {
              const percentage = (lang.count / totalCount) * 100;
              return (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 truncate">
                      {lang.name}
                    </p>
                    <div className="h-1.5 bg-slate-700/30 rounded-full overflow-hidden mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 w-10 text-right">
                    {Math.round(percentage)}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
