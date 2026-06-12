import type { ReactNode } from 'react';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
  className?: string;
}

export function DashboardWidget({ title, children, action, onAction, className = '' }: DashboardWidgetProps) {
  return (
    <div className={`dq-card flex flex-col ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</h3>
        {action && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-secondary hover:underline"
          >
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
