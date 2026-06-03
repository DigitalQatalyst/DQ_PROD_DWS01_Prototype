import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Task, RequestRecord, Approval, WorkflowItem, KnowledgeAsset, AuditEvent, KpiSet } from '../types/platform';
import { StatusPill } from './StatusPill';
import { SlaBadge } from './SlaBadge';
import { OwnerBadge } from './OwnerBadge';
import { MonoId } from './MonoId';
import { EvidenceList } from './EvidenceList';
import { Timeline } from './Timeline';
import { toast } from 'sonner';
interface DetailPanelProps {
  entity: Task | RequestRecord | Approval | WorkflowItem | KnowledgeAsset | AuditEvent | KpiSet | null;
  type: 'task' | 'request' | 'approval' | 'workflow' | 'knowledge' | 'audit' | 'kpi' | null;
  onClose: () => void;
}
export function DetailPanel({
  entity,
  type,
  onClose
}: DetailPanelProps) {
  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  if (!entity || !type) return null;
  const renderTask = (task: Task) => <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <MonoId value={task.id} />
            <h2 className="text-2xl font-bold text-primary mt-2">
              {task.title}
            </h2>
          </div>
          <StatusPill status={task.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-card border border-border-subtle">
          <div>
            <span className="text-xs text-text-muted block mb-1">Owner</span>
            <OwnerBadge userId={task.ownerUserId} />
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">
              SLA Status
            </span>
            <SlaBadge state={task.slaState} />
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">Due Date</span>
            <span className="text-sm font-medium">{task.dueDate}</span>
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">Priority</span>
            <span className="text-sm font-medium">{task.priority}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Purpose
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {task.purpose}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Expected Output
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {task.expectedOutput}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center justify-between">
          <span>Checklist</span>
          <span className="text-xs font-medium text-text-muted normal-case">
            {task.checklistDone} of {task.checklistTotal} complete
          </span>
        </h3>
        <div className="w-full bg-border-subtle rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{
          width: `${task.checklistDone / task.checklistTotal * 100}%`
        }} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Evidence
        </h3>
        <EvidenceList task={task} />
      </div>

      <div className="pt-6 border-t border-border-subtle flex gap-3">
        <button onClick={() => {
        toast.success('Progress update saved in prototype mode');
        onClose();
      }} className="flex-1 bg-primary text-white py-2 rounded-button font-medium hover:bg-navy-800 transition-colors">
          Update Progress
        </button>
        <button onClick={() => {
        toast.success('Closure review requested');
        onClose();
      }} className="flex-1 bg-white border border-border-strong text-text-primary py-2 rounded-button font-medium hover:bg-surface transition-colors">
          Request Review
        </button>
      </div>
    </div>;
  const renderRequest = (request: RequestRecord) => <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <MonoId value={request.id} />
            <h2 className="text-2xl font-bold text-primary mt-2">
              {request.title}
            </h2>
          </div>
          <StatusPill status={request.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-card border border-border-subtle">
          <div>
            <span className="text-xs text-text-muted block mb-1">
              Requester
            </span>
            <OwnerBadge userId={request.requesterUserId} />
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">Owner</span>
            <OwnerBadge userId={request.ownerUserId} />
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">Category</span>
            <span className="text-sm font-medium">{request.category}</span>
          </div>
          <div>
            <span className="text-xs text-text-muted block mb-1">
              SLA Status
            </span>
            <SlaBadge state={request.slaState} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
          Expected Outcome
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {request.expectedOutcome}
        </p>
      </div>

      <div className="pt-6 border-t border-border-subtle flex gap-3">
        <button onClick={() => {
        toast.success('Request status opened in prototype mode');
        onClose();
      }} className="flex-1 bg-primary text-white py-2 rounded-button font-medium hover:bg-navy-800 transition-colors">
          View Request Status
        </button>
      </div>
    </div>;
  const renderGeneric = () => <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary">Details</h2>
      <pre className="bg-surface p-4 rounded-card text-xs overflow-auto border border-border-default">
        {JSON.stringify(entity, null, 2)}
      </pre>
    </div>;
  return <>
      <div className="fixed inset-0 z-[150] bg-transparent" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[40vw] min-w-[520px] max-w-[720px] bg-white shadow-2xl z-[200] flex flex-col animate-in slide-in-from-right duration-200 border-l border-border-default">
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-white sticky top-0 z-10">
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            {type} Details
          </h3>
          <button onClick={onClose} className="p-2 rounded-button hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {type === 'task' && renderTask(entity as Task)}
          {type === 'request' && renderRequest(entity as RequestRecord)}
          {['approval', 'workflow', 'knowledge', 'audit', 'kpi'].includes(type) && renderGeneric()}
        </div>
      </div>
    </>;
}