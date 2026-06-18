import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
interface KpiTileProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  icon?: LucideIcon;
}
export function KpiTile({
  label,
  value,
  subtitle,
  trend,
  status,
  icon: Icon
}: KpiTileProps) {
  const statusConfig = {
    success: {
      iconBg: 'bg-success-surface',
      text: 'text-success-text',
      accent: 'border-t-success'
    },
    warning: {
      iconBg: 'bg-warning-surface',
      text: 'text-warning-text',
      accent: 'border-t-warning'
    },
    danger: {
      iconBg: 'bg-danger-surface',
      text: 'text-danger-text',
      accent: 'border-t-danger'
    },
    info: {
      iconBg: 'bg-info-surface',
      text: 'text-info-text',
      accent: 'border-t-info'
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
    return <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${colorClass}`}>
        <Icon size={14} strokeWidth={1.5} />
        {trend}
      </div>;
  };
  return <div className={`dq-card dq-card-clickable min-h-[124px] border-t-4 ${config.accent}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] font-semibold text-primary">{label}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-primary">{value}</div>
        </div>
        {Icon && <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-button ${config.iconBg} ${config.text}`}>
            <Icon size={20} strokeWidth={1.5} />
          </div>}
      </div>
      <div>
        {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
        {renderTrend()}
      </div>
    </div>;
}
