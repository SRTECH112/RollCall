'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAttendanceHistory } from '../services/firestore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';
import { formatDate, isToday } from '../lib/utils';
import { motion } from 'framer-motion';

const CalendarView = ({ onBack }) => {
  const { userProfile } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendanceData();
  }, [userProfile]);

  const loadAttendanceData = async () => {
    if (!userProfile?.id) return;
    
    try {
      setLoading(true);
      const logs = await getUserAttendanceHistory(userProfile.id, 90); // Last 90 days
      const dataMap = {};
      logs.forEach(log => {
        dataMap[log.date] = log.status;
      });
      setAttendanceData(dataMap);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDayStatus = (dateKey) => {
    return attendanceData[dateKey] || null;
  };

  const getDayClasses = (day, dateKey) => {
    const status = getDayStatus(dateKey);
    const today = isToday(dateKey);
    
    let classes = 'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all relative ';
    
    if (today) {
      classes += 'ring-2 ring-nexblue-500 z-10 ';
    }
    
    if (status === 'on_time') {
      classes += 'bg-primary-900/30 text-primary-400 border border-primary-800 ';
    } else if (status === 'late') {
      classes += 'bg-warning-900/30 text-warning-400 border border-warning-800 ';
    } else {
      classes += 'text-dark-text-muted hover:bg-dark-800 hover:text-white ';
    }
    
    return classes;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Day headers
    dayNames.forEach(dayName => {
      days.push(
        <div key={dayName} className="text-center text-xs font-bold text-dark-text-muted py-2">
          {dayName}
        </div>
      );
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const status = getDayStatus(dateKey);
      
      days.push(
        <motion.div
          key={day}
          className={getDayClasses(day, dateKey)}
          title={status ? `${formatDate(dateKey)} - ${status === 'on_time' ? 'On Time' : 'Late'}` : formatDate(dateKey)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {day}
          {status && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'on_time' ? 'bg-primary-500' : 'bg-warning-500'}`}></div>
            </div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };

  const getMonthStats = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    
    let onTimeCount = 0;
    let lateCount = 0;
    let totalPresent = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const status = getDayStatus(dateKey);
      
      if (status === 'on_time') {
        onTimeCount++;
        totalPresent++;
      } else if (status === 'late') {
        lateCount++;
        totalPresent++;
      }
    }
    
    return { onTimeCount, lateCount, totalPresent, daysInMonth };
  };

  const monthStats = getMonthStats();
  const attendanceRate = monthStats.daysInMonth > 0 
    ? Math.round((monthStats.totalPresent / monthStats.daysInMonth) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-dark-950 pb-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950">
      {/* Header */}
      <div className="bg-dark-950/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 text-dark-text-secondary hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white">Calendar</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Month Navigation */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-dark-text-secondary hover:text-white transition-colors hover:bg-dark-700 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-dark-text-secondary hover:text-white transition-colors hover:bg-dark-700 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-primary-400">{monthStats.onTimeCount}</div>
            <div className="text-xs text-dark-text-secondary">On Time</div>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-warning-400">{monthStats.lateCount}</div>
            <div className="text-xs text-dark-text-secondary">Late</div>
          </div>
          <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-nexblue-400">{attendanceRate}%</div>
            <div className="text-xs text-dark-text-secondary">Rate</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-nexblue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
              {renderCalendar()}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary-900/30 border border-primary-800 rounded"></div>
              <span className="text-sm text-dark-text-secondary">On Time</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-warning-900/30 border border-warning-800 rounded"></div>
              <span className="text-sm text-dark-text-secondary">Late</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-dark-700 border border-dark-600 rounded"></div>
              <span className="text-sm text-dark-text-secondary">No Record</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-nexblue-500 rounded"></div>
              <span className="text-sm text-dark-text-secondary">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
