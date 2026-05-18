import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
interface Stage0SetupChecklistProps {
  items: {
    id: string;
    label: string;
    completed: boolean;
  }[];
  toggleItem: (id: string) => void;
}
export function Stage0SetupChecklist({
  items,
  toggleItem
}: Stage0SetupChecklistProps) {
  const completedCount = items.filter((i) => i.completed).length;
  return <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary mb-1">
          First-time setup checklist
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Complete these items before entering daily execution.
        </p>
        <div className="flex items-center justify-between text-xs font-medium text-text-muted">
          <span>Progress</span>
          <span>
            {completedCount} of {items.length} complete
          </span>
        </div>
        <div className="w-full bg-border-subtle rounded-full h-1.5 mt-2">
          <div className="bg-success h-1.5 rounded-full transition-all duration-300" style={{
          width: `${completedCount / items.length * 100}%`
        }} />
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item) => <button key={item.id} onClick={() => toggleItem(item.id)} className="w-full flex items-center gap-3 p-3 rounded-button hover:bg-surface transition-colors text-left group">
            {item.completed ? <CheckCircle2 size={20} className="text-success shrink-0" /> : <Circle size={20} className="text-text-disabled group-hover:text-text-muted shrink-0" />}
            <span className={`text-sm font-medium ${item.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {item.label}
            </span>
          </button>)}
      </div>
    </div>;
}