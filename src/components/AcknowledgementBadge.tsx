import React from 'react';
import { AcknowledgementState } from '../types/knowledgeDiscovery';
import { CheckCircle2, Clock, MinusCircle } from 'lucide-react';

interface AcknowledgementBadgeProps {
  state: AcknowledgementState;
  size?: 'sm' | 'md';
}

export function AcknowledgementBadge({ state, size = 'sm' }: AcknowledgementBadgeProps) {
  const config = {
    Acknowledged: { icon: CheckCircle2, cls: 'bg-success/10 text-success', label: 'Acknowledged' },
    Pending: { icon: Clock, cls: 'bg-warning/10 text-warning', label: 'Pending' },
    'Not Required': { icon: MinusCircle, cls: 'bg-surface text-text-muted ring-1 ring-border-subtle', label: 'Not Required' },
  }[state];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bold ${config.cls} ${textSize}`}>
      <Icon size={iconSize} />
      {config.label}
    </span>
  );
}
