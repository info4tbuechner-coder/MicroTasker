
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onCompleteTask: (id: string, reward: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onCompleteTask }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCompleteTask(task.id, task.reward);
    }, 300); // Zeit für die Animation
  };

  return (
    <div 
      className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 transition-all duration-300 transform ${isExiting ? 'opacity-0 scale-95 -translate-x-full' : 'opacity-100 scale-100'} active:bg-slate-50 touch-manipulation animate-in fade-in slide-in-from-right-4 duration-500`}
    >
      <div className="flex-1 mr-4">
        <p className="text-gray-800 font-bold leading-tight tracking-tight">{task.description}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Verfügbare Mikro-Aufgabe</p>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <span className="text-xl font-black text-emerald-600 whitespace-nowrap">
          {task.reward.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
        </span>
        <button
          onClick={handleComplete}
          aria-label={`Aufgabe erledigen für ${task.reward} Euro`}
          className="px-6 py-3 bg-emerald-600 text-white font-black rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-90 transition-all duration-200"
        >
          Erledigen
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
