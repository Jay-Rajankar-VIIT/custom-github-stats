'use client';

import React from 'react';

export default function SetupPage() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto pt-20">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-12">
          <h1 className="text-4xl font-bold text-white mb-6">GitHub Stats Setup</h1>
          
          <div className="space-y-8">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Step 1: Create GitHub Personal Access Tokens</h2>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">GitHub Settings → Developer settings → Personal access tokens</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Click "Generate new token"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Give it a name (e.g., "Jay's Stats Token")</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Select scopes: <code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">public_repo</code>, <code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">read:user</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>Generate and copy the token</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-bold">6.</span>
                  <span>Repeat steps 2-5 to create a second token</span>
                </li>
              </ol>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-4">Step 2: Add Environment Variables</h2>
              <p className="text-slate-300 mb-4">Click the settings button (⚙️) in the top right of v0 and go to <span className="font-bold">Vars</span></p>
              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded p-4">
                  <p className="text-slate-400 text-sm mb-2">Add these two environment variables:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-emerald-400 font-mono text-sm">GITHUB_TOKEN_1</p>
                      <p className="text-slate-500 text-sm">(paste your first token here)</p>
                    </div>
                    <div>
                      <p className="text-emerald-400 font-mono text-sm">GITHUB_TOKEN_2</p>
                      <p className="text-slate-500 text-sm">(paste your second token here)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4">Step 3: Configure Usernames</h2>
              <p className="text-slate-300 mb-4">The stats dashboard is configured to track:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-green-400">•</span>
                  <span><code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">Jay-Rajankar-VIIT</code> (for GITHUB_TOKEN_1)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400">•</span>
                  <span><code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">JayRajankar</code> (for GITHUB_TOKEN_2)</span>
                </li>
              </ul>
              <p className="text-slate-400 text-sm mt-4">To change these, edit the API route at <code className="bg-slate-900 px-2 py-1 rounded text-emerald-400">src/app/api/stats/route.ts</code></p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-6">
              <p className="text-slate-300 mb-4">After adding the environment variables:</p>
              <button
                onClick={handleGoHome}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all w-full"
              >
                Go Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
