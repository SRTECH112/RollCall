'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Box, Activity, Layers } from 'lucide-react';
import PointsCard from './components/PointsCard';
import StatsCard from './components/StatsCard';
import InviteCard from './components/InviteCard';
import LeaderboardTable from './components/LeaderboardTable';
import { useApp } from '@/src/contexts/AppContext';

export default function Dashboard() {
  const { leaderboard, streakLeaderboard } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Attendance
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary-600 text-white font-medium shadow-lg shadow-primary-900/20 whitespace-nowrap">
            <Box className="w-4 h-4" />
            Dashboard
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-dark-800 border border-white/5 text-gray-400 hover:text-white hover:bg-dark-700 transition-all whitespace-nowrap">
            <span className="text-lg">�</span>
            Schedule
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-dark-800 border border-white/5 text-gray-400 hover:text-white hover:bg-dark-700 transition-all whitespace-nowrap">
            <span className="text-lg">🏆</span>
            Rankings
        </button>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: How to Earn Points (Cards) */}
        <div className="lg:col-span-8 bg-dark-800/20 rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">R</div>
                    <h2 className="text-xl font-bold text-white">How to Win</h2>
                </div>
                <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 hover:text-white transition-all flex items-center gap-2">
                    Game Rules <ExternalLinkIcon />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <PointsCard 
                    title="Daily Check-in"
                    description="Check in on time every day to earn points and maintain your streak. Consistency is key!"
                    badge="+10 PTS"
                    icon={<Box className="w-6 h-6" />}
                    gradient="from-green-500 to-emerald-500"
                />
                <PointsCard 
                    title="Streak Bonuses"
                    description="Build a 7-day or 10-day streak to unlock massive point multipliers and rare badges."
                    badge="MULTIPLIER"
                    icon={<Activity className="w-6 h-6" />}
                    gradient="from-orange-500 to-red-500"
                />
                <PointsCard 
                    title="Top the Board"
                    description="Compete with your classmates for the top spot. The most consistent students win prizes!"
                    badge="PRIZES"
                    icon={<Layers className="w-6 h-6" />}
                    gradient="from-blue-500 to-indigo-500"
                />
            </div>
        </div>

        {/* Right: Stats & Invite */}
        <div className="lg:col-span-4 space-y-4">
             <StatsCard />
             <InviteCard />
        </div>
      </div>

      {/* Bottom: Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardTable 
             title="Class Leaderboard" 
             data={leaderboard.slice(0, 5)} 
             type="users"
          />
          <LeaderboardTable 
             title="Top Streaks" 
             data={streakLeaderboard.slice(0, 5).map((user: any) => ({
               ...user,
               score: user.currentStreak
             }))}
             type="users"
          />
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
    )
}
