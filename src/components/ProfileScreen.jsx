'use client';

import React, { useState } from 'react';
import { User, Calendar, Award, TrendingUp, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { BadgeConfig } from '../lib/models';
import { formatDate, getRandomEmoji } from '../lib/utils';
import { motion } from 'framer-motion';

const ProfileScreen = ({ onBack }) => {
  const { userProfile, updateProfile } = useAuth();
  const { todayAttendance } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: userProfile?.nickname || '',
    emoji: userProfile?.emoji || '😊'
  });

  const handleSave = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      nickname: userProfile?.nickname || '',
      emoji: userProfile?.emoji || '😊'
    });
    setIsEditing(false);
  };

  const emojiOptions = ['😊', '🎉', '🚀', '⭐', '🔥', '💪', '🎯', '🏆', '🌟', '✨', '🎊', '🙌'];

  const stats = [
    {
      icon: Calendar,
      label: 'Total Days Present',
      value: userProfile?.totalDaysPresent || 0,
      color: 'text-nexblue-400',
      bgColor: 'bg-nexblue-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: userProfile?.currentStreak || 0,
      color: 'text-primary-400',
      bgColor: 'bg-primary-900/20',
      suffix: userProfile?.currentStreak > 0 ? '🔥' : ''
    },
    {
      icon: Award,
      label: 'Best Streak',
      value: userProfile?.longestStreak || 0,
      color: 'text-accent-400',
      bgColor: 'bg-accent-900/20'
    },
    {
      icon: TrendingUp,
      label: 'On Time Count',
      value: userProfile?.onTimeCount || 0,
      color: 'text-warning-400',
      bgColor: 'bg-warning-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-950 pb-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950">
      {/* Header */}
      <div className="bg-dark-950/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 text-dark-text-secondary hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 transition-colors ${isEditing ? 'text-nexblue-400' : 'text-dark-text-secondary hover:text-white'}`}
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-b from-nexblue-900/10 to-transparent pointer-events-none" />
          <div className="text-center py-8 px-4 relative z-10">
            {isEditing ? (
              <div className="space-y-6">
                {/* Emoji Selection */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-3">
                    Choose Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditData(prev => ({ ...prev, emoji }))}
                        className={`text-2xl p-2 rounded-xl border transition-all ${
                          editData.emoji === emoji
                            ? 'border-nexblue-500 bg-nexblue-900/30'
                            : 'border-dark-700 hover:border-dark-600 bg-dark-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nickname Input */}
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={editData.nickname}
                    onChange={(e) => setEditData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white text-center focus:ring-2 focus:ring-nexblue-500 focus:border-transparent outline-none transition-all placeholder-dark-text-muted"
                    maxLength={20}
                    placeholder="Enter nickname"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center pt-2">
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl bg-nexblue-600 text-white font-medium hover:bg-nexblue-500 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 mx-auto bg-dark-700 rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-dark-800"
                >
                  {userProfile?.emoji}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{userProfile?.nickname}</h2>
                  <div className="text-sm text-dark-text-secondary flex items-center justify-center gap-2">
                    <span>Joined {formatDate(userProfile?.joinDate)}</span>
                    <span>•</span>
                    <span className="bg-dark-700 px-2 py-0.5 rounded text-xs text-white">{userProfile?.classCode}</span>
                  </div>
                </div>
                
                {todayAttendance && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                    todayAttendance.status === 'on_time' 
                      ? 'bg-primary-900/30 text-primary-400 border-primary-800' 
                      : 'bg-warning-900/30 text-warning-400 border-warning-800'
                  }`}>
                    {todayAttendance.status === 'on_time' ? '✅ Present (On Time)' : '⏰ Present (Late)'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ icon: Icon, label, value, color, bgColor, suffix }) => (
            <div key={label} className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-dark-800 transition-colors">
              <div className={`p-2.5 rounded-xl ${bgColor} mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-1 mb-1">
                {value}
                {suffix && <span className="text-lg">{suffix}</span>}
              </div>
              <div className="text-xs text-dark-text-secondary">{label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {userProfile?.badges && userProfile.badges.length > 0 && (
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-accent-400" />
              <h3 className="font-bold text-white">Achievement Badges</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {userProfile.badges.map((badgeType) => {
                const badge = BadgeConfig[badgeType];
                if (!badge) return null;
                return (
                  <div
                    key={badgeType}
                    className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl border border-dark-700"
                  >
                    <span className="text-3xl">{badge.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">
                        {badge.name}
                      </div>
                      <div className="text-xs text-dark-text-secondary">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Streak Info */}
        {userProfile?.currentStreak > 0 && (
          <div className="bg-linear-to-r from-orange-900/20 to-red-900/20 border border-orange-900/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2 animate-pulse">🔥</div>
            <h3 className="font-bold text-white text-lg mb-1">
              {userProfile.currentStreak} Day Streak!
            </h3>
            <p className="text-sm text-dark-text-secondary">
              Keep it up! You're on fire!
            </p>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-linear-to-r from-nexblue-900/20 to-primary-900/20 border border-nexblue-900/30 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-white mb-1">
              Keep building great habits!
            </h3>
            <p className="text-sm text-dark-text-secondary">
              Every day you show up, you're investing in your future
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
