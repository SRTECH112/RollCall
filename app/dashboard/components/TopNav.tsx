'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNav() {
  const { userProfile, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 relative z-50">
      {/* Left: Logo & Mobile Menu */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-lg shadow-glow-primary">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RollCall+ By Marvin Villaluz</span>
        </Link>
        <button className="md:hidden p-2 text-dark-text-secondary hover:text-white" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-1 bg-dark-800/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-dark-600/50">
        <Link href="/dashboard" className="px-4 py-1.5 text-sm font-medium text-dark-text-secondary hover:text-white transition-colors rounded-full hover:bg-dark-700">
          Dashboard
        </Link>
        
        <Link href="/classes" className="px-4 py-1.5 text-sm font-medium text-dark-text-secondary hover:text-white transition-colors rounded-full hover:bg-dark-700">
          Browse Classes
        </Link>

        <Link href="/leaderboard" className="px-4 py-1.5 text-sm font-medium text-dark-text-secondary hover:text-white transition-colors rounded-full hover:bg-dark-700">
          Leaderboard
        </Link>

        <Link href="/create-class" className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors rounded-full">
          + Create Class
        </Link>
      </div>

      {/* Right: Search & Profile */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-dark-text-muted group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            className="block w-48 lg:w-64 pl-10 pr-3 py-2 border border-dark-600 rounded-full leading-5 bg-dark-800 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:bg-dark-700 focus:border-primary-500/50 transition-all duration-200 text-sm"
            placeholder="Search Classmates"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-dark-text-muted text-xs bg-dark-700 px-1.5 py-0.5 rounded border border-dark-600">/</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
           <div className="relative">
             <button 
               onClick={() => setShowDropdown(!showDropdown)}
               className="flex items-center gap-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-full pl-1.5 pr-4 py-1.5 cursor-pointer transition-all duration-200 group"
             >
                <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center border border-dark-500 text-lg shadow-inner">
                  {userProfile?.emoji || '👤'}
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors">
                      {userProfile?.nickname || 'User'}
                   </span>
                   <span className="text-[10px] text-dark-text-secondary">
                      {userProfile?.classCode || 'No Class'}
                   </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-dark-text-muted group-hover:text-white ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
             </button>

             <AnimatePresence>
               {showDropdown && (
                 <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.2 }}
                   className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-600 rounded-2xl shadow-xl overflow-hidden z-50"
                 >
                   <div className="p-2">
                     <Link 
                       href="/profile"
                       onClick={() => setShowDropdown(false)}
                       className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark-700 transition-colors group"
                     >
                       <UserIcon className="w-4 h-4 text-dark-text-secondary group-hover:text-primary-500" />
                       <span className="text-sm text-white">View Profile</span>
                     </Link>
                     
                     <button
                       onClick={handleSignOut}
                       className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/20 transition-colors group"
                     >
                       <LogOut className="w-4 h-4 text-dark-text-secondary group-hover:text-red-500" />
                       <span className="text-sm text-white group-hover:text-red-400">Sign Out</span>
                     </button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <button className="w-10 h-10 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center text-dark-text-secondary hover:text-white hover:border-dark-500 transition-all" aria-label="Notifications">
             <Bell className="w-5 h-5" />
           </button>
        </div>
      </div>
    </nav>
  );
}
