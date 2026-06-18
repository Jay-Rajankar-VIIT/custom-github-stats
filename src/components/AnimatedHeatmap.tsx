'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Week {
  contributionDays: Array<{
    contributionCount: number;
    date: string;
  }>;
}

interface AnimatedHeatmapProps {
  weeks: Week[];
}

const getColor = (count: number) => {
  if (count === 0) return '#0f172a';
  if (count < 5) return '#10b981';
  if (count < 10) return '#34d399';
  if (count < 20) return '#6ee7b7';
  if (count < 30) return '#a7f3d0';
  return '#d1fae5';
};

export function AnimatedHeatmap({ weeks }: AnimatedHeatmapProps) {
  // Only show last 52 weeks
  const displayWeeks = weeks.slice(-52);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 overflow-x-auto"
    >
      <h3 className="text-xl font-bold text-white mb-6">52-Week Contribution Heatmap</h3>
      
      <svg
        viewBox="0 0 1100 150"
        className="w-full h-auto min-w-max"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="heatmapGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heatmap Grid */}
        <g>
          {displayWeeks.map((week, weekIdx) => (
            <g key={weekIdx}>
              {week.contributionDays.map((day, dayIdx) => (
                <motion.g
                  key={`${weekIdx}-${dayIdx}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: (weekIdx * 7 + dayIdx) * 0.01,
                  }}
                  viewport={{ once: true }}
                >
                  <rect
                    x={50 + weekIdx * 15}
                    y={30 + dayIdx * 15}
                    width="12"
                    height="12"
                    rx="2"
                    fill={getColor(day.contributionCount)}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                    filter="url(#heatmapGlow)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.6; 1; 0.6"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <title>{`${day.contributionCount} contributions on ${day.date}`}</title>
                </motion.g>
              ))}
            </g>
          ))}
        </g>

        {/* Legend */}
        <g transform="translate(50, 130)">
          <text x="0" y="0" fontSize="12" fill="#cbd5e1" fontWeight="600">
            Less
          </text>
          <rect
            x="35"
            y="-8"
            width="10"
            height="10"
            rx="2"
            fill="#0f172a"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <rect
            x="50"
            y="-8"
            width="10"
            height="10"
            rx="2"
            fill="#10b981"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <rect
            x="65"
            y="-8"
            width="10"
            height="10"
            rx="2"
            fill="#34d399"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <rect
            x="80"
            y="-8"
            width="10"
            height="10"
            rx="2"
            fill="#a7f3d0"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <rect
            x="95"
            y="-8"
            width="10"
            height="10"
            rx="2"
            fill="#d1fae5"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
          <text x="115" y="0" fontSize="12" fill="#cbd5e1" fontWeight="600">
            More
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
