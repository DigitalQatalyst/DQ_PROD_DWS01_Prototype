import React from 'react';
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
  kpiStrip?: React.ReactNode;
  filterRow?: React.ReactNode;
  children: React.ReactNode;
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
        <div className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider mb-2">
          {eyebrow}
        </div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#030F35] mb-2">{title}</h1>
            <p className="text-sm text-[#2E2E42]">{purpose}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {secondaryAction && <button onClick={secondaryAction.onClick} className="px-4 py-2 bg-white border border-[#D8D9E6] text-[#111118] text-sm font-medium rounded-[8px] hover:bg-[#F6F6FB] transition-colors">
                {secondaryAction.label}
              </button>}
            {primaryAction && <button onClick={primaryAction.onClick} className="px-4 py-2 bg-[#FB5535] text-white text-sm font-medium rounded-[8px] hover:bg-[#E04A2E] transition-colors">
                {primaryAction.label}
              </button>}
          </div>
        </div>
      </div>

      {kpiStrip && <div className="mb-8">{kpiStrip}</div>}

      {filterRow && <div className="mb-6">{filterRow}</div>}

      <div>{children}</div>
    </div>;
}