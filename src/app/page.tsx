'use client';

import { useGitHubData } from '@/hooks/useGitHubData';
import { HeroSection } from '@/components/HeroSection';
import { DeveloperLevel } from '@/components/DeveloperLevel';
import { StatsGrid } from '@/components/StatsGrid';
import { ContributionGalaxy } from '@/components/ContributionGalaxy';
import { CodingStreak } from '@/components/CodingStreak';
import { DeveloperRadar } from '@/components/DeveloperRadar';
import { AccountBreakdown } from '@/components/AccountBreakdown';
import { motion } from 'framer-motion';

export default function Home() {
  const { combined, stats1, stats2, user1Data, user2Data, loading, error } = useGitHubData();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error Loading Data</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !combined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-slate-300">Loading your universe...</p>
        </div>
      </div>
    );
  }

  const weeks = user1Data?.contributionsCollection?.contributionCalendar?.weeks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <HeroSection 
        title="Jay's Developer Universe"
        subtitle="Building the future, one commit at a time"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 space-y-16">
        
        {/* Developer Level */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">RPG Developer Profile</h2>
          <DeveloperLevel stats={combined} />
        </motion.section>

        {/* Statistics Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Global Statistics</h2>
          <StatsGrid 
            stats={{
              contributions: combined.total,
              commits: combined.commits,
              followers: combined.followers,
              repos: combined.repos,
              stars: combined.stars,
              prs: combined.prs,
              issues: combined.issues,
            }}
          />
        </motion.section>

        {/* Contribution Galaxy */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Contribution Galaxy</h2>
          <ContributionGalaxy weeks={weeks} />
        </motion.section>

        {/* Coding Streak */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Coding Streaks</h2>
          <CodingStreak weeks={weeks} />
        </motion.section>

        {/* Developer Radar */}
        {user1Data?.repositories?.nodes && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Language Proficiency</h2>
            <DeveloperRadar topLanguages={
              Object.entries(
                user1Data.repositories.nodes.reduce((acc: any, repo: any) => {
                  if (repo.primaryLanguage) {
                    const name = repo.primaryLanguage.name;
                    acc[name] = acc[name] || { name, count: 0, color: repo.primaryLanguage.color || '#888' };
                    acc[name].count += 1;
                  }
                  return acc;
                }, {})
              )
              .map(([_, data]: any) => data)
              .sort((a: any, b: any) => b.count - a.count)
              .slice(0, 6)
            } />
          </motion.section>
        )}

        {/* Account Breakdown */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">Account Comparison</h2>
          <AccountBreakdown 
            account1={{
              name: '@Jay-Rajankar-VIIT',
              commits: stats1.commits,
              prs: stats1.prs,
              issues: stats1.issues,
              repos: stats1.repos,
              stars: stats1.stars,
              color: 'from-purple-400 to-blue-400',
              emoji: '🎯',
            }}
            account2={{
              name: '@JayRajankar',
              commits: stats2.commits,
              prs: stats2.prs,
              issues: stats2.issues,
              repos: stats2.repos,
              stars: stats2.stars,
              color: 'from-cyan-400 to-blue-400',
              emoji: '🚀',
            }}
          />
        </motion.section>

        {/* Embed Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 mt-20"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Share Your Stats Card</h3>
          <div className="bg-slate-900/50 rounded-lg p-6 mb-4">
            <p className="text-slate-400 text-sm mb-3">Embed in your GitHub README:</p>
            <code className="text-emerald-400 text-sm font-mono">
              {`![GitHub Stats](https://yoursite.com/api/stats)`}
            </code>
          </div>
          <p className="text-slate-300">Your stats card is available as a beautiful SVG image at <code className="text-purple-400 bg-slate-900/50 px-2 py-1 rounded">/api/stats</code></p>
        </motion.section>
      </div>

      {/* Footer spacing */}
      <div className="h-20" />
    </div>
  );
}
