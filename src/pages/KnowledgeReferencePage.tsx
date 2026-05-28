import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { KnowledgeDetailRecord } from '../types/knowledgeDiscovery';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';

export function KnowledgeReferencePage() {
  const { knowledgeId } = useParams();
  const navigate = useNavigate();
  const { assets, getAssetDetail, isLoading: isContextLoading } = useKnowledgeLifecycle();
  
  const [detail, setDetail] = useState<KnowledgeDetailRecord | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const asset = assets.find(a => a.id === knowledgeId);

  useEffect(() => {
    if (knowledgeId) {
      setIsLoading(true);
      getAssetDetail(knowledgeId).then(data => {
        setDetail(data);
        setIsLoading(false);
      });
    }
  }, [knowledgeId, getAssetDetail]);

  if (isContextLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-text-muted">Loading reference content...</div>
      </div>
    );
  }

  if (!asset || !detail) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
        <h2 className="mb-2 text-2xl font-bold text-text-primary">Content Not Found</h2>
        <p className="mb-6 text-text-secondary">The reference material you are looking for could not be loaded.</p>
        <button 
          onClick={() => navigate('/marketplaces/knowledge')}
          className="rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-navy-700"
        >
          Return to Knowledge Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Reading Header */}
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/marketplaces/knowledge/${knowledgeId}`)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-secondary hover:bg-navy-50 hover:text-primary transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-4 w-px bg-border-subtle" />
            <span className="flex items-center gap-2 text-sm font-bold text-text-muted">
              <BookOpen size={16} />
              {asset.type}
            </span>
          </div>
          <button 
            onClick={() => navigate(`/tasks/create/from-knowledge/${asset.id}`)}
            className="rounded-lg bg-navy-50 px-4 py-1.5 text-sm font-bold text-primary hover:bg-navy-100"
          >
            Start Task
          </button>
        </div>
      </div>

      {/* Reading Content */}
      <div className="mx-auto max-w-3xl px-6 py-12 pb-32">
        <header className="mb-12 border-b border-border-subtle pb-8">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-text-primary">{asset.title}</h1>
          <p className="text-xl leading-relaxed text-text-secondary">{asset.summary}</p>
        </header>

        <article className="prose prose-slate max-w-none">
          <p className="lead text-lg text-text-secondary">{detail.content}</p>
          
          {detail.sections.map(section => (
            <div key={section.id} className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-text-primary">{section.title}</h2>
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
                <p className="whitespace-pre-wrap text-text-secondary">{section.body}</p>
              </div>
            </div>
          ))}

          {/* Acknowledgement block if required */}
          {asset.acknowledgementRequired && (
            <div className="mt-12 rounded-xl border border-primary/20 bg-navy-50 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-primary">Acknowledgement Required</h3>
              <p className="mb-4 text-sm text-text-secondary">
                You must acknowledge that you have read and understood this {asset.type.toLowerCase()}.
              </p>
              <button className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white shadow-sm hover:bg-navy-700">
                Acknowledge Reading
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
