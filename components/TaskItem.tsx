
import React, { useState, memo } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onCompleteTask: (id: string, reward: number) => void;
  onShowDetails: (task: Task) => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  const icons: Record<string, string> = {
    photo: '📸', text: '✍️', research: '🔍', creative: '💡', technical: '⚙️'
  };
  return <span className="drop-shadow-sm">{icons[category] || '📋'}</span>;
};

const TaskItem: React.FC<TaskItemProps> = memo(({ task, onCompleteTask, onShowDetails }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    setIsExiting(true);
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => onCompleteTask(task.id, task.reward), 450);
  };

  return (
    <div 
      onClick={() => onShowDetails(task)}
      className={`
        group bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 cursor-pointer
        flex flex-col sm:flex-row justify-between items-start sm:items-center 
        space-y-4 sm:space-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform 
        hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-emerald-200
        ${isExiting ? 'opacity-0 -translate-x-full scale-95 pointer-events-none' : 'opacity-100 translate-x-0'} 
        active:scale-[0.98] animate-in fade-in slide-in-from-right-8
      `}
    >
      <div className="flex items-center gap-5 flex-1 mr-4">
        <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-2xl shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
          <CategoryIcon category={task.category} />
        </div>
        <div>
          <h3 className={`text-slate-800 font-bold leading-tight tracking-tight text-lg transition-colors ${isExiting ? 'text-emerald-600' : ''}`}>
            {task.description}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
              {task.category}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
              +10 XP
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Belohnung</span>
          <span className={`text-2xl font-black whitespace-nowrap transition-all duration-300 ${isExiting ? 'text-emerald-700 scale-110' : 'text-slate-900'}`}>
            {task.reward.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <button
          onClick={handleComplete}
          disabled={isExiting}
          className={`
            px-8 py-4 font-black rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-2 text-sm
            ${isExiting 
              ? 'bg-emerald-800 text-white scale-90' 
              : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 active:scale-95 hover:shadow-emerald-300'
            }
          `}
        >
          {isExiting ? '...' : 'Erledigen'}
        </button>
      </div>
    </div>
  );
});

export default TaskItem;
