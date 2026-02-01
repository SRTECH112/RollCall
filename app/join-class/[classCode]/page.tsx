'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Clock, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import { getClassByCode } from '@/src/services/firestore';
import { updateUserProfile } from '@/src/services/firestore';

interface ClassData {
  id: string;
  classCode: string;
  name: string;
  checkInStartTime: string;
  gracePeriodMinutes: number;
  active: boolean;
}

export default function JoinClass() {
  const router = useRouter();
  const params = useParams();
  const classCode = params.classCode as string;
  const { user, userProfile, updateProfile } = useAuth();
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClassData();
  }, [classCode]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      const data = await getClassByCode(classCode.toUpperCase());
      
      if (!data) {
        setError('Class not found');
        return;
      }

      setClassData({
        id: data.id,
        classCode: data.classCode,
        name: data.name || data.classCode,
        checkInStartTime: data.checkInStartTime,
        gracePeriodMinutes: data.gracePeriodMinutes,
        active: data.active
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load class');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!user || !userProfile || !classData) {
      setError('You must be logged in to join a class');
      return;
    }

    try {
      setJoining(true);
      setError('');

      // Update user profile with new class code
      await updateUserProfile(user.uid, {
        classCode: classData.classCode
      });

      // Update local profile state
      await updateProfile({
        classCode: classData.classCode
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to join class');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-dark-text-secondary mt-4">Loading class...</p>
        </div>
      </div>
    );
  }

  if (error && !classData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link 
          href="/classes"
          className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Classes
        </Link>

        <div className="bg-dark-800/60 backdrop-blur-md border border-dark-600 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-red-900/30 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Class Not Found</h2>
          <p className="text-dark-text-secondary mb-6">{error}</p>
          <Link
            href="/classes"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors"
          >
            Browse Other Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link 
        href="/classes"
        className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classes
      </Link>

      {/* Class Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800/60 backdrop-blur-md border border-dark-600 rounded-3xl p-8 space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-900/30 border border-primary-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{classData?.name}</h1>
          <div className="inline-block px-4 py-2 bg-dark-700 border border-dark-600 rounded-xl">
            <span className="text-gray-300 font-mono text-lg">{classData?.classCode}</span>
          </div>
        </div>

        {/* Class Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-700/50 border border-dark-600 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-xs text-dark-text-muted mb-1">Check-in Time</p>
            <p className="text-white font-semibold">{classData?.checkInStartTime}</p>
          </div>
          <div className="bg-dark-700/50 border border-dark-600 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-xs text-dark-text-muted mb-1">Grace Period</p>
            <p className="text-white font-semibold">{classData?.gracePeriodMinutes} min</p>
          </div>
          <div className="bg-dark-700/50 border border-dark-600 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-dark-text-muted mb-1">Status</p>
            <p className="text-green-400 font-semibold">Active</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-primary-900/20 border border-primary-500/30 rounded-xl p-4">
          <p className="text-sm text-gray-300 text-center">
            <Users className="w-4 h-4 inline mr-2" />
            By joining this class, you'll be able to check in daily, compete on the leaderboard, and earn streak badges!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/classes"
            className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleJoinClass}
            disabled={joining || !user}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? 'Joining...' : 'Join Class'}
          </button>
        </div>

        {!user && (
          <p className="text-sm text-dark-text-secondary text-center">
            Please <Link href="/" className="text-primary-500 hover:underline">sign in</Link> to join this class
          </p>
        )}
      </motion.div>
    </div>
  );
}
