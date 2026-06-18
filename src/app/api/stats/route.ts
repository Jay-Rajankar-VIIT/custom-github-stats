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
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
          nodes { stargazers { totalCount } }
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

    // Fetch both accounts securely using their respective private tokens
    const [user1Data, user2Data] = await Promise.all([
      fetchStats("Jay-Rajankar-VIIT", token1),
      fetchStats("JayRajankar", token2)
    ]);

    const calculateStats = (user: any) => {
      if (!user) return { commits: 0, prs: 0, issues: 0, total: 0, stars: 0 };
      const contribs = user.contributionsCollection;
      const repos = user.repositories.nodes;
      const stars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers.totalCount, 0);
      return {
        commits: contribs.totalCommitContributions || 0,
        prs: contribs.totalPullRequestContributions || 0,
        issues: contribs.totalIssueContributions || 0,
        total: contribs.contributionCalendar.totalContributions || 0,
        stars
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
    };

    // Advanced Glassmorphism SVG Dashboard
    const svg = `
      <svg width="500" height="420" viewBox="0 0 500 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e1b4b" />
          </linearGradient>
          <!-- Orbs for fake glass effect underneath -->
          <radialGradient id="orb1" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb2" cx="80%" cy="80%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb3" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
          </radialGradient>
          <!-- Glass -->
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.03)" />
          </linearGradient>
          <linearGradient id="glass-divider" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="500" height="420" rx="15" fill="url(#bg-grad)" />
        
        <!-- Background Orbs -->
        <circle cx="80" cy="80" r="120" fill="url(#orb1)" />
        <circle cx="420" cy="150" r="140" fill="url(#orb2)" />
        <circle cx="250" cy="380" r="150" fill="url(#orb3)" />

        <!-- Glassmorphism Card (overlay) -->
        <rect x="15" y="15" width="470" height="390" rx="10" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />

        <!-- Text Content -->
        <g font-family="'Segoe UI', Ubuntu, sans-serif">
          
          <!-- Aggregate Section -->
          <text x="35" y="55" font-weight="bold" font-size="22" fill="#ffffff">🚀 Total Aggregate Stats</text>
          
          <g font-size="14" fill="#cbd5e1" font-weight="600">
            <text x="35" y="90">Total Contributions:</text>
            <text x="180" y="90" fill="#ffffff" font-weight="bold">${combined.total}</text>
            <text x="35" y="115">Total Commits:</text>
            <text x="180" y="115" fill="#ffffff" font-weight="bold">${combined.commits}</text>
            
            <text x="270" y="90">Total PRs &amp; Issues:</text>
            <text x="405" y="90" fill="#ffffff" font-weight="bold">${combined.prs + combined.issues}</text>
            <text x="270" y="115">Total Stars:</text>
            <text x="405" y="115" fill="#fde047" font-weight="bold">${combined.stars}</text>
          </g>

          <!-- Divider -->
          <rect x="35" y="135" width="430" height="1" fill="url(#glass-divider)" />

          <!-- Jay-Rajankar-VIIT Section -->
          <text x="35" y="165" font-weight="bold" font-size="18" fill="#a78bfa">Jay-Rajankar-VIIT</text>
          <g font-size="13" fill="#94a3b8" font-weight="600">
            <text x="35" y="195">Contributions:</text>
            <text x="140" y="195" fill="#f8fafc" font-weight="bold">${stats1.total}</text>
            <text x="35" y="220">Commits:</text>
            <text x="140" y="220" fill="#f8fafc" font-weight="bold">${stats1.commits}</text>
            
            <text x="270" y="195">PRs &amp; Issues:</text>
            <text x="375" y="195" fill="#f8fafc" font-weight="bold">${stats1.prs + stats1.issues}</text>
            <text x="270" y="220">Stars:</text>
            <text x="375" y="220" fill="#fde047" font-weight="bold">${stats1.stars}</text>
          </g>

          <!-- Divider -->
          <rect x="35" y="245" width="430" height="1" fill="url(#glass-divider)" />

          <!-- JayRajankar Section -->
          <text x="35" y="275" font-weight="bold" font-size="18" fill="#38bdf8">JayRajankar</text>
          <g font-size="13" fill="#94a3b8" font-weight="600">
            <text x="35" y="305">Contributions:</text>
            <text x="140" y="305" fill="#f8fafc" font-weight="bold">${stats2.total}</text>
            <text x="35" y="330">Commits:</text>
            <text x="140" y="330" fill="#f8fafc" font-weight="bold">${stats2.commits}</text>
            
            <text x="270" y="305">PRs &amp; Issues:</text>
            <text x="375" y="305" fill="#f8fafc" font-weight="bold">${stats2.prs + stats2.issues}</text>
            <text x="270" y="330">Stars:</text>
            <text x="375" y="330" fill="#fde047" font-weight="bold">${stats2.stars}</text>
          </g>

          <!-- Footer/Brand -->
          <text x="35" y="375" font-size="12" fill="#64748b" font-weight="600" font-style="italic">
            Custom built &amp; dynamically updating via Vercel
          </text>
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
