
export type TaskCategory = 'photo' | 'text' | 'research' | 'creative' | 'technical';

export interface Task {
  id: string;
  description: string;
  reward: number;
  category: TaskCategory;
}

export interface UserStats {
  totalEarned: number;
  tasksCompleted: number;
  xp: number;
  level: number;
}

export interface AppState {
  balance: number;
  tasks: Task[];
  stats: UserStats;
  lastSync: number;
}
