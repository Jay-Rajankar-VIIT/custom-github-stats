'use client';

import { useEffect, useState } from 'react';

interface GitHubData {
  combined: any;
  stats1: any;
  stats2: any;
  topLangs: any[];
  user1Data: any;
  user2Data: any;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = 'github_stats_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useGitHubData() {
  const [data, setData] = useState<GitHubData>({
    combined: null,
    stats1: null,
    stats2: null,
    topLangs: [],
    user1Data: null,
    user2Data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data: cachedData } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setData({ ...cachedData, loading: false });
            return;
          }
        }

        // Fetch fresh data from our API
        const response = await fetch('/api/stats');
        
        // The response is SVG, but we need JSON data
        // We'll need to modify the API to also provide JSON
        // For now, fetch the stats page metadata
        const statsResponse = await fetch('/api/stats?format=json');
        const statsData = await statsResponse.json();

        // Cache the data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: statsData,
          })
        );

        setData({ ...statsData, loading: false });
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch data',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
