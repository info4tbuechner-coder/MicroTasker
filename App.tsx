
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, UserStats, AppState } from './types';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ProgressBar from './components/ProgressBar';
import SkeletonTask from './components/SkeletonTask';
import Toast from './components/Toast';
import TaskDetailsModal from './components/TaskDetailsModal';
import { generateInitialTasks } from './services/geminiService';

const CACHE_TTL = 30 * 60 * 1000;
const XP_PER_TASK = 10;

const App: React.FC = () => {
  // Centralized persistence
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('tasker_app_state');
    if (saved) return JSON.parse(saved);
    return {
      balance: 20.00,
      tasks: [],
      stats: { totalEarned: 0, tasksCompleted: 0, xp: 0, level: 1 },
      lastSync: 0
    };
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('tasker_app_state', JSON.stringify(appState));
  }, [appState]);

  // Online Detection
  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const fetchTasks = useCallback(async (isBackground = false) => {
    if (!isOnline) return;
    setIsSyncing(true);
    try {
      const generated = await generateInitialTasks();
      const newTasks: Task[] = generated.map((t, i) => ({
        ...t,
        id: `gen-${Date.now()}-${i}`,
        category: t.category || 'creative'
      }));
      
      setAppState(prev => ({
        ...prev,
        tasks: [...prev.tasks.filter(t => !t.id.startsWith('gen-')), ...newTasks].slice(0, 15),
        lastSync: Date.now()
      }));
      setToastMessage(isBackground ? "Neue Chancen verfügbar!" : "Marktplatz aktualisiert.");
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  useEffect(() => {
    const shouldRefresh = Date.now() - appState.lastSync > CACHE_TTL;
    if (appState.tasks.length === 0 || shouldRefresh) {
      fetchTasks(appState.tasks.length > 0);
    }
  }, [fetchTasks, appState.lastSync, appState.tasks.length]);

  const handleCompleteTask = useCallback((id: string, reward: number) => {
    setAppState(prev => {
      const newXp = prev.stats.xp + XP_PER_TASK;
      const nextThreshold = prev.stats.level * 100;
      const leveledUp = newXp >= nextThreshold;
      
      return {
        ...prev,
        balance: prev.balance + reward,
        tasks: prev.tasks.filter(t => t.id !== id),
        stats: {
          ...prev.stats,
          tasksCompleted: prev.stats.tasksCompleted + 1,
          totalEarned: prev.stats.totalEarned + reward,
          xp: leveledUp ? newXp - nextThreshold : newXp,
          level: leveledUp ? prev.stats.level + 1 : prev.stats.level
        }
      };
    });
    setToastMessage(`+${reward.toFixed(2)}€ & +10 XP!`);
  }, []);

  const handleAddTask = useCallback((desc: string, rew: number) => {
    const newTask: Task = { 
      id: `user-${Date.now()}`, 
      description: desc, 
      reward: rew, 
      category: 'creative' 
    };
    setAppState(prev => ({
      ...prev,
      balance: prev.balance - rew,
      tasks: [newTask, ...prev.tasks]
    }));
    setToastMessage("Aufgabe veröffentlicht!");
  }, []);

  const handleShowDetails = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen font-sans pb-safe flex flex-col selection:bg-emerald-200">
      <Header 
        balance={appState.balance} 
        isOnline={isOnline} 
        onRefresh={() => fetchTasks(false)} 
        isSyncing={isSyncing} 
      />
      
      <ProgressBar stats={appState.stats} />

      <div className="container mx-auto px-4 md:px-8 max-w-3xl pt-8 flex-1">
        <main className="space-y-12">
          <TaskForm onAddTask={handleAddTask} balance={appState.balance} />
          
          <section>
            <div className="flex justify-between items-end mb-8 px-1">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Marktplatz</h2>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                  Echtzeit-Angebote &bull; {appState.tasks.length} aktiv
                </p>
              </div>
              {isSyncing && (
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  Syncing
                </div>
              )}
            </div>
            
            <div className="space-y-5">
              {appState.tasks.length === 0 && isSyncing ? (
                <><SkeletonTask /><SkeletonTask /><SkeletonTask /></>
              ) : (
                <TaskList 
                  tasks={appState.tasks} 
                  onCompleteTask={handleCompleteTask} 
                  onShowDetails={handleShowDetails}
                />
              )}
            </div>
          </section>
        </main>
        
        <footer className="mt-20 py-10 border-t border-slate-200 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
             Tasker Pro &bull; {new Date().getFullYear()} &bull; Performance Engine v2
           </p>
        </footer>
      </div>

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default App;
