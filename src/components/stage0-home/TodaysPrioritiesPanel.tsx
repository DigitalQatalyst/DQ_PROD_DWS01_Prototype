import React from 'react';
import { ChevronRight, ClipboardList, ListTodo, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stage0WorkspaceRouteForPersona } from '../../config/stage0HomeRoutes';
import { usePersona } from '../../context/PersonaContext';
import { todaysPriorities } from '../../mocks/stage0Home.mock';

const icons = [Play, ListTodo, ClipboardList];

const delayClasses = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300'] as const;

export function TodaysPrioritiesPanel() {
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const workspaceRoute = stage0WorkspaceRouteForPersona(activePersona.id);
  const canOpenRequestStatus = ['associate', 'hra', 'admin', 'support'].includes(activePersona.id);

  const handleClick = (id: string) => {
    if (id === 'resume') {
      navigate(canOpenRequestStatus ? '/requests/REQ-2401/status' : '/workspace/my-requests');
      return;
    }
    if (id === 'queue') {
      navigate(workspaceRoute);
      return;
    }
    navigate('/workspace/notifications');
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {todaysPriorities.map((card, index) => {
        const Icon = icons[index] ?? Play;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => handleClick(card.id)}
            className={`animate-fade-in-up ${delayClasses[index] ?? ''} flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-dq-orange hover:shadow-dq-hover`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-dq-navy">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-dq-navy">{card.title}</h3>
              <p className="mt-1 truncate text-sm font-medium text-text-secondary">{card.primary}</p>
              <p className="mt-0.5 text-xs text-text-muted">{card.secondary}</p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-text-muted" />
          </button>
        );
      })}
    </div>
  );
}
