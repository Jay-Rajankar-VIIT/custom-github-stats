'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

interface AccountStats {
  name: string;
  commits: number;
  prs: number;
  issues: number;
  repos: number;
  stars: number;
  color: string;
  emoji: string;
}

interface AccountBreakdownProps {
  account1: AccountStats;
  account2: AccountStats;
}

export function AccountBreakdown({ account1, account2 }: AccountBreakdownProps) {
  const accounts = [account1, account2];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {accounts.map((account, idx) => (
          <AccountCard key={account.name} account={account} delay={idx * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

interface AccountCardProps {
  account: AccountStats;
  delay: number;
}

function AccountCard({ account, delay }: AccountCardProps) {
  const commitsCount = useCountUp(account.commits, { duration: 1500, delay: delay * 100 + 100 });
  const prsCount = useCountUp(account.prs, { duration: 1500, delay: delay * 100 + 150 });
  const issuesCount = useCountUp(account.issues, { duration: 1500, delay: delay * 100 + 200 });
  const reposCount = useCountUp(account.repos, { duration: 1500, delay: delay * 100 + 250 });
  const starsCount = useCountUp(account.stars, { duration: 1500, delay: delay * 100 + 300 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${account.color}/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`absolute inset-0 bg-gradient-to-br ${account.color}/10`} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{account.emoji}</span>
            <div>
              <h3 className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${account.color}`}>
                {account.name}
              </h3>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatItem label="Commits" value={commitsCount} />
            <StatItem label="PRs" value={prsCount} />
            <StatItem label="Issues" value={issuesCount} />
            <StatItem label="Repos" value={reposCount} />
          </div>

          {/* Stars */}
          <div className="pt-4 border-t border-slate-600/30">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Stars Earned</span>
              <span className="text-2xl font-bold text-yellow-400">
                {starsCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Activity indicator */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 flex items-center gap-2 text-xs text-slate-400"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Active contributor
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-200">{value.toLocaleString()}</p>
    </div>
  );
}
