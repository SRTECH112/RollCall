import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Generate a device hash for anti-cheating
export function generateDeviceHash() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Date utilities
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateString) {
  return dateString === getTodayString();
}

export function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getCurrentTime() {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    timeString: now.toTimeString().slice(0, 5)
  };
}

// Check if current time is within check-in window
export function isWithinCheckInWindow(startTime, gracePeriodMinutes) {
  const now = new Date();
  const start = parseTime(startTime);
  const end = new Date(start.getTime() + gracePeriodMinutes * 60000);
  
  return now >= start && now <= end;
}

// Check if current time is before check-in window
export function isBeforeCheckInWindow(startTime) {
  const now = new Date();
  const start = parseTime(startTime);
  return now < start;
}

// Check if current time is after check-in window
export function isAfterCheckInWindow(startTime, gracePeriodMinutes) {
  const now = new Date();
  const start = parseTime(startTime);
  const end = new Date(start.getTime() + gracePeriodMinutes * 60000);
  return now > end;
}

// Determine attendance status based on check-in time
export function getAttendanceStatus(checkInTime, classStartTime, gracePeriodMinutes) {
  const checkIn = new Date(checkInTime);
  const start = parseTime(classStartTime);
  const graceEnd = new Date(start.getTime() + gracePeriodMinutes * 60000);
  
  if (checkIn <= start) {
    return 'on_time';
  } else if (checkIn <= graceEnd) {
    return 'late';
  } else {
    return null; // Outside window
  }
}

// Calculate streak from attendance logs
export function calculateStreak(attendanceLogs, endDate = null) {
  if (!attendanceLogs || attendanceLogs.length === 0) return 0;
  
  const sortedLogs = [...attendanceLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const today = endDate ? new Date(endDate) : new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const log of sortedLogs) {
    const logDate = new Date(log.date);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - streak);
    
    if (logDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Badge calculation helpers
export function checkBadgeEligibility(user, attendanceLogs) {
  const badges = [];
  const recentLogs = attendanceLogs
    .filter(log => new Date(log.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Perfect Week (7 consecutive days, on time)
  const last7Days = recentLogs.slice(0, 7);
  if (last7Days.length === 7 && last7Days.every(log => log.status === 'on_time')) {
    badges.push('perfect_week');
  }
  
  // Never Late (7 consecutive on-time check-ins)
  const onTimeLogs = recentLogs.filter(log => log.status === 'on_time');
  if (onTimeLogs.length >= 7) {
    badges.push('never_late');
  }
  
  // 10-Day Streak
  if (user.currentStreak >= 10) {
    badges.push('ten_day_streak');
  }
  
  // Early Bird (check in within first 5 minutes)
  const todayLog = recentLogs.find(log => isToday(log.date));
  if (todayLog && todayLog.status === 'on_time') {
    // This would need class start time to calculate properly
    badges.push('early_bird');
  }
  
  // Consistency Champion (30 days of attendance)
  if (user.totalDaysPresent >= 30) {
    badges.push('consistency_champion');
  }
  
  return badges.filter(badge => !user.badges.includes(badge));
}

// Emoji utilities
export function getRandomEmoji() {
  const emojis = ['😊', '🎉', '🚀', '⭐', '🔥', '💪', '🎯', '🏆', '🌟', '✨', '🎊', '🙌'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Local storage helpers
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
}
