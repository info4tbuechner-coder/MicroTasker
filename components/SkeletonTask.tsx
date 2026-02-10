
import React from 'react';

const SkeletonTask: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm animate-skeleton">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
          <div className="h-2 bg-slate-50 rounded-full w-1/4"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 bg-slate-100 rounded-lg w-16"></div>
          <div className="h-12 bg-slate-100 rounded-2xl w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTask;
