import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createUser, createAttendanceLog, createClass } from '../lib/models';
import { getTodayString, calculateStreak, checkBadgeEligibility } from '../lib/utils';

// Collections
const USERS_COLLECTION = 'users';
const ATTENDANCE_COLLECTION = 'attendance';
const CLASSES_COLLECTION = 'classes';

// User operations
export const createUserProfile = async (userData) => {
  try {
    const user = createUser(userData);
    // Use the firebaseUid as the document ID to match Firestore security rules
    const docRef = doc(db, USERS_COLLECTION, userData.firebaseUid);
    await setDoc(docRef, {
      ...user,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: userData.firebaseUid, ...user };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUsersByClassCode = async (classCode) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('classCode', '==', classCode)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users by class code:', error);
    throw error;
  }
};

// Attendance operations
export const checkInUser = async (userId, classCode, deviceHash) => {
  try {
    const today = getTodayString();
    
    // Check if user already checked in today for THIS class
    const existingAttendance = await getTodayAttendance(userId, today, classCode);
    if (existingAttendance) {
      console.log('⚠️ User already checked in today for this class:', existingAttendance);
      return existingAttendance;
    }
    
    // Get class info for time validation
    const classInfo = await getClassByCode(classCode);
    if (!classInfo) {
      throw new Error('Invalid class code');
    }
    
    // Create attendance log
    const attendanceData = createAttendanceLog({
      userId,
      date: today,
      timestamp: new Date(),
      deviceHash,
      classCode
    });
    
    // Always mark as on_time since check-in is available 24/7
    attendanceData.status = 'on_time';
    
    // Save attendance log
    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), {
      ...attendanceData,
      createdAt: serverTimestamp()
    });
    
    console.log('✅ Check-in successful, updating stats...');
    
    // Update user stats - wrap in try-catch to prevent partial failures
    try {
      await updateUserStats(userId, attendanceData.status, classCode);
    } catch (statsError) {
      console.error('⚠️ Stats update failed, but check-in was recorded:', statsError);
      // Don't throw - check-in was successful even if stats update failed
    }
    
    return { id: docRef.id, ...attendanceData };
  } catch (error) {
    console.error('❌ Error checking in user:', error);
    throw error;
  }
};

export const getTodayAttendance = async (userId, date = null, classCode = null) => {
  try {
    const targetDate = date || getTodayString();
    const constraints = [
      where('userId', '==', userId),
      where('date', '==', targetDate)
    ];
    
    // If classCode is provided, filter by class
    if (classCode) {
      constraints.push(where('classCode', '==', classCode));
    }
    
    const q = query(collection(db, ATTENDANCE_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting today attendance:', error);
    throw error;
  }
};

export const getUserAttendanceHistory = async (userId, classCode = null, limitCount = 30) => {
  try {
    const constraints = [
      where('userId', '==', userId)
    ];
    
    // Filter by class if provided
    if (classCode) {
      constraints.push(where('classCode', '==', classCode));
    }
    
    constraints.push(orderBy('date', 'desc'));
    constraints.push(limit(limitCount));
    
    const q = query(collection(db, ATTENDANCE_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user attendance history:', error);
    throw error;
  }
};

export const getClassAttendanceToday = async (classCode) => {
  try {
    const today = getTodayString();
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('classCode', '==', classCode),
      where('date', '==', today)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting class attendance today:', error);
    throw error;
  }
};

// Update user statistics after check-in
export const updateUserStats = async (userId, status, classCode) => {
  try {
    console.log('📊 Updating user stats for:', userId, 'Class:', classCode, 'Status:', status);
    const user = await getUserProfile(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return;
    }
    
    console.log('👤 Current user stats:', {
      totalDaysPresent: user.totalDaysPresent,
      currentStreak: user.currentStreak,
      onTimeCount: user.onTimeCount
    });
    
    let attendanceHistory = [];
    let newCurrentStreak = 1;
    let newBadges = [];
    
    // Try to get attendance history for THIS class only
    try {
      attendanceHistory = await getUserAttendanceHistory(userId, classCode);
      
      // Calculate new streak based on class-specific attendance
      newCurrentStreak = calculateStreak([
        { date: getTodayString(), status },
        ...attendanceHistory
      ]);
      
      // Check for new badges
      newBadges = checkBadgeEligibility(
        { ...user, currentStreak: newCurrentStreak, totalDaysPresent: user.totalDaysPresent + 1 },
        attendanceHistory
      );
    } catch (historyError) {
      console.warn('⚠️ Could not fetch attendance history (index may be building), using basic stats:', historyError.message);
      // Use simple increment if we can't get history
      newCurrentStreak = (user.currentStreak || 0) + 1;
    }
    
    const newTotalDays = user.totalDaysPresent + 1;
    const newOnTimeCount = status === 'on_time' ? user.onTimeCount + 1 : user.onTimeCount;
    const newLongestStreak = Math.max(user.longestStreak, newCurrentStreak);
    
    const updates = {
      totalDaysPresent: newTotalDays,
      onTimeCount: newOnTimeCount,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastCheckIn: new Date().toISOString(),
      badges: [...user.badges, ...newBadges]
    };
    
    console.log('✅ New user stats (for class ' + classCode + '):', updates);
    console.log('🏆 New badges earned:', newBadges);
    
    await updateUserProfile(userId, updates);
    console.log('💾 User stats saved to Firestore');
    return updates;
  } catch (error) {
    console.error('❌ Error updating user stats:', error);
    throw error;
  }
};

// Class operations
export const createClassRoom = async (classData) => {
  try {
    const classRoom = createClass(classData);
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
      ...classRoom,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...classRoom };
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const getClassByCode = async (classCode) => {
  try {
    const q = query(
      collection(db, CLASSES_COLLECTION),
      where('classCode', '==', classCode),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting class by code:', error);
    throw error;
  }
};

export const updateClass = async (classId, updates) => {
  try {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

// Leaderboard operations
export const getLeaderboard = async (classCode, sortBy = 'totalDaysPresent', limitCount = 10) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where('classCode', '==', classCode),
      orderBy(sortBy, 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Real-time subscriptions
export const subscribeToUserProfile = (userId, callback, errorCallback) => {
  const docRef = doc(db, USERS_COLLECTION, userId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error subscribing to user profile:", error);
    if (errorCallback) {
      errorCallback(error);
    }
  });
};

export const subscribeToLeaderboard = (classCode, sortBy, callback) => {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('classCode', '==', classCode),
    orderBy(sortBy, 'desc'),
    limit(10)
  );
  
  return onSnapshot(q, 
    (querySnapshot) => {
      const leaderboard = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(leaderboard);
    },
    (error) => {
      console.error('Error in leaderboard subscription:', error);
      if (error.code === 'failed-precondition') {
        console.warn('⚠️ Firestore index required. Returning empty leaderboard.');
        console.warn('Create index at: https://console.firebase.google.com/project/steb-91fd4/firestore/indexes');
      }
      // Return empty array on error to prevent app crash
      callback([]);
    }
  );
};

export const subscribeToTodayAttendance = (classCode, callback) => {
  const today = getTodayString();
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('classCode', '==', classCode),
    where('date', '==', today)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const attendance = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(attendance);
  });
};
