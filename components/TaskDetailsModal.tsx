
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTaskHint } from '../services/geminiService';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setLoading(true);
      getTaskHint(task.description).then(h => {
        setHint(h);
        setLoading(false);
      });
    } else {
      setHint(null);
    }
  }, [task]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">KI-Assistent</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guide & Briefing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aufgabe</p>
            <p className="text-lg font-bold text-slate-800 leading-tight">{task.description}</p>
          </div>

          <div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Gemini Pro Tipp
            </p>
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
              </div>
            ) : (
              <p className="text-slate-600 leading-relaxed font-medium italic">
                "{hint}"
              </p>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all mt-4"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
