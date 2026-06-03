import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Briefcase, Building2, GitBranch, Info, MessageSquare, ShieldCheck, UsersRound } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import {
  ContactRouteList,
  DirectoryActionRail,
  DirectoryDetailHero,
  DirectoryInfoCard,
  DirectoryLinkedWorkPanel,
  OwnershipChip,
  OwnershipSummary
} from '../components/WorkDirectoryComponents';
import { StatusPill } from '../components/StatusPill';

export function WorkDirectoryDetailPage() {
  const { directoryId } = useParams();
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const {
    isLoading,
    getEntry,
    getDetail,
    getLinkedWorkForEntry,
    getOwnershipForEntry,
    getRelatedEntries,
    getRoutesForEntry,
    activities
  } = useDirectoryLifecycle();

  const entry = getEntry(directoryId);
  const detail = getDetail(directoryId);
  const executiveOnly = activePersona.id === 'ceo';

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-text-muted">Loading directory entry...</div>;
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
        <h1 className="mb-2 text-2xl font-bold text-primary">Directory entry not found</h1>
        <p className="mb-6 text-text-secondary">The requested Work Directory record is missing from the prototype fixtures.</p>
        <button onClick={() => navigate('/marketplaces/work-directory')} className="rounded-button bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700">
          Return to Work Directory
        </button>
      </div>
    );
  }

  const linkedWork = getLinkedWorkForEntry(entry.id);
  const ownership = getOwnershipForEntry(entry);
  const routes = getRoutesForEntry(entry);
  const relatedEntries = getRelatedEntries(entry);
  const recentActivity = activities.filter((activity) => activity.relatedEntry === entry.id || entry.ownershipAreas.some((area) => activity.activity.includes(area))).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DirectoryDetailHero entry={entry} />

      {entry.availability === 'Escalation only' && (
        <div className="mb-6 rounded-card border border-danger/20 bg-danger-surface px-5 py-4 text-sm font-semibold text-danger-text">
          This owner is marked escalation only. Use the backup route or escalation path before assigning routine work.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="space-y-6 lg:col-span-2">
          <DirectoryInfoCard title="Organisation Context" icon={<Building2 size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Fact label="Unit" value={entry.unit} />
              <Fact label="Team" value={entry.team || 'Not mapped'} />
              <Fact label="Lead" value={entry.lead || entry.name} />
              <Fact label="Backup Contact" value={entry.backupOwner || 'Missing backup owner'} danger={!entry.backupOwner} />
            </div>
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Ownership Summary" icon={<ShieldCheck size={18} className="text-primary" />}>
            <OwnershipSummary records={ownership} />
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Responsibilities" icon={<Info size={18} className="text-primary" />}>
            <p className="text-sm leading-6 text-text-secondary">{detail?.responsibilitySummary || entry.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.ownershipAreas.map((area) => <OwnershipChip key={area} value={area} />)}
            </div>
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Contact Route" icon={<MessageSquare size={18} className="text-primary" />}>
            <p className="mb-4 text-sm text-text-secondary">{detail?.recommendedRoute || `Use ${entry.preferredContactRoute} for this entry.`}</p>
            <ContactRouteList routes={routes} />
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Availability & Coverage" icon={<UsersRound size={18} className="text-primary" />}>
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusPill status={entry.availability} />
              <StatusPill status={entry.workload} />
              <StatusPill status={entry.backupOwner ? 'Covered' : 'Needs Backup'} />
            </div>
            <p className="text-sm leading-6 text-text-secondary">{detail?.coverageNotes || 'Coverage notes are not mapped for this entry.'}</p>
            <p className="mt-2 text-sm font-semibold text-text-primary">Escalation trigger: {detail?.escalationTrigger || 'Not mapped'}</p>
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Linked Work" icon={<Briefcase size={18} className="text-primary" />}>
            <DirectoryLinkedWorkPanel records={linkedWork} />
          </DirectoryInfoCard>

          <ThreeColumnContext
            service={detail?.serviceContext || ['No service context mapped']}
            knowledge={detail?.knowledgeContext || ['No knowledge context mapped']}
            governance={detail?.governanceContext || ['No governance context mapped']}
          />

          <DirectoryInfoCard title="Recent Activity" icon={<GitBranch size={18} className="text-primary" />}>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="rounded-lg bg-surface px-4 py-3">
                    <p className="font-bold text-text-primary">{activity.activity}</p>
                    <p className="text-xs text-text-muted">{activity.actor} · {activity.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No recent activity is mapped for this entry.</p>
            )}
          </DirectoryInfoCard>

          <DirectoryInfoCard title="Related Directory Entries" icon={<UsersRound size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedEntries.map((related) => (
                <Link key={related.id} to={`/marketplaces/work-directory/${related.id}`} className="rounded-lg border border-border-subtle p-4 hover:border-secondary">
                  <p className="font-bold text-primary">{related.name}</p>
                  <p className="text-xs text-text-muted">{related.entityType} · {related.roleLabel}</p>
                </Link>
              ))}
              {relatedEntries.length === 0 && <p className="text-sm text-text-muted">No related entries mapped.</p>}
            </div>
          </DirectoryInfoCard>
        </main>

        <div className="lg:col-span-1">
          <DirectoryActionRail entry={entry} executiveOnly={executiveOnly} />
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className={`mt-1 font-bold ${danger ? 'text-danger' : 'text-text-primary'}`}>{value}</p>
    </div>
  );
}

function ThreeColumnContext({ service, knowledge, governance }: { service: string[]; knowledge: string[]; governance: string[] }) {
  const blocks = [
    { title: 'Service / Fulfilment Context', values: service },
    { title: 'Knowledge / Expertise Context', values: knowledge },
    { title: 'Governance / Escalation Route', values: governance }
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {blocks.map((block) => (
        <DirectoryInfoCard key={block.title} title={block.title}>
          <ul className="space-y-2">
            {block.values.map((value) => (
              <li key={value} className="flex gap-2 text-sm text-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </DirectoryInfoCard>
      ))}
    </div>
  );
}
