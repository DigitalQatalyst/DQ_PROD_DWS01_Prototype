import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import type { Service } from '../types/serviceLifecycle';
import { getServiceCategoryCode } from '../utils/serviceCategoryCodes';
import { MarketplaceCatalogCard } from './marketplace/MarketplaceCatalogCard';

function RiskBadge({ risk }: { risk: Service['risk'] }) {
  if (risk === 'Standard') return null;

  const config = {
    'Governance-sensitive': {
      label: 'Governed',
      className: 'bg-warning-surface text-warning-text',
    },
    'Review-sensitive': {
      label: 'Review',
      className: 'bg-info-surface text-info-text',
    },
    'At Risk': {
      label: 'Priority',
      className: 'bg-orange-100 text-orange-600',
    },
  }[risk];

  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] ${config.className}`}
    >
      {risk === 'At Risk' && <ShieldAlert className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('from') || 'deploy';

  return (
    <MarketplaceCatalogCard
      typeLabel={`${getServiceCategoryCode(service.category)} · Service`}
      metaLabel={`SLA ${service.sla} · ${service.approval}`}
      title={service.title}
      description={service.description}
      footerId={service.id}
      badge={<RiskBadge risk={service.risk} />}
      highlighted={
        service.risk !== 'Standard' || service.approval === 'Required'
      }
      onClick={() => navigate(`/marketplace/services/${service.id}?from=${stage}`)}
    />
  );
}
