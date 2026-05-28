import React, { useState } from 'react';
import { X, CheckSquare, Inbox, Link as LinkIcon, ChevronDown, AlertCircle } from 'lucide-react';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';

import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { useViewingMode } from '../context/ViewingModeContext';
import { buildTasks } from '../pages/TasksSectionPages';
import { buildWorkspaceRecords } from '../pages/WorkspaceSectionPages';

interface AttachKnowledgeModalProps {
  asset: KnowledgeAssetFull;
  defaultTarget?: 'Task' | 'Request';
  onClose: () => void;
  onAttached: (message: string) => void;
}

export function AttachKnowledgeModal({ asset, defaultTarget = 'Task', onClose, onAttached }: AttachKnowledgeModalProps) {
  const { attachKnowledge } = useKnowledgeLifecycle();
  const { activeRole } = useWorkspaceRole();
  const { mode } = useViewingMode();
  
  const [targetType, setTargetType] = useState<'Task' | 'Request'>(defaultTarget);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  // Map real tasks and requests into the dropdown format
  const tasks = buildTasks(activeRole, mode);
  const requests = buildWorkspaceRecords('my-requests', activeRole, mode);

  const formattedTasks = tasks.map(t => ({ id: t.taskId, title: t.title, status: t.status, owner: t.owner }));
  const formattedRequests = requests.map(r => ({ id: r.id, title: r.title, status: r.status, owner: r.owner }));

  const options = targetType === 'Task' ? formattedTasks : formattedRequests;
  const selected = options.find(o => o.id === selectedId);

  const handleAttach = () => {
    if (!selectedId || !selected) {
      setError(`Please select a ${targetType.toLowerCase()} to attach.`);
      return;
    }
    attachKnowledge(asset.id, {
      targetId: selectedId,
      targetTitle: selected.title,
      targetType
    });
    onAttached(`Knowledge asset linked to ${targetType} ${selectedId}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-border-subtle animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-subtle p-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Attach to {targetType}</h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Link <strong className="text-text-primary">{asset.title}</strong> to an active work item.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-primary transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Context banner */}
        <div className="mx-6 mt-5 flex items-center gap-3 rounded-lg bg-navy-50 px-4 py-3 ring-1 ring-primary/10">
          <LinkIcon size={16} className="text-primary shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary">{asset.title}</p>
            <p className="text-xs text-text-muted">{asset.type} · v{asset.version} · {asset.status}</p>
          </div>
        </div>

        {/* Target type toggle */}
        <div className="mx-6 mt-5 flex rounded-lg bg-surface p-1 ring-1 ring-border-subtle">
          {(['Task', 'Request'] as const).map(type => (
            <button
              key={type}
              onClick={() => { setTargetType(type); setSelectedId(''); setError(''); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-all ${
                targetType === type ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {type === 'Task' ? <CheckSquare size={15} /> : <Inbox size={15} />}
              {type}
            </button>
          ))}
        </div>

        {/* Selection */}
        <div className="mx-6 mt-4">
          <label className="mb-1.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">
            Select {targetType}
          </label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={e => { setSelectedId(e.target.value); setError(''); }}
              className="w-full appearance-none rounded-lg border border-border-default bg-white px-4 py-2.5 pr-9 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select {targetType.toLowerCase()}...</option>
              {options.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.id}: {opt.title} ({opt.status})
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-danger">
              <AlertCircle size={13} />
              {error}
            </div>
          )}
        </div>

        {/* Selected preview */}
        {selected && (
          <div className="mx-6 mt-3 rounded-lg bg-surface p-3 ring-1 ring-border-subtle text-xs text-text-secondary">
            <p><span className="font-semibold text-text-primary">{selected.id}</span> · {selected.status}</p>
            <p className="mt-0.5 text-text-muted">Owner: {selected.owner}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border-subtle px-6 py-5 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAttach}
            disabled={!selectedId}
            id={`btn-confirm-attach-${asset.id}`}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-navy-700 disabled:opacity-40 transition-colors"
          >
            Attach Knowledge
          </button>
        </div>
      </div>
    </div>
  );
}
