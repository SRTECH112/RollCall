import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal } from 'lucide-react';

const PodiumStep = ({ user, rank, delay }) => {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  // Height of the podium block
  const heightClass = isFirst ? 'h-48' : isSecond ? 'h-32' : 'h-24';
  
  // Color styling based on rank
  const rankColor = isFirst 
    ? 'text-yellow-400' 
    : isSecond 
      ? 'text-gray-300' 
      : 'text-amber-600';
      
  const bgGradient = isFirst
    ? 'bg-linear-to-t from-yellow-500/20 to-yellow-500/5'
    : isSecond
      ? 'bg-linear-to-t from-gray-400/20 to-gray-400/5'
      : 'bg-linear-to-t from-amber-600/20 to-amber-600/5';

  const borderColor = isFirst
    ? 'border-yellow-500/30'
    : isSecond
      ? 'border-gray-400/30'
      : 'border-amber-600/30';

  return (
    <div className={`flex flex-col items-center ${isFirst ? 'order-2 -mt-12 z-10' : isSecond ? 'order-1' : 'order-3'}`}>
      {/* Avatar/Emoji with Glow */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
        className="relative mb-4"
      >
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-dark-800 border ${borderColor} shadow-lg relative z-10`}>
          <span className="text-4xl">{user.emoji || '👤'}</span>
          
          {/* Rank Badge */}
          <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-dark-800 border ${borderColor} shadow-sm`}>
            {isFirst && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            {isSecond && <span className="font-bold text-gray-300">2</span>}
            {isThird && <span className="font-bold text-amber-600">3</span>}
          </div>
        </div>
        
        {/* Glow effect behind avatar */}
        <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 ${isFirst ? 'bg-yellow-500' : isSecond ? 'bg-gray-400' : 'bg-amber-600'} -z-10`} />
      </motion.div>

      {/* User Info */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
        className="text-center mb-2"
      >
        <h3 className="text-white font-bold text-lg truncate max-w-[120px]">{user.nickname}</h3>
        <p className={`${rankColor} font-medium text-sm`}>{user.displayScore} pts</p>
      </motion.div>

      {/* Podium Block */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: isFirst ? 192 : isSecond ? 128 : 96 }} // 48/32/24 * 4
        transition={{ delay: delay + 0.1, duration: 0.5, ease: "backOut" }}
        className={`w-32 rounded-t-lg backdrop-blur-sm border-x border-t ${borderColor} ${bgGradient} flex flex-col items-center justify-start pt-4 relative`}
      >
        <div className={`text-2xl font-bold ${rankColor}`}>
           {isFirst && <Trophy className="w-8 h-8 mb-2" />}
        </div>
        
        {/* Prize/Reward Placeholder */}
        <div className="mt-auto mb-4 flex flex-col items-center">
             <span className="text-xs text-dark-text-muted uppercase tracking-wider">Bonus</span>
             <div className="flex items-center gap-1 text-nexblue-400 font-bold">
                <span>✨</span>
                <span>{isFirst ? 500 : isSecond ? 250 : 100} XP</span>
             </div>
        </div>
      </motion.div>
    </div>
  );
};

const Podium = ({ topUsers, scoreKey }) => {
  // Ensure we have 3 slots, fill with placeholders if needed
  const podiumData = [
    topUsers[1] || { id: 'p2', nickname: 'Empty', emoji: '👻', displayScore: 0 }, // 2nd place (Left)
    topUsers[0] || { id: 'p1', nickname: 'Empty', emoji: '👻', displayScore: 0 }, // 1st place (Center)
    topUsers[2] || { id: 'p3', nickname: 'Empty', emoji: '👻', displayScore: 0 }  // 3rd place (Right)
  ];

  return (
    <div className="flex justify-center items-end gap-4 mb-12 min-h-[350px]">
      {podiumData.map((user, index) => {
        // Map display index to actual rank
        // Index 0 is 2nd place, Index 1 is 1st place, Index 2 is 3rd place
        const rank = index === 0 ? 2 : index === 1 ? 1 : 3;
        
        // Calculate display score based on selected metric
        const score = user[scoreKey] || 0;
        const userWithScore = { ...user, displayScore: score };
        
        return (
          <PodiumStep 
            key={user.id || `placeholder-${rank}`} 
            user={userWithScore} 
            rank={rank} 
            delay={index * 0.2} 
          />
        );
      })}
    </div>
  );
};

export default Podium;
