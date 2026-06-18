'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { calculateStreaks } from '@/utils/calculateStreaks';

interface CodingStreakProps {
  weeks: any[];
}

export function CodingStreak({ weeks }: CodingStreakProps) {
  const streakData = calculateStreaks(weeks);

  const currentStreakCount = useCountUp(streakData.currentStreak, { duration: 1500, delay: 100 });
  const longestStreakCount = useCountUp(streakData.longestStreak, { duration: 1500, delay: 200 });

  const fireIntensity = Math.min(100, (streakData.currentStreak / 30) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Streak */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Current Streak</h3>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl"
                >
                  🔥
                </motion.div>
              </div>

              <div className="mb-6">
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  {currentStreakCount}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  {streakData.currentStreak === 0 ? 'Keep coding to start a streak' : 'consecutive days'}
                </p>
              </div>

              {/* Flame intensity bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Intensity</span>
                  <span>{Math.round(fireIntensity)}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fireIntensity}%` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  />
                </div>
              </div>

              {/* Last contribution */}
              {streakData.lastContributionDate && (
                <p className="text-xs text-slate-500 mt-4">
                  Last contribution: {new Date(streakData.lastContributionDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="relative group">
          <div className={`absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Longest Streak</h3>
                <div className="text-4xl">🏆</div>
              </div>

              <div className="mb-6">
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                  {longestStreakCount}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  {streakData.longestStreak === 0 ? 'All-time record' : 'consecutive days'}
                </p>
              </div>

              {/* Achievement indicator */}
              <div className="flex gap-2">
                {streakData.longestStreak >= 7 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-300"
                  >
                    Week Master
                  </motion.div>
                )}
                {streakData.longestStreak >= 30 && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
                  >
                    Dedicated
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
