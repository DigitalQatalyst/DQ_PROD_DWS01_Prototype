import React from 'react';
import type { Persona } from '../types/platform';
import { quickResumeItems } from '../mocks/stage0.mock';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface Stage0QuickResumeProps {
  activePersona: Persona;
}
export function Stage0QuickResume({
  activePersona
}: Stage0QuickResumeProps) {
  const items = quickResumeItems[activePersona.id] || quickResumeItems['associate'];
  const navigate = useNavigate();
  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={20} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-warning-text" />;
      case 'danger':
        return <AlertCircle size={20} className="text-danger" />;
      case 'info':
        return <Info size={20} className="text-info-text" />;
      default:
        return <Info size={20} className="text-text-muted" />;
    }
  };
  const getBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success-surface border-success/20';
      case 'warning':
        return 'bg-warning-surface border-warning/20';
      case 'danger':
        return 'bg-danger-surface border-danger/20';
      case 'info':
        return 'bg-info-surface border-info/20';
      default:
        return 'bg-surface border-border-subtle';
    }
  };
  return <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">Quick Resume</h3>
        <button onClick={() => navigate(activePersona.defaultRoute)} className="text-sm font-medium text-secondary hover:underline flex items-center gap-1">
          Go to workspace <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => <div key={item.id} className={`p-4 rounded border ${getBg(item.status)} flex flex-col h-full`}>
            <div className="flex items-start gap-3 mb-2">
              <div className="mt-0.5">{getIcon(item.status)}</div>
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  {item.title}
                </h4>
                {item.linkedId && <span className="text-xs font-mono text-text-muted">
                    {item.linkedId}
                  </span>}
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4 flex-1 ml-8">
              {item.explanation}
            </p>
            <div className="ml-8 mt-auto">
              <button className="text-xs font-semibold bg-white px-3 py-1.5 rounded shadow-sm border border-border-subtle hover:bg-surface transition-colors">
                {item.cta}
              </button>
            </div>
          </div>)}
      </div>
    </div>;
}