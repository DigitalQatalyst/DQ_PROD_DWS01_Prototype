import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskTemplateFull } from '../types/taskLibrary';
import { MarketplaceCatalogCard } from './marketplace/MarketplaceCatalogCard';

function ReviewBadge({ reviewPath }: { reviewPath: string }) {
  if (reviewPath === 'No review') return null;

  return (
    <span className="inline-flex items-center rounded bg-info-surface px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-info-text">
      {reviewPath === 'Approval required' ? 'Approval' : 'Review'}
    </span>
  );
}

export function TemplateCard({
  template,
  onClick,
}: {
  template: TaskTemplateFull;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) onClick();
    else navigate(`/marketplace/task-library/${template.id}`);
  };

  const categoryCode = template.category
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();

  return (
    <MarketplaceCatalogCard
      typeLabel={`${categoryCode} · Template`}
      metaLabel={`${template.checklistDepth || 'Standard'} checklist · ${template.evidenceRequired ? 'Evidence req' : 'Evidence opt'}`}
      title={template.title}
      description={template.description}
      footerId={template.id}
      badge={<ReviewBadge reviewPath={template.reviewPath} />}
      highlighted={
        template.reviewPath === 'Approval required' || template.evidenceRequired
      }
      onClick={handleCardClick}
    />
  );
}
