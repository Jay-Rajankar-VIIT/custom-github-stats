'use client';

import { motion } from 'framer-motion';

interface TimelineEvent {
  type: 'commit' | 'pr' | 'star' | 'repo' | 'issue';
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
}

interface ActivityTimelineProps {
  events?: TimelineEvent[];
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
    repos: number;
  };
}

export function ActivityTimeline({ events, stats }: ActivityTimelineProps) {
  // Generate mock timeline events based on stats
  const defaultEvents: TimelineEvent[] = [
    {
      type: 'commit',
      title: 'Commits Activity',
      description: `${stats.commits.toLocaleString()} total commits across all repositories`,
      date: 'Ongoing',
      icon: '💾',
      color: 'from-blue-400 to-blue-600',
    },
    {
      type: 'pr',
      title: 'Pull Requests',
      description: `${stats.prs.toLocaleString()} pull requests created and reviewed`,
      date: 'Recent',
      icon: '🔀',
      color: 'from-purple-400 to-purple-600',
    },
    {
      type: 'star',
      title: 'Stars Earned',
      description: `${stats.stars.toLocaleString()} stars awarded across projects`,
      date: 'All Time',
      icon: '⭐',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      type: 'repo',
      title: 'Repositories',
      description: `${stats.repos.toLocaleString()} repositories maintained and created`,
      date: 'Active',
      icon: '📦',
      color: 'from-green-400 to-green-600',
    },
    {
      type: 'issue',
      title: 'Issues Created',
      description: `${stats.issues.toLocaleString()} issues reported and resolved`,
      date: 'Community',
      icon: '⚠️',
      color: 'from-red-400 to-red-600',
    },
  ];

  const timelineEvents = events || defaultEvents;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8">Activity Timeline</h3>

        <div className="space-y-6">
          {timelineEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4"
            >
              {/* Timeline marker */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}
                >
                  {event.icon}
                </motion.div>
                {idx < timelineEvents.length - 1 && (
                  <div className="w-1 h-12 bg-gradient-to-b from-slate-600 to-slate-700 mt-2" />
                )}
              </div>

              {/* Timeline content */}
              <motion.div
                whileHover={{ x: 10 }}
                className="flex-1 pb-4"
              >
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">{event.title}</h4>
                    <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{event.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
