
import React, { useMemo } from 'react';
import { UserStats } from '../types';

interface ProgressBarProps {
  stats: UserStats;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  const xpThreshold = stats.level * 100;
  const progress = useMemo(() => (stats.xp / xpThreshold) * 100, [stats.xp, xpThreshold]);

  return (
    <div className="sticky top-[72px] md:top-[88px] z-40 bg-white/70 backdrop-blur-xl px-4 py-3 border-b border-slate-200/60 shadow-sm transition-all">
      <div className="container mx-auto max-w-3xl flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Status</span>
          <div className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter">
            Lvl {stats.level}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-bold text-slate-500 uppercase">XP Fortschritt</span>
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               {stats.xp} / {xpThreshold}
             </span>
          </div>
          <div className="h-2.5 bg-slate-200/50 rounded-full overflow-hidden border border-slate-100">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
