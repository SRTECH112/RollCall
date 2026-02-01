'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';

interface ClassData {
  id: string;
  classCode: string;
  name: string;
  createdBy: string;
  checkInStartTime: string;
  gracePeriodMinutes: number;
  active: boolean;
  memberCount?: number;
}

export default function ClassBrowser() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'classes'),
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const classesData: ClassData[] = [];
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Count members in this class
        const usersQuery = query(
          collection(db, 'users'),
          where('classCode', '==', data.classCode)
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        classesData.push({
          id: doc.id,
          classCode: data.classCode,
          name: data.name || data.classCode,
          createdBy: data.createdBy,
          checkInStartTime: data.checkInStartTime,
          gracePeriodMinutes: data.gracePeriodMinutes,
          active: data.active,
          memberCount: usersSnapshot.size
        });
      }
      
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.classCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Browse Classes</h1>
          <p className="text-dark-text-secondary">Find and join active classes</p>
        </div>
        <Link 
          href="/create-class"
          className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors"
        >
          + Create New Class
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by class code or name..."
          className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-600 rounded-2xl text-white placeholder-dark-text-muted focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-dark-text-secondary mt-4">Loading classes...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-12 bg-dark-800/50 rounded-3xl border border-dark-600">
          <p className="text-dark-text-secondary">No classes found</p>
          <Link 
            href="/create-class"
            className="inline-block mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
          >
            Create the first class
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-800/60 backdrop-blur-md border border-dark-600 rounded-3xl p-6 hover:border-primary-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-900/30 border border-primary-500/50 flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <span className="px-3 py-1 bg-green-900/30 border border-green-500/50 text-green-400 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                {cls.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-dark-700 border border-dark-600 text-gray-300 text-sm font-mono rounded-lg">
                  {cls.classCode}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <Users className="w-4 h-4" />
                  <span>{cls.memberCount || 0} members</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Check-in: {cls.checkInStartTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <TrendingUp className="w-4 h-4" />
                  <span>{cls.gracePeriodMinutes} min grace period</span>
                </div>
              </div>

              <Link
                href={`/join-class/${cls.classCode}`}
                className="block w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-center transition-colors"
              >
                Join Class
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
