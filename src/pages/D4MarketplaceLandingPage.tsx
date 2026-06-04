import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BarChart3, BookOpen, Boxes, FileText, MessageSquare, Users, ArrowRight } from 'lucide-react';

const marketplaceCards = {
  discern: {
    title: 'Discern',
    description: 'Find knowledge, analytics, and work ownership entry points to understand what exists before acting.',
    cards: [
      { name: 'Knowledge Discovery', route: '/marketplace/knowledge-discovery?from=discern', tag: 'Discern', owner: 'Knowledge users', icon: BookOpen, purpose: 'Find approved guidance, references, standards, templates, and workspace context.' },
      { name: 'Analytics Discovery', route: '/marketplace/analytics-discovery?from=discern', tag: 'Discern', owner: 'Leads and operators', icon: BarChart3, purpose: 'Use analytics to understand current state, patterns, and needs.' },
      { name: 'Work Directory', route: '/marketplace/work-directory?from=discern', tag: 'Discern', owner: 'All roles', icon: Users, purpose: 'Find owners, experts, teams, and work context.' },
    ],
  },
  design: {
    title: 'Design',
    description: 'Find reusable task patterns, templates, and playbooks that help structure work before execution.',
    cards: [
      { name: 'Task Library', route: '/marketplace/task-library?from=design', tag: 'Design', owner: 'Task creators', icon: FileText, purpose: 'Select governed task templates with checklist, evidence, SLA, and closure criteria.' },
      { name: 'Playbooks & Templates', route: '/marketplace/knowledge-discovery?from=design&focus=playbooks-templates', tag: 'Design', owner: 'Work designers', icon: BookOpen, purpose: 'Use reusable playbooks, operating examples, and content templates to shape work correctly.' },
    ],
  },
  deploy: {
    title: 'Deploy',
    description: 'Access executable service and work-routing marketplaces that help move work into delivery.',
    cards: [
      { name: 'Services Marketplace', route: '/marketplace/services?from=deploy', tag: 'Deploy', owner: 'Requesters', icon: Boxes, purpose: 'Submit support, access, HRA, admin, approval, and escalation requests.' },
      { name: 'Work Directory', route: '/marketplace/work-directory?from=deploy', tag: 'Deploy', owner: 'Fulfilment owners', icon: Users, purpose: 'Route work to the right owner or service team.' },
    ],
  },
  drive: {
    title: 'Drive',
    description: 'Monitor outcomes, feedback, performance signals, and improvement opportunities.',
    cards: [
      { name: 'Analytics Discovery', route: '/marketplace/analytics-discovery?from=drive', tag: 'Drive', owner: 'Leads and executives', icon: BarChart3, purpose: 'Use analytics to monitor performance, improvement, and outcomes.' },
      { name: 'Marketplace Feedback', route: '/marketplace/feedback?from=drive', tag: 'Drive', owner: 'All roles', icon: MessageSquare, purpose: 'Raise feedback on unclear services, missing templates, outdated knowledge, or broken marketplace paths.' },
    ],
  },
};

type MarketplaceStage = keyof typeof marketplaceCards;

export function D4MarketplaceLandingPage() {
  const { d4Stage } = useParams();
  const location = useLocation();
  const pathStage = location.pathname.split('/').filter(Boolean).pop();
  const requestedStage = d4Stage || pathStage;
  const stage = (requestedStage && requestedStage in marketplaceCards ? requestedStage : 'discern') as MarketplaceStage;
  const content = marketplaceCards[stage];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Marketplace</div>
        <h1 className="mt-1 text-3xl font-bold text-primary">DWS Marketplace</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
          Discover services, knowledge, reusable task patterns, work ownership, analytics, and feedback through the DWS 4D model.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-4">
        {(Object.keys(marketplaceCards) as MarketplaceStage[]).map((category) => {
          const categoryContent = marketplaceCards[category];
          const isActive = category === stage;
          return (
            <Link
              key={category}
              to={`/marketplace/${category}`}
              className={`rounded-card border p-4 transition ${
                isActive ? 'border-primary bg-primary text-white shadow-sm' : 'border-border-subtle bg-white text-primary hover:bg-surface'
              }`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">{categoryContent.title}</h2>
                <ArrowRight size={16} />
              </div>
              <p className={`mt-2 text-xs leading-5 ${isActive ? 'text-white/75' : 'text-text-muted'}`}>
                {categoryContent.cards.length} marketplace pathways
              </p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-info-text">4D category</div>
          <h2 className="mt-1 text-2xl font-bold text-primary">{content.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{content.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {content.cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.name} to={card.route} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm transition hover:bg-surface">
              <div className="flex items-start justify-between gap-3">
                <Icon size={22} className="text-primary" />
                <span className="rounded-pill bg-navy-100 px-2 py-1 text-[11px] font-bold text-primary">{card.tag}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold text-primary">{card.name}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{card.purpose}</p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                <span className="text-text-muted">{card.owner}</span>
                <span className="text-info-text">Open</span>
              </div>
            </Link>
          );
        })}
        </div>
      </section>
    </div>
  );
}
