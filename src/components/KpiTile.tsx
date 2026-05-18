import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
interface KpiTileProps {
  label: string;
  value: string;
  trend?: string;
  status: 'success' | 'warning' | 'danger' | 'info';
}
export function KpiTile({
  label,
  value,
  trend,
  status
}: KpiTileProps) {
  const statusConfig = {
    success: {
      bg: 'bg-success-surface',
      text: 'text-success-text',
      border: 'border-success/20'
    },
    warning: {
      bg: 'bg-warning-surface',
      text: 'text-warning-text',
      border: 'border-warning/20'
    },
    danger: {
      bg: 'bg-danger-surface',
      text: 'text-danger-text',
      border: 'border-danger/20'
    },
    info: {
      bg: 'bg-info-surface',
      text: 'text-info-text',
      border: 'border-info/20'
    }
  };
  const config = statusConfig[status];
  const renderTrend = () => {
    if (!trend) return null;
    const isPositive = trend.startsWith('+');
    const isNegative = trend.startsWith('-');
    let Icon = Minus;
    let colorClass = 'text-text-muted';
    if (isPositive) {
      Icon = ArrowUpRight;
      colorClass = 'text-success';
    } else if (isNegative) {
      Icon = ArrowDownRight;
      colorClass = 'text-danger';
    }
    return <div className={`flex items-center gap-1 text-xs font-medium ${colorClass}`}>
        <Icon size={14} />
        {trend}
      </div>;
  };
  return <div className={`min-h-[108px] rounded-card p-4 flex flex-col justify-between border ${config.border} ${config.bg} transition-shadow hover:shadow-sm`}>
      <div className="text-sm font-medium text-text-secondary">{label}</div>
      <div className="flex items-end justify-between mt-2">
        <div className={`text-2xl font-bold ${config.text}`}>{value}</div>
        {renderTrend()}
      </div>
    </div>;
}