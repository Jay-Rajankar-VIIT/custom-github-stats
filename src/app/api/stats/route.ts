import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new NextResponse('GITHUB_TOKEN not found. Please set it in Vercel.', { status: 500 });
  }

  const query = `
    query {
      user1: user(login: "Jay-Rajankar-VIIT") {
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
      user2: user(login: "JayRajankar") {
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
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 } // Cache for 1 hour to avoid hitting API limits
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    
    // Process Data
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

    const stats1 = calculateStats(data?.data?.user1);
    const stats2 = calculateStats(data?.data?.user2);

    const combined = {
      stars: stats1.stars + stats2.stars,
      commits: stats1.commits + stats2.commits,
      prs: stats1.prs + stats2.prs,
      issues: stats1.issues + stats2.issues,
      total: stats1.total + stats2.total,
    };

    // Glassmorphism SVG (compatible with GitHub Readme <img> tags)
    const svg = `
      <svg width="495" height="195" viewBox="0 0 495 195" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#1e1b4b" />
          </linearGradient>
          <!-- Orbs for fake glass effect underneath -->
          <radialGradient id="orb1" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="orb2" cx="80%" cy="80%" r="50%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
          </radialGradient>
          <!-- Glass -->
          <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.12)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.03)" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="495" height="195" rx="15" fill="url(#bg-grad)" />
        
        <!-- Background Orbs -->
        <circle cx="70" cy="50" r="100" fill="url(#orb1)" />
        <circle cx="420" cy="150" r="120" fill="url(#orb2)" />

        <!-- Glassmorphism Card (overlay) -->
        <rect x="15" y="15" width="465" height="165" rx="10" fill="url(#glass-grad)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />

        <!-- Title -->
        <text x="35" y="55" font-family="'Segoe UI', Ubuntu, sans-serif" font-weight="bold" font-size="22" fill="#ffffff">
          🚀 Jay's Combined Stats
        </text>

        <!-- Stats -->
        <g font-family="'Segoe UI', Ubuntu, sans-serif" font-size="14" fill="#cbd5e1" font-weight="600">
          <text x="35" y="100">Total Contributions:</text>
          <text x="180" y="100" fill="#ffffff" font-weight="bold">${combined.total}</text>

          <text x="35" y="130">Total Commits:</text>
          <text x="180" y="130" fill="#ffffff" font-weight="bold">${combined.commits}</text>

          <text x="35" y="160">Total PRs &amp; Issues:</text>
          <text x="180" y="160" fill="#ffffff" font-weight="bold">${combined.prs + combined.issues}</text>

          <text x="270" y="100">Total Stars:</text>
          <text x="360" y="100" fill="#fde047" font-weight="bold">${combined.stars}</text>

          <text x="270" y="130">Accounts:</text>
          <text x="360" y="130" fill="#ffffff" font-weight="bold">Jay-Rajankar-VIIT</text>
          <text x="360" y="150" fill="#ffffff" font-weight="bold">&amp; JayRajankar</text>
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
