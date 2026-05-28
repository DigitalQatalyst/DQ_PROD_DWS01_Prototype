import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeTypeBadge } from '../components/KnowledgeTypeBadge';
import { ArrowLeft, Clock, Calendar, User, Link as LinkIcon, MessageSquare, AlertTriangle, FileText, Share, CheckCircle2, CheckSquare } from 'lucide-react';

export function KnowledgeDetailPage() {
  const { knowledgeId } = useParams();
  const navigate = useNavigate();
  const { assets, isLoading } = useKnowledgeLifecycle();
  const [showToast, setShowToast] = useState(false);

  const asset = assets.find(a => a.id === knowledgeId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!asset) return <div className="p-8 text-danger">Asset not found.</div>;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 pb-32">
      <button 
        onClick={() => navigate('/marketplaces/knowledge')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Knowledge Marketplace
      </button>

      {/* Header */}
      <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border-subtle">
        <div className="mb-4 flex items-center justify-between">
          <KnowledgeTypeBadge type={asset.type} size="md" />
          <div className="flex items-center gap-3">
            {asset.status === 'Effective' && (
              <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-bold text-success">
                <CheckCircle2 size={16} />
                Effective
              </span>
            )}
            {asset.status === 'Needs Update' && (
              <span className="flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-sm font-bold text-warning">
                <AlertTriangle size={16} />
                Needs Update
              </span>
            )}
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-text-primary">{asset.title}</h1>
        <p className="mb-6 text-lg text-text-secondary">{asset.summary}</p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl bg-surface p-4 text-sm font-medium text-text-secondary">
          <div className="flex items-center gap-2">
            <User size={16} className="text-text-muted" />
            <span className="text-text-muted">Owner:</span> {asset.owner}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-text-muted" />
            <span className="text-text-muted">Read Time:</span> {asset.readTime}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-text-muted" />
            <span className="text-text-muted">Last Reviewed:</span> {asset.lastReviewed}
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-text-muted" />
            <span className="text-text-muted">Uses:</span> {asset.linkedWorkCount}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column - Details */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Purpose & Applicability */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Purpose & Scope</h2>
            <p className="mb-6 text-text-secondary">{asset.purpose}</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="mb-2 text-sm font-bold text-text-primary">When to Use</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
                  {asset.whenToUse.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-text-primary">When NOT to Use</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
                  {asset.whenNotToUse.map((item, i) => <li key={i}>{item}</li>)}
                  {asset.whenNotToUse.length === 0 && <li>No specific exclusions.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Core Guidance Preview (Mocked) */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Content Preview</h2>
              <button 
                onClick={() => navigate(`/knowledge/${asset.id}/reference`)}
                className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                Read Full Reference &rarr;
              </button>
            </div>
            <div className="rounded-lg bg-surface p-4">
              <p className="mb-2 text-sm font-medium text-text-primary">Key Principle:</p>
              <p className="text-sm text-text-secondary italic">
                "{asset.coreGuidance?.principles[0] || 'Follow the established operating model patterns to ensure consistent delivery.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-text-muted">Actions</h3>
            
            <button 
              onClick={() => navigate(`/knowledge/${asset.id}/reference`)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-navy-700"
            >
              <FileText size={18} />
              Read Full Reference
            </button>
            
            <button 
              onClick={() => navigate(`/tasks/create/from-knowledge/${asset.id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-navy-50 px-4 py-2.5 text-sm font-bold text-primary hover:bg-navy-100"
            >
              <CheckSquare size={18} />
              Start Task from Guide
            </button>
            
            <button 
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-surface"
            >
              <Share size={18} />
              Copy Link
            </button>

            <div className="my-2 h-px bg-border-subtle" />
            
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-surface">
              <MessageSquare size={18} />
              Provide Feedback
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg">
          Link copied to clipboard
        </div>
      )}
    </div>
  );
}

// Ensure CheckSquare is imported from lucide-react in the final code.
