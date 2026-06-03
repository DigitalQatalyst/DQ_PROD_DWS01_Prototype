import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeAssetFull, RelatedKnowledgeRecord } from '../types/knowledgeDiscovery';
import { KnowledgeTypeBadge } from './KnowledgeTypeBadge';
import { ArrowRight } from 'lucide-react';

interface RelatedKnowledgeGridProps {
  records: RelatedKnowledgeRecord[];
  allAssets: KnowledgeAssetFull[];
}

export function RelatedKnowledgeGrid({ records, allAssets }: RelatedKnowledgeGridProps) {
  const navigate = useNavigate();

  if (records.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="mb-5 text-lg font-bold text-text-primary">Related Knowledge</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {records.map(rel => {
          const asset = allAssets.find(a => a.id === rel.toAssetId);
          if (!asset) return null;
          return (
            <div
              key={rel.id}
              onClick={() => navigate(`/marketplaces/knowledge/${asset.id}`)}
              className="group cursor-pointer rounded-lg border border-border-subtle bg-surface p-4 transition-all hover:border-primary/30 hover:bg-navy-50"
            >
              <div className="mb-2">
                <KnowledgeTypeBadge type={asset.type} size="sm" />
              </div>
              <p className="mb-1 text-sm font-bold text-text-primary group-hover:text-primary">{asset.title}</p>
              <p className="mb-3 line-clamp-2 text-xs text-text-muted">{rel.relationship}</p>
              <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
