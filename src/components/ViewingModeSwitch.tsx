import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useViewingMode } from '../context/ViewingModeContext';
export function ViewingModeSwitch() {
  const {
    mode,
    setMode
  } = useViewingMode();
  return <div className="flex items-center h-10 rounded-pill bg-surface border border-border-subtle p-0.5" role="group" aria-label="Viewing mode">
      <button onClick={() => setMode('first-time')} aria-pressed={mode === 'first-time'} title="Show orientation and onboarding content" className={`flex items-center gap-1.5 h-full px-3 rounded-pill text-xs font-semibold transition-all ${mode === 'first-time' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
        <Sparkles size={13} />
        New Joiner
      </button>
      <button onClick={() => setMode('returning')} aria-pressed={mode === 'returning'} title="Show continuation and execution content" className={`flex items-center gap-1.5 h-full px-3 rounded-pill text-xs font-semibold transition-all ${mode === 'returning' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-primary'}`}>
        <RotateCcw size={13} />
        Returning
      </button>
    </div>;
}