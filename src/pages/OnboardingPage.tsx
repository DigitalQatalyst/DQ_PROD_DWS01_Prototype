import React, { useMemo, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, ArrowRight, ArrowLeft, ClipboardList, ShieldCheck, Compass, Layers, Rocket, Activity, Briefcase, BookOpen, Users, Inbox, AlertOctagon, Paperclip, Bell, LayoutList, KanbanSquare, CheckSquare, Lock, Eye, FileText, PartyPopper } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import type { Persona } from '../types/platform';
const ONBOARDING_STEPS = [{
  id: 1,
  title: 'Overview'
}, {
  id: 2,
  title: 'Profile & Role'
}, {
  id: 3,
  title: 'Work Model'
}, {
  id: 4,
  title: 'Work Rules'
}, {
  id: 5,
  title: 'Marketplaces'
}, {
  id: 6,
  title: 'First Task'
}, {
  id: 7,
  title: 'Preferences'
}, {
  id: 8,
  title: 'Complete'
}];
export function OnboardingPage() {
  const {
    activePersona
  } = usePersona();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // Step 6 (first task) interactive state
  const [taskProgress, setTaskProgress] = useState('');
  const [evidenceAttached, setEvidenceAttached] = useState(false);
  const [blockerRaised, setBlockerRaised] = useState(false);
  const [taskReadyForReview, setTaskReadyForReview] = useState(false);
  // Step 7 preferences
  const [prefs, setPrefs] = useState({
    taskAlerts: true,
    dueReminders: true,
    approvalAlerts: true,
    mentionAlerts: true,
    requestUpdates: false,
    workspaceView: 'list' as 'list' | 'board'
  });
  const goNext = () => {
    setCompletedSteps((prev) => prev.includes(currentStep) ? prev : [...prev, currentStep]);
    setCurrentStep((s) => Math.min(ONBOARDING_STEPS.length, s + 1));
  };
  const goBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };
  const totalSteps = ONBOARDING_STEPS.length;
  const completionPct = Math.round(completedSteps.length / totalSteps * 100);
  return <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header strip */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-bold text-secondary tracking-wider uppercase">
            DWS.01 Onboarding
          </span>
          <span className="px-3 py-1 rounded-pill bg-navy-50 border border-border-default text-xs font-semibold text-primary">
            {activePersona.name} — {activePersona.role}
          </span>
          <span className="px-3 py-1 rounded-pill bg-surface border border-border-subtle text-xs font-medium text-text-muted">
            ~ 10 min total
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Start Your DWS.01 Onboarding
        </h1>
        <p className="text-text-secondary max-w-3xl">
          Set up your profile, understand how work moves in DWS.01, and complete
          the first steps before entering daily execution.
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-secondary transition-all duration-500" style={{
            width: `${completionPct}%`
          }} />
          </div>
          <span className="text-xs font-semibold text-text-muted tabular-nums">
            Step {currentStep} of {totalSteps} · {completionPct}%
          </span>
        </div>
      </header>

      {/* Step indicator */}
      <nav aria-label="Onboarding steps" className="mb-8 overflow-x-auto hide-scrollbar">
        <ol className="flex items-center gap-2 min-w-max">
          {ONBOARDING_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === currentStep;
          const isClickable = isCompleted || isActive;
          return <li key={step.id} className="flex items-center">
                <button type="button" onClick={() => isClickable && setCurrentStep(step.id)} disabled={!isClickable} className={`flex items-center gap-2 px-3 py-1.5 rounded-pill text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-success-surface text-success-text hover:bg-success/20' : 'bg-surface text-text-disabled cursor-not-allowed'}`}>
                  {isCompleted ? <Check size={12} /> : <span className="tabular-nums">{step.id}</span>}
                  {step.title}
                </button>
                {step.id !== ONBOARDING_STEPS.length && <span className="mx-1 w-4 h-px bg-border-default" />}
              </li>;
        })}
        </ol>
      </nav>

      {/* Step body */}
      <div className="bg-white rounded-card border border-border-default p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        {currentStep === 1 && <StepOverview persona={activePersona} onBegin={goNext} />}
        {currentStep === 2 && <StepProfile persona={activePersona} onNext={goNext} />}
        {currentStep === 3 && <StepWorkModel onNext={goNext} />}
        {currentStep === 4 && <StepWorkRules onNext={goNext} />}
        {currentStep === 5 && <StepMarketplaces onNext={goNext} />}
        {currentStep === 6 && <StepFirstTask persona={activePersona} taskProgress={taskProgress} setTaskProgress={setTaskProgress} evidenceAttached={evidenceAttached} setEvidenceAttached={setEvidenceAttached} blockerRaised={blockerRaised} setBlockerRaised={setBlockerRaised} taskReadyForReview={taskReadyForReview} setTaskReadyForReview={setTaskReadyForReview} onNext={goNext} />}
        {currentStep === 7 && <StepPreferences prefs={prefs} setPrefs={setPrefs} onNext={goNext} />}
        {currentStep === 8 && <StepComplete persona={activePersona} completedSteps={completedSteps} onEnterWorkspace={() => {
        toast.success('Welcome to your workspace.');
        navigate(activePersona.defaultRoute);
      }} onExploreMarketplaces={() => {
        navigate('/stage-0/orientation#explore-marketplaces');
      }} onViewFirstTasks={() => navigate('/workspace/my-tasks')} />}
      </div>

      {/* Footer navigation */}
      {currentStep > 1 && currentStep < ONBOARDING_STEPS.length && <div className="mt-6 flex items-center justify-between">
          <button onClick={goBack} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
            <ArrowLeft size={16} />
            Previous
          </button>
          <button onClick={() => {
        toast.info('You can resume onboarding from Stage 0.');
        navigate('/stage-0/orientation');
      }} className="text-xs font-medium text-text-muted hover:text-primary transition-colors">
            Save and exit
          </button>
        </div>}
    </div>;
}
/* ============================================================
   STEP 1 — Overview
   ============================================================ */
function StepOverview({
  persona,
  onBegin



}: {persona: Persona;onBegin: () => void;}) {
  const sections = [{
    icon: Compass,
    label: 'Understand DWS.01'
  }, {
    icon: ShieldCheck,
    label: 'Confirm profile and role'
  }, {
    icon: FileText,
    label: 'Learn work rules'
  }, {
    icon: Layers,
    label: 'Explore marketplaces'
  }, {
    icon: ClipboardList,
    label: 'Complete first task simulation'
  }, {
    icon: Briefcase,
    label: 'Enter workspace'
  }];
  return <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Welcome, {persona.name.split(' ')[0]}.
          </h2>
          <p className="text-text-secondary max-w-2xl">
            DWS.01 is where DQ work becomes structured, owned, evidenced,
            governed, visible, and measurable. This activation path takes you
            through the essentials before you enter daily execution.
          </p>
        </div>
        <div className="shrink-0 px-4 py-3 rounded-card bg-navy-50 border border-border-default">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            Estimated time
          </div>
          <div className="text-2xl font-bold text-primary">~10 min</div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
          What you'll cover
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((s) => {
          const Icon = s.icon;
          return <div key={s.label} className="flex items-center gap-3 p-3 rounded-card bg-surface border border-border-subtle">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary">
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-primary">
                  {s.label}
                </span>
              </div>;
        })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onBegin} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Begin Setup
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
/* ============================================================
   STEP 2 — Profile & Role
   ============================================================ */
function StepProfile({
  persona,
  onNext



}: {persona: Persona;onNext: () => void;}) {
  const permissions = useMemo(() => [`Default workspace: ${persona.defaultRoute}`, `Access domains: ${persona.navDomains.join(', ')}`, `Tier: ${persona.tier}`], [persona]);
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Confirm your profile and role
      </h2>
      <p className="text-text-secondary max-w-2xl mb-6">
        DWS depends on role-based access, ownership, responsibility, and
        visibility. Confirm the details below before continuing.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-card border border-border-default p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
            Identity
          </div>
          <dl className="space-y-3">
            <ProfileRow label="Name" value={persona.name} />
            <ProfileRow label="Role / Persona" value={persona.role} />
            <ProfileRow label="Unit" value={persona.unit} />
            <ProfileRow label="Reporting line" value="Unit Lead (mock)" />
          </dl>
        </div>

        <div className="bg-surface rounded-card border border-border-default p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={14} className="text-primary" />
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Permission preview
            </div>
          </div>
          <ul className="space-y-2">
            {permissions.map((p) => <li key={p} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check size={14} className="text-success mt-0.5 shrink-0" />
                <span>{p}</span>
              </li>)}
          </ul>
        </div>
      </div>

      <div className="bg-navy-50 rounded-card border border-border-default p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Eye size={14} className="text-primary" />
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Role-based workspace preview
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Your home workspace is{' '}
          <span className="font-semibold text-primary font-mono">
            {persona.defaultRoute}
          </span>
          . You'll see assigned tasks, approvals, evidence, and blockers scoped
          to your role.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Confirm and Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
function ProfileRow({
  label,
  value



}: {label: string;value: string;}) {
  return <div className="flex justify-between gap-4">
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-primary text-right">{value}</dd>
    </div>;
}
/* ============================================================
   STEP 3 — Work Model Orientation
   ============================================================ */
function StepWorkModel({
  onNext


}: {onNext: () => void;}) {
  const flow = [{
    code: 'D1',
    title: 'Discover',
    desc: 'Find services, knowledge, owners'
  }, {
    code: 'D2',
    title: 'Start',
    desc: 'Open or accept a task / request'
  }, {
    code: 'D3',
    title: 'Execute',
    desc: 'Update progress against the record'
  }, {
    code: 'D4',
    title: 'Route',
    desc: 'Send to reviewer or fulfilment queue'
  }, {
    code: 'D5',
    title: 'Evidence',
    desc: 'Attach proof before closure'
  }, {
    code: 'D6',
    title: 'Close',
    desc: 'Confirm output meets criteria'
  }, {
    code: 'D7',
    title: 'Measure',
    desc: 'Adoption, SLA, closure quality'
  }];
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        How work moves in DWS.01
      </h2>
      <p className="text-text-secondary max-w-2xl mb-8">
        DWS.01 is a governed execution workspace. Work is structured as tasks,
        requests, approvals, blockers, evidence, and closure — you don't just
        browse information, you execute governed work.
      </p>

      <div className="bg-surface rounded-card border border-border-subtle p-6 mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
          The Governed Work Path
        </div>
        <div className="flex flex-wrap items-stretch gap-3">
          {flow.map((step, i) => <Fragment key={step.code}>
              <div className="flex-1 min-w-[140px] bg-white rounded-card border border-border-default p-4">
                <div className="text-[10px] font-bold text-secondary tracking-wider mb-1">
                  {step.code}
                </div>
                <div className="text-sm font-bold text-primary mb-1">
                  {step.title}
                </div>
                <div className="text-xs text-text-muted leading-snug">
                  {step.desc}
                </div>
              </div>
              {i < flow.length - 1 && <div className="hidden lg:flex items-center text-text-disabled">
                  <ArrowRight size={16} />
                </div>}
            </Fragment>)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Pillar icon={ClipboardList} title="Tasks & requests" desc="Every unit of work is captured as a structured record with an owner and expected output." />
        <Pillar icon={ShieldCheck} title="Approvals & evidence" desc="Decisions carry rationale, and proof of work is attached before closure." />
        <Pillar icon={Activity} title="Visibility & measurement" desc="Role-based dashboards make SLA, blockers, and closure quality observable." />
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Continue to Work Rules
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
function Pillar({
  icon: Icon,
  title,
  desc




}: {icon: React.ElementType;title: string;desc: string;}) {
  return <div className="bg-white rounded-card border border-border-default p-5">
      <div className="w-9 h-9 rounded-full bg-navy-50 flex items-center justify-center text-primary mb-3">
        <Icon size={18} />
      </div>
      <h4 className="text-sm font-bold text-primary mb-1">{title}</h4>
      <p className="text-xs text-text-secondary leading-snug">{desc}</p>
    </div>;
}
/* ============================================================
   STEP 4 — Structured Work Rules
   ============================================================ */
function StepWorkRules({
  onNext


}: {onNext: () => void;}) {
  const rules = [{
    title: 'Every task has an owner',
    desc: 'Work cannot move without clear accountability.'
  }, {
    title: 'Every task has an expected output',
    desc: 'Tasks define what must be produced or changed.'
  }, {
    title: 'Progress is updated against the work record',
    desc: 'Updates stay attached to the task or request.'
  }, {
    title: 'Blockers are named, owned, and resolved',
    desc: 'Obstacles become visible and actionable.'
  }, {
    title: 'Evidence is attached before closure',
    desc: 'Proof travels with the work.'
  }, {
    title: 'Approvals require rationale',
    desc: 'Decisions stay connected to the work they affect.'
  }, {
    title: 'Closure quality is reviewed',
    desc: 'Work is checked before it is treated as complete.'
  }, {
    title: 'Visibility is role-based',
    desc: 'Every role sees the signals they are permitted to act on.'
  }];
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Structured work rules
      </h2>
      <p className="text-text-secondary max-w-2xl mb-8">
        These rules govern every task, request, and approval inside DWS.01. They
        are how DQ work stays owned, evidenced, and measurable.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {rules.map((r, i) => <div key={r.title} className="flex items-start gap-3 p-4 rounded-card bg-surface border border-border-subtle">
            <div className="w-7 h-7 rounded-full bg-white border border-border-default flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">{r.title}</h4>
              <p className="text-xs text-text-secondary leading-snug">
                {r.desc}
              </p>
            </div>
          </div>)}
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Continue to Marketplace Orientation
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
/* ============================================================
   STEP 5 — Marketplace Orientation
   ============================================================ */
function StepMarketplaces({
  onNext


}: {onNext: () => void;}) {
  const groups = [{
    code: 'D1',
    title: 'Discern',
    purpose: 'Understand',
    icon: Compass,
    entries: ['News & Announcements', 'Knowledge Center', 'Learning Center', 'Service Catalog', 'Tools Directory', 'Glossary', 'Community & Office Hours']
  }, {
    code: 'D2',
    title: 'Design',
    purpose: 'Plan + Govern',
    icon: Layers,
    entries: ['Journey & Service Design Studio', 'Forms & Templates Library', 'Content Design System', 'UI / Design System Marketplace', 'Workflow Specification Studio', 'Integration & Data Mapping Templates']
  }, {
    code: 'D3',
    title: 'Deploy',
    purpose: 'Build + Release',
    icon: Rocket,
    entries: ['Release Center', 'QA / UAT Marketplace', 'Environments Hub', 'CI/CD & Build Pipeline Hub', 'Content Publishing Console', 'Integration Deployment Hub']
  }, {
    code: 'D4',
    title: 'Drive',
    purpose: 'Operate + Improve',
    icon: Activity,
    entries: ['My Requests & Workflow Tracker', 'Support & Help Center', 'Operations Command Center', 'Adoption & Engagement Dashboard', 'Governance & Policy Console', 'Performance & Insights', 'Change Management Hub']
  }];
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Where to discover what you need
      </h2>
      <p className="text-text-secondary max-w-2xl mb-8">
        Marketplaces in DWS.01 are grouped under the 4D operating model.
        Discern, Design, Deploy, Drive — find the right surface for the moment
        of work you're in.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {groups.map((g) => {
        const Icon = g.icon;
        return <div key={g.code} className="bg-white rounded-card border border-border-default overflow-hidden flex flex-col">
              <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-primary">
                    <Icon size={14} />
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-wider">
                    {g.code}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-primary leading-tight">
                  {g.title}
                  <span className="text-text-muted font-medium">
                    {' '}
                    — {g.purpose}
                  </span>
                </h3>
              </div>
              <ul className="px-3 py-2 flex-1">
                {g.entries.map((e) => <li key={e} className="px-2 py-1.5 text-xs text-text-secondary leading-snug flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-secondary shrink-0" />
                    {e}
                  </li>)}
              </ul>
            </div>;
      })}
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Try First Task Simulation
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
/* ============================================================
   STEP 6 — First Task Simulation
   ============================================================ */
interface StepFirstTaskProps {
  persona: Persona;
  taskProgress: string;
  setTaskProgress: (v: string) => void;
  evidenceAttached: boolean;
  setEvidenceAttached: (v: boolean) => void;
  blockerRaised: boolean;
  setBlockerRaised: (v: boolean) => void;
  taskReadyForReview: boolean;
  setTaskReadyForReview: (v: boolean) => void;
  onNext: () => void;
}
function StepFirstTask({
  persona,
  taskProgress,
  setTaskProgress,
  evidenceAttached,
  setEvidenceAttached,
  blockerRaised,
  setBlockerRaised,
  taskReadyForReview,
  setTaskReadyForReview,
  onNext
}: StepFirstTaskProps) {
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Run your first task
      </h2>
      <p className="text-text-secondary max-w-2xl mb-8">
        Experience how a governed task moves in DWS.01 — update progress, attach
        evidence, and mark it ready for review.
      </p>

      <div className="bg-white rounded-card border border-border-default overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border-subtle bg-surface">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-text-muted">
                  TSK-OB-001
                </span>
                <span className="px-2 py-0.5 rounded-pill bg-warning-surface text-warning-text text-[10px] font-bold uppercase tracking-wider">
                  In Progress
                </span>
              </div>
              <h3 className="text-base font-bold text-primary">
                Complete DWS.01 onboarding confirmation
              </h3>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-text-muted">
                Due
              </div>
              <div className="text-sm font-semibold text-primary">Today</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-5 border-b border-border-subtle">
          <TaskMeta label="Owner" value={persona.name} />
          <TaskMeta label="Reviewer" value="Unit Lead" />
          <TaskMeta label="Inputs" value="Profile confirmed, role acknowledged" />
          <TaskMeta label="Expected output" value="Acknowledged onboarding record with evidence" />
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Add progress update
            </label>
            <textarea value={taskProgress} onChange={(e) => setTaskProgress(e.target.value)} placeholder="Describe what you've completed so far..." rows={3} className="w-full p-3 rounded-button border border-border-default text-sm text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => {
            setEvidenceAttached(!evidenceAttached);
            toast.success(evidenceAttached ? 'Evidence detached.' : 'Evidence attached (simulated).');
          }} className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-semibold border transition-colors ${evidenceAttached ? 'bg-success-surface text-success-text border-success/30' : 'bg-white text-primary border-border-default hover:bg-surface'}`}>
              <Paperclip size={14} />
              {evidenceAttached ? 'Evidence attached' : 'Attach evidence'}
            </button>

            <button type="button" onClick={() => {
            setBlockerRaised(!blockerRaised);
            toast.info(blockerRaised ? 'Blocker cleared.' : 'Blocker raised (simulated).');
          }} className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-semibold border transition-colors ${blockerRaised ? 'bg-danger-surface text-danger-text border-danger/30' : 'bg-white text-primary border-border-default hover:bg-surface'}`}>
              <AlertOctagon size={14} />
              {blockerRaised ? 'Blocker raised' : 'Raise blocker'}
            </button>
          </div>

          <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-text-muted">
              Tip: evidence must be attached before closure.
            </p>
            <button type="button" onClick={() => {
            setTaskReadyForReview(true);
            toast.success('Task marked ready for review.');
          }} disabled={!evidenceAttached || taskReadyForReview} className={`flex items-center gap-2 px-4 py-2 rounded-button text-sm font-semibold transition-colors ${taskReadyForReview ? 'bg-success-surface text-success-text' : 'bg-primary text-white hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed'}`}>
              {taskReadyForReview ? <>
                  <Check size={14} />
                  Ready for review
                </> : <>
                  <CheckSquare size={14} />
                  Mark ready for review
                </>}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Set Preferences
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
function TaskMeta({
  label,
  value



}: {label: string;value: string;}) {
  return <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">
        {label}
      </div>
      <div className="text-sm font-medium text-primary">{value}</div>
    </div>;
}
/* ============================================================
   STEP 7 — Preferences
   ============================================================ */
interface Preferences {
  taskAlerts: boolean;
  dueReminders: boolean;
  approvalAlerts: boolean;
  mentionAlerts: boolean;
  requestUpdates: boolean;
  workspaceView: 'list' | 'board';
}
function StepPreferences({
  prefs,
  setPrefs,
  onNext




}: {prefs: Preferences;setPrefs: (p: Preferences) => void;onNext: () => void;}) {
  const togglePref = (key: keyof Preferences) => {
    if (key === 'workspaceView') return;
    setPrefs({
      ...prefs,
      [key]: !prefs[key]
    });
  };
  const notifs: {
    key: keyof Preferences;
    label: string;
    desc: string;
  }[] = [{
    key: 'taskAlerts',
    label: 'Task assignment alerts',
    desc: 'When a task is assigned to you.'
  }, {
    key: 'dueReminders',
    label: 'Due date reminders',
    desc: 'Before tasks approach their due date.'
  }, {
    key: 'approvalAlerts',
    label: 'Approval notifications',
    desc: 'When an approval needs your decision.'
  }, {
    key: 'mentionAlerts',
    label: 'Mention alerts',
    desc: 'When you are @mentioned on a record.'
  }, {
    key: 'requestUpdates',
    label: 'Request update notifications',
    desc: 'When your submitted requests change state.'
  }];
  return <div>
      <h2 className="text-2xl font-bold text-primary mb-2">
        Notification & workspace preferences
      </h2>
      <p className="text-text-secondary max-w-2xl mb-8">
        Tune how DWS.01 surfaces work to you. You can change these later from
        your user menu.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-surface rounded-card border border-border-subtle p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={14} className="text-primary" />
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Notifications
            </div>
          </div>
          <ul className="divide-y divide-border-subtle">
            {notifs.map((n) => <li key={n.key} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-primary">
                    {n.label}
                  </div>
                  <div className="text-xs text-text-muted">{n.desc}</div>
                </div>
                <button type="button" role="switch" aria-checked={prefs[n.key] as boolean} onClick={() => togglePref(n.key)} className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${prefs[n.key] ? 'bg-primary' : 'bg-border-default'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${prefs[n.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </li>)}
          </ul>
        </div>

        <div className="bg-surface rounded-card border border-border-subtle p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
            Preferred workspace view
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setPrefs({
            ...prefs,
            workspaceView: 'list'
          })} className={`flex flex-col items-center gap-2 p-4 rounded-card border-2 transition-colors ${prefs.workspaceView === 'list' ? 'border-primary bg-white text-primary' : 'border-border-default bg-white text-text-muted hover:border-border-strong'}`}>
              <LayoutList size={20} />
              <span className="text-sm font-semibold">List</span>
            </button>
            <button type="button" onClick={() => setPrefs({
            ...prefs,
            workspaceView: 'board'
          })} className={`flex flex-col items-center gap-2 p-4 rounded-card border-2 transition-colors ${prefs.workspaceView === 'board' ? 'border-primary bg-white text-primary' : 'border-border-default bg-white text-text-muted hover:border-border-strong'}`}>
              <KanbanSquare size={20} />
              <span className="text-sm font-semibold">Board</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onNext} className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          Complete Onboarding
          <ArrowRight size={18} />
        </button>
      </div>
    </div>;
}
/* ============================================================
   STEP 8 — Complete
   ============================================================ */
function StepComplete({
  persona,
  completedSteps,
  onEnterWorkspace,
  onExploreMarketplaces,
  onViewFirstTasks






}: {persona: Persona;completedSteps: number[];onEnterWorkspace: () => void;onExploreMarketplaces: () => void;onViewFirstTasks: () => void;}) {
  const summary = [{
    label: 'Profile confirmed',
    done: completedSteps.includes(2)
  }, {
    label: 'Work model reviewed',
    done: completedSteps.includes(3)
  }, {
    label: 'Work rules acknowledged',
    done: completedSteps.includes(4)
  }, {
    label: 'Marketplaces explored',
    done: completedSteps.includes(5)
  }, {
    label: 'First task simulated',
    done: completedSteps.includes(6)
  }, {
    label: 'Preferences set',
    done: completedSteps.includes(7)
  }];
  return <div>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-success-surface flex items-center justify-center text-success shrink-0">
          <PartyPopper size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            You're ready to execute
          </h2>
          <p className="text-text-secondary max-w-2xl">
            Your DWS.01 onboarding is complete. You can now enter your
            workspace, explore marketplaces, or pick up your first assigned
            tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface rounded-card border border-border-subtle p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
            Checklist completed
          </div>
          <ul className="space-y-2">
            {summary.map((s) => <li key={s.label} className="flex items-center gap-2 text-sm">
                <Check size={14} className={s.done ? 'text-success' : 'text-text-disabled'} />
                <span className={s.done ? 'text-primary font-medium' : 'text-text-muted'}>
                  {s.label}
                </span>
              </li>)}
          </ul>
        </div>

        <div className="bg-navy-50 rounded-card border border-border-default p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={14} className="text-primary" />
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Role readiness
            </div>
          </div>
          <div className="text-base font-bold text-primary mb-1">
            {persona.role} — Ready
          </div>
          <p className="text-xs text-text-secondary leading-snug">
            Your workspace is configured for {persona.unit}. Tasks, approvals,
            and visibility are scoped to your role.
          </p>
        </div>
      </div>

      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-muted">
        Suggested next actions
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onEnterWorkspace} className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-button font-semibold hover:bg-orange-600 transition-colors shadow-md">
          <Briefcase size={18} />
          Enter My Workspace
        </button>
        <button onClick={onExploreMarketplaces} className="flex-1 flex items-center justify-center gap-2 bg-white text-primary border border-border-default px-6 py-3 rounded-button font-semibold hover:bg-surface transition-colors">
          <Compass size={18} />
          Explore Marketplaces
        </button>
        <button onClick={onViewFirstTasks} className="flex-1 flex items-center justify-center gap-2 bg-white text-primary border border-border-default px-6 py-3 rounded-button font-semibold hover:bg-surface transition-colors">
          <ClipboardList size={18} />
          View My First Tasks
        </button>
      </div>
    </div>;
}