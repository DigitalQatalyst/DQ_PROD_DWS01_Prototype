import React, { useState } from 'react';
import { Check, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { TimelineEvent } from '../types/serviceLifecycle';

interface RequestStatusTimelineProps {
  timeline: TimelineEvent[];
}

export function RequestStatusTimeline({ timeline }: RequestStatusTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({});

  const toggleEvent = (index: number) => {
    setExpandedEvents(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <h2 className="text-lg font-bold text-primary mb-8">Request Progression</h2>

      <div className="flex flex-col gap-0">
        {timeline.map((event, i) => {
          const isCompleted = event.status === 'completed';
          const isActive = event.status === 'active';
          const isPending = event.status === 'pending';
          const isExpanded = expandedEvents[i];
          const isLast = i === timeline.length - 1;

          return (
            <div key={i} className="flex gap-4 sm:gap-6 group">
              {/* Icon + connector column */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-white z-10
                    ${isCompleted ? 'border-success-text text-success-text' :
                      isActive ? 'border-primary text-primary shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)]' :
                      'border-border-strong text-border-strong'}`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> :
                    isActive ? <Clock size={16} strokeWidth={2.5} /> :
                    <Circle size={10} className="fill-current" />}
                </div>
                {/* Connector line to next item */}
                {!isLast && (
                  <div className="w-px flex-1 bg-border-strong my-1" />
                )}
              </div>

              {/* Content card */}
              <div className={`flex-1 ${isLast ? 'mb-0' : 'mb-4'}`}>
                <div
                  className="bg-surface/30 rounded-md border border-border-subtle hover:border-border-strong transition-colors cursor-pointer"
                  onClick={() => toggleEvent(i)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className={`text-sm font-bold ${isPending ? 'text-text-muted' : 'text-primary'}`}>
                        {event.label}
                      </h3>
                      {event.timestamp && (
                        <p className="text-xs font-medium text-text-muted mt-0.5">
                          {new Date(event.timestamp).toLocaleString('en-GB', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="text-text-muted group-hover:text-primary transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
