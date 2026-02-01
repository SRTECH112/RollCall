'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';

interface PointsCardProps {
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function PointsCard({ title, description, badge, icon, gradient }: PointsCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-3xl border border-white/5 bg-dark-800/40 backdrop-blur-sm p-6 group"
    >
      {/* Background Gradient Mesh */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${gradient} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity duration-500`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white group-hover:border-white/20 transition-all duration-300">
          {icon}
        </div>
        <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-white/70 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
          {badge}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6 min-h-[40px]">
        {description}
      </p>

      <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/10 transition-all duration-200 flex items-center justify-center gap-2 group/btn">
        View Details
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
      </button>
    </motion.div>
  );
}
