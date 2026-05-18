import React from 'react';
import { NextStepCard } from './NextStepCard';
import { Briefcase, Inbox, BookOpen, Users } from 'lucide-react';
import type { Persona } from '../types/platform';
import { roleGuides } from '../mocks/stage0.mock';
interface Stage0NextDestinationsProps {
  activePersona: Persona;
}
export function Stage0NextDestinations({
  activePersona
}: Stage0NextDestinationsProps) {
  const metrics = roleGuides[activePersona.id]?.metrics || [];
  const getMetricValue = (label: string, fallback: string) => {
    const metric = metrics.find((m) => m.label.toLowerCase().includes(label.toLowerCase()));
    return metric ? metric.value : fallback;
  };
  return <section className="max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-primary mb-6">
        Continue Execution
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NextStepCard title="My Workspace" description="Open assigned tasks, approvals, evidence, and blockers." icon={Briefcase} route={activePersona.defaultRoute} />
        <NextStepCard title="Service Catalogue" description="Submit and track operational requests." icon={Inbox} route="/marketplaces/services" />
        <NextStepCard title="Knowledge Hub" description="Find GHC references, playbooks, and workspace guides." icon={BookOpen} route="/marketplaces/knowledge" />
        <NextStepCard title="Work Directory" description="Find teams, owners, experts, and support contacts." icon={Users} route="/marketplaces/work-directory" />
      </div>
    </section>;
}