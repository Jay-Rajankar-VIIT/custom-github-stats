interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastContributionDate: string | null;
}

export function calculateStreaks(weeks: any[]): StreakData {
  let currentStreak = 0;
  let longestStreak = 0;
  let maxStreak = 0;
  let lastContributionDate: string | null = null;

  // Flatten all weeks into individual days in reverse chronological order
  const allDays: ContributionDay[] = [];
  weeks.forEach((week: any) => {
    week.contributionDays?.forEach((day: ContributionDay) => {
      allDays.push(day);
    });
  });

  // Sort by date descending (most recent first)
  allDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate current streak from today backwards
  const today = new Date();
  let checkDate = new Date(today);
  let streak = 0;

  for (const day of allDays) {
    const dayDate = new Date(day.date);
    const dayOfWeek = dayDate.getDay();

    // Check if day has contributions
    if (day.contributionCount > 0) {
      if (!lastContributionDate) {
        lastContributionDate = day.date;
      }

      // Check if this day is consecutive with our streak
      const expectedDate = new Date(checkDate);
      expectedDate.setDate(expectedDate.getDate() - streak);

      // Allow for weekends, just check it's within 2 days
      const diffTime = Math.abs(dayDate.getTime() - expectedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2 || streak === 0) {
        streak++;
      } else {
        break;
      }
    }
  }

  currentStreak = streak;

  // Calculate longest streak by scanning all days
  streak = 0;
  allDays.forEach((day) => {
    if (day.contributionCount > 0) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 0;
    }
  });

  return {
    currentStreak,
    longestStreak,
    lastContributionDate,
  };
}
