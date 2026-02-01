'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthChange, signInAnonymous, signUpWithEmail, signInWithEmail, signOut as firebaseSignOut } from '../lib/firebase';
import { getUserProfile, createUserProfile, subscribeToUserProfile } from '../services/firestore';
import { generateDeviceHash, loadFromLocalStorage, saveToLocalStorage } from '../lib/utils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Safety timeout to ensure we don't get stuck in loading state
    const safetyTimeout = setTimeout(() => {
      setLoading((currentLoading) => {
        if (currentLoading) {
          console.warn("Auth state change timed out, forcing loading to false");
          return false;
        }
        return currentLoading;
      });
    }, 5000);

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      clearTimeout(safetyTimeout);
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          // Subscribe to real-time user profile updates
          const unsubscribeProfile = subscribeToUserProfile(
            firebaseUser.uid, 
            (profile) => {
              if (profile) {
                setUserProfile(profile);
                saveToLocalStorage('userProfile', profile);
              } else {
                // Handle case where profile doesn't exist yet (e.g. new user)
                // Check if we have cached profile data as fallback
                const cachedProfile = loadFromLocalStorage('userProfile');
                if (cachedProfile && cachedProfile.firebaseUid === firebaseUser.uid) {
                   setUserProfile(cachedProfile);
                } else {
                   setUserProfile(null);
                }
              }
              setLoading(false);
            },
            (error) => {
              console.error("Profile subscription error:", error);
              // Don't set error here to avoid blocking the UI, just log it
              // setError("Failed to load profile updates: " + error.message);
              setLoading(false);
            }
          );

          return () => {
             unsubscribeProfile();
          };
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      const result = await signInAnonymous();
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      const result = await signUpWithEmail(email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signInEmail = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmail(email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const createProfile = async (profileData) => {
    try {
      setError(null);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      const deviceHash = generateDeviceHash();
      const profile = await createUserProfile({
        ...profileData,
        firebaseUid: currentUser.uid,
        deviceHash
      });

      setUserProfile(profile);
      saveToLocalStorage('userProfile', profile);
      
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      
      if (!userProfile) {
        throw new Error('No user profile found');
      }

      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      saveToLocalStorage('userProfile', updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      setUserProfile(null);
      saveToLocalStorage('userProfile', null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signInEmail,
    signOut,
    createProfile,
    updateProfile,
    isAuthenticated: !!user,
    hasProfile: !!userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
