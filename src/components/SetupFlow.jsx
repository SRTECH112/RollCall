'use client';

import React, { useState } from 'react';
import { User, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import { validateNickname, validateClassCode } from '../lib/models';
import { getRandomEmoji } from '../lib/utils';
import { getClassByCode, createClassRoom } from '../services/firestore';
import { motion } from 'framer-motion';

const SetupFlow = () => {
  const { signUp, createProfile, loading: authLoading, error: authError } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    classCode: '',
    emoji: getRandomEmoji()
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber >= 2) {
      // Email validation
      if (!formData.email || !formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Password validation
      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    if (stepNumber >= 3) {
      const nicknameValidation = validateNickname(formData.nickname);
      if (!nicknameValidation.valid) {
        errors.nickname = nicknameValidation.error;
      }
    }
    
    if (stepNumber >= 4) {
      const classCodeValidation = validateClassCode(formData.classCode);
      if (!classCodeValidation.valid) {
        errors.classCode = classCodeValidation.error;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      console.log('❌ Validation failed for step 4');
      return;
    }
    
    console.log('✅ Starting setup process...');
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up with email and password
      console.log('🔐 Step 1: Creating account with email...');
      const user = await signUp(formData.email.trim(), formData.password);
      if (!user) {
        throw new Error('Failed to create account');
      }
      console.log('✅ Account created successfully, user ID:', user.uid);

      const formattedClassCode = formData.classCode.toUpperCase().trim();
      console.log('📝 Class code:', formattedClassCode);

      // 2. Check if class exists, if not create it (for demo purposes)
      console.log('🔍 Step 2: Checking if class exists...');
      const existingClass = await getClassByCode(formattedClassCode);
      
      if (!existingClass) {
        console.log('⚠️ Class does not exist, creating new class...');
        // Set start time to now so check-in is available immediately for testing
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;

        await createClassRoom({
          classCode: formattedClassCode,
          checkInStartTime: currentTime,
          gracePeriodMinutes: 60, // Generous window for testing
          active: true,
          name: `${formattedClassCode} Class`,
          createdBy: user.uid
        });
        console.log('✅ Class created successfully');
      } else {
        console.log('✅ Class already exists:', existingClass.name);
      }
      
      // 3. Create the profile
      console.log('👤 Step 3: Creating user profile...');
      await createProfile({
        nickname: formData.nickname.trim(),
        classCode: formattedClassCode,
        emoji: formData.emoji
      });
      console.log('✅ Profile created successfully!');
      console.log('🎉 Setup complete! Waiting for navigation...');
    } catch (err) {
      console.error('❌ Setup failed at some step:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🏁 Setup process finished (loading set to false)');
    }
  };

  const emojiOptions = ['😊', '🎉', '🚀', '⭐', '🔥', '💪', '🎯', '🏆', '🌟', '✨', '🎊', '🙌'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 font-sans">
      <Card className="w-full max-w-md border-dark-800 bg-dark-900/50 backdrop-blur-xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-center text-2xl font-bold text-white mb-4">
            Welcome to RollCall+ 🎯
          </CardTitle>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${i <= step ? 'bg-primary-500' : 'bg-dark-700'}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: i === step ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4 animate-bounce-gentle">🎓</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Ready to boost your attendance?
                </h2>
                <p className="text-dark-text-secondary leading-relaxed">
                  Join your classmates in a fun, positive attendance challenge. 
                  No penalties, just motivation! 🚀
                </p>
              </div>
              <div className="space-y-2 bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                <p className="text-sm text-dark-text-muted flex items-center gap-2">
                  <span className="text-primary-500">✅</span> One-tap daily check-ins
                </p>
                <p className="text-sm text-dark-text-muted flex items-center gap-2">
                  <span className="text-accent-500">🏆</span> Friendly leaderboards
                </p>
                <p className="text-sm text-dark-text-muted flex items-center gap-2">
                  <span className="text-warning-500">🔥</span> Build your streak
                </p>
                <p className="text-sm text-dark-text-muted flex items-center gap-2">
                  <span className="text-nexblue-500">🎖️</span> Earn achievement badges
                </p>
              </div>
              <Button 
                onClick={handleNext} 
                className="w-full text-lg py-6"
                variant="primary"
              >
                Let's Get Started!
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-800/50">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
                <p className="text-dark-text-secondary">Sign up with email and password</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-text-muted focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-text-muted focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                  {validationErrors.password && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleBack}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-800/50">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Choose your identity</h2>
                <p className="text-dark-text-secondary">Pick a nickname and emoji</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    placeholder="Enter your nickname"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-text-muted focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    maxLength={20}
                  />
                  {validationErrors.nickname && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.nickname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Your Emoji
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleInputChange('emoji', emoji)}
                        className={`text-2xl p-2 rounded-xl border transition-all ${
                          formData.emoji === emoji 
                            ? 'bg-primary-900/30 border-primary-500' 
                            : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleBack}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-800/50">
                  <Hash className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Join your class</h2>
                <p className="text-dark-text-secondary">Enter your class code</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Class Code
                </label>
                <input
                  type="text"
                  value={formData.classCode}
                  onChange={(e) => handleInputChange('classCode', e.target.value.toUpperCase())}
                  placeholder="e.g., MATH101"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white font-mono text-center text-lg placeholder-dark-text-muted focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all uppercase"
                  maxLength={10}
                />
                {validationErrors.classCode && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.classCode}</p>
                )}
                <p className="text-xs text-dark-text-muted mt-2 text-center">
                  Ask your teacher for the class code
                </p>
              </div>

              <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
                <h3 className="font-medium text-white mb-2 text-sm">Preview:</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{formData.emoji}</span>
                  <span className="font-semibold text-white">{formData.nickname || 'Your Nickname'}</span>
                  <span className="text-sm text-dark-text-secondary">in {formData.classCode || 'CLASS'}</span>
                </div>
              </div>

              {(error || authError) && (
                <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-3">
                  <p className="text-red-400 text-sm text-center">{error || authError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleBack}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || authLoading}
                  loading={loading || authLoading}
                  className="flex-1"
                >
                  {loading || authLoading ? 'Creating Account...' : 'Create Account!'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-dark-text-secondary text-sm">
          Already have an account?{' '}
          <a 
            href="/login" 
            className="text-primary-500 hover:text-primary-400 font-medium transition-colors"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SetupFlow;
