
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (id: string, reward: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onCompleteTask }) => {
  if (tasks.length === 0) {
    return (
        <div className="text-center py-16 px-6 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Keine Aufträge</h3>
            <p className="mt-2 text-xs text-slate-400 font-bold uppercase tracking-wider">Erstelle den ersten Auftrag oben!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onCompleteTask={onCompleteTask} />
      ))}
    </div>
  );
};

export default TaskList;
