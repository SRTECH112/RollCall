# Setup Instructions

## 1. Firebase Configuration

The application requires a Firebase project to function. The current error `auth/api-key-not-valid` occurs because the `.env` file contains placeholder values.

### Steps to Fix:

1.  **Create a Firebase Project:**
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the setup steps.

2.  **Enable Authentication:**
    *   In your new project, go to **Build** > **Authentication**.
    *   Click "Get Started".
    *   Select **Anonymous** from the Sign-in providers list and enable it.
    *   (Optional) Enable other providers if you plan to extend the app.

3.  **Create Firestore Database:**
    *   Go to **Build** > **Firestore Database**.
    *   Click "Create database".
    *   Choose a location and start in **Test mode** (for development).

4.  **Get Configuration Keys:**
    *   Go to **Project settings** (gear icon next to Project Overview).
    *   Scroll down to "Your apps" and click the Web icon (`</>`).
    *   Register the app (give it a name like "RollCall").
    *   Copy the `firebaseConfig` object values.

5.  **Update Environment Variables:**
    *   Open the `.env` file in your project root.
    *   Replace the placeholder values with your actual Firebase configuration:

    ```env
    VITE_FIREBASE_API_KEY=your_actual_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

6.  **Restart the Development Server:**
    *   Stop the running server (Ctrl+C).
    *   Run `npm run dev` again to load the new environment variables.

## 2. Firestore Rules

Ensure your Firestore security rules allow the necessary access. Copy the contents of `firestore.rules` in this project to your Firebase Console > Firestore Database > Rules tab.
