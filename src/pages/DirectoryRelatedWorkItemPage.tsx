import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Lock } from 'lucide-react';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { DirectoryLinkedWorkPanel } from '../components/WorkDirectoryComponents';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';

export function DirectoryRelatedWorkItemPage() {
  const { workItemId } = useParams();
  const navigate = useNavigate();
  const { getLinkedWorkItem, getEntry, linkedWork } = useDirectoryLifecycle();
  const item = getLinkedWorkItem(workItemId);
  const ownerEntry = getEntry(item?.relatedDirectoryEntryId);
  const siblingWork = linkedWork.filter((record) => record.relatedDirectoryEntryId === item?.relatedDirectoryEntryId && record.workItemId !== item?.workItemId);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-primary">Related work item not found</h1>
        <p className="mb-6 text-text-secondary">The Work Directory fixture does not include a related work item matching "{workItemId}".</p>
        <button onClick={() => navigate('/marketplaces/work-directory')} className="rounded-button bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700">
          Return to Work Directory
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
        <ArrowLeft size={16} />
        Back
      </button>

      <section className="mb-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-primary">
              <Briefcase size={24} />
            </div>
            <div>
              <MonoId value={item.workItemId} />
              <h1 className="mt-2 text-3xl font-bold text-primary">{item.title}</h1>
              <p className="mt-1 text-text-secondary">{item.type} · Owner: {item.owner}</p>
            </div>
          </div>
          <StatusPill status={item.status} />
        </div>
      </section>

      {item.restricted && (
        <section className="mb-6 rounded-card border border-warning/30 bg-warning-surface p-5 text-warning-text">
          <div className="flex gap-3">
            <Lock size={18} className="mt-0.5 shrink-0" />
            <div>
              <h2 className="font-bold">Restricted related work item</h2>
              <p className="mt-1 text-sm">{item.restrictionReason || 'This item is restricted for the active prototype persona.'}</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-card border border-border-default bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-primary">Work Context</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ContextFact label="Type" value={item.type} />
            <ContextFact label="Status" value={item.status} />
            <ContextFact label="Owner" value={item.owner} />
            <ContextFact label="Directory Source" value={ownerEntry?.name || item.relatedDirectoryEntryId} />
          </div>
          <p className="mt-5 text-sm leading-6 text-text-secondary">
            This is a Work Directory prototype record used to show how linked tasks, requests, approvals, workflows, queues, and knowledge assets are opened from directory context without relying on backend persistence.
          </p>
        </section>

        <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Ownership</h2>
          {ownerEntry ? (
            <Link to={`/marketplaces/work-directory/${ownerEntry.id}`} className="block rounded-lg border border-border-subtle p-4 hover:border-secondary">
              <p className="font-bold text-primary">{ownerEntry.name}</p>
              <p className="text-xs text-text-muted">{ownerEntry.entityType} · {ownerEntry.preferredContactRoute}</p>
            </Link>
          ) : (
            <p className="text-sm text-text-muted">No directory owner is mapped.</p>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-card border border-border-default bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-primary">Other Related Work For This Owner</h2>
        <DirectoryLinkedWorkPanel records={siblingWork} />
      </section>
    </div>
  );
}

function ContextFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-bold text-text-primary">{value}</p>
    </div>
  );
}
