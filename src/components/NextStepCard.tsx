import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
interface NextStepCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  disabled?: boolean;
}
export function NextStepCard({
  title,
  description,
  icon: Icon,
  route,
  disabled = false
}: NextStepCardProps) {
  const navigate = useNavigate();
  if (disabled) {
    return <div className="p-6 rounded-card border border-border-default bg-surface opacity-75 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-text-disabled">
          <Lock size={16} />
        </div>
        <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center mb-4 text-text-disabled">
          <Icon size={20} />
        </div>
        <h3 className="text-base font-semibold text-text-muted mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-disabled">{description}</p>
      </div>;
  }
  return <button onClick={() => navigate(route)} className="text-left p-6 rounded-card border border-border-default bg-white hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </button>;
}