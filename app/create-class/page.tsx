'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import { createClassRoom } from '@/src/services/firestore';

export default function CreateClass() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    className: '',
    classCode: '',
    checkInStartTime: '09:00',
    gracePeriodMinutes: 60
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a class');
      return;
    }

    if (!formData.className || !formData.classCode) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.classCode.length < 4 || formData.classCode.length > 10) {
      setError('Class code must be 4-10 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createClassRoom({
        classCode: formData.classCode.toUpperCase(),
        name: formData.className,
        checkInStartTime: formData.checkInStartTime,
        gracePeriodMinutes: formData.gracePeriodMinutes,
        active: true,
        createdBy: user.uid
      });

      router.push('/classes');
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link 
        href="/classes"
        className="inline-flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classes
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Class</h1>
        <p className="text-dark-text-secondary">Set up a new class for your students</p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-dark-800/60 backdrop-blur-md border border-dark-600 rounded-3xl p-8 space-y-6"
      >
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Class Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Class Name *
          </label>
          <input
            type="text"
            value={formData.className}
            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
            placeholder="e.g., Computer Science 101"
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-text-muted focus:outline-none focus:border-primary-500 transition-colors"
            required
          />
        </div>

        {/* Class Code */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Class Code *
          </label>
          <input
            type="text"
            value={formData.classCode}
            onChange={(e) => setFormData({ ...formData, classCode: e.target.value.toUpperCase() })}
            placeholder="e.g., CS101"
            maxLength={10}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white font-mono placeholder-dark-text-muted focus:outline-none focus:border-primary-500 transition-colors uppercase"
            required
          />
          <p className="text-xs text-dark-text-muted mt-2">
            4-10 characters, letters and numbers only
          </p>
        </div>

        {/* Check-in Start Time */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Check-in Start Time
          </label>
          <input
            type="time"
            value={formData.checkInStartTime}
            onChange={(e) => setFormData({ ...formData, checkInStartTime: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
          <p className="text-xs text-dark-text-muted mt-2">
            Students can check in starting at this time each day
          </p>
        </div>

        {/* Grace Period */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Users className="w-4 h-4 inline mr-2" />
            Grace Period (minutes)
          </label>
          <select
            value={formData.gracePeriodMinutes}
            onChange={(e) => setFormData({ ...formData, gracePeriodMinutes: parseInt(e.target.value) })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
          <p className="text-xs text-dark-text-muted mt-2">
            How long after start time students can still check in
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Link
            href="/classes"
            className="flex-1 py-3 bg-dark-700 hover:bg-dark-600 text-white font-semibold rounded-xl text-center transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Class'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
