import React from 'react';
import { FileText, Briefcase, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';

interface RelatedItemsCardProps {
  knowledgeLinks: string[];
  serviceLinks: string[];
}

export function RelatedItemsCard({ knowledgeLinks, serviceLinks }: RelatedItemsCardProps) {
  const navigate = useNavigate();
  const { services } = useServiceLifecycle();

  const handleKnowledgeClick = () => {
    toast.info('Reference opened in prototype state');
  };

  const handleServiceClick = (serviceTitle: string) => {
    // Attempt to resolve service by title
    const svc = services.find(s => s.title === serviceTitle);
    if (svc) {
      navigate(`/marketplaces/services/${svc.id}`);
    } else {
      toast.error('Service not found in prototype');
    }
  };

  return (
    <div className="bg-white rounded-card border border-border-default p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-primary mb-4">Related Knowledge</h2>
          {knowledgeLinks.length > 0 ? (
            <ul className="space-y-3">
              {knowledgeLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={handleKnowledgeClick}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-surface transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-primary flex-1 group-hover:text-primary transition-colors">{link}</span>
                    <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No related knowledge assets.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-primary mb-4">Alternative Services</h2>
          {serviceLinks.length > 0 ? (
            <ul className="space-y-3">
              {serviceLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleServiceClick(link)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-surface transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Briefcase size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-primary flex-1 group-hover:text-primary transition-colors">{link}</span>
                    <span className="text-xs font-semibold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      View service
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted">No related services.</p>
          )}
        </div>
      </div>
    </div>
  );
}
