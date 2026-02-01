// Core data models for RollCall+

export const AttendanceStatus = {
  ON_TIME: 'on_time',
  LATE: 'late'
};

export const BadgeTypes = {
  PERFECT_WEEK: 'perfect_week',
  NEVER_LATE: 'never_late',
  TEN_DAY_STREAK: 'ten_day_streak',
  EARLY_BIRD: 'early_bird',
  CONSISTENCY_CHAMPION: 'consistency_champion',
  MONTH_PERFECT: 'month_perfect'
};

export const BadgeConfig = {
  [BadgeTypes.PERFECT_WEEK]: {
    name: 'Perfect Week',
    emoji: '🏆',
    description: '7 days in a row, on time',
    color: 'text-yellow-600'
  },
  [BadgeTypes.NEVER_LATE]: {
    name: 'Never Late',
    emoji: '⏰',
    description: '7 consecutive on-time check-ins',
    color: 'text-blue-600'
  },
  [BadgeTypes.TEN_DAY_STREAK]: {
    name: '10-Day Streak',
    emoji: '🔥',
    description: '10 days of consistent attendance',
    color: 'text-red-600'
  },
  [BadgeTypes.EARLY_BIRD]: {
    name: 'Early Bird',
    emoji: '🐦',
    description: 'Check in within first 5 minutes',
    color: 'text-green-600'
  },
  [BadgeTypes.CONSISTENCY_CHAMPION]: {
    name: 'Consistency Champion',
    emoji: '💎',
    description: '30 days of attendance',
    color: 'text-purple-600'
  },
  [BadgeTypes.MONTH_PERFECT]: {
    name: 'Monthly Perfect',
    emoji: '🌟',
    description: 'Perfect attendance for a month',
    color: 'text-indigo-600'
  }
};

export const LeaderboardSortTypes = {
  TOTAL_DAYS: 'totalDaysPresent',
  LONGEST_STREAK: 'longestStreak',
  ON_TIME_COUNT: 'onTimeCount',
  CURRENT_STREAK: 'currentStreak'
};

// User model factory
export const createUser = (data = {}) => ({
  id: data.id || null,
  firebaseUid: data.firebaseUid || null,
  nickname: data.nickname || '',
  emoji: data.emoji || '😊',
  joinDate: data.joinDate || new Date().toISOString().split('T')[0],
  totalDaysPresent: data.totalDaysPresent || 0,
  onTimeCount: data.onTimeCount || 0,
  longestStreak: data.longestStreak || 0,
  currentStreak: data.currentStreak || 0,
  badges: data.badges || [],
  classCode: data.classCode || '',
  lastCheckIn: data.lastCheckIn || null,
  deviceHash: data.deviceHash || null,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date()
});

// AttendanceLog model factory
export const createAttendanceLog = (data = {}) => ({
  id: data.id || null,
  userId: data.userId || '',
  date: data.date || new Date().toISOString().split('T')[0],
  status: data.status || AttendanceStatus.ON_TIME,
  timestamp: data.timestamp || new Date(),
  deviceHash: data.deviceHash || '',
  classCode: data.classCode || '',
  createdAt: data.createdAt || new Date()
});

// Class model factory
export const createClass = (data = {}) => ({
  id: data.id || null,
  classCode: data.classCode || '',
  checkInStartTime: data.checkInStartTime || '09:00',
  gracePeriodMinutes: data.gracePeriodMinutes || 5,
  active: data.active !== undefined ? data.active : true,
  createdBy: data.createdBy || '',
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date(),
  timezone: data.timezone || 'UTC'
});

// Validation helpers
export const validateNickname = (nickname) => {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: 'Nickname is required' };
  }
  if (nickname.length > 20) {
    return { valid: false, error: 'Nickname must be 20 characters or less' };
  }
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(nickname)) {
    return { valid: false, error: 'Nickname can only contain letters, numbers, spaces, hyphens, and underscores' };
  }
  return { valid: true };
};

export const validateClassCode = (classCode) => {
  if (!classCode || classCode.trim().length === 0) {
    return { valid: false, error: 'Class code is required' };
  }
  if (classCode.length < 4 || classCode.length > 10) {
    return { valid: false, error: 'Class code must be 4-10 characters' };
  }
  if (!/^[A-Z0-9]+$/.test(classCode.toUpperCase())) {
    return { valid: false, error: 'Class code can only contain letters and numbers' };
  }
  return { valid: true };
};
