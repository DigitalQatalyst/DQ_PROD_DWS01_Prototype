import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Service } from '../types/serviceLifecycle';
import { formatServiceSla } from '../utils/formatServiceSla';

function RiskBadge({ risk }: { risk: Service['risk'] }) {
  if (risk === 'Standard') return null;

  const labels: Record<string, string> = {
    'Governance-sensitive': 'Governed',
    'Review-sensitive': 'Review',
    'At Risk': 'Priority',
  };

  return (
    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary">
      {labels[risk]}
    </span>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('from') || 'deploy';
  const approvalText = service.approvalLabel ?? service.approval;
  const slaText = formatServiceSla(service.sla);

  return (
    <button
      type="button"
      onClick={() => navigate(`/marketplace/services/${service.id}?from=${stage}`)}
      className="group flex h-full w-full flex-col rounded-xl border border-border-default bg-white p-5 text-left transition hover:border-secondary/30 hover:shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#f6f6fb] px-2.5 py-1 text-[11px] font-medium text-text-secondary">
          {service.domain ?? service.category}
        </span>
        <div className="flex items-center gap-2">
          <RiskBadge risk={service.risk} />
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-text-disabled transition group-hover:text-secondary"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <h3 className="text-[15px] font-bold leading-snug text-primary">{service.title}</h3>

      <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-text-muted">
        {service.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border-subtle pt-3 text-[11px] text-text-muted">
        <span>{slaText}</span>
        <span className="text-border-strong">·</span>
        <span>{approvalText}</span>
      </div>
    </button>
  );
}
