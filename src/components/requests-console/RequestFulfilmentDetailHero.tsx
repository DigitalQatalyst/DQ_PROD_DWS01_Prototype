import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MonoId } from '../MonoId';
import { RequestStatusPill } from './RequestStatusPill';
import { PriorityPill } from './PriorityPill';
import { SlaStatusPill } from './SlaStatusPill';
import { QueueBadge } from './QueueBadge';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface Props {
  request: FulfilmentRequestRow;
}

export function RequestFulfilmentDetailHero({ request }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-card border border-border-default p-6 lg:p-8 mb-6">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
        <button onClick={() => navigate('/stage-03/requests-console')} className="hover:text-primary font-medium">Stage 03</button>
        <ChevronRight size={12} />
        <button onClick={() => navigate('/stage-03/requests-console')} className="hover:text-primary font-medium">Requests Console</button>
        <ChevronRight size={12} />
        <span className="font-semibold text-text-primary">{request.id}</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <MonoId value={request.id} />
            <RequestStatusPill status={request.fulfilmentStatus} />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-primary mb-3">{request.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <QueueBadge queue={request.queue} />
            <PriorityPill priority={request.priority} />
            <SlaStatusPill state={request.slaState} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/stage-03/requests-console')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button border border-border-strong bg-white text-xs font-semibold text-primary hover:bg-surface transition-colors"
          >
            <ExternalLink size={13} />
            Back to Console
          </button>
        </div>
      </div>
    </div>
  );
}
