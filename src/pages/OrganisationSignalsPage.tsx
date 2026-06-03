import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, BarChart3, Building2, CheckCircle2, ExternalLink, GitBranch, Info, Inbox, ShieldAlert, UsersRound } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { KpiTile } from '../components/KpiTile';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import type { OrganisationSignal } from '../types/workDirectory';

type ImpactStatus = 'Success' | 'Warning' | 'Danger';

interface ImpactedArea {
  area: string;
  signal: string;
  owner: string;
  status: ImpactStatus;
  linkedArea: string;
  route: string;
}

const impactedAreas: ImpactedArea[] = [
  { area: 'Knowledge ownership', signal: 'Missing backup owner', owner: 'Grace Wanjiru', status: 'Warning', linkedArea: 'Admin Review Queue', route: '/admin/work-directory/review' },
  { area: 'Platform Support Queue', signal: 'High workload', owner: 'Brian Otieno', status: 'Danger', linkedArea: 'Platform Support Queue', route: '/queues/QUE-3001' },
  { area: 'Digital Platforms', signal: 'Escalation concentration', owner: 'Omar Farouk', status: 'Warning', linkedArea: 'Escalation Routes', route: '/marketplaces/work-directory/DIR-PER-004' },
  { area: 'DWS Core Squad', signal: 'Missing contact route', owner: 'Omar Farouk', status: 'Warning', linkedArea: 'Admin Review Queue', route: '/admin/work-directory/review' }
];

const signalFilters: Record<string, string[]> = {
  'SIG-ORG-9001': ['Knowledge ownership', 'DWS Core Squad'],
  'SIG-ORG-9002': ['Knowledge ownership'],
  'SIG-ORG-9003': ['Platform Support Queue'],
  'SIG-ORG-9004': ['Digital Platforms'],
  'SIG-ORG-9005': [],
  'SIG-ORG-9006': []
};

export function OrganisationSignalsPage() {
  const { activePersona } = usePersona();
  const { activeRole } = useWorkspaceRole();
  const { organisationSignals, isLoading } = useDirectoryLifecycle();
  const navigate = useNavigate();
  const [selectedSignalId, setSelectedSignalId] = useState<string>('All');

  const executiveOnly = activePersona.id === 'ceo' || activeRole === 'CEO';
  const canOpenAdminReview = ['team-lead', 'unit-lead', 'admin'].includes(activePersona.id);
  const selectedSignal = organisationSignals.find((signal) => signal.id === selectedSignalId);

  const filteredAreas = useMemo(() => {
    if (selectedSignalId === 'All') return impactedAreas;
    const allowedAreas = signalFilters[selectedSignalId] || [];
    return impactedAreas.filter((area) => allowedAreas.includes(area.area));
  }, [selectedSignalId]);

  if (isLoading) {
    return <OrganisationSignalsLoading />;
  }

  if (organisationSignals.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <OrganisationSignalHeader audience={executiveOnly ? 'Executives' : 'Lead / Executives'} />
        <div className="rounded-card border border-dashed border-border-default bg-white py-16 text-center">
          <BarChart3 size={44} className="mx-auto mb-4 text-text-muted opacity-50" />
          <h2 className="text-lg font-bold text-primary">No organisation signals available in prototype state</h2>
          <p className="mt-2 text-sm text-text-secondary">Signal records will appear here when fixture data is available.</p>
        </div>
      </div>
    );
  }

  const inspectSignal = (signal: OrganisationSignal) => {
    const route = getSignalRoute(signal, executiveOnly, canOpenAdminReview);
    navigate(route);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <OrganisationSignalHeader audience={executiveOnly ? 'Executives' : 'Lead / Executives'} />
      <OrganisationSignalStrip signals={organisationSignals} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <main className="space-y-6 xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <OwnershipCoverageCard signal={organisationSignals[0]} selected={selectedSignalId === 'SIG-ORG-9001'} onClick={() => setSelectedSignalId('SIG-ORG-9001')} onInspect={inspectSignal} />
            <OverloadedQueuesCard signal={organisationSignals[2]} selected={selectedSignalId === 'SIG-ORG-9003'} onClick={() => setSelectedSignalId('SIG-ORG-9003')} onInspect={inspectSignal} />
            <AvailabilityGapsCard signal={organisationSignals[1]} selected={selectedSignalId === 'SIG-ORG-9002'} onClick={() => setSelectedSignalId('SIG-ORG-9002')} onInspect={inspectSignal} executiveOnly={executiveOnly} />
            <EscalationConcentrationCard signal={organisationSignals[3]} selected={selectedSignalId === 'SIG-ORG-9004'} onClick={() => setSelectedSignalId('SIG-ORG-9004')} onInspect={inspectSignal} />
          </div>

          <ImpactedAreaTable
            areas={filteredAreas}
            selectedSignal={selectedSignal}
            executiveOnly={executiveOnly}
            canOpenAdminReview={canOpenAdminReview}
            onClearFilter={() => setSelectedSignalId('All')}
          />
        </main>

        <SignalInterpretationPanel executiveOnly={executiveOnly} canOpenAdminReview={canOpenAdminReview} />
      </div>
    </div>
  );
}

function OrganisationSignalHeader({ audience }: { audience: string }) {
  return (
    <header className="mb-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-primary"><BarChart3 size={28} /> Organisation Signals</h1>
          <p className="mt-2 max-w-4xl text-text-secondary">Aggregate visibility into ownership coverage, queue load, availability gaps, and escalation concentration.</p>
        </div>
        <span className="rounded-pill bg-navy-100 px-3 py-1.5 text-xs font-bold text-primary">{audience}</span>
      </div>
    </header>
  );
}

function OrganisationSignalStrip({ signals }: { signals: OrganisationSignal[] }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {signals.map((signal) => (
        <KpiTile key={signal.id} label={signal.signal} value={signal.value} status={toKpiStatus(signal.status)} />
      ))}
    </div>
  );
}

function OwnershipCoverageCard({ signal, selected, onClick, onInspect }: SignalCardProps) {
  return (
    <SignalCard
      icon={<ShieldAlert size={20} />}
      title="Ownership Coverage"
      description="Covered versus uncovered ownership areas across tasks, requests, approvals, knowledge, SLA rules, and support triage."
      signal={signal}
      selected={selected}
      onClick={onClick}
      onInspect={onInspect}
    >
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-warning/20">
        <div className="h-full w-[87.5%] rounded-full bg-warning" />
      </div>
      <p className="mt-2 text-xs font-semibold text-text-muted">7 covered · 1 needs attention</p>
    </SignalCard>
  );
}

function OverloadedQueuesCard({ signal, selected, onClick, onInspect }: SignalCardProps) {
  return (
    <SignalCard
      icon={<Inbox size={20} />}
      title="Overloaded Queues"
      description="Queue load risk and high-severity fulfilment pressure."
      signal={signal}
      selected={selected}
      onClick={onClick}
      onInspect={onInspect}
      highRisk
    >
      <p className="mt-4 rounded-lg bg-danger-surface px-3 py-2 text-sm font-bold text-danger-text">Platform Support Queue · High workload</p>
    </SignalCard>
  );
}

function AvailabilityGapsCard({ signal, selected, onClick, onInspect, executiveOnly }: SignalCardProps & { executiveOnly: boolean }) {
  return (
    <SignalCard
      icon={<UsersRound size={20} />}
      title="Availability Gaps"
      description="Unavailable owners, missing backups, and escalation-only coverage."
      signal={signal}
      selected={selected}
      onClick={onClick}
      onInspect={onInspect}
    >
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <span className="rounded-lg bg-warning-surface px-2 py-2 text-warning-text">1 missing backup</span>
        <span className="rounded-lg bg-danger-surface px-2 py-2 text-danger-text">2 escalation-only</span>
        <span className="rounded-lg bg-success-surface px-2 py-2 text-success-text">2 fulfilment contacts</span>
      </div>
      {executiveOnly && <p className="mt-3 text-xs text-text-muted">Executive view remains aggregate-only.</p>}
    </SignalCard>
  );
}

function EscalationConcentrationCard({ signal, selected, onClick, onInspect }: SignalCardProps) {
  return (
    <SignalCard
      icon={<GitBranch size={20} />}
      title="Escalation Concentration"
      description="Active escalation concentration by owner, unit, or queue."
      signal={signal}
      selected={selected}
      onClick={onClick}
      onInspect={onInspect}
    >
      <p className="mt-4 rounded-lg bg-warning-surface px-3 py-2 text-sm font-bold text-warning-text">Omar Farouk · Digital Platforms · 3 active</p>
    </SignalCard>
  );
}

interface SignalCardProps {
  signal?: OrganisationSignal;
  selected: boolean;
  onClick: () => void;
  onInspect: (signal: OrganisationSignal) => void;
  highRisk?: boolean;
}

function SignalCard({
  icon,
  title,
  description,
  signal,
  selected,
  onClick,
  onInspect,
  highRisk = false,
  children
}: SignalCardProps & { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  if (!signal) return null;
  return (
    <section onClick={onClick} className={`cursor-pointer rounded-card border bg-white p-5 shadow-sm transition-all hover:border-secondary ${selected ? 'border-secondary ring-2 ring-secondary/20' : highRisk ? 'border-danger/30' : 'border-border-default'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${highRisk ? 'bg-danger-surface text-danger' : 'bg-navy-50 text-primary'}`}>{icon}</div>
          <div>
            <h2 className="font-bold text-primary">{title}</h2>
            <p className="mt-1 text-sm leading-5 text-text-secondary">{description}</p>
          </div>
        </div>
        <StatusPill status={signal.status} />
      </div>
      {children}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
        <div>
          <MonoId value={signal.id} />
          <p className="mt-1 text-lg font-bold text-text-primary">{signal.value}</p>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onInspect(signal);
          }}
          className="inline-flex items-center gap-1.5 rounded-button bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-navy-700"
        >
          Inspect Signal
          <ExternalLink size={13} />
        </button>
      </div>
    </section>
  );
}

function ImpactedAreaTable({
  areas,
  selectedSignal,
  executiveOnly,
  canOpenAdminReview,
  onClearFilter
}: {
  areas: ImpactedArea[];
  selectedSignal?: OrganisationSignal;
  executiveOnly: boolean;
  canOpenAdminReview: boolean;
  onClearFilter: () => void;
}) {
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-primary">Impacted Areas</h2>
          <p className="text-sm text-text-muted">{selectedSignal ? `Filtered by ${selectedSignal.signal}` : 'All impacted ownership, queue, availability, and escalation areas.'}</p>
        </div>
        {selectedSignal && <button onClick={onClearFilter} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Clear filter</button>}
      </div>
      {areas.length === 0 ? (
        <div className="rounded-lg bg-surface px-5 py-8 text-center">
          <CheckCircle2 size={34} className="mx-auto mb-2 text-success" />
          <p className="font-bold text-primary">No impacted areas for this signal</p>
          <p className="text-sm text-text-muted">The selected aggregate signal has no impacted-area fixture rows.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border-subtle">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                {['Area', 'Signal', 'Owner / Scope', 'Status', 'Linked Area', ''].map((heading) => <th key={heading} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {areas.map((area) => {
                const allowedRoute = getAllowedAreaRoute(area, executiveOnly, canOpenAdminReview);
                return (
                  <tr key={`${area.area}-${area.signal}`} className="hover:bg-surface/50">
                    <td className="px-4 py-4 font-bold text-primary">{area.area}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{area.signal}</td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{area.owner}</td>
                    <td className="px-4 py-4"><StatusPill status={area.status} /></td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{area.linkedArea}</td>
                    <td className="px-4 py-4 text-right">
                      <Link to={allowedRoute} className="text-xs font-bold text-primary hover:underline">Inspect</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SignalInterpretationPanel({ executiveOnly, canOpenAdminReview }: { executiveOnly: boolean; canOpenAdminReview: boolean }) {
  return (
    <aside className="space-y-4 xl:col-span-1">
      <section className="sticky top-24 rounded-card border border-border-default bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Info size={18} className="text-primary" />
          <h2 className="font-bold text-primary">Interpretation</h2>
        </div>
        <div className="space-y-4 text-sm leading-6 text-text-secondary">
          <p>Use this page to identify aggregate ownership coverage gaps, overloaded queues, availability risks, and escalation concentration before work is routed incorrectly.</p>
          <p>Green signals are covered. Warning signals need lead/admin review. Danger signals indicate queue or escalation pressure.</p>
          {executiveOnly && <p className="font-semibold text-primary">Executive view is aggregate-only. Personal contact, inbox, and edit actions are hidden.</p>}
        </div>
        <div className="mt-5 space-y-2">
          <Link to="/marketplaces/work-directory" className="flex items-center gap-2 rounded-button bg-primary px-3 py-2.5 text-sm font-bold text-white hover:bg-navy-700">
            <UsersRound size={15} />
            Open Work Directory
          </Link>
          <Link to="/marketplaces/work-directory/structure" className="flex items-center gap-2 rounded-button border border-border-default px-3 py-2.5 text-sm font-bold text-primary hover:bg-surface">
            <Building2 size={15} />
            View Organisation Structure
          </Link>
          {canOpenAdminReview && !executiveOnly && (
            <Link to="/admin/work-directory/review" className="flex items-center gap-2 rounded-button border border-warning/30 bg-warning-surface px-3 py-2.5 text-sm font-bold text-warning-text hover:bg-warning/20">
              <AlertTriangle size={15} />
              Admin Review Queue
            </Link>
          )}
        </div>
      </section>
    </aside>
  );
}

function OrganisationSignalsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-32 animate-pulse rounded-card bg-white" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-card bg-white" />)}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-4 xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-card bg-white" />)}
          </div>
          <div className="h-80 animate-pulse rounded-card bg-white" />
        </div>
        <div className="h-80 animate-pulse rounded-card bg-white" />
      </div>
    </div>
  );
}

function getSignalRoute(signal: OrganisationSignal, executiveOnly: boolean, canOpenAdminReview: boolean) {
  if (signal.id === 'SIG-ORG-9002' && canOpenAdminReview && !executiveOnly) return '/admin/work-directory/review';
  if (signal.id === 'SIG-ORG-9003') return '/queues/QUE-3001';
  if (signal.id === 'SIG-ORG-9004') return '/marketplaces/work-directory/DIR-PER-004';
  if (signal.id === 'SIG-ORG-9006') return '/marketplaces/work-directory/structure';
  return '/marketplaces/work-directory';
}

function getAllowedAreaRoute(area: ImpactedArea, executiveOnly: boolean, canOpenAdminReview: boolean) {
  if (area.route === '/admin/work-directory/review' && (!canOpenAdminReview || executiveOnly)) return '/marketplaces/work-directory';
  return area.route;
}

function toKpiStatus(status: OrganisationSignal['status']) {
  if (status === 'Danger') return 'danger';
  if (status === 'Warning') return 'warning';
  if (status === 'Success') return 'success';
  return 'info';
}
