import React from 'react';
import { Clock, User, Copy, CheckCircle2 } from 'lucide-react';
import type { ServiceRequestRecord } from '../types/serviceLifecycle';
import { CategoryBadge } from './CategoryBadge';
import { toast } from 'sonner';

interface RequestHeaderCardProps {
  request: ServiceRequestRecord;
}

export function RequestHeaderCard({ request }: RequestHeaderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'Pending Approval':
      case 'In Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Fulfilment':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Returned for Information':
        return 'bg-warning-surface text-warning-text border-warning-text/20';
      case 'Closed':
        return 'bg-success-surface text-success-text border-success-text/20';
      case 'Draft':
      default:
        return 'bg-surface text-text-secondary border-border-strong';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(request.id);
    toast.success('Request ID copied');
  };

  return (
    <div className="bg-white rounded-card border border-border-default p-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-surface border border-border-strong rounded hover:border-text-muted transition-colors group"
            >
              <span className="font-mono text-xs font-bold text-text-primary">{request.id}</span>
              <Copy size={12} className="text-text-muted group-hover:text-primary transition-colors" />
            </button>
            <div className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getStatusColor(request.status)}`}>
              {request.status}
            </div>
            <CategoryBadge category={request.category} />
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">
            {request.service}
          </h1>
          <p className="text-sm text-text-secondary">
            Submitted on {new Date(request.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 bg-surface/50 p-4 rounded-md border border-border-subtle">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
              <User size={14} />
              <span>Service Owner</span>
            </div>
            <span className="text-sm font-semibold text-primary">{request.owner}</span>
          </div>
          
          <div className="hidden sm:block w-px bg-border-strong" />
          
          <div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1">
              <Clock size={14} />
              <span>SLA Target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-primary">{request.sla}</span>
              {request.slaState === 'At Risk' && (
                <span className="w-2 h-2 rounded-full bg-warning-text" title="At Risk" />
              )}
              {request.slaState === 'Completed' && (
                <CheckCircle2 size={14} className="text-success-text" />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
