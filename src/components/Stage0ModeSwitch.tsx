import React from 'react';
interface Stage0ModeSwitchProps {
  mode: 'first-time' | 'returning';
  setMode: (mode: 'first-time' | 'returning') => void;
}
export function Stage0ModeSwitch({
  mode,
  setMode
}: Stage0ModeSwitchProps) {
  return <div className="flex flex-col items-center my-16">
      <div className="text-sm font-medium text-text-muted mb-3">
        Viewing mode
      </div>
      <div className="inline-flex bg-surface p-1 rounded-pill border border-border-default">
        <button onClick={() => setMode('first-time')} className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all ${mode === 'first-time' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
          First-time / New Joiner
        </button>
        <button onClick={() => setMode('returning')} className={`px-6 py-2.5 rounded-pill text-sm font-semibold transition-all ${mode === 'returning' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
          Returning User
        </button>
      </div>
    </div>;
}