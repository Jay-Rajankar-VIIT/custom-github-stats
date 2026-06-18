interface GitHubStats {
  commits: number;
  prs: number;
  issues: number;
  stars: number;
  followers: number;
}

export function calculateXP(stats: GitHubStats): number {
  return (
    stats.commits * 5 +
    stats.prs * 20 +
    stats.stars * 10 +
    stats.issues * 5 +
    stats.followers * 15
  );
}

export function calculateLevel(xp: number): number {
  // Exponential level progression: each level requires more XP
  // Level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100));
}

export function getXPForLevel(level: number): number {
  // XP needed to reach this level
  return level * level * 100;
}

export function getCurrentLevelProgress(xp: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const level = calculateLevel(xp);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

export function getLevelTitle(level: number): string {
  if (level < 5) return 'Novice Developer';
  if (level < 10) return 'Apprentice';
  if (level < 15) return 'Journeyman';
  if (level < 20) return 'Expert';
  if (level < 25) return 'Master';
  if (level < 30) return 'Legendary';
  return 'Mythic Developer';
}
