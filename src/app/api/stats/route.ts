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

    // Massive 800x600 Animated SVG Dashboard
    const svg = `
      <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
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

          <!-- Glassmorphism Panels -->
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.03)" />
          </linearGradient>
          <linearGradient id="glass-grad-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
        </defs>

        <style>
          /* CSS animations are stripped by GitHub's image proxy, so we use native SVG <animate> */
        </style>

        <!-- Base Background -->
        <rect width="800" height="600" rx="20" fill="url(#bg-grad)" />
        
        <!-- Animated Background Orbs -->
        <g>
          <circle cx="200" cy="150" r="250" fill="url(#orb-blue)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 50,50; 0,0" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="600" cy="450" r="300" fill="url(#orb-purple)">
            <animateTransform attributeName="transform" type="translate" values="0,0; -60,-40; 0,0" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="400" cy="100" r="200" fill="url(#orb-pink)">
            <animateTransform attributeName="transform" type="translate" values="0,0; 40,-30; 0,0" dur="18s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- TITLE -->
        <g opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" fill="freeze" />
          <text x="400" y="60" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="32" fill="#ffffff">
            🚀 JAY'S DEVELOPER UNIVERSE 🚀
          </text>
          <text x="400" y="85" text-anchor="middle" font-family="'Segoe UI', Ubuntu, sans-serif" font-size="16" fill="#cbd5e1">
            Aggregated Data from Jay-Rajankar-VIIT &amp; JayRajankar
          </text>
        </g>

        <!-- PANEL 1: MASSIVE AGGREGATE STATS (Top Center) -->
        <g transform="translate(40, 120)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.3s" fill="freeze" />
          <rect width="720" height="160" rx="15" fill="url(#glass-grad-highlight)" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
          
          <g font-family="'Segoe UI', Ubuntu, sans-serif" fill="#ffffff" text-anchor="middle">
            <!-- Contributions -->
            <text x="90" y="55" font-size="16" fill="#cbd5e1" font-weight="600">Contributions</text>
            <text x="90" y="105" font-size="44" font-weight="bold" fill="#38bdf8">${combined.total}</text>
            <text x="90" y="130" font-size="14" fill="#94a3b8">(past year)</text>
            
            <!-- Commits -->
            <text x="270" y="55" font-size="16" fill="#cbd5e1" font-weight="600">Total Commits</text>
            <text x="270" y="105" font-size="44" font-weight="bold" fill="#a855f7">${combined.commits}</text>

            <!-- Stars -->
            <text x="450" y="55" font-size="16" fill="#cbd5e1" font-weight="600">Stars Earned</text>
            <text x="450" y="105" font-size="44" font-weight="bold" fill="#fde047">${combined.stars}</text>

            <!-- Followers -->
            <text x="630" y="55" font-size="16" fill="#cbd5e1" font-weight="600">Followers</text>
            <text x="630" y="105" font-size="44" font-weight="bold" fill="#ec4899">${combined.followers}</text>
          </g>
        </g>

        <!-- PANEL 2: TOP LANGUAGES (Bottom Left) -->
        <g transform="translate(40, 310)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.6s" fill="freeze" />
          <rect width="345" height="250" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="40" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="20" fill="#ffffff">
            🔥 Top Languages
          </text>
          
          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#cbd5e1" font-weight="600">
            ${topLangs.map((lang, i) => `
              <g transform="translate(25, ${75 + i * 35})">
                <text x="0" y="12">${lang.name}</text>
                <text x="295" y="12" text-anchor="end">${Math.round((lang.count / totalLangRepos) * 100)}%</text>
                <rect x="0" y="20" width="295" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                <rect x="0" y="20" width="0" height="6" rx="3" fill="${lang.color}">
                  <animate attributeName="width" from="0" to="${(lang.count / totalLangRepos) * 295}" dur="1.5s" fill="freeze" />
                </rect>
              </g>
            `).join('')}
          </g>
        </g>

        <!-- PANEL 3: ACCOUNT SPLIT (Bottom Right) -->
        <g transform="translate(415, 310)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0.9s" fill="freeze" />
          <rect width="345" height="250" rx="15" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
          
          <text x="25" y="40" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="20" fill="#ffffff">
            📊 Account Breakdown
          </text>

          <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" font-weight="600">
            <!-- Account 1 -->
            <text x="25" y="80" fill="#a78bfa" font-size="16" font-weight="bold">@Jay-Rajankar-VIIT</text>
            <text x="25" y="110" fill="#cbd5e1">Public &amp; Private Repos:</text>
            <text x="315" y="110" fill="#ffffff" text-anchor="end">${stats1.repos}</text>
            <text x="25" y="135" fill="#cbd5e1">PRs &amp; Issues:</text>
            <text x="315" y="135" fill="#ffffff" text-anchor="end">${stats1.prs + stats1.issues}</text>

            <rect x="25" y="165" width="290" height="1" fill="rgba(255,255,255,0.1)" />

            <!-- Account 2 -->
            <text x="25" y="200" fill="#38bdf8" font-size="16" font-weight="bold">@JayRajankar</text>
            <text x="25" y="230" fill="#cbd5e1">Public &amp; Private Repos:</text>
            <text x="315" y="230" fill="#ffffff" text-anchor="end">${stats2.repos}</text>
            <text x="25" y="255" fill="#cbd5e1">PRs &amp; Issues:</text>
            <text x="315" y="255" fill="#ffffff" text-anchor="end">${stats2.prs + stats2.issues}</text>
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
