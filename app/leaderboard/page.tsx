'use client';

import React from 'react';
import Leaderboard from '@/src/components/Leaderboard';
import TopNav from '../dashboard/components/TopNav';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-dark-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 text-white selection:bg-accent-500/30">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        <TopNav />
        <main>
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          </div>
          <div className="bg-dark-800/40 backdrop-blur-md rounded-3xl border border-white/5 p-6">
            <Leaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}
