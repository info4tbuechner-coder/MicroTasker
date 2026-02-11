
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (id: string, reward: number) => void;
  onShowDetails: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onCompleteTask, onShowDetails }) => {
  if (tasks.length === 0) {
    return (
        <div className="text-center py-16 px-6 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Keine Aufträge</h3>
            <p className="mt-2 text-xs text-slate-400 font-bold uppercase tracking-wider">Komm später wieder vorbei!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onCompleteTask={onCompleteTask} onShowDetails={onShowDetails} />
      ))}
    </div>
  );
};

export default TaskList;
