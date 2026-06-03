import React from 'react';
import { TaskTemplateFull } from '../types/taskLibrary';
import { TemplateCategoryBadge } from './TemplateCategoryBadge';
import { ListChecks, Paperclip, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TemplateCardProps {
  template: TaskTemplateFull;
  onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/marketplaces/task-templates/${template.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border-subtle bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <TemplateCategoryBadge category={template.category} />
          {template.reviewPath !== 'No review' && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-navy-600">
              <ShieldCheck size={12} />
              {template.reviewPath}
            </span>
          )}
        </div>
        
        <h3 className="mb-2 text-base font-bold text-text-primary group-hover:text-primary">
          {template.title}
        </h3>
        
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary">
          {template.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-text-muted">
          <div className="flex items-center gap-1.5" title="Checklist depth">
            <ListChecks size={14} />
            {template.checklistDepth || 'Standard'} Checklist
          </div>
          {template.evidenceRequired && (
            <div className="flex items-center gap-1.5" title="Evidence Required">
              <Paperclip size={14} />
              Evidence Req
            </div>
          )}
        </div>
      </div>
      
      {/* Footer bar */}
      <div className="border-t border-border-subtle bg-surface px-5 py-3 flex items-center justify-between text-xs font-semibold text-text-secondary">
        <span className="truncate pr-4">Owner: {template.ownerType}</span>
        <span className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View Template &rarr;
        </span>
      </div>
    </div>
  );
}
