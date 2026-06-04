import React from 'react';

interface QueueBadgeProps {
  queue: string;
}

export function QueueBadge({ queue }: QueueBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-pill bg-navy-50 text-primary text-[11px] font-semibold leading-none">
      {queue}
    </span>
  );
}
