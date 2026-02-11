
import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (description: string, reward: number) => void;
  balance: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, balance }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rewardValue = parseFloat(reward.replace(',', '.'));

    if (!description.trim()) {
      setError('Beschreibung fehlt');
      return;
    }
    if (isNaN(rewardValue) || rewardValue <= 0) {
      setError('Ungültiger Betrag');
      return;
    }
    if (rewardValue > balance) {
        setError('Zu wenig Guthaben');
        return;
    }

    onAddTask(description, rewardValue);
    setDescription('');
    setReward('');
    setError('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Eigene Aufgabe ausschreiben
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black text-slate-800">Neue Aufgabe</h2>
        <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Beschreibung</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was soll getan werden?"
            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Belohnung (€)</label>
          <input
            type="number"
            inputMode="decimal"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="1.50"
            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-emerald-600"
          />
        </div>
        {error && <p className="text-xs font-bold text-red-500 animate-bounce">{error}</p>}
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
        >
          Veröffentlichen
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
