
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SkeletonTask from './components/SkeletonTask';
import { generateInitialTasks } from './services/geminiService';

const App: React.FC = () => {
  // Persistence Initialization
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('tasker_balance');
    return saved ? parseFloat(saved) : 20.00;
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasker_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(tasks.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tasker_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('tasker_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Network & Install Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const fetchInitialTasks = useCallback(async () => {
    if (!isOnline && tasks.length > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const generatedTasks = await generateInitialTasks();
      const tasksWithIds = generatedTasks.map((task, index) => ({
        ...task,
        id: `${Date.now()}-${index}`
      }));
      setTasks(prev => tasks.length === 0 ? tasksWithIds : [...tasksWithIds, ...prev].slice(0, 15));
    } catch (err) {
      if (tasks.length === 0) {
        setError("Aufgaben konnten nicht geladen werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, tasks.length]);

  useEffect(() => {
    if (tasks.length === 0) {
      fetchInitialTasks();
    }
  }, [fetchInitialTasks, tasks.length]);

  const handleAddTask = (description: string, reward: number) => {
    if (balance >= reward) {
      if (navigator.vibrate) navigator.vibrate(15);
      const newTask: Task = {
        id: Date.now().toString(),
        description,
        reward,
      };
      setTasks(prev => [newTask, ...prev]);
      setBalance(prev => prev - reward);
    }
  };

  const handleCompleteTask = (id: string, reward: number) => {
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    setTasks(prev => prev.filter(task => task.id !== id));
    setBalance(prev => prev + reward);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans pb-safe selection:bg-emerald-100">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl pt-[env(safe-area-inset-top,1rem)]">
        <Header 
          balance={balance} 
          isOnline={isOnline} 
          onInstall={deferredPrompt ? handleInstall : undefined}
          onRefresh={fetchInitialTasks}
        />
        
        {!isOnline && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-bold rounded-xl text-center shadow-sm">
            OFFLINE &bull; Daten werden lokal gespeichert
          </div>
        )}

        <main className="mt-6">
          <TaskForm onAddTask={handleAddTask} balance={balance} />
          
          <div className="mt-8">
            <h2 className="text-xl font-black text-slate-800 mb-4 px-1 flex items-center justify-between">
              Marktplatz
              {isLoading && <span className="text-[10px] text-emerald-500 animate-pulse">Synchronisiere...</span>}
            </h2>
            
            <div className="space-y-4">
              {isLoading && tasks.length === 0 ? (
                <>
                  <SkeletonTask />
                  <SkeletonTask />
                  <SkeletonTask />
                </>
              ) : error && tasks.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold mb-4">{error}</p>
                  <button onClick={fetchInitialTasks} className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Neu laden</button>
                </div>
              ) : (
                <TaskList tasks={tasks} onCompleteTask={handleCompleteTask} />
              )}
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 mb-8 text-slate-400 text-[9px] uppercase tracking-[0.3em] font-black opacity-50">
          <p>Micro Tasker Pro &bull; Cloud Sync &bull; Secure</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
