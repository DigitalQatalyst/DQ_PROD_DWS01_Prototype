import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface ServiceEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function ServiceEmptyState({
  icon: Icon = Inbox,
  title,
  message,
  ctaLabel,
  onCtaClick,
}: ServiceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-card border-2 border-dashed border-border-default">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted mb-4">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-6 max-w-md text-center leading-relaxed">
        {message}
      </p>
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="px-5 py-2.5 bg-surface text-primary font-semibold text-sm rounded-button hover:bg-navy-50 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
