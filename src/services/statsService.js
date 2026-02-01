import { getUserAttendanceHistory } from './firestore';
import { calculateStreak } from '../lib/utils';

/**
 * Calculate stats for a specific user in a specific class
 * This reads attendance history and calculates stats on-the-fly
 */
export const getClassSpecificStats = async (userId, classCode) => {
  try {
    // Get attendance history for this class only
    const attendanceHistory = await getUserAttendanceHistory(userId, classCode);
    
    if (!attendanceHistory || attendanceHistory.length === 0) {
      return {
        totalDaysPresent: 0,
        currentStreak: 0,
        longestStreak: 0,
        onTimeCount: 0
      };
    }
    
    // Calculate total days present
    const totalDaysPresent = attendanceHistory.length;
    
    // Calculate on-time count
    const onTimeCount = attendanceHistory.filter(log => log.status === 'on_time').length;
    
    // Calculate current streak
    const currentStreak = calculateStreak(attendanceHistory);
    
    // Calculate longest streak by checking all possible streaks
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedLogs = [...attendanceHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    for (let i = 0; i < sortedLogs.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedLogs[i - 1].date);
        const currDate = new Date(sortedLogs[i].date);
        const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      totalDaysPresent,
      currentStreak,
      longestStreak,
      onTimeCount
    };
  } catch (error) {
    console.error('Error calculating class-specific stats:', error);
    // Return zeros if calculation fails
    return {
      totalDaysPresent: 0,
      currentStreak: 0,
      longestStreak: 0,
      onTimeCount: 0
    };
  }
};
