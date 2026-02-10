
import React from 'react';

interface HeaderProps {
  balance: number;
  isOnline?: boolean;
  onInstall?: () => void;
  onRefresh?: () => void;
}

const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ balance, isOnline = true, onInstall, onRefresh }) => {
  return (
    <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 -mx-4 px-4 py-4 md:mx-0 md:rounded-3xl shadow-lg shadow-slate-200/50 border-b md:border border-white/50 transition-all">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tighter">
              TASKER<span className="text-emerald-500">.</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                {isOnline ? 'Network Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onInstall && (
            <button 
              onClick={onInstall}
              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 active:scale-90 transition-transform"
              aria-label="App installieren"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl border border-slate-200 active:rotate-180 transition-transform duration-500"
              aria-label="Aktualisieren"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2.5 bg-emerald-600 p-2.5 px-4 rounded-2xl shadow-md shadow-emerald-200 border border-emerald-500 active:scale-95 transition-transform">
            <WalletIcon className="h-4 w-4 text-emerald-100" />
            <span className="text-sm font-black text-white">
              {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
