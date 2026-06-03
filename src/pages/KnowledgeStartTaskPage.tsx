import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeLifecycle } from '../context/KnowledgeLifecycleContext';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { getSuggestedTasksFromGuide } from '../services/platform.service';
import { ArrowLeft, PlayCircle, Plus } from 'lucide-react';
import { KnowledgeTypeBadge } from '../components/KnowledgeTypeBadge';
import { TemplateCategoryBadge } from '../components/TemplateCategoryBadge';

export function KnowledgeStartTaskPage() {
  const { knowledgeId } = useParams();
  const navigate = useNavigate();
  const { assets } = useKnowledgeLifecycle();
  const { templates } = useTaskLifecycle();
  
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([]);

  const asset = assets.find(a => a.id === knowledgeId);

  useEffect(() => {
    getSuggestedTasksFromGuide().then(setSuggestedTasks);
  }, []);

  if (!asset) return <div className="p-8">Asset not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 pb-32">
      <button 
        onClick={() => navigate(`/marketplaces/knowledge/${knowledgeId}`)}
        className="mb-8 flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back to {asset.title}
      </button>

      <div className="mb-8 flex items-start justify-between rounded-2xl bg-navy-50 p-6 ring-1 ring-border-subtle">
        <div>
          <KnowledgeTypeBadge type={asset.type} />
          <h1 className="mt-3 text-2xl font-bold text-text-primary">Start Work from Guide</h1>
          <p className="mt-2 text-text-secondary">
            Select a recommended task template linked to <strong>{asset.title}</strong>, or start a blank task.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Recommended Templates</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {suggestedTasks.map(suggestion => {
          const template = templates.find(t => t.id === suggestion.templateId);
          if (!template) return null;

          return (
            <div 
              key={suggestion.id}
              onClick={() => navigate(`/tasks/create/${template.id}?knowledgeId=${asset.id}`)}
              className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm ring-1 ring-border-subtle transition-all hover:ring-primary/50 hover:shadow-md"
            >
              <div className="mb-3">
                <TemplateCategoryBadge category={template.category} />
              </div>
              <h3 className="mb-1 font-bold text-text-primary group-hover:text-primary">
                {suggestion.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2">
                {template.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle size={16} />
                Use Template
              </div>
            </div>
          );
        })}

        {/* Blank Task Option */}
        <div 
          onClick={() => navigate(`/tasks/create/blank?knowledgeId=${asset.id}`)}
          className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-default bg-surface p-6 text-center transition-all hover:border-primary/50 hover:bg-navy-50"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-text-muted shadow-sm group-hover:text-primary">
            <Plus size={24} />
          </div>
          <h3 className="font-bold text-text-primary group-hover:text-primary">Blank Task</h3>
          <p className="mt-1 text-sm text-text-secondary">Start from scratch, linked to this guide.</p>
        </div>
      </div>
    </div>
  );
}
