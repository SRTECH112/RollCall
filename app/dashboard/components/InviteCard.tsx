'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/src/contexts/AppContext';

export default function InviteCard() {
  const { performCheckIn, checkInStatus, loading } = useApp();

  const handleCheckIn = async () => {
    if (checkInStatus === 'available') {
      try {
        await performCheckIn();
      } catch (error) {
        console.error("Check-in failed", error);
      }
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    switch (checkInStatus) {
      case 'checked_in': return 'Checked In ✅';
      case 'early': return 'Check-in Opens Soon ⏳';
      case 'closed': return 'Check-in Closed 🔒';
      default: return 'Check In';
    }
  };

  const isAvailable = checkInStatus === 'available';
  const isCheckedIn = checkInStatus === 'checked_in';

  return (
    <div className="rounded-3xl border border-white/5 bg-dark-800/60 backdrop-blur-md p-8 relative overflow-hidden">
      {/* Glow Effect - Green for available, subtle for others */}
      {isAvailable && (
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
      )}
      
      <h3 className="text-xl font-bold text-white mb-3 relative z-10">Daily Check-In</h3>
      <p className="text-sm text-gray-300 mb-8 relative z-10">
        {isAvailable ? 'Check in now to maintain your streak and earn points!' : 'Invite your friends to join the class! Compete on the leaderboard and earn streak badges together.'}
      </p>

      <button
        onClick={handleCheckIn}
        disabled={checkInStatus !== 'available' || loading}
        className={`w-full py-5 rounded-2xl font-bold text-lg relative z-10 transition-all duration-300 shadow-2xl transform ${
          isAvailable
            ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.03] hover:shadow-green-500/50 border-2 border-green-400/50 animate-pulse' 
            : isCheckedIn
            ? 'bg-linear-to-r from-green-600/50 to-emerald-700/50 border-2 border-green-500/30 text-green-100'
            : 'bg-dark-700/50 border-2 border-dark-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          {isAvailable && <span className="text-2xl">✓</span>}
          {checkInStatus === 'available' ? 'CHECK IN NOW' : getButtonText().toUpperCase()}
        </span>
      </button>

      <p className="text-xs text-gray-400 text-center mt-4 relative z-10">
        {isAvailable ? '🔥 Don\'t break your streak!' : 'Check-in daily to maintain your streak!'}
      </p>
    </div>
  );
}
