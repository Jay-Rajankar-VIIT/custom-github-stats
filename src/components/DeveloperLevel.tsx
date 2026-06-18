'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { calculateXP, calculateLevel, getLevelTitle, getCurrentLevelProgress } from '@/utils/calculateXP';

interface DeveloperLevelProps {
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
    followers: number;
  };
}

export function DeveloperLevel({ stats }: DeveloperLevelProps) {
  const totalXP = calculateXP(stats);
  const level = calculateLevel(totalXP);
  const title = getLevelTitle(level);
  const progressData = getCurrentLevelProgress(totalXP);
  
  const displayXP = useCountUp(totalXP, { duration: 2000, delay: 200 });
  const displayLevel = useCountUp(level, { duration: 1500, delay: 100 });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-md mx-auto"
    >
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Level Badge */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg shadow-purple-500/50"
            >
              {displayLevel}
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-center text-2xl font-bold text-white mb-2">
            {title}
          </h3>

          {/* XP Display */}
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-2">Experience Points</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              {displayXP.toLocaleString()}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Current Level</span>
              <span>Next Level</span>
            </div>
            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressData.progress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{progressData.currentLevelXP.toLocaleString()}</span>
              <span>{progressData.nextLevelXP.toLocaleString()}</span>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
              <p className="text-slate-400 text-xs mb-1">Commits</p>
              <p className="text-lg font-bold text-blue-400">{stats.commits.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
              <p className="text-slate-400 text-xs mb-1">Pull Requests</p>
              <p className="text-lg font-bold text-purple-400">{stats.prs.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
              <p className="text-slate-400 text-xs mb-1">Stars</p>
              <p className="text-lg font-bold text-yellow-400">{stats.stars.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/20">
              <p className="text-slate-400 text-xs mb-1">Followers</p>
              <p className="text-lg font-bold text-pink-400">{stats.followers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}
