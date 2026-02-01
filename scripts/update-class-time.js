// Script to update class check-in time to current time
// Run this with: node scripts/update-class-time.js YOUR_CLASS_CODE

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBFa5DeN3R2U4UDGlrg2FW9Mu_x6s7teek',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'steb-91fd4.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'steb-91fd4',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'steb-91fd4.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '180339870495',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:180339870495:web:03d79c98a9c76e2891be2a'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateClassCheckInTime(classCode) {
  try {
    console.log(`🔍 Looking for class with code: ${classCode}`);
    
    const q = query(
      collection(db, 'classes'),
      where('classCode', '==', classCode.toUpperCase()),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('❌ Class not found with code:', classCode);
      process.exit(1);
    }
    
    const classDoc = querySnapshot.docs[0];
    const classData = classDoc.data();
    
    console.log('✅ Found class:', classData.name || classCode);
    console.log('📅 Current check-in time:', classData.checkInStartTime);
    console.log('⏱️  Current grace period:', classData.gracePeriodMinutes, 'minutes');
    
    // Set check-in time to current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const newCheckInTime = `${hours}:${minutes}`;
    
    console.log('\n🔄 Updating check-in time to:', newCheckInTime);
    console.log('⏱️  Grace period: 60 minutes');
    
    await updateDoc(doc(db, 'classes', classDoc.id), {
      checkInStartTime: newCheckInTime,
      gracePeriodMinutes: 60,
      updatedAt: new Date()
    });
    
    console.log('✅ Class check-in time updated successfully!');
    console.log(`\n📋 Check-in window:`);
    console.log(`   Opens: ${newCheckInTime}`);
    
    const endTime = new Date(now.getTime() + 60 * 60000);
    const endHours = String(endTime.getHours()).padStart(2, '0');
    const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
    console.log(`   Closes: ${endHours}:${endMinutes}`);
    
    console.log('\n🎉 You can now check in! Refresh your app.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating class:', error.message);
    process.exit(1);
  }
}

const classCode = process.argv[2];

if (!classCode) {
  console.error('❌ Please provide a class code');
  console.log('Usage: node scripts/update-class-time.js YOUR_CLASS_CODE');
  process.exit(1);
}

updateClassCheckInTime(classCode);
