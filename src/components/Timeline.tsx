import React from 'react';
import type { AuditEvent } from '../types/platform';
interface TimelineProps {
  events: AuditEvent[];
}
export function Timeline({
  events
}: TimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-sm text-text-muted italic">
        No timeline events available.
      </div>;
  }
  return <div className="relative pl-4 border-l-2 border-border-subtle space-y-6">
      {events.map((event, i) => {
      let dotColor = 'bg-primary';
      if (event.severity === 'Warning') dotColor = 'bg-warning';
      if (event.severity === 'Critical') dotColor = 'bg-danger';
      return <div key={event.id} className="relative">
            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${dotColor} ring-4 ring-white`} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-primary">
                {event.event}
              </span>
              <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                <span>{event.timestamp}</span>
                <span>•</span>
                <span>{event.actorUserId}</span>
              </div>
            </div>
          </div>;
    })}
    </div>;
}