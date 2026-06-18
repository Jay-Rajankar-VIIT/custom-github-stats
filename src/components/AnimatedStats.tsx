'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedStatsProps {
  contributions: number;
  commits: number;
  stars: number;
  followers: number;
  repos: number;
}

export function AnimatedStats({ contributions, commits, stars, followers, repos }: AnimatedStatsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div className="w-full space-y-8">
      {/* Animated SVG Stats Card 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 overflow-hidden"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 300"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="statsGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="statsGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="statsGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="statsGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="statsGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="1000" height="300" fill="none" />

          {/* Stat 1: Contributions */}
          <g transform="translate(50, 50)">
            <rect width="150" height="180" rx="12" fill="rgba(59, 130, 246, 0.1)" stroke="url(#statsGradient1)" strokeWidth="2" />
            <circle cx="75" cy="35" r="25" fill="url(#statsGradient1)" filter="url(#glow)" />
            <text x="75" y="42" textAnchor="middle" fontSize="32" fill="#ffffff" fontWeight="bold">
              📊
            </text>
            <text x="75" y="110" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#3b82f6">
              {contributions.toLocaleString()}
            </text>
            <text x="75" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1">
              Contributions
            </text>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.05; 1"
              dur="3s"
              repeatCount="indefinite"
              additive="sum"
            />
          </g>

          {/* Stat 2: Commits */}
          <g transform="translate(250, 50)">
            <rect width="150" height="180" rx="12" fill="rgba(139, 92, 246, 0.1)" stroke="url(#statsGradient2)" strokeWidth="2" />
            <circle cx="75" cy="35" r="25" fill="url(#statsGradient2)" filter="url(#glow)" />
            <text x="75" y="42" textAnchor="middle" fontSize="32" fill="#ffffff" fontWeight="bold">
              💻
            </text>
            <text x="75" y="110" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#8b5cf6">
              {commits.toLocaleString()}
            </text>
            <text x="75" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1">
              Commits
            </text>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.05; 1"
              dur="3.5s"
              repeatCount="indefinite"
              additive="sum"
            />
          </g>

          {/* Stat 3: Stars */}
          <g transform="translate(450, 50)">
            <rect width="150" height="180" rx="12" fill="rgba(236, 72, 153, 0.1)" stroke="url(#statsGradient3)" strokeWidth="2" />
            <circle cx="75" cy="35" r="25" fill="url(#statsGradient3)" filter="url(#glow)" />
            <text x="75" y="42" textAnchor="middle" fontSize="32" fill="#ffffff" fontWeight="bold">
              ⭐
            </text>
            <text x="75" y="110" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#ec4899">
              {stars.toLocaleString()}
            </text>
            <text x="75" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1">
              Stars
            </text>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.05; 1"
              dur="4s"
              repeatCount="indefinite"
              additive="sum"
            />
          </g>

          {/* Stat 4: Followers */}
          <g transform="translate(650, 50)">
            <rect width="150" height="180" rx="12" fill="rgba(245, 158, 11, 0.1)" stroke="url(#statsGradient4)" strokeWidth="2" />
            <circle cx="75" cy="35" r="25" fill="url(#statsGradient4)" filter="url(#glow)" />
            <text x="75" y="42" textAnchor="middle" fontSize="32" fill="#ffffff" fontWeight="bold">
              👥
            </text>
            <text x="75" y="110" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#f59e0b">
              {followers.toLocaleString()}
            </text>
            <text x="75" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1">
              Followers
            </text>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.05; 1"
              dur="4.5s"
              repeatCount="indefinite"
              additive="sum"
            />
          </g>
        </svg>
      </motion.div>

      {/* Animated SVG Stats Card 2 - Repository Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 overflow-hidden"
      >
        <h3 className="text-xl font-bold text-white mb-6">Repository Distribution</h3>
        <svg
          viewBox="0 0 600 250"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="barGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="barGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <linearGradient id="barGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>

          {/* Bar 1 */}
          <g transform="translate(50, 80)">
            <rect
              x="0"
              y="0"
              width="80"
              height="0"
              rx="8"
              fill="url(#barGradient1)"
            >
              <animate
                attributeName="height"
                from="0"
                to="120"
                dur="1.5s"
                fill="freeze"
              />
            </rect>
            <text x="40" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1" fontWeight="bold">
              {repos}
            </text>
            <text x="40" y="165" textAnchor="middle" fontSize="12" fill="#94a3b8">
              Repos
            </text>
          </g>

          {/* Bar 2 */}
          <g transform="translate(200, 80)">
            <rect
              x="0"
              y="0"
              width="80"
              height="0"
              rx="8"
              fill="url(#barGradient2)"
            >
              <animate
                attributeName="height"
                from="0"
                to="95"
                dur="1.7s"
                fill="freeze"
              />
            </rect>
            <text x="40" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1" fontWeight="bold">
              {Math.round(commits / 100)}
            </text>
            <text x="40" y="165" textAnchor="middle" fontSize="12" fill="#94a3b8">
              Commits (x100)
            </text>
          </g>

          {/* Bar 3 */}
          <g transform="translate(350, 80)">
            <rect
              x="0"
              y="0"
              width="80"
              height="0"
              rx="8"
              fill="url(#barGradient3)"
            >
              <animate
                attributeName="height"
                from="0"
                to="110"
                dur="1.9s"
                fill="freeze"
              />
            </rect>
            <text x="40" y="145" textAnchor="middle" fontSize="14" fill="#cbd5e1" fontWeight="bold">
              {followers}
            </text>
            <text x="40" y="165" textAnchor="middle" fontSize="12" fill="#94a3b8">
              Followers
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
