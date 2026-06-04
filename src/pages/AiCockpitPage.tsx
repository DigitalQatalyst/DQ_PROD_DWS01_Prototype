import React from 'react';
import { AlertTriangle, Bot, CheckSquare, Lightbulb, MessageSquareText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

const insightCards = [
  { title: 'Work requiring attention', value: '6', detail: 'Tasks, approvals, and requests requiring action.', icon: CheckSquare },
  { title: 'Risks and blockers', value: '3', detail: 'SLA exposure and unresolved blockers across your work.', icon: AlertTriangle },
  { title: 'Decision support', value: '4', detail: 'Recommended decisions based on active work signals.', icon: Lightbulb },
];

export function AiCockpitPage() {
  const { activeRole } = useWorkspaceRole();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-7 lg:px-8">
      <header className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-info-text">Orientation</div>
        <h1 className="mt-1 text-3xl font-bold text-primary">AI Cockpit</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
          AI-assisted work intelligence, summaries, risk signals, and decision support for the active {activeRole} role.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <button key={card.title} onClick={() => toast.info(`${card.title} opened.`)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm hover:bg-navy-50">
              <div className="flex items-start justify-between gap-3">
                <Icon size={20} className="text-primary" />
                <span className="text-3xl font-bold text-primary">{card.value}</span>
              </div>
              <h2 className="mt-4 font-bold text-primary">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{card.detail}</p>
            </button>
          );
        })}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Bot size={22} className="text-primary" />
            <h2 className="text-xl font-bold text-primary">Ask DWS AI</h2>
          </div>
          <p className="mt-2 text-sm text-text-secondary">Ask for a work brief, status summary, risk review, or recommended next action.</p>
          <textarea rows={5} placeholder="Ask about your work, requests, workflows, trackers, or governance actions..." className="mt-5 w-full resize-none rounded-input border border-border-default bg-surface p-4 text-sm outline-none focus:border-border-strong" />
          <button onClick={() => toast.success('AI work brief generated in prototype mode.')} className="mt-3 inline-flex h-10 items-center gap-2 rounded-button bg-primary px-4 text-sm font-bold text-white">
            <Sparkles size={16} />
            Generate work brief
          </button>
        </div>

        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary"><MessageSquareText size={18} /> Suggested prompts</h2>
          <div className="mt-4 space-y-2">
            {['Summarise my priorities for today', 'What approvals are waiting on me?', 'Show blockers affecting outcomes', 'Prepare my weekly status update'].map((prompt) => (
              <button key={prompt} onClick={() => toast.info(`Prompt selected: ${prompt}`)} className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-3 text-left text-sm font-semibold text-primary hover:bg-navy-50">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
