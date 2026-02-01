'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useApp } from '@/src/contexts/AppContext';

interface LeaderboardTableProps {
  title: string;
  data: any[];
  type: 'users' | 'protocols'; // Keeping 'protocols' for now to avoid breaking existing calls, but logic is generic
}

export default function LeaderboardTable({ title, data, type }: LeaderboardTableProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-dark-800/40 backdrop-blur-md p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <button className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          Show all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/5">
              <th className="pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider pl-4">Rank</th>
              <th className="pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="pb-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-right pr-4">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-accent-500 transition-colors" />
                    <span className="text-sm text-gray-400 font-mono">#{String(index + 1).padStart(3, '0')}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-dark-700 flex items-center justify-center text-[10px]">
                        {item.emoji || '👤'}
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{item.nickname || item.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="py-4 text-right pr-4">
                  <span className="text-sm text-gray-400 font-mono">
                    {item.score?.toLocaleString() || item.totalDaysPresent || 0}
                  </span>
                </td>
              </tr>
            ))}
            
            {/* Fill remaining rows if empty */}
            {Array.from({ length: Math.max(0, 5 - data.length) }).map((_, i) => (
               <tr key={`empty-${i}`} className="group hover:bg-white/[0.02] transition-colors">
                 <td className="py-4 pl-4">
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border border-white/20" />
                     <span className="text-sm text-gray-600 font-mono">#{String(data.length + i + 1).padStart(3, '0')}</span>
                   </div>
                 </td>
                 <td className="py-4">
                    <span className="text-sm text-gray-700">---</span>
                 </td>
                 <td className="py-4 text-right pr-4">
                    <span className="text-sm text-gray-700">---</span>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
