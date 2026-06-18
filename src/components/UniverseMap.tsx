'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Repository {
  name: string;
  stars: number;
  language?: string;
}

interface UniverseMapProps {
  repositories: Repository[];
}

export function UniverseMap({ repositories }: UniverseMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !repositories.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create nodes from repositories
    const nodes = repositories
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 15)
      .map((repo, idx) => {
        const angle = (Math.PI * 2 * idx) / Math.min(15, repositories.length);
        const distance = 100 + (Math.random() * 80);
        return {
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          name: repo.name,
          stars: repo.stars,
          radius: Math.min(15, 5 + Math.log(repo.stars + 1)),
        };
      });

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw central sun
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
      sunGradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
      sunGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(168, 85, 247, 1)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw nodes and connections
      nodes.forEach((node, idx) => {
        // Draw connection to center
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();

        // Draw node glow
        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 3
        );
        glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw node
        ctx.fillStyle = `hsl(${200 + idx * 10}, 80%, 50%)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw pulse
        const pulse = Math.sin(time * 2 + idx) * 2 + 1;
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulse, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw labels
      ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';

      nodes.slice(0, 5).forEach((node) => {
        ctx.fillText(node.name.substring(0, 12), node.x, node.y + node.radius + 15);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [repositories]);

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
          <h3 className="text-xl font-bold text-white mb-2">Universe Map</h3>
          <p className="text-slate-400 text-sm">Your repository ecosystem visualization</p>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full border border-slate-700/30 rounded-lg bg-gradient-to-b from-slate-900/50 to-slate-950/50"
        />

        <div className="mt-4 text-xs text-slate-400">
          Larger nodes = more stars. Repositories organized in orbital system around your core projects.
        </div>
      </div>
    </motion.div>
  );
}
