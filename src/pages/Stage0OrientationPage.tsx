import React from 'react';
import { toast } from 'sonner';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Compass,
  Cpu,
  Headphones,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Workflow
} from 'lucide-react';
import { useViewingMode } from '../context/ViewingModeContext';
import { Stage0Hero } from '../components/Stage0Hero';
import { Stage0Marketplaces4D } from '../components/Stage0Marketplaces4D';

const workFlow = [
  { label: 'Discover', description: 'Find needs, services, knowledge, and owners.', icon: Search },
  { label: 'Start Work', description: 'Open requests, tasks, workflows, and trackers.', icon: Workflow },
  { label: 'Track Execution', description: 'Make progress, ownership, and evidence visible.', icon: ClipboardList },
  { label: 'Govern', description: 'Apply quality, controls, and decision discipline.', icon: ShieldCheck },
  { label: 'Improve', description: 'Learn from outcomes and improve how work runs.', icon: TrendingUp }
];

const priorities = [
  'One governed entry point for DQ work, knowledge, services, and support.',
  'Clear ownership, transparent execution, and reusable templates.',
  'Evidence-led governance that keeps decisions, risks, and outcomes visible.',
  'AI-assisted discovery and summaries without replacing accountable owners.'
];

const announcements = [
  'Updated onboarding guide available for all DWS.01 users',
  '4D marketplace taxonomy refreshed for service discovery',
  'Governance templates aligned to the latest delivery review cycle'
];

const changedItems = [
  { title: 'New workflow templates published', icon: Workflow },
  { title: 'Strategic Initiatives Tracker updated', icon: TrendingUp },
  { title: 'Governance review cycle opened', icon: ShieldCheck },
  { title: 'New learning path available', icon: BookOpen },
  { title: 'Platform update released', icon: Cpu }
];

const supportCards = [
  {
    title: 'Need Help?',
    description: 'Find answers, FAQs, and common workspace guidance.',
    icon: CircleHelp,
    message: 'Help and support options opened.'
  },
  {
    title: 'IT & Access Support',
    description: 'Get help with access, tools, and technical issues.',
    icon: Headphones,
    message: 'IT and access support options opened for this prototype.'
  },
  {
    title: 'HR & Onboarding',
    description: 'Questions about onboarding, policies, and benefits.',
    icon: Users,
    message: 'HRA and onboarding support options opened for this prototype.'
  },
  {
    title: 'Platform Help',
    description: 'Guides, how-tos, and platform support resources.',
    icon: Compass,
    message: 'Platform help options opened for this prototype.'
  }
];

const aiNewJoiner = [
  {
    title: 'AI Work Brief',
    description: 'Get a tailored brief of priorities, risks, and next actions.',
    icon: Sparkles
  },
  {
    title: 'AI Discovery Search',
    description: 'Ask anything and find services, documents, people, and templates faster.',
    icon: Search
  },
  {
    title: 'AI Tracker Summary',
    description: 'Get AI-powered insights on tracker progress and risks.',
    icon: BarChart3
  },
  {
    title: 'AI Governance Check',
    description: 'Check compliance, controls, and missing work information.',
    icon: ShieldCheck
  }
];

const aiReturning = [
  {
    title: 'AI Work Brief',
    description: 'Prepare your daily brief once you enter the workspace.',
    icon: Sparkles
  },
  {
    title: 'AI Discovery Search',
    description: 'Find services, templates, knowledge, and owners quickly.',
    icon: Search
  },
  {
    title: 'AI Tracker Summary',
    description: 'Summarise tracker progress before review sessions.',
    icon: BarChart3
  },
  {
    title: 'AI Governance Check',
    description: 'Identify missing owners, overdue items, and incomplete records.',
    icon: ShieldCheck
  }
];

function SectionShell({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10 ${className}`}>{children}</section>;
}

function OperatingModel() {
  return (
    <SectionShell className="pt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">How Work Runs in DWS</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          A simple operating path keeps discovery, execution, governance, and improvement connected.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {workFlow.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.label} className="relative rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
                  <Icon size={19} />
                </div>
                <span className="text-xs font-bold text-text-disabled">0{index + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-primary">{step.label}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{step.description}</p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function PrioritiesAndUpdates() {
  return (
    <SectionShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-secondary">
              <CheckCircle2 size={19} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">DQ Priorities & Ways of Working</h2>
              <p className="text-sm text-text-muted">Organisational priorities and delivery principles.</p>
            </div>
          </div>
          <div className="space-y-3">
            {priorities.map((priority) => (
              <div key={priority} className="flex gap-3 rounded-xl bg-surface px-4 py-3 text-sm leading-6 text-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                <span>{priority}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
              <Megaphone size={19} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">DWS Announcements / Updates</h2>
              <p className="text-sm text-text-muted">Important changes before entering execution.</p>
            </div>
          </div>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement} className="rounded-xl border border-border-subtle px-4 py-3">
                <div className="text-sm font-semibold text-primary">{announcement}</div>
                <div className="mt-1 text-xs text-text-muted">Workspace update</div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </SectionShell>
  );
}

function ChangedSinceLastVisit() {
  return (
    <SectionShell className="scroll-mt-24" >
      <div id="stage0-updates" className="scroll-mt-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">What&apos;s Changed Since Your Last Visit</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Review recent updates before entering Stage 02 workspace execution.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {changedItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
                <Icon size={20} className="text-primary" />
                <h3 className="mt-4 text-sm font-bold leading-6 text-primary">{item.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function AiPreview({
  returning
}: {
  returning: boolean;
}) {
  const cards = returning ? aiReturning : aiNewJoiner;
  return (
    <SectionShell>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">AI-Driven Workspace Preview</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Preview the intelligent support available once you enter the workspace.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
                <Icon size={19} />
              </div>
              <h3 className="text-sm font-bold text-primary">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{card.description}</p>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function SupportSection() {
  return (
    <SectionShell className="pb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Need Support?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Find help for onboarding, access, platform guidance, and workspace questions.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {supportCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => toast.info(card.message)}
              className="rounded-2xl border border-border-subtle bg-white p-5 text-left shadow-sm transition-colors hover:border-border-default hover:bg-surface">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
                <Icon size={19} />
              </div>
              <h3 className="text-sm font-bold text-primary">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{card.description}</p>
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}

function MarketplaceSection() {
  return (
    <SectionShell>
      <Stage0Marketplaces4D />
    </SectionShell>
  );
}

export function Stage0OrientationPage() {
  const { mode } = useViewingMode();
  const returning = mode === 'returning';

  return (
    <div className="w-full bg-[#F7F8FC]">
      <Stage0Hero mode={mode} marketplaceAnchorId="explore-marketplaces" updatesAnchorId="stage0-updates" />

      <div className="space-y-16">
        <OperatingModel />
        <MarketplaceSection />
        {returning ? <ChangedSinceLastVisit /> : <PrioritiesAndUpdates />}
        <AiPreview returning={returning} />
        <SupportSection />
      </div>
    </div>
  );
}
