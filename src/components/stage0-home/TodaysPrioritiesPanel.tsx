import React from 'react';
import { ChevronRight, ClipboardList, ListTodo, Play } from 'lucide-react';
import { toast } from 'sonner';
import { todaysPriorities } from '../../mocks/stage0Home.mock';

const icons = [Play, ListTodo, ClipboardList];

export function TodaysPrioritiesPanel() {
  const handleClick = (id: string) => {
    if (id === 'resume') {
      toast.info('Opening REQ-2401 · Access & Permission Request for this prototype.');
      return;
    }
    if (id === 'queue') {
      toast.info('Opening My Work action queue filtered for today.');
      return;
    }
    toast.info('Opening pending reviews and handoffs for this prototype.');
  };

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-semibold text-primary">Today&apos;s Priorities</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {todaysPriorities.map((card, index) => {
          const Icon = icons[index] ?? Play;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleClick(card.id)}
              className="flex items-center gap-4 rounded-card border border-border-subtle bg-white px-5 py-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border-default hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-primary">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-primary">{card.title}</h3>
                <p className="mt-1 truncate text-sm font-medium text-text-secondary">{card.primary}</p>
                <p className="mt-0.5 text-xs text-text-muted">{card.secondary}</p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-text-muted" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
