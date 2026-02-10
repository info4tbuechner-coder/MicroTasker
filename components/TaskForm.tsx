
import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (description: string, reward: number) => void;
  balance: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, balance }) => {
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rewardValue = parseFloat(reward.replace(',', '.'));

    if (!description.trim()) {
      setError('Die Beschreibung darf nicht leer sein.');
      return;
    }
    if (isNaN(rewardValue) || rewardValue <= 0) {
      setError('Die Belohnung muss eine positive Zahl sein.');
      return;
    }
    if (rewardValue > balance) {
        setError('Guthaben nicht ausreichend.');
        return;
    }

    onAddTask(description, rewardValue);
    setDescription('');
    setReward('');
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Aufgabe erstellen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">
            Beschreibung
          </label>
          <input
            id="description"
            type="text"
            enterKeyHint="next"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was ist zu tun?"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label htmlFor="reward" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1">
            Belohnung (€)
          </label>
          <input
            id="reward"
            type="number"
            inputMode="decimal"
            enterKeyHint="done"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
        >
          Aufgabe veröffentlichen
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
