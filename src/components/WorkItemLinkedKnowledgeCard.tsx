import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { KnowledgeTypeBadge } from './KnowledgeTypeBadge';

interface WorkItemLinkedKnowledgeCardProps {
  /** The task or request ID to look up linked knowledge for */
  workItemId: string;
}

export function WorkItemLinkedKnowledgeCard({ workItemId }: WorkItemLinkedKnowledgeCardProps) {
  const navigate = useNavigate();
  const { linkedWork, assets } = useKnowledgeLifecycle();
  const [collapsed, setCollapsed] = useState(false);

  // Find knowledge assets linked to this work item
  const linkedAssetIds = linkedWork
    .filter(l => l.targetId === workItemId)
    .map(l => l.knowledgeId);
  const linkedAssets = assets.filter(a => linkedAssetIds.includes(a.id));

  if (linkedAssets.length === 0) return null;

  return (
    <div className="rounded-xl bg-white ring-1 ring-border-subtle shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-surface transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen size={15} className="text-primary" />
          <span className="text-sm font-bold text-text-primary">Linked Knowledge</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
            {linkedAssets.length}
          </span>
        </div>
        {collapsed ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronUp size={16} className="text-text-muted" />}
      </button>

      {!collapsed && (
        <div className="border-t border-border-subtle px-5 pb-4 pt-3 space-y-2">
          {linkedAssets.map(asset => (
            <div
              key={asset.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2.5 ring-1 ring-border-subtle"
            >
              <div className="flex items-center gap-3 min-w-0">
                <KnowledgeTypeBadge type={asset.type} size="sm" />
                <span className="truncate text-sm font-semibold text-text-primary">{asset.title}</span>
              </div>
              <button
                onClick={() => navigate(`/marketplaces/knowledge/${asset.id}`)}
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Open <ExternalLink size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
