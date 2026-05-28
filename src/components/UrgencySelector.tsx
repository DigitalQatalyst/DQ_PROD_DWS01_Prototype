import React from 'react';

interface UrgencySelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const urgencies = ['Low', 'Normal', 'High', 'Critical'];

const urgencyDescriptions: Record<string, string> = {
  Low: 'No strict timeline; process when possible.',
  Normal: 'Standard business impact; SLA applies.',
  High: 'Significant business impact; prioritize.',
  Critical: 'Severe blocker or outage; immediate action required.',
};

export function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-2">
        Urgency Level
      </label>
      <div className="flex bg-surface p-1 rounded-lg border border-border-subtle">
        {urgencies.map((u) => (
          <button
            key={u}
            onClick={() => onChange(u)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              value === u
                ? 'bg-white shadow-sm text-primary border border-border-subtle'
                : 'text-text-secondary hover:text-primary hover:bg-white/50'
            }`}
          >
            {u}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-muted mt-2">
        {urgencyDescriptions[value]}
      </p>
    </div>
  );
}
