'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import Podium from './Podium';

const Leaderboard = () => {
  const { leaderboard, refreshLeaderboard, loading, leaderboardSort } = useApp();

  const sortOptions = [
    { key: 'totalDaysPresent', label: 'Total', icon: Calendar },
    { key: 'longestStreak', label: 'Best', icon: TrendingUp },
    { key: 'currentStreak', label: 'Current', icon: Award }
  ];

  const handleSortChange = (newSort) => {
    refreshLeaderboard(newSort);
  };

  const getStatValue = (user, stat) => {
    switch (stat) {
      case 'totalDaysPresent': return user.totalDaysPresent || 0;
      case 'longestStreak': return user.longestStreak || 0;
      case 'onTimeCount': return user.onTimeCount || 0;
      case 'currentStreak': return user.currentStreak || 0;
      default: return 0;
    }
  };

  // Split top 3 and the rest
  const topUsers = leaderboard.slice(0, 3);
  const restUsers = leaderboard.slice(3);

  return (
    <div className="w-full pb-24">
      {/* Filter/Sort Toggle */}
      <div className="flex justify-center mb-10">
        <div className="flex bg-dark-800 p-1 rounded-full border border-dark-600 shadow-lg relative z-20">
            {sortOptions.map((option) => (
                <button
                    key={option.key}
                    onClick={() => handleSortChange(option.key)}
                    className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                        leaderboardSort === option.key 
                        ? 'bg-dark-600 text-white shadow-md' 
                        : 'text-dark-text-secondary hover:text-white'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <option.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        {option.label}
                    </div>
                </button>
            ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
            <motion.div 
                key="loading"
                className="flex justify-center py-20"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="w-10 h-10 border-4 border-nexblue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
        ) : leaderboard.length === 0 ? (
             <motion.div 
                key="empty"
                className="text-center text-dark-text-secondary py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
             >
                No data available yet
             </motion.div>
        ) : (
            <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Podium for Top 3 */}
                <div className="mb-8">
                    <Podium topUsers={topUsers} scoreKey={leaderboardSort} />
                </div>

                {/* List for the rest */}
                {restUsers.length > 0 && (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex text-xs text-dark-text-muted uppercase tracking-wider px-4 sm:px-6 mb-3 font-medium">
                            <div className="w-12">Rank</div>
                            <div className="flex-1">Student</div>
                            <div className="w-24 text-right">Score</div>
                        </div>
                        
                        <div className="space-y-3">
                            {restUsers.map((user, index) => {
                                const rank = index + 4;
                                const score = getStatValue(user, leaderboardSort);
                                
                                return (
                                    <motion.div 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center px-4 sm:px-6 py-4 bg-dark-800/40 backdrop-blur-md border border-dark-600/50 rounded-xl hover:bg-dark-700/60 transition-colors group"
                                    >
                                        <div className="w-12 font-bold text-dark-text-secondary group-hover:text-white transition-colors">
                                            {rank}
                                        </div>
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark-700 flex items-center justify-center text-lg shadow-sm border border-dark-600">
                                                {user.emoji || '👤'}
                                            </div>
                                            <span className="font-medium text-white text-sm sm:text-base">{user.nickname}</span>
                                        </div>
                                        <div className="w-24 text-right font-bold text-white tabular-nums">
                                            {score.toLocaleString()}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
