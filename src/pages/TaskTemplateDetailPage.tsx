import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { TemplateCategoryBadge } from '../components/TemplateCategoryBadge';
import { ArrowLeft, Clock, ShieldCheck, ListChecks, Paperclip, Share, Settings, Zap } from 'lucide-react';

export function TaskTemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { templates, isLoading } = useTaskLifecycle();
  const [showToast, setShowToast] = useState(false);

  const template = templates.find(t => t.id === templateId);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!template) return <div className="p-8 text-danger">Template not found.</div>;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 pb-32">
      <button 
        onClick={() => navigate('/marketplaces/task-templates')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to Task Templates
      </button>

      {/* Header */}
      <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border-subtle">
        <div className="mb-4 flex items-center justify-between">
          <TemplateCategoryBadge category={template.category} size="md" />
        </div>

        <h1 className="mb-4 text-3xl font-bold text-text-primary">{template.title}</h1>
        <p className="mb-6 text-lg text-text-secondary">{template.description}</p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl bg-surface p-4 text-sm font-medium text-text-secondary">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-text-muted" />
            <span className="text-text-muted">SLA Guidance:</span> {template.slaGuidance}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-text-muted" />
            <span className="text-text-muted">Review Path:</span> {template.reviewPath}
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-text-muted" />
            <span className="text-text-muted">Best For:</span> {template.bestFor}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Purpose & Output</h2>
            <div className="mb-6">
              <h3 className="mb-1 text-sm font-bold text-text-primary">Purpose</h3>
              <p className="text-sm text-text-secondary">{template.purpose}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-text-primary">Expected Output</h3>
              <p className="text-sm text-text-secondary">{template.expectedOutput}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-text-primary">Checklist & Evidence</h2>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-text-primary">
                Required Checklist Items ({template.checklistItems.length})
              </h3>
              <ul className="space-y-2">
                {template.checklistItems.map(item => (
                  <li key={item.id} className="flex items-start gap-3 rounded-lg bg-surface p-3 text-sm">
                    <div className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-border-strong bg-white"></div>
                    <span className="font-medium text-text-secondary">
                      {item.text}
                      {item.required && <span className="ml-2 text-[10px] font-bold text-danger">*</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-text-primary flex items-center gap-2">
                <Paperclip size={16} />
                Evidence Requirements
              </h3>
              {template.evidenceRequired ? (
                <div className="rounded-lg border border-warning/20 bg-warning/5 p-4 text-sm text-text-secondary">
                  <span className="font-bold text-warning">Evidence Required:</span> {template.evidenceRule || 'Evidence must be attached prior to closure.'}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No evidence is strictly required for this task.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-text-muted">Actions</h3>
            
            <button 
              onClick={() => navigate(`/tasks/create/${template.id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-navy-700"
            >
              <Zap size={18} />
              Start Task from Template
            </button>
            
            <button 
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-surface"
            >
              <Share size={18} />
              Copy Link
            </button>

            {template.auditNote && (
              <>
                <div className="my-2 h-px bg-border-subtle" />
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-text-muted">
                  <strong className="block text-slate-700 mb-1">Audit Note:</strong>
                  {template.auditNote}
                </div>
              </>
            )}
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
