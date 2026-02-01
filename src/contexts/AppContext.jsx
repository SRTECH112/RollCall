'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { auth } from '../lib/firebase';
import { 
  getClassByCode, 
  getTodayAttendance, 
  checkInUser, 
  getLeaderboard,
  subscribeToLeaderboard,
  subscribeToTodayAttendance 
} from '../services/firestore';
import { getClassSpecificStats } from '../services/statsService';
import { 
  isWithinCheckInWindow, 
  isBeforeCheckInWindow, 
  isAfterCheckInWindow,
  generateDeviceHash,
  getTodayString 
} from '../lib/utils';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { userProfile, updateProfile } = useAuth();
  
  // App state
  const [classInfo, setClassInfo] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakLeaderboard, setStreakLeaderboard] = useState([]);
  const [leaderboardSort, setLeaderboardSort] = useState('totalDaysPresent');
  const [todayAttendanceCount, setTodayAttendanceCount] = useState(0);
  const [checkInStatus, setCheckInStatus] = useState('loading'); // loading, available, checked_in, closed, early
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classStats, setClassStats] = useState({
    totalDaysPresent: 0,
    currentStreak: 0,
    longestStreak: 0,
    onTimeCount: 0
  });

  // Load class info when user profile is available
  useEffect(() => {
    if (userProfile?.classCode) {
      loadClassInfo(userProfile.classCode);
    }
  }, [userProfile?.classCode]);

  // Load class-specific stats when user or class changes
  useEffect(() => {
    const loadClassStats = async () => {
      if (userProfile?.firebaseUid && userProfile?.classCode) {
        const stats = await getClassSpecificStats(userProfile.firebaseUid, userProfile.classCode);
        setClassStats(stats);
      }
    };
    loadClassStats();
  }, [userProfile?.firebaseUid, userProfile?.classCode]);

  // Check attendance status when class info changes
  useEffect(() => {
    if (classInfo && userProfile) {
      checkAttendanceStatus();
      
      // Set up an interval to re-check status every minute
      // This handles the transition from "early" to "available" to "closed"
      const intervalId = setInterval(() => {
        if (checkInStatus !== 'checked_in') {
          checkAttendanceStatus(false); // false = don't fetch from DB, just check time
        }
      }, 60000); // 1 minute
      
      return () => clearInterval(intervalId);
    }
  }, [classInfo, userProfile, checkInStatus]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userProfile?.classCode) return;

    const unsubscribeLeaderboard = subscribeToLeaderboard(
      userProfile.classCode,
      leaderboardSort,
      setLeaderboard
    );

    const unsubscribeStreakLeaderboard = subscribeToLeaderboard(
      userProfile.classCode,
      'currentStreak',
      setStreakLeaderboard
    );

    const unsubscribeTodayAttendance = subscribeToTodayAttendance(
      userProfile.classCode,
      (attendance) => {
        setTodayAttendanceCount(attendance.length);
      }
    );

    return () => {
      unsubscribeLeaderboard();
      unsubscribeStreakLeaderboard();
      unsubscribeTodayAttendance();
    };
  }, [userProfile?.classCode, leaderboardSort]);

  const loadClassInfo = async (classCode) => {
    try {
      setLoading(true);
      const info = await getClassByCode(classCode);
      if (info) {
        setClassInfo(info);
      } else {
        console.error("Class not found for code:", classCode);
        setCheckInStatus('closed'); // Or some error state
        // We could also set an error message to display
        setError("Class not found. Please check your class code.");
      }
    } catch (err) {
      setError(err.message);
      setCheckInStatus('closed');
    } finally {
      setLoading(false);
    }
  };

  const checkAttendanceStatus = async (fetchDb = true) => {
    try {
      if (!userProfile || !classInfo) return;

      // Use firebaseUid as the user ID (this is the document ID in Firestore)
      // Fallback to auth.currentUser.uid if not in profile
      const userId = userProfile.firebaseUid || userProfile.id || auth.currentUser?.uid;
      if (!userId) {
        // Silently return if no user ID - profile might still be loading
        return;
      }

      // Check if already checked in today for THIS class
      if (fetchDb) {
        const attendance = await getTodayAttendance(userId, null, userProfile.classCode);
        setTodayAttendance(attendance);

        if (attendance) {
          setCheckInStatus('checked_in');
          return;
        }
      } else if (todayAttendance) {
        // If we already have attendance in state, we are checked in
        setCheckInStatus('checked_in');
        return;
      }

      // Check-in is always available (24/7)
      setCheckInStatus('available');
    } catch (err) {
      setError(err.message);
    }
  };

  const performCheckIn = async () => {
    try {
      if (!userProfile || !classInfo) {
        throw new Error('Missing user profile or class info');
      }

      if (checkInStatus !== 'available') {
        throw new Error('Check-in not available at this time');
      }

      // Use firebaseUid as the user ID (this is the document ID in Firestore)
      // Fallback to auth.currentUser.uid if not in profile
      const userId = userProfile.firebaseUid || userProfile.id || auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user ID found in profile');
      }

      setLoading(true);
      setError(null);

      const deviceHash = generateDeviceHash();
      const attendance = await checkInUser(
        userId,
        userProfile.classCode,
        deviceHash
      );

      setTodayAttendance(attendance);
      setCheckInStatus('checked_in');

      // Update user profile with new stats (this will be handled by the backend)
      // Trigger a refresh of user stats
      return attendance;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = (sortBy = 'totalDaysPresent') => {
    setLeaderboardSort(sortBy);
  };

  const getCheckInTimeInfo = () => {
    if (!classInfo) return null;

    const { checkInStartTime, gracePeriodMinutes } = classInfo;
    const now = new Date();
    const startTime = new Date();
    const [hours, minutes] = checkInStartTime.split(':');
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const endTime = new Date(startTime.getTime() + gracePeriodMinutes * 60000);

    return {
      startTime,
      endTime,
      gracePeriodMinutes,
      isEarly: now < startTime,
      isAvailable: now >= startTime && now <= endTime,
      isClosed: now > endTime,
      minutesUntilStart: Math.max(0, Math.ceil((startTime - now) / 60000)),
      minutesUntilEnd: Math.max(0, Math.ceil((endTime - now) / 60000))
    };
  };

  const value = {
    // State
    classInfo,
    todayAttendance,
    leaderboard,
    streakLeaderboard,
    leaderboardSort,
    todayAttendanceCount,
    checkInStatus,
    loading,
    error,
    classStats,
    // Actions
    performCheckIn,
    refreshLeaderboard,
    checkAttendanceStatus,
    getCheckInTimeInfo,
    // Computed values
    hasCheckedInToday: !!todayAttendance,
    canCheckIn: checkInStatus === 'available',
    isCheckInEarly: checkInStatus === 'early',
    isCheckInClosed: checkInStatus === 'closed'
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
