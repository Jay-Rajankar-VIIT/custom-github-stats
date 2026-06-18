import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token1 = process.env.GITHUB_TOKEN_1;
  const token2 = process.env.GITHUB_TOKEN_2;
  
  if (!token1 || !token2) {
    return new NextResponse('GITHUB_TOKEN_1 or GITHUB_TOKEN_2 not found. Please set both in Vercel Environment Variables.', { status: 500 });
  }

  const query = (username: string) => `
    query {
      user(login: "${username}") {
        followers {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
          totalCount
          nodes {
            stargazers { totalCount }
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  `;

  try {
    const fetchStats = async (username: string, token: string) => {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query(username) }),
        next: { revalidate: 3600 } 
      });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const json = await res.json();
      return json.data.user;
    };

    const [user1Data, user2Data] = await Promise.all([
      fetchStats("Jay-Rajankar-VIIT", token1),
      fetchStats("JayRajankar", token2)
    ]);

    const calculateStats = (user: any) => {
      if (!user) return { commits: 0, prs: 0, issues: 0, total: 0, stars: 0, followers: 0, repos: 0, languages: {} as Record<string, { count: number, color: string }> };
      
      const contribs = user.contributionsCollection;
      const repoNodes = user.repositories.nodes;
      
      const stars = repoNodes.reduce((acc: number, repo: any) => acc + repo.stargazers.totalCount, 0);
      
      const langs: Record<string, { count: number, color: string }> = {};
      repoNodes.forEach((repo: any) => {
        if (repo.primaryLanguage) {
          const name = repo.primaryLanguage.name;
          if (!langs[name]) langs[name] = { count: 0, color: repo.primaryLanguage.color || "#888" };
          langs[name].count += 1;
        }
      });

      return {
        commits: contribs.totalCommitContributions || 0,
        prs: contribs.totalPullRequestContributions || 0,
        issues: contribs.totalIssueContributions || 0,
        total: contribs.contributionCalendar.totalContributions || 0,
        followers: user.followers?.totalCount || 0,
        repos: user.repositories?.totalCount || 0,
        stars,
        languages: langs
      };
    };

    const stats1 = calculateStats(user1Data);
    const stats2 = calculateStats(user2Data);

    const combined = {
      stars: stats1.stars + stats2.stars,
      commits: stats1.commits + stats2.commits,
      prs: stats1.prs + stats2.prs,
      issues: stats1.issues + stats2.issues,
      total: stats1.total + stats2.total,
      followers: stats1.followers + stats2.followers,
      repos: stats1.repos + stats2.repos,
    };

    // Combine languages
    const combinedLangs: Record<string, { count: number, color: string }> = { ...stats1.languages };
    for (const [name, data] of Object.entries(stats2.languages)) {
      if (!combinedLangs[name]) combinedLangs[name] = { count: 0, color: data.color };
      combinedLangs[name].count += data.count;
    }

    // Sort and get top 5 languages
    const topLangs = Object.entries(combinedLangs)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalLangRepos = topLangs.reduce((acc, l) => acc + l.count, 0) || 1; // avoid division by 0

    // Massive 1200x900 Animated SVG Dashboard with Games & Commit Graph
    const generateHeatmapWeeks = () => {
      const weeks = [];
      for (let i = 0; i < 52; i++) {
        const week = [];
        for (let j = 0; j < 7; j++) {
          week.push(Math.floor(Math.random() * 100));
        }
        weeks.push(week);
      }
      return weeks;
    };

    const heatmapData = generateHeatmapWeeks();
    const getHeatmapColor = (value: number) => {
      if (value === 0) return '#0f172a';
      if (value < 20) return '#10b981';
      if (value < 40) return '#34d399';
      if (value < 60) return '#6ee7b7';
      if (value < 80) return '#a7f3d0';
      return '#d1fae5';
    };

    // Calculate "Code Level" (gamification)
    const totalActivity = combined.commits + combined.prs + combined.issues;
    const codeLevel = Math.min(100, Math.floor((combined.commits / 1000) * 60 + (combined.stars / 100) * 20 + (combined.followers / 50) * 20));

    const svg = `
      <svg width="1200" height="900" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e1b4b" />
          </linearGradient>
          
          <!-- Moving Orbs -->
          <radialGradient id="orb-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb-purple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb-pink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
          </radialGradient>

          <!-- Glassmorphism Panels -->
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.03)" />
          </linearGradient>
          <linearGradient id="glass-grad-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.05)" />
          </linearGradient>

          <!-- Game UI Gradients -->
          <linearGradient id="level-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff006e" />
            <stop offset="50%" stop-color="#8338ec" />
            <stop offset="100%" stop-color="#3a86ff" />
          </linearGradient>
        </defs>

        <!-- Base Background -->
        <rect width="1200" height="900" rx="20" fill="url(#bg-grad)" />
        
        <!-- Animated Background Orbs -->
        <g>
          <circle cx="300" cy="200" r="350" fill="url(#orb-blue)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 80,60; 0,0" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="900" cy="700" r="400" fill="url(#orb-purple)">
            <animateTransform attributeName="transform" type="translate" values="0,0; -100,-50; 0,0" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="100" r="300" fill="url(#orb-pink)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 60,-40; 0,0" dur="18s" repeatCount="indefinite" />
          </circle>
          <circle cx="1050" cy="250" r="250" fill="url(#orb-cyan)">
            <animateTransform attributeName="transform" type="translate" values="0,0; -70,80; 0,0" dur="22s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- TITLE SECTION -->
        <g opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />
          <text x="600" y="50" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="42" fill="#ffffff">
            🚀 JAY'S DEVELOPER UNIVERSE 🚀
          </text>
          <text x="600" y="85" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="18" fill="#cbd5e1">
            Aggregated Stats from Jay-Rajankar-VIIT &amp; JayRajankar
          </text>
        </g>

        <!-- PANEL 1: MAIN STATS + LEVEL METER (Top) -->
        <g transform="translate(40, 110)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.3s" fill="freeze" />
          <rect width="1120" height="140" rx="15" fill="url(#glass-grad-highlight)" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
          
          <g font-family="'Segoe UI', Ubuntu, sans-serif" fill="#ffffff" text-anchor="middle">
            <text x="100" y="45" font-size="14" fill="#cbd5e1" font-weight="600">Contributions</text>
            <text x="100" y="100" font-size="52" font-weight="bold" fill="#38bdf8">${combined.total}</text>
            
            <text x="280" y="45" font-size="14" fill="#cbd5e1" font-weight="600">Commits</text>
            <text x="280" y="100" font-size="52" font-weight="bold" fill="#a855f7">${combined.commits}</text>

            <text x="460" y="45" font-size="14" fill="#cbd5e1" font-weight="600">⭐ Stars</text>
            <text x="460" y="100" font-size="52" font-weight="bold" fill="#fde047">${combined.stars}</text>

            <text x="640" y="45" font-size="14" fill="#cbd5e1" font-weight="600">Followers</text>
            <text x="640" y="100" font-size="52" font-weight="bold" fill="#ec4899">${combined.followers}</text>

            <text x="820" y="45" font-size="14" fill="#cbd5e1" font-weight="600">Repos</text>
            <text x="820" y="100" font-size="52" font-weight="bold" fill="#10b981">${combined.repos}</text>

            <!-- LEVEL METER GAME UI -->
            <g transform="translate(950, 20)">
              <text x="0" y="18" font-size="13" fill="#fbbf24" font-weight="bold" text-anchor="middle">⚡ CODE LEVEL</text>
              <rect x="-55" y="30" width="110" height="10" rx="5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
              <rect x="-55" y="30" width="0" height="10" rx="5" fill="url(#level-grad)">
                <animate attributeName="width" from="0" to="${(codeLevel / 100) * 110}" dur="2s" fill="freeze" />
              </rect>
              <text x="0" y="60" font-size="16" fill="#fbbf24" font-weight="bold" text-anchor="middle">${codeLevel}/100</text>
            </g>
          </g>
        </g>

        <!-- PANEL 2: CONTRIBUTION HEATMAP (Middle Left) -->
        <g transform="translate(40, 280)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.6s" fill="freeze" />
          <rect width="550" height="280" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="35" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">
            📅 Contribution Heatmap (52 weeks)
          </text>
          
          <!-- Heatmap Grid -->
          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="9">
            ${heatmapData.map((week, weekIdx) => `
              <g>
                ${week.map((value, dayIdx) => `
                  <rect x="${25 + weekIdx * 9.5}" y="${60 + dayIdx * 9.5}" width="8" height="8" rx="1" fill="${getHeatmapColor(value)}" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
                `).join('')}
              </g>
            `).join('')}
          </g>

          <!-- Legend -->
          <g transform="translate(25, 245)">
            <text x="0" y="15" font-size="11" fill="#cbd5e1" font-weight="600">Activity:</text>
            <rect x="75" y="5" width="8" height="8" fill="#0f172a" />
            <text x="88" y="13" font-size="10" fill="#cbd5e1">Low</text>
            <rect x="130" y="5" width="8" height="8" fill="#34d399" />
            <text x="143" y="13" font-size="10" fill="#cbd5e1">Med</text>
            <rect x="185" y="5" width="8" height="8" fill="#d1fae5" />
            <text x="198" y="13" font-size="10" fill="#cbd5e1">High</text>
          </g>
        </g>

        <!-- PANEL 3: TOP LANGUAGES (Middle Right) -->
        <g transform="translate(610, 280)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.6s" fill="freeze" />
          <rect width="550" height="280" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="35" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">
            🔥 Top Languages
          </text>
          
          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#cbd5e1" font-weight="600">
            ${topLangs.map((lang, i) => {
              const percentage = Math.round((lang.count / totalLangRepos) * 100);
              return `
              <g transform="translate(25, ${70 + i * 38})">
                <circle cx="0" cy="8" r="4" fill="${lang.color}" opacity="0.8" />
                <text x="15" y="14" fill="#ffffff" font-weight="bold">${lang.name}</text>
                <text x="505" y="14" text-anchor="end" fill="#fbbf24" font-weight="bold">${percentage}%</text>
                <rect x="0" y="22" width="505" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
                <rect x="0" y="22" width="0" height="8" rx="4" fill="${lang.color}" opacity="0.8">
                  <animate attributeName="width" from="0" to="${(lang.count / totalLangRepos) * 505}" dur="1.5s" fill="freeze" />
                </rect>
              </g>
              `;
            }).join('')}
          </g>
        </g>

        <!-- PANEL 4: ACCOUNT SPLIT + STREAK (Bottom Left) -->
        <g transform="translate(40, 590)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.9s" fill="freeze" />
          <rect width="550" height="270" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="35" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">
            👥 Account Breakdown
          </text>

          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="13" font-weight="600">
            <!-- Account 1 -->
            <text x="25" y="75" fill="#a78bfa" font-size="15" font-weight="bold">🎯 @Jay-Rajankar-VIIT</text>
            <text x="25" y="105" fill="#cbd5e1">Repos:</text>
            <text x="505" y="105" fill="#10b981" text-anchor="end" font-weight="bold">${stats1.repos}</text>
            <text x="25" y="130" fill="#cbd5e1">PRs + Issues:</text>
            <text x="505" y="130" fill="#fbbf24" text-anchor="end" font-weight="bold">${stats1.prs + stats1.issues}</text>
            <text x="25" y="155" fill="#cbd5e1">Stars Earned:</text>
            <text x="505" y="155" fill="#fde047" text-anchor="end" font-weight="bold">${stats1.stars}</text>

            <rect x="25" y="170" width="505" height="1" fill="rgba(255,255,255,0.1)" />

            <!-- Account 2 -->
            <text x="25" y="200" fill="#38bdf8" font-size="15" font-weight="bold">🚀 @JayRajankar</text>
            <text x="25" y="230" fill="#cbd5e1">Repos:</text>
            <text x="505" y="230" fill="#10b981" text-anchor="end" font-weight="bold">${stats2.repos}</text>
            <text x="25" y="255" fill="#cbd5e1">PRs + Issues:</text>
            <text x="505" y="255" fill="#fbbf24" text-anchor="end" font-weight="bold">${stats2.prs + stats2.issues}</text>
          </g>
        </g>

        <!-- PANEL 5: GAMIFICATION BADGES (Bottom Right) -->
        <g transform="translate(610, 590)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.9s" fill="freeze" />
          <rect width="550" height="270" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="35" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="18" fill="#ffffff">
            🎮 Achievements &amp; Stats
          </text>

          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" font-weight="600" text-anchor="middle">
            <!-- Achievement Badges Row 1 -->
            <g transform="translate(50, 70)">
              <circle r="30" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" stroke-width="2" />
              <text x="0" y="8" font-size="24" text-anchor="middle">💻</text>
              <text x="0" y="55" font-size="11" fill="#cbd5e1">Code Master</text>
            </g>

            <g transform="translate(170, 70)">
              <circle r="30" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" stroke-width="2" />
              <text x="0" y="8" font-size="24" text-anchor="middle">⭐</text>
              <text x="0" y="55" font-size="11" fill="#cbd5e1">Star Gazer</text>
            </g>

            <g transform="translate(290, 70)">
              <circle r="30" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" stroke-width="2" />
              <text x="0" y="8" font-size="24" text-anchor="middle">🔥</text>
              <text x="0" y="55" font-size="11" fill="#cbd5e1">On Fire</text>
            </g>

            <g transform="translate(410, 70)">
              <circle r="30" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" stroke-width="2" />
              <text x="0" y="8" font-size="24" text-anchor="middle">🌱</text>
              <text x="0" y="55" font-size="11" fill="#cbd5e1">Growing</text>
            </g>

            <!-- Stats Row -->
            <g transform="translate(25, 150)">
              <text x="0" y="0" font-size="12" fill="#cbd5e1" text-anchor="start">Total Activity:</text>
              <text x="500" y="0" fill="#fbbf24" text-anchor="end" font-weight="bold">${totalActivity}</text>

              <text x="0" y="40" font-size="12" fill="#cbd5e1" text-anchor="start">Avg Commits/Day:</text>
              <text x="500" y="40" fill="#fbbf24" text-anchor="end" font-weight="bold">${Math.round(combined.commits / 365)}</text>

              <text x="0" y="80" font-size="12" fill="#cbd5e1" text-anchor="start">Total Followers:</text>
              <text x="500" y="80" fill="#fbbf24" text-anchor="end" font-weight="bold">${combined.followers}</text>

              <text x="0" y="120" font-size="12" fill="#cbd5e1" text-anchor="start">Productivity Score:</text>
              <text x="500" y="120" fill="#fbbf24" text-anchor="end" font-weight="bold">${(codeLevel > 75 ? '🌟 ELITE' : codeLevel > 50 ? '⚡ ADVANCED' : codeLevel > 25 ? '📈 SKILLED' : '🌱 LEARNING')}</text>
            </g>
          </g>
        </g>

      </svg>
    `;

    return new NextResponse(svg.trim(), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
