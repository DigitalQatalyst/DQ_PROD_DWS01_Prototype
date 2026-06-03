import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KnowledgeAssetFull } from '../types/knowledgeDiscovery';
import { KnowledgeTypeBadge } from './KnowledgeTypeBadge';
import { MonoId } from './MonoId';
import {
  ChevronRight, User, Clock, Calendar, CalendarClock, Link as LinkIcon,
  CheckCircle2, AlertTriangle, Info, XCircle, FileEdit
} from 'lucide-react';

interface KnowledgeDetailHeroProps {
  asset: KnowledgeAssetFull;
}

function StatusBadge({ status }: { status: KnowledgeAssetFull['status'] }) {
  const config = {
    'Effective': { icon: CheckCircle2, cls: 'bg-success/10 text-success', label: 'Effective' },
    'Under Review': { icon: AlertTriangle, cls: 'bg-warning/10 text-warning', label: 'Under Review' },
    'Draft': { icon: Info, cls: 'bg-info/10 text-info', label: 'Draft' },
    'Needs Update': { icon: AlertTriangle, cls: 'bg-warning/10 text-warning', label: 'Needs Update' },
    'Deprecated': { icon: XCircle, cls: 'bg-danger/10 text-danger', label: 'Deprecated' },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${config.cls}`}>
      <Icon size={13} />
      {config.label}
    </span>
  );
}

export function KnowledgeDetailHero({ asset }: KnowledgeDetailHeroProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-text-muted" aria-label="Breadcrumb">
        <button
          onClick={() => navigate('/marketplaces/knowledge')}
          className="hover:text-primary transition-colors"
        >
          Stage 01 Marketplaces
        </button>
        <ChevronRight size={14} className="text-border-default" />
        <button
          onClick={() => navigate('/marketplaces/knowledge')}
          className="hover:text-primary transition-colors"
        >
          Knowledge Hub
        </button>
        <ChevronRight size={14} className="text-border-default" />
        <span className="text-text-secondary line-clamp-1 max-w-[260px]">{asset.title}</span>
      </nav>

      {/* Hero card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border-subtle">
        {/* Top row */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <KnowledgeTypeBadge type={asset.type} size="md" />
            <StatusBadge status={asset.status} />
          </div>
          <MonoId value={asset.id} />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary">{asset.title}</h1>

        {/* Purpose */}
        <p className="mb-6 text-base leading-relaxed text-text-secondary">{asset.summary}</p>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {asset.tags.map(tag => (
              <span key={tag} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text-muted ring-1 ring-border-subtle">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata strip */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl bg-surface px-5 py-4 text-sm font-medium text-text-secondary">
          <div className="flex items-center gap-2">
            <User size={15} className="text-text-muted" />
            <span className="text-text-muted">Owner:</span>
            <span className="font-semibold text-text-primary">{asset.owner}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-text-muted" />
            <span className="text-text-muted">Read time:</span>
            {asset.readTime}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-text-muted" />
            <span className="text-text-muted">Last reviewed:</span>
            {asset.lastReviewed}
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock size={15} className="text-text-muted" />
            <span className="text-text-muted">Review due:</span>
            {asset.reviewDue}
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon size={15} className="text-text-muted" />
            <span className="text-text-muted">Linked work:</span>
            <span className="font-bold text-primary">{asset.linkedWorkCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileEdit size={15} className="text-text-muted" />
            <span className="text-text-muted">Version:</span>
            {asset.version}
          </div>
        </div>

        {/* Status banners */}
        {asset.status === 'Deprecated' && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
            <XCircle size={16} />
            This knowledge asset is deprecated. Please refer to a current alternative.
          </div>
        )}
        {asset.status === 'Under Review' && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm font-medium text-warning">
            <AlertTriangle size={16} />
            This asset is currently under review. Content may be updated before the review due date.
          </div>
        )}
        {asset.status === 'Needs Update' && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm font-medium text-warning">
            <AlertTriangle size={16} />
            This asset has been flagged as needing an update. Use with caution and check the review date.
          </div>
        )}
      </div>
    </div>
  );
}
