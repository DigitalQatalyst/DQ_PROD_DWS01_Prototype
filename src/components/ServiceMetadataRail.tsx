import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, ListTree, Clock, ShieldAlert, BookOpen } from 'lucide-react';
import type { ServiceDetail } from '../types/serviceLifecycle';

interface ServiceMetadataRailProps {
  detail: ServiceDetail;
}

export function ServiceMetadataRail({ detail }: ServiceMetadataRailProps) {
  const navigate = useNavigate();

  const handleStartRequest = () => {
    navigate(`/requests/start/${detail.serviceId}`);
  };

  return (
    <div className="bg-white rounded-card border border-border-default p-6 sticky top-[88px]">
      <button
        onClick={handleStartRequest}
        className="w-full py-3 px-4 bg-secondary text-white font-semibold text-sm rounded-button hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mb-8 shadow-sm"
      >
        Start Request
        <ArrowRight size={16} strokeWidth={2} />
      </button>

      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">
        Governance Metadata
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <User size={14} />
            <span>Service Owner</span>
          </div>
          <div className="text-sm font-medium text-primary pl-5">
            {detail.owner}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <ListTree size={14} />
            <span>Fulfilment Queue</span>
          </div>
          <div className="text-sm font-medium text-primary pl-5">
            {detail.queue}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <Clock size={14} />
            <span>Fulfilment SLA</span>
          </div>
          <div className="text-sm font-medium text-primary pl-5">
            {detail.sla}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
            <ShieldAlert size={14} />
            <span>Escalation Trigger</span>
          </div>
          <div className="text-sm font-medium text-primary pl-5 leading-snug">
            {detail.escalationTrigger}
          </div>
        </div>
      </div>

    </div>
  );
}
