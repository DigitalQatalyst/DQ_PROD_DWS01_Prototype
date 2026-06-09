import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, Users, ArrowRight } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import { ApprovalBadge } from './ApprovalBadge';
import type { Service } from '../types/serviceLifecycle';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/marketplaces/services/${service.id}`);
  };

  const handleStartRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/requests/start/${service.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col bg-white rounded-card border border-border-default overflow-hidden hover:shadow-md hover:border-border-strong transition-all cursor-pointer group"
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-secondary" />

      <div className="flex flex-col flex-1 p-6">
        {/* Header: icon + category */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Briefcase size={20} strokeWidth={1.5} />
          </div>
          <CategoryBadge category={service.category} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-primary mb-2 leading-snug">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-5 flex-1 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock size={14} strokeWidth={1.5} />
            <span>SLA: {service.sla}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Users size={14} strokeWidth={1.5} />
            <span>{service.owner}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <ApprovalBadge requirement={service.approval} label={service.approvalDetail} />
        </div>

        {/* CTA */}
        <button
          onClick={handleCardClick}
          className="w-full py-2.5 bg-secondary text-white font-semibold text-sm rounded-button hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
