'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import SetupFlow from '@/src/components/SetupFlow';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const { loading, isAuthenticated, hasProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && hasProfile) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, hasProfile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-dark-800 border-t-primary-500 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2 
            className="text-xl font-semibold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            RollCall+
          </motion.h2>
          <motion.p 
            className="text-dark-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return <SetupFlow />;
}
