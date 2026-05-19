import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  Grid3X3,
  KeyRound,
  Layers3,
  MessageSquareText,
  MonitorUp,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import type { ViewingMode } from '../context/ViewingModeContext';

interface Stage0HeroProps {
  mode?: ViewingMode;
  marketplaceAnchorId?: string;
  updatesAnchorId?: string;
}

const newJoinerCards = [
  {
    title: 'Complete Profile',
    description: 'Set up your profile and workspace preferences.',
    icon: CheckCircle2
  },
  {
    title: 'Understand DQ Ways of Working',
    description: 'Learn how work is structured, governed, and delivered.',
    icon: BookOpen
  },
  {
    title: 'Request Access & Tools',
    description: 'Request systems, tools, and workspace access.',
    icon: KeyRound
  },
  {
    title: 'Meet Your Team & Contacts',
    description: 'Find key contacts, owners, and support channels.',
    icon: Users
  }
];

const returningCards = [
  {
    title: 'Continue Where You Left Off',
    description: 'Resume recent work, tasks, trackers, and workflows.',
    icon: RotateCcw
  },
  {
    title: 'Review Updates Since Last Visit',
    description: 'See recent activity, changes, and important updates.',
    icon: MessageSquareText
  },
  {
    title: 'Open Favourite Destinations',
    description: 'Quick access to saved marketplaces and tools.',
    icon: BriefcaseBusiness
  },
  {
    title: 'Check Access, Requests & Support',
    description: 'Review access, support requests, and workspace help.',
    icon: ShieldCheck
  }
];

function scrollToId(id?: string) {
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

export function Stage0Hero({
  mode = 'first-time',
  marketplaceAnchorId = 'explore-marketplaces',
  updatesAnchorId = 'stage0-updates'
}: Stage0HeroProps) {
  const navigate = useNavigate();
  const isNewJoiner = mode === 'first-time';
  const cards = isNewJoiner ? newJoinerCards : returningCards;
  const headline = isNewJoiner ? 'Welcome to DWS.01' : 'Welcome back to DWS.01';
  const subtitle = isNewJoiner ?
  'Your digital entry point into how DQ works — discover services, understand ways of working, access knowledge, and start your onboarding journey.' :
  'Continue into your workspace, review what has changed, and access the right marketplace entry points before moving into execution.';
  const visualLabels = isNewJoiner ?
  ['Onboarding', 'Access', 'Knowledge', '4D Marketplaces'] :
  ['Workspace Entry', 'Recent Updates', 'Saved Destinations', 'Marketplace Access'];

  return (
    <section
      aria-label="DWS.01 Stage 00 landing hero"
      className="relative w-full overflow-hidden bg-white"
      style={{
        minHeight: 'calc(100vh - 64px)'
      }}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fc_100%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="max-w-3xl">
            <h1 className="text-[42px] font-bold leading-[1.06] text-primary sm:text-[56px] lg:text-[68px]">
              {headline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => navigate(isNewJoiner ? '/onboarding' : '/stage02/workspace')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-button bg-primary px-6 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#07194f]">
                {isNewJoiner ? 'Start Onboarding' : 'Enter Workspace'}
                <ArrowRight size={17} />
              </button>
              <button
                onClick={() => scrollToId(marketplaceAnchorId)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-button border border-border-default bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-surface">
                <Grid3X3 size={17} />
                Explore 4D Marketplaces
              </button>
              <button
                onClick={() => isNewJoiner ? navigate('/stage-0/operating-guide') : scrollToId(updatesAnchorId)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-button border border-border-default bg-white px-6 text-sm font-semibold text-primary transition-colors hover:bg-surface">
                <FileText size={17} />
                {isNewJoiner ? 'View Getting Started Guide' : 'Review What\'s New'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-border-subtle bg-white p-5 shadow-xl">
              <div className="rounded-2xl border border-border-subtle bg-surface p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                      <MonitorUp size={19} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">DWS.01</div>
                      <div className="text-xs text-text-muted">
                        {isNewJoiner ? 'Orientation workspace' : 'Return workspace'}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-pill border border-border-default bg-white px-3 py-1 text-[11px] font-semibold text-text-muted">
                    Stage 00
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {visualLabels.map((label, index) => {
                    const icons = [Sparkles, KeyRound, Search, Layers3];
                    const Icon = icons[index] || Compass;
                    return (
                      <div key={label} className="rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
                        <Icon size={20} className={index === 0 ? 'text-secondary' : 'text-primary'} />
                        <div className="mt-4 text-sm font-semibold text-primary">{label}</div>
                        <div className="mt-2 h-1.5 w-full rounded-pill bg-navy-100" />
                        <div className="mt-2 h-1.5 w-2/3 rounded-pill bg-navy-100" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-border-subtle bg-white p-4">
                  <div className="mb-3 flex items-center justify-between text-xs font-semibold text-text-muted">
                    <span>{isNewJoiner ? 'DQ ways of working' : 'Recent workspace context'}</span>
                    <span className="text-secondary">AI ready</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {['Discover', 'Start', 'Track', 'Govern', 'Improve'].map((step) => (
                      <div key={step} className="rounded-lg bg-surface px-2 py-3 text-center text-[10px] font-semibold text-primary">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-2xl border border-border-subtle bg-white/95 p-5 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
                  <Icon size={19} />
                </div>
                <h2 className="text-sm font-bold text-primary">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
