import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';
import { AlertCircle } from 'lucide-react';
interface PlaceholderPageProps {
  title: string;
  description: string;
  phase?: string;
}
export function PlaceholderPage({
  title,
  description,
  phase = 'Prototype Shell'
}: PlaceholderPageProps) {
  const navigate = useNavigate();
  const {
    activePersona
  } = usePersona();
  return <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-white border border-dashed border-border-default rounded-card p-12 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <AlertCircle size={48} className="text-secondary" />
        </div>

        <h1 className="text-[20px] font-bold text-primary mb-3">{title}</h1>

        <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">
          {description}
        </p>

        <div className="inline-block bg-orange-100 text-orange-900 text-xs font-semibold px-3 py-1 rounded-pill mb-8">
          Coming in {phase}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => navigate('/stage-0/orientation')} className="px-4 py-2 rounded-button bg-white border border-border-strong text-text-secondary hover:bg-surface transition-colors font-medium text-sm">
            Return to Stage 0
          </button>
          <button onClick={() => navigate(activePersona.defaultRoute)} className="px-4 py-2 rounded-button bg-primary text-white hover:bg-navy-800 transition-colors font-medium text-sm">
            Open my workspace
          </button>
        </div>
      </div>
    </div>;
}