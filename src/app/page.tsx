export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <main className="flex flex-col items-center gap-8 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            📊 GitHub Stats Card
          </h1>
          <p className="text-xl text-slate-300">
            Beautiful, animated developer statistics dashboard
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-slate-800/40 backdrop-blur border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="/api/stats"
            alt="GitHub Stats Card"
            className="w-full h-auto"
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full mt-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-3">✨ Features</h3>
            <ul className="space-y-2 text-slate-300">
              <li>✅ Real-time GitHub data aggregation</li>
              <li>✅ Animated contribution heatmap</li>
              <li>✅ Language usage breakdown</li>
              <li>✅ Gamified &quot;Code Level&quot; meter</li>
              <li>✅ Achievement badges system</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-3">🎮 Game Elements</h3>
            <ul className="space-y-2 text-slate-300">
              <li>🎯 Code Level (0-100) progression</li>
              <li>⭐ Star Gazer achievement</li>
              <li>🔥 On Fire badge</li>
              <li>💻 Code Master status</li>
              <li>🌱 Growth tracking</li>
            </ul>
          </div>
        </div>

        {/* Embed Instructions */}
        <div className="bg-slate-800/60 border border-white/10 rounded-lg p-6 w-full">
          <h3 className="text-xl font-bold text-white mb-4">📌 Embed This Card</h3>
          <div className="bg-slate-900/50 rounded p-4 overflow-x-auto">
            <code className="text-emerald-400 text-sm">
              {`![GitHub Stats](<your-domain>/api/stats)`}
            </code>
          </div>
          <p className="text-slate-300 text-sm mt-3">
            Add this to your GitHub profile README to display your stats card!
          </p>
        </div>
      </main>
    </div>
  );
}
