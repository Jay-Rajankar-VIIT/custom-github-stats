'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface StatsGridProps {
  stats: {
    contributions: number;
    commits: number;
    followers: number;
    repos: number;
    stars: number;
    prs: number;
    issues: number;
  };
}

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  gradient: string;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statCards: StatCard[] = [
    {
      label: 'Contributions',
      value: stats.contributions,
      icon: '📊',
      color: 'from-blue-400 to-blue-600',
      gradient: 'from-blue-500/10 to-blue-600/10',
    },
    {
      label: 'Commits',
      value: stats.commits,
      icon: '💾',
      color: 'from-purple-400 to-purple-600',
      gradient: 'from-purple-500/10 to-purple-600/10',
    },
    {
      label: 'Followers',
      value: stats.followers,
      icon: '👥',
      color: 'from-pink-400 to-pink-600',
      gradient: 'from-pink-500/10 to-pink-600/10',
    },
    {
      label: 'Repositories',
      value: stats.repos,
      icon: '📦',
      color: 'from-green-400 to-green-600',
      gradient: 'from-green-500/10 to-green-600/10',
    },
    {
      label: 'Stars',
      value: stats.stars,
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
      gradient: 'from-yellow-500/10 to-yellow-600/10',
    },
    {
      label: 'Pull Requests',
      value: stats.prs,
      icon: '🔀',
      color: 'from-cyan-400 to-cyan-600',
      gradient: 'from-cyan-500/10 to-cyan-600/10',
    },
    {
      label: 'Issues',
      value: stats.issues,
      icon: '⚠️',
      color: 'from-red-400 to-red-600',
      gradient: 'from-red-500/10 to-red-600/10',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {statCards.map((card, index) => (
        <StatCard key={index} card={card} delay={index * 0.1} />
      ))}
    </motion.div>
  );
}

interface StatCardProps {
  card: StatCard;
  delay: number;
}

function StatCard({ card, delay }: StatCardProps) {
  const animatedValue = useCountUp(card.value, { duration: 1500, delay: delay * 100 + 100 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-medium">{card.label}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          
          <p className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
            {animatedValue.toLocaleString()}
          </p>

          {/* Trend indicator placeholder */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 bg-slate-600/30 rounded-full overflow-hidden">
              <div className={`h-full w-3/4 bg-gradient-to-r ${card.color}`} />
            </div>
            <span className="text-xs text-green-400">+12%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
