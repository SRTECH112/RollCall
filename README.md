# RollCall+ 🎯

A positive, opt-in, gamified attendance leaderboard web app designed for students. Encourages punctuality and consistency through fun, friendly motivation - no penalties or shaming!

## ✨ Features

### 🎯 Core Principles
- **Opt-in only** - Students choose to participate
- **No penalties** - Only positive reinforcement
- **No public "last place"** - Top 10 leaderboard only
- **Fun & motivating** - Gamified with badges and streaks
- **Daily 1-tap interaction** - Simple check-in process
- **Nicknames only** - Privacy-focused, no real names

### 📱 Key Features
- **Daily Check-In**: One-tap attendance marking with time validation
- **Smart Time Windows**: On-time vs late detection with grace periods
- **Streak System**: Build and maintain attendance streaks with 🔥 indicators
- **Achievement Badges**: Earn badges for consistency, punctuality, and milestones
- **Real-time Leaderboards**: Top 10 rankings with multiple sort options
- **Anti-Cheating**: Device fingerprinting and time-locked check-ins
- **Mobile-First Design**: Optimized for smartphone usage
- **Anonymous Authentication**: No personal data required

### 🏆 Gamification Elements
- **Badges**: Perfect Week, Never Late, 10-Day Streak, Early Bird, etc.
- **Streaks**: Visual fire emoji indicators for consecutive attendance
- **Leaderboards**: Sort by total days, longest streak, on-time count
- **Daily Motivation**: Encouraging messages and progress tracking

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Firestore + Auth)
- **Authentication**: Anonymous Firebase Auth
- **Database**: Cloud Firestore (real-time)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Hosting**: Ready for Vercel/Firebase Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for production)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd RollApp
npm install
```

2. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Anonymous provider)
   - Enable Firestore Database
   - Copy your Firebase config

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📊 Data Models

### User Profile
```javascript
{
  id: string,
  nickname: string,
  emoji: string,
  joinDate: string,
  totalDaysPresent: number,
  onTimeCount: number,
  longestStreak: number,
  currentStreak: number,
  badges: string[],
  classCode: string,
  deviceHash: string
}
```

### Attendance Log
```javascript
{
  id: string,
  userId: string,
  date: string, // YYYY-MM-DD
  status: 'on_time' | 'late',
  timestamp: Date,
  deviceHash: string,
  classCode: string
}
```

### Class Configuration
```javascript
{
  id: string,
  classCode: string,
  checkInStartTime: string, // HH:MM
  gracePeriodMinutes: number,
  active: boolean,
  createdBy: string
}
```

## 🎮 How It Works

### For Students
1. **Join**: Enter class code and choose nickname + emoji
2. **Check In**: Tap "Mark Present" during check-in window
3. **Build Streaks**: Maintain consecutive attendance days
4. **Earn Badges**: Unlock achievements for various milestones
5. **Compete Friendly**: See your ranking in top 10 leaderboard

### For Teachers
1. **Create Class**: Set up class code and check-in times
2. **Share Code**: Give students the class code to join
3. **Monitor**: View attendance dashboard and statistics
4. **Adjust Settings**: Modify check-in times and grace periods

## 🔒 Privacy & Security

- **Anonymous Authentication**: No personal information required
- **Device Fingerprinting**: Prevents multiple check-ins from same device
- **Time-Locked Windows**: Check-in only allowed during specified times
- **Nickname Only**: No real names displayed publicly
- **Opt-in Participation**: Students choose to join

## 🎨 UI/UX Design

- **Mobile-First**: Optimized for smartphone usage
- **Clean & Modern**: Friendly, bright design without being childish
- **Micro-Animations**: Smooth transitions and feedback
- **Accessibility**: High contrast, readable fonts, clear navigation
- **Progressive Enhancement**: Works on various devices and connections

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration

### Firebase Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read other profiles in their class (for leaderboard)
    match /users/{userId} {
      allow read: if request.auth != null && 
        resource.data.classCode == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.classCode;
    }
    
    // Attendance logs
    match /attendance/{logId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Classes (read-only for students)
    match /classes/{classId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📈 Future Enhancements

- **Class vs Class Leaderboards**: Inter-class competitions
- **Monthly Resets**: Seasonal leaderboard cycles  
- **Printable Reports**: Teacher analytics and certificates
- **QR Code Check-ins**: Location-based verification
- **Parent Notifications**: Optional progress updates
- **Offline Support**: PWA capabilities for poor connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check this README and inline code comments
- **Firebase Setup**: Follow [Firebase documentation](https://firebase.google.com/docs)

## 🎯 App Identity

**RollCall+** - Making attendance fun, one check-in at a time! 

Built with ❤️ for students who want to build better habits through positive reinforcement and friendly competition.
