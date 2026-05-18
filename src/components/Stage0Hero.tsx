import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight, Compass, ChevronDown, Search, Play, Activity, FileCheck2, CheckCircle2, BarChart3 } from 'lucide-react';
import type { Persona, PersonaId } from '../types/platform';
import type { ViewingMode } from '../context/ViewingModeContext';
interface Stage0HeroProps {
  activePersona: Persona;
  mode?: ViewingMode;
  marketplaceAnchorId?: string;
  nextSectionAnchorId?: string;
}
interface SignalChip {
  label: string;
  value: string;
}
const personaSignals: Record<PersonaId, SignalChip[]> = {
  associate: [{
    label: 'Assigned Tasks',
    value: '2'
  }, {
    label: 'Pending Requests',
    value: '2'
  }, {
    label: 'Blocked Items',
    value: '1'
  }, {
    label: 'Awaiting Approval',
    value: '0'
  }, {
    label: 'SLA Risk',
    value: '0'
  }],
  'scrum-master': [{
    label: 'Missing Updates',
    value: '5'
  }, {
    label: 'Active Blockers',
    value: '3'
  }, {
    label: 'Task Hygiene Risks',
    value: '2'
  }, {
    label: 'SLA Risks',
    value: '2'
  }, {
    label: 'Closure Risks',
    value: '3'
  }],
  'team-lead': [{
    label: 'Team Tasks',
    value: '11'
  }, {
    label: 'Overdue Items',
    value: '3'
  }, {
    label: 'Pending Approvals',
    value: '2'
  }, {
    label: 'Blocked Work',
    value: '2'
  }, {
    label: 'Closure Risks',
    value: '2'
  }],
  'unit-lead': [{
    label: 'SLA Health',
    value: '84%'
  }, {
    label: 'Governance Risks',
    value: '2'
  }, {
    label: 'Outcome Delayed',
    value: '1'
  }, {
    label: 'Escalations',
    value: '2'
  }, {
    label: 'Units on Watch',
    value: '1'
  }],
  hra: [{
    label: 'HRA Requests',
    value: '6'
  }, {
    label: 'Onboarding Checklists',
    value: '2'
  }, {
    label: 'Returned Requests',
    value: '1'
  }, {
    label: 'Policy Checks',
    value: '3'
  }, {
    label: 'Pending Approvals',
    value: '1'
  }],
  admin: [{
    label: 'Config Alerts',
    value: '3'
  }, {
    label: 'Permission Exceptions',
    value: '2'
  }, {
    label: 'Audit Events',
    value: '4'
  }, {
    label: 'SLA Rule Reviews',
    value: '1'
  }, {
    label: 'Change Requests',
    value: '2'
  }],
  support: [{
    label: 'New Requests',
    value: '8'
  }, {
    label: 'Missing Inputs',
    value: '3'
  }, {
    label: 'SLA Risk',
    value: '3'
  }, {
    label: 'Routed Items',
    value: '5'
  }, {
    label: 'Closure Queue',
    value: '5'
  }],
  ceo: [{
    label: 'Strategic Risks',
    value: '3'
  }, {
    label: 'SLA Health',
    value: '84%'
  }, {
    label: 'Governance Health',
    value: 'Watch'
  }, {
    label: 'Outcome Progress',
    value: '72%'
  }, {
    label: 'Critical Escalations',
    value: '2'
  }]
};
const personaCtaLabel: Record<PersonaId, string> = {
  associate: 'Open Associate Workspace',
  'scrum-master': 'Open Scrum Master Workspace',
  'team-lead': 'Open Team Lead Workspace',
  'unit-lead': 'Open Unit Lead Workspace',
  hra: 'Open HRA Workspace',
  admin: 'Open Admin Console',
  support: 'Open Support Operations',
  ceo: 'Open CEO Enterprise View'
};
const flowSteps: Array<{
  key: string;
  icon: typeof Search;
  label: string;
  detail: string;
}> = [{
  key: 'discover',
  icon: Search,
  label: 'Discover',
  detail: 'Work enters with context'
}, {
  key: 'start',
  icon: Play,
  label: 'Start',
  detail: 'Ownership becomes visible'
}, {
  key: 'execute',
  icon: Activity,
  label: 'Execute',
  detail: 'Decisions stay attached'
}, {
  key: 'evidence',
  icon: FileCheck2,
  label: 'Evidence',
  detail: 'Evidence travels with the work'
}, {
  key: 'close',
  icon: CheckCircle2,
  label: 'Close',
  detail: 'Closure is reviewed before completion'
}, {
  key: 'measure',
  icon: BarChart3,
  label: 'Measure',
  detail: 'Outcomes stay observable'
}];
export function Stage0Hero({
  activePersona,
  mode = 'first-time',
  marketplaceAnchorId = 'explore-marketplaces',
  nextSectionAnchorId
}: Stage0HeroProps) {
  const navigate = useNavigate();
  const isFirstTime = mode === 'first-time';
  const signals = personaSignals[activePersona.id] || [];
  const primaryCtaLabel = isFirstTime ? 'Start Onboarding' : personaCtaLabel[activePersona.id] || 'Open Workspace';
  const handlePrimaryCta = () => {
    if (isFirstTime) {
      navigate('/onboarding');
      return;
    }
    if (activePersona.defaultRoute) {
      navigate(activePersona.defaultRoute);
    } else {
      toast.message(`Opening ${activePersona.role} workspace.`);
    }
  };
  const handleSecondaryCta = () => {
    navigate('/marketplaces/services');
  };
  const handleSignalClick = (label: string) => {
    toast.message(`Opening ${label}.`);
  };
  const handleScrollCue = () => {
    const targetId = nextSectionAnchorId || marketplaceAnchorId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  // Highlight the third step ("Execute") to give the preview an active anchor
  const activeFlowKey = 'execute';
  return <section aria-label="DWS.01 entry hero" className="relative w-full bg-[#030F35] overflow-hidden" style={{
    minHeight: 'calc(100vh - 64px)'
  }}>
      {/* Subtle radial mesh treatment — navy + orange brand tones only */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
      background: 'radial-gradient(60% 50% at 15% 20%, rgba(251,85,53,0.10) 0%, rgba(3,15,53,0) 60%), radial-gradient(50% 60% at 85% 80%, rgba(181,197,247,0.10) 0%, rgba(3,15,53,0) 65%)'
    }} />
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-3xl" style={{
      background: 'rgba(251,85,53,0.08)'
    }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full blur-3xl" style={{
      background: 'rgba(181,197,247,0.06)'
    }} />

      {/* Constrained inner content */}
      <div className="relative z-10 mx-auto flex flex-col" style={{
      maxWidth: '1180px',
      paddingLeft: 'clamp(24px, 4vw, 48px)',
      paddingRight: 'clamp(24px, 4vw, 48px)',
      minHeight: 'calc(100vh - 64px)'
    }}>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-16 pb-24">
          {/* LEFT COLUMN — value copy, persona context, CTAs, signal strip */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* Eyebrow + persona pill */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              
              <span className="inline-flex items-center max-w-[260px] px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white truncate" title={`Viewing as: ${activePersona.name} — ${activePersona.role}`}>
                <span className="truncate">
                  Viewing as: {activePersona.name} — {activePersona.role}
                </span>
              </span>
              {isFirstTime && <span className="px-2.5 py-1 rounded-full bg-[#FB5535]/15 border border-[#FB5535]/40 text-[10px] font-semibold text-[#FB5535] uppercase tracking-wider">
                  New Joiner
                </span>}
            </div>

            {/* Headline */}
            <h1 className="text-white font-bold leading-[1.08] tracking-tight text-[40px] sm:text-[44px] lg:text-[52px] mb-5">
              Where DQ work becomes owned, evidenced, and measurable.
            </h1>

            {/* Body */}
            <p className="text-[#B5C5F7] text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
              DWS.01 gives every DQ role one governed entry point for work,
              requests, decisions, evidence, knowledge, and execution
              visibility.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={handlePrimaryCta} className="inline-flex items-center justify-center gap-2 bg-[#FB5535] hover:bg-[#e34a2c] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-[0_10px_24px_-12px_rgba(251,85,53,0.55)]">
                {primaryCtaLabel}
                <ArrowRight size={18} />
              </button>
              <button onClick={handleSecondaryCta} className="inline-flex items-center justify-center gap-2 bg-transparent text-[#FB5535] border border-[#FB5535]/70 hover:bg-[#FB5535]/10 px-6 py-3 rounded-lg font-semibold transition-colors">
                <Compass size={18} />
                Explore services, templates & knowledge
              </button>
            </div>

            {/* Execution signal strip — persona aware */}
            <div className="border-t border-white/10 pt-6">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#B5C5F7]/70 mb-3">
                {activePersona.role} signals
              </div>
              <div className="flex flex-wrap gap-2">
                {signals.length === 0 ? <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs">
                    Role context loading…
                  </span> : signals.map((s) => <button key={s.label} onClick={() => handleSignalClick(s.label)} className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 hover:bg-white/14 border border-white/10 hover:border-white/20 text-white text-xs font-medium transition-colors">
                      <span className="text-[#B5C5F7] group-hover:text-white transition-colors">
                        {s.label}
                      </span>
                      <span className="text-white font-semibold">·</span>
                      <span className="text-white font-semibold">
                        {s.value}
                      </span>
                    </button>)}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Governed work preview panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 lg:p-7 shadow-[0_30px_60px_-30px_rgba(3,15,53,0.8)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#FB5535]">
                    Governed work preview
                  </div>
                  <div className="text-white font-semibold text-sm mt-1">
                    How work moves through DWS.01
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#FB5535]/15 text-[#FB5535] text-[10px] font-semibold uppercase tracking-wider">
                  Live
                </span>
              </div>

              <ol className="space-y-2">
                {flowSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = step.key === activeFlowKey;
                return <li key={step.key} className={`relative flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${isActive ? 'bg-[#FB5535]/12 border border-[#FB5535]/40' : 'bg-white/[0.03] border border-white/8 hover:bg-white/[0.06]'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#FB5535] text-white' : 'bg-white/10 text-[#B5C5F7]'}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-white/90'}`}>
                            {step.label}
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            0{idx + 1}
                          </span>
                        </div>
                        <div className="text-xs text-[#B5C5F7] leading-snug mt-0.5">
                          {step.detail}
                        </div>
                      </div>
                    </li>;
              })}
              </ol>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-[#B5C5F7]">
                  Ownership · Evidence · Closure · Outcome
                </span>
                
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <button onClick={handleScrollCue} className="self-center mb-6 inline-flex flex-col items-center gap-1 text-[#B5C5F7] hover:text-white transition-colors group" aria-label="Continue to execution overview">
          <span className="text-[11px] font-medium tracking-wider uppercase">
            Continue to execution overview
          </span>
          <ChevronDown size={18} className="animate-bounce group-hover:text-[#FB5535] transition-colors" />
        </button>
      </div>
    </section>;
}