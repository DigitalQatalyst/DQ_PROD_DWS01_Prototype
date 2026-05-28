import React from 'react';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { KnowledgeTypeBadge } from './KnowledgeTypeBadge';
import { Clock, CheckCircle2, AlertTriangle, Link as LinkIcon, Info, XCircle, ThumbsUp, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KnowledgeCardProps {
  asset: KnowledgeAssetFull;
  onClick?: () => void;
}

function StatusBadge({ status }: { status: KnowledgeAssetFull['status'] }) {
  const config = {
    'Effective': { icon: CheckCircle2, cls: 'text-success', label: 'Effective' },
    'Under Review': { icon: AlertTriangle, cls: 'text-warning', label: 'Under Review' },
    'Draft': { icon: Info, cls: 'text-info', label: 'Draft' },
    'Needs Update': { icon: AlertTriangle, cls: 'text-warning', label: 'Needs Update' },
    'Deprecated': { icon: XCircle, cls: 'text-danger', label: 'Deprecated' },
  }[status] ?? { icon: Info, cls: 'text-text-muted', label: status };
  const Icon = config.icon;
  return (
    <span className={`flex items-center gap-1 text-[11px] font-bold ${config.cls}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function FeedbackMarker({ marker }: { marker: KnowledgeAssetFull['feedbackMarker'] }) {
  if (!marker || marker === 'No feedback') return null;
  if (marker === 'Useful') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-success">
      <ThumbsUp size={10} /> Useful
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-warning">
      <Flag size={10} /> {marker}
    </span>
  );
}

export function KnowledgeCard({ asset, onClick }: KnowledgeCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/marketplaces/knowledge/${asset.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col p-5">
        {/* Top row */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <KnowledgeTypeBadge type={asset.type} />
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={asset.status} />
            <FeedbackMarker marker={asset.feedbackMarker} />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-primary">
          {asset.title}
        </h3>

        {/* Summary */}
        <p className="mb-3 line-clamp-2 text-sm text-text-secondary">
          {asset.summary}
        </p>

        {/* Applicability chips */}
        {asset.applicability.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {asset.applicability.slice(0, 2).map(tag => (
              <span key={tag} className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/10">
                {tag}
              </span>
            ))}
            {asset.applicability.length > 2 && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-muted ring-1 ring-border-subtle">
                +{asset.applicability.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {asset.readTime}
          </div>
          {asset.linkedWorkCount > 0 && (
            <div className="flex items-center gap-1.5" title="Tasks/Requests using this knowledge">
              <LinkIcon size={14} />
              {asset.linkedWorkCount} {asset.linkedWorkCount === 1 ? 'use' : 'uses'}
            </div>
          )}
          {asset.acknowledgementRequired && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              Ack Req
            </span>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-border-subtle bg-surface px-5 py-3 flex items-center justify-between text-xs font-semibold text-text-secondary">
        <span className="truncate pr-4">Owner: {asset.owner}</span>
        <span className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Open &rarr;
        </span>
      </div>
    </div>
  );
}
