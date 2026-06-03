import React from 'react';
import type { ServiceDetail } from '../types/serviceLifecycle';
import { Network, User, ListTree, Clock, ShieldAlert } from 'lucide-react';
import { ApprovalPathCard } from './ApprovalPathCard';

interface RoutingPreviewCardProps {
  detail: ServiceDetail;
  urgency: string;
}

export function RoutingPreviewCard({ detail, urgency }: RoutingPreviewCardProps) {
  const isHighUrgency = urgency === 'High' || urgency === 'Critical';

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-card border border-border-default p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Routing Preview</h2>
            <p className="text-sm text-text-secondary">Where your request will be sent upon submission.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
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
              <span>Response & Fulfilment SLA</span>
            </div>
            <div className="text-sm font-medium pl-5 flex items-center gap-2">
              <span className="text-primary">{detail.sla}</span>
              {isHighUrgency && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-warning-surface text-warning-text border border-warning-text/20">
                  Risk Accelerated
                </span>
              )}
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

      <ApprovalPathCard requirement={detail.approval} detail={detail.approvalDetail} />
    </div>
  );
}
