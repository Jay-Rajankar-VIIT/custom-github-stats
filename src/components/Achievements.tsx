'use client';

import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementsProps {
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
    followers: number;
    repos: number;
  };
}

export function Achievements({ stats }: AchievementsProps) {
  // Define all achievements and their unlock conditions
  const achievements: Achievement[] = [
    {
      id: 'first-commit',
      name: 'First Steps',
      description: 'Made your first commit',
      icon: '👶',
      color: 'from-blue-400 to-blue-600',
      unlocked: stats.commits > 0,
      rarity: 'common',
    },
    {
      id: 'hundred-commits',
      name: 'Century',
      description: '100+ commits',
      icon: '💯',
      color: 'from-purple-400 to-purple-600',
      unlocked: stats.commits >= 100,
      rarity: 'common',
    },
    {
      id: 'thousand-commits',
      name: 'Millennium',
      description: '1,000+ commits',
      icon: '🎉',
      color: 'from-pink-400 to-pink-600',
      unlocked: stats.commits >= 1000,
      rarity: 'rare',
    },
    {
      id: 'pr-master',
      name: 'Pull Request Master',
      description: '50+ pull requests',
      icon: '🔀',
      color: 'from-cyan-400 to-cyan-600',
      unlocked: stats.prs >= 50,
      rarity: 'rare',
    },
    {
      id: 'issue-solver',
      name: 'Issue Solver',
      description: '25+ issues created',
      icon: '⚠️',
      color: 'from-yellow-400 to-yellow-600',
      unlocked: stats.issues >= 25,
      rarity: 'common',
    },
    {
      id: 'star-collector',
      name: 'Star Collector',
      description: '100+ stars earned',
      icon: '⭐',
      color: 'from-yellow-300 to-yellow-500',
      unlocked: stats.stars >= 100,
      rarity: 'rare',
    },
    {
      id: 'star-legend',
      name: 'Star Legend',
      description: '500+ stars earned',
      icon: '✨',
      color: 'from-amber-300 to-amber-500',
      unlocked: stats.stars >= 500,
      rarity: 'epic',
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: '500+ followers',
      icon: '🦋',
      color: 'from-rose-400 to-rose-600',
      unlocked: stats.followers >= 500,
      rarity: 'epic',
    },
    {
      id: 'repository-builder',
      name: 'Repository Builder',
      description: '50+ public repositories',
      icon: '🏗️',
      color: 'from-orange-400 to-orange-600',
      unlocked: stats.repos >= 50,
      rarity: 'rare',
    },
    {
      id: 'legendary-developer',
      name: 'Legendary Developer',
      description: 'All achievements unlocked',
      icon: '👑',
      color: 'from-purple-500 via-pink-500 to-red-500',
      unlocked:
        stats.commits >= 1000 &&
        stats.prs >= 50 &&
        stats.stars >= 500 &&
        stats.followers >= 500,
      rarity: 'legendary',
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Achievements</h3>
          <div className="flex items-center justify-between">
            <p className="text-slate-400">
              Unlock achievements by hitting milestones
            </p>
            <div className="text-sm font-bold text-purple-400">
              {unlockedCount}/{achievements.length} Unlocked
            </div>
          </div>
          <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              variants={item}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${achievement.color} rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity ${!achievement.unlocked && 'opacity-0'}`}
              />

              <div
                className={`relative h-32 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color} bg-opacity-10 border-opacity-50`
                    : 'bg-slate-800/50 border-slate-600/30 opacity-50'
                } ${achievement.unlocked && 'group-hover:scale-110'}`}
              >
                <div className="text-3xl">{achievement.icon}</div>
                <p className="text-xs font-bold text-slate-200 text-center px-2 line-clamp-2">
                  {achievement.name}
                </p>

                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    viewport={{ once: true }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <div className="bg-slate-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap border border-slate-700">
                  {achievement.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
