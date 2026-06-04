import React from 'react';
import { KpiTile } from '../KpiTile';

export interface RequestsConsoleKpiValues {
  active: number;
  slaAtRisk: number;
  breached: number;
  blocked: number;
  closureReview: number;
  reopened: number;
}

interface RequestsConsoleKpiStripProps {
  values: RequestsConsoleKpiValues;
  loading?: boolean;
}

const KPI_CONFIG: {
  key: keyof RequestsConsoleKpiValues;
  label: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}[] = [
  { key: 'active', label: 'Active fulfilment requests', status: 'info' },
  { key: 'slaAtRisk', label: 'SLA at risk', status: 'warning' },
  { key: 'breached', label: 'Breached', status: 'danger' },
  { key: 'blocked', label: 'Blocked', status: 'warning' },
  { key: 'closureReview', label: 'Closure Review', status: 'info' },
  { key: 'reopened', label: 'Reopened', status: 'warning' },
];

export function RequestsConsoleKpiStrip({ values, loading }: RequestsConsoleKpiStripProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[108px] rounded-card bg-white border border-border-default animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {KPI_CONFIG.map(({ key, label, status }) => (
        <KpiTile key={key} label={label} value={String(values[key])} status={status} />
      ))}
    </div>
  );
}
