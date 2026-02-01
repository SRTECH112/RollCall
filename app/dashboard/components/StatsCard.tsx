'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApp } from '@/src/contexts/AppContext';

export default function StatsCard() {
  const { userProfile } = useAuth();
  const { todayAttendanceCount, classStats } = useApp();

  return (
    <div className="rounded-3xl border border-white/5 bg-dark-800/60 backdrop-blur-md p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">My Attendance Score</h3>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl border border-dark-600">
          <span className="text-sm text-dark-text-secondary">Present</span>
          <span className="text-2xl font-bold text-white">{classStats?.totalDaysPresent || 0}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl border border-dark-600">
          <span className="text-sm text-dark-text-secondary">Streak</span>
          <span className="text-2xl font-bold text-primary-500">{classStats?.currentStreak || 0} 🔥</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl border border-dark-600">
          <span className="text-sm text-dark-text-secondary">Today</span>
          <span className="text-2xl font-bold text-nexblue-500">{todayAttendanceCount || 0} ✓</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary-900/20 border border-primary-500/30 rounded-xl">
        <p className="text-xs text-gray-300 text-center">
          Consistent attendance unlocks exclusive badges and higher leaderboard rankings!
        </p>
      </div>
    </div>
  );
}
