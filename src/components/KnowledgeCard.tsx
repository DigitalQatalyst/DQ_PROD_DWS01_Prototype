import React from 'react';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { KnowledgeTypeBadge } from './KnowledgeTypeBadge';
import { Clock, CheckCircle2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KnowledgeCardProps {
  asset: KnowledgeAssetFull;
  onClick?: () => void;
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
        <div className="mb-3 flex items-start justify-between gap-4">
          <KnowledgeTypeBadge type={asset.type} />
          {asset.status === 'Effective' && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-success">
              <CheckCircle2 size={12} />
              Effective
            </span>
          )}
          {asset.status === 'Needs Update' && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-warning">
              <AlertTriangle size={12} />
              Needs Update
            </span>
          )}
        </div>
        
        <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-primary">
          {asset.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">
          {asset.summary}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            {asset.readTime}
          </div>
          {asset.linkedWorkCount > 0 && (
            <div className="flex items-center gap-1.5" title="Tasks/Requests using this knowledge">
              <LinkIcon size={14} />
              {asset.linkedWorkCount} uses
            </div>
          )}
          {asset.acknowledgementRequired && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
              Ack Req
            </span>
          )}
        </div>
      </div>
      
      {/* Footer bar */}
      <div className="border-t border-border-subtle bg-surface px-5 py-3 flex items-center justify-between text-xs font-semibold text-text-secondary">
        <span className="truncate pr-4">Owner: {asset.owner}</span>
        <span className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View Details &rarr;
        </span>
      </div>
    </div>
  );
}
