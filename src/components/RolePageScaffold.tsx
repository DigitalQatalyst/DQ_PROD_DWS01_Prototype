import type { ReactNode } from 'react';
import { DqButton } from './DqButton';
interface RolePageScaffoldProps {
  eyebrow: string;
  title: string;
  purpose: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  kpiStrip?: ReactNode;
  filterRow?: ReactNode;
  /** Legacy props kept for page compatibility during scaffold migration. */
  loading?: boolean;
  kpis?: unknown;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: ReactNode;
}
export function RolePageScaffold({
  eyebrow,
  title,
  purpose,
  primaryAction,
  secondaryAction,
  kpiStrip,
  filterRow,
  children
}: RolePageScaffoldProps) {
  return <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <div className="dq-overline mb-2">
          {eyebrow}
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="dq-page-title mb-2">{title}</h1>
            <p className="text-sm leading-6 text-text-secondary">{purpose}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {secondaryAction && <DqButton onClick={secondaryAction.onClick} variant="outline">
                {secondaryAction.label}
              </DqButton>}
            {primaryAction && <DqButton onClick={primaryAction.onClick} variant="orange">
                {primaryAction.label}
              </DqButton>}
          </div>
        </div>
      </div>

      {kpiStrip && <div className="mb-8">{kpiStrip}</div>}

      {filterRow && <div className="mb-6">{filterRow}</div>}

      <div>{children}</div>
    </div>;
}
