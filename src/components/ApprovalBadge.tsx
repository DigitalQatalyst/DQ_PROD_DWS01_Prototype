import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import type { ApprovalRequirement } from '../types/serviceLifecycle';

interface ApprovalBadgeProps {
  requirement: ApprovalRequirement;
  label?: string;
}

const config: Record<ApprovalRequirement, {
  bg: string;
  text: string;
  icon: typeof ShieldCheck;
}> = {
  'Required': {
    bg: 'bg-warning-surface',
    text: 'text-warning-text',
    icon: ShieldAlert,
  },
  'Conditional': {
    bg: 'bg-info-surface',
    text: 'text-info-text',
    icon: ShieldQuestion,
  },
  'Not Required': {
    bg: 'bg-success-surface',
    text: 'text-success-text',
    icon: ShieldCheck,
  },
};

export function ApprovalBadge({ requirement, label }: ApprovalBadgeProps) {
  const { bg, text, icon: Icon } = config[requirement];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-button text-xs font-medium ${bg} ${text}`}
    >
      <Icon size={12} strokeWidth={1.5} />
      {label || requirement}
    </span>
  );
}
