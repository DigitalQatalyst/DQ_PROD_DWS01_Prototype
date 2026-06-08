/**
 * REQUEST STATUS TRACKING PAGES — Group 2
 */

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  RegisterShell,
  RecoveryShell,
  LifecycleShell,
  TrackerSheet,
  TrackerTabRail,
  TrackerDocumentActions,
  TrackerSlideInPanel,
  TrackerLifecycleStepper,
  TrackerChecklistPanel,
  TrackerSourceStrip,
  TrackerSlaChip,
  TrackerMonoId,
  TrackerStatusPill,
  TrackerPageFrame,
  type TrackerSheetColumn,
} from '../../components/TrackerSharedComponents';
import { TRACKER_PAGE_META } from '../../data/trackerPageMeta';
import {
  requestRecords,
  requestDrafts,
  pendingInfoRecords,
  REQUEST_CATEGORIES,
  type RequestCategory,
  type RequestRecord,
  type RequestDraft,
  type PendingInfoRecord,
} from '../../data/trackerAreaData';

/**
 * Page: Submitted Requests
 * Purpose: Tracker sheet for submitted requests across categories
 * Primary layout: REQUEST CATEGORY TRACKER
 * Main zones: category tabs | SLA summary | request sheet | fulfilment panel
 * Why this layout fits: users think of requests by category and queue
 * How it differs from related pages: not cross-tracker register (Open Items)
 */
export function SubmittedRequestsPage() {
  const [category, setCategory] = useState<RequestCategory | 'all'>('all');
  const [selected, setSelected] = useState<RequestRecord | null>(null);

  const filtered = useMemo(
    () => (category === 'all' ? requestRecords : requestRecords.filter((r) => r.category === category)),
    [category],
  );

  const columns: TrackerSheetColumn<RequestRecord>[] = [
    { header: 'ID', width: '90px', frozen: true, accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Category', width: '120px', accessor: (r) => r.category },
    { header: 'Stage', width: '110px', accessor: (r) => r.stage },
    { header: 'Owner', width: '110px', accessor: (r) => r.owner },
    { header: 'SLA', width: '90px', accessor: (r) => <TrackerSlaChip sla={r.sla} /> },
    { header: 'Remaining', width: '100px', accessor: (r) => r.slaRemaining || '—' },
  ];

  const atRisk = filtered.filter((r) => r.sla === 'At Risk').length;
  const onTrack = filtered.filter((r) => r.sla === 'On Track').length;
  const breached = requestRecords.filter((r) => r.sla === 'Breached').length;

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.submittedRequests}
      kpis={[
        { label: 'In queue', value: String(filtered.length), status: 'info' },
        { label: 'On track', value: String(onTrack), status: 'success' },
        { label: 'At risk', value: String(atRisk), status: 'warning' },
        { label: 'Breached', value: String(breached), status: 'danger' },
      ]}
    >
    <RegisterShell
      top={
        <TrackerTabRail
          tabs={[
            { id: 'all', label: 'All', count: requestRecords.length },
            ...REQUEST_CATEGORIES.map((c) => ({
              id: c,
              label: c,
              count: requestRecords.filter((r) => r.category === c).length,
            })),
          ]}
          activeId={category}
          onChange={(id) => setCategory(id as RequestCategory | 'all')}
          actions={<TrackerDocumentActions placement="toolbar" compact />}
        />
      }
      center={
        <TrackerSheet
          columns={columns}
          rows={filtered}
          selectedId={selected?.id}
          onRowClick={setSelected}
          getRowId={(r) => r.id}
        />
      }
      right={
        <TrackerSlideInPanel open={!!selected} onClose={() => setSelected(null)} title="Fulfilment Summary">
          {selected && (
            <div className="space-y-3 text-sm">
              <TrackerMonoId value={selected.id} />
              <h4 className="font-bold text-primary">{selected.title}</h4>
              <div><span className="text-text-muted">Stage:</span> {selected.stage}</div>
              <div><span className="text-text-muted">Owner:</span> {selected.owner}</div>
              <TrackerSlaChip sla={selected.sla} />
              {selected.fulfilmentNotes && <p className="rounded-lg bg-surface p-2">{selected.fulfilmentNotes}</p>}
              {selected.linkedRecords && selected.linkedRecords.length > 0 && (
                <div>
                  <span className="text-text-muted">Linked:</span>
                  {selected.linkedRecords.map((l) => <TrackerMonoId key={l} value={l} />)}
                </div>
              )}
            </div>
          )}
        </TrackerSlideInPanel>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Request Drafts
 * Purpose: Recovery page for incomplete draft request rows
 * Primary layout: DRAFT RECOVERY WORKSPACE
 * Main zones: draft list | missing-fields checklist | action panel | source strip
 * Why this layout fits: drafts are incomplete records needing completion
 * How it differs from related pages: not a regular sheet-first table
 */
export function RequestDraftsPage() {
  const [selected, setSelected] = useState<RequestDraft>(requestDrafts[0]);
  const levels = ['Almost ready', 'Missing key fields', 'Stale drafts'] as const;

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.requestDrafts}>
    <RecoveryShell
      left={
        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level}>
              <h3 className="mb-1 text-xs font-bold uppercase text-text-muted">{level}</h3>
              {requestDrafts.filter((d) => d.completionLevel === level).map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => setSelected(draft)}
                  className={`mb-1 w-full rounded-lg border p-3 text-left text-sm ${selected.id === draft.id ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}
                >
                  <TrackerMonoId value={draft.id} />
                  <div className="mt-1 font-medium text-primary">{draft.title}</div>
                  <div className="text-xs text-text-muted">{draft.category} · {draft.lastEdited}</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      }
      center={
        <TrackerChecklistPanel
          title="Missing Fields Checklist"
          items={selected.missingFields.map((f) => ({ label: f, done: false }))}
        />
      }
      right={
        <TrackerChecklistPanel
          title="Actions"
          items={[]}
          actions={
            <>
              <button onClick={() => toast.success('Draft resumed.')} className="w-full rounded-button bg-primary py-2 text-sm font-bold text-white">Resume Draft</button>
              <button onClick={() => toast.success('Draft submitted.')} className="w-full rounded-button border border-border-default py-2 text-sm font-bold text-primary">Submit</button>
              <button onClick={() => toast.error('Draft deleted.')} className="w-full rounded-button border border-red-200 py-2 text-sm font-bold text-red-600">Delete</button>
            </>
          }
        />
      }
      bottom={<TrackerSourceStrip source={{ sourceFile: selected.sourceFile, version: selected.version, lastModified: selected.lastEdited, modifiedBy: 'You' }} />}
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Request Status
 * Purpose: Request lifecycle tracker showing journey stage
 * Primary layout: LIFECYCLE SHEET
 * Main zones: request selector | lifecycle stepper | lifecycle sheet | step notes
 * Why this layout fits: key question is "where is the request in the process?"
 * How it differs from related pages: not generic request table
 */
export function RequestStatusPage() {
  const [selectedId, setSelectedId] = useState(requestRecords[0].id);
  const selected = requestRecords.find((r) => r.id === selectedId)!;

  const columns: TrackerSheetColumn<RequestRecord>[] = [
    { header: 'Stage', accessor: (r) => r.stage },
    { header: 'Owner', accessor: (r) => r.owner },
    { header: 'SLA', accessor: (r) => <TrackerSlaChip sla={r.sla} /> },
    { header: 'Notes', accessor: (r) => r.fulfilmentNotes || '—' },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.requestStatus}>
    <LifecycleShell
      left={
        <div className="rounded-card border border-border-subtle bg-white shadow-sm">
          <div className="border-b border-border-subtle p-3 text-sm font-bold text-primary">Requests</div>
          {requestRecords.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`w-full border-b border-border-subtle p-3 text-left text-sm ${selectedId === r.id ? 'bg-info-surface' : 'hover:bg-surface'}`}
            >
              <TrackerMonoId value={r.id} />
              <div className="mt-0.5 truncate font-medium text-primary">{r.title}</div>
              <TrackerStatusPill status={r.stage} />
            </button>
          ))}
        </div>
      }
      center={
        <>
          {selected.lifecycleStages && <TrackerLifecycleStepper stages={selected.lifecycleStages} />}
          <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-primary">Lifecycle Tracker Sheet</h3>
            <TrackerSheet columns={columns} rows={[selected]} readOnly getRowId={(r) => r.id} />
          </div>
        </>
      }
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Step Notes & Audit</h3>
          <div className="mt-3 space-y-2 text-sm">
            {selected.auditEvents?.map((e, i) => (
              <div key={i} className="rounded-lg bg-surface p-2">
                <span className="font-mono text-xs text-text-muted">{e.timestamp}</span>
                <p className="mt-0.5 text-primary">{e.event}</p>
                <span className="text-xs text-text-muted">by {e.user}</span>
              </div>
            )) || <p className="text-text-muted">No audit events recorded.</p>}
          </div>
        </div>
      }
      bottom={<TrackerDocumentActions placement="metadata" compact />}
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Pending Information
 * Purpose: Requests blocked by missing information
 * Primary layout: MISSING-INFO RESOLUTION DESK
 * Main zones: alert banner | grouped queue | pending sheet | response workspace
 * Why this layout fits: page is about resolving missing information
 * How it differs from related pages: not Submitted Requests
 */
export function PendingInformationPage() {
  const [waitingOn, setWaitingOn] = useState<'all' | PendingInfoRecord['waitingOn']>('all');
  const [selected, setSelected] = useState<PendingInfoRecord | null>(pendingInfoRecords[0]);
  const oldest = pendingInfoRecords.reduce((a, b) => (a.daysPending > b.daysPending ? a : b));

  const filtered = waitingOn === 'all' ? pendingInfoRecords : pendingInfoRecords.filter((r) => r.waitingOn === waitingOn);

  const columns: TrackerSheetColumn<PendingInfoRecord>[] = [
    { header: 'ID', width: '90px', frozen: true, accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Waiting On', width: '130px', accessor: (r) => r.waitingOn },
    { header: 'Days Pending', width: '100px', accessor: (r) => r.daysPending },
    { header: 'SLA Impact', width: '140px', accessor: (r) => r.slaImpact },
    { header: 'Owner', width: '110px', accessor: (r) => r.owner },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.pendingInformation}>
    <RecoveryShell
      top={
        <div className="rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Oldest pending:</strong> {oldest.title} ({oldest.id}) — {oldest.daysPending} days waiting
        </div>
      }
      left={
        <div className="space-y-2">
          {(['all', 'Requester', 'Fulfilment owner', 'Approval owner'] as const).map((group) => (
            <button
              key={group}
              onClick={() => setWaitingOn(group)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-bold ${waitingOn === group ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}
            >
              {group === 'all' ? 'All queues' : `Waiting on ${group}`}
              <span className="ml-2 text-xs font-normal text-text-muted">
                ({group === 'all' ? pendingInfoRecords.length : pendingInfoRecords.filter((r) => r.waitingOn === group).length})
              </span>
            </button>
          ))}
        </div>
      }
      center={
        <TrackerSheet
          columns={columns}
          rows={filtered}
          selectedId={selected?.id}
          onRowClick={setSelected}
          getRowId={(r) => r.id}
        />
      }
      right={
        selected && (
          <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">Response Workspace</h3>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-text-muted">Missing fields</span>
                <ul className="mt-1 list-disc pl-4">
                  {selected.missingFields.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <textarea placeholder="Response note..." className="w-full rounded-lg border border-border-subtle p-2 text-sm" rows={3} />
              <div className="text-xs text-text-muted">SLA impact: {selected.slaImpact}</div>
              <button onClick={() => toast.success('Reminder sent.')} className="w-full rounded-button bg-primary py-2 text-xs font-bold text-white">Send Reminder</button>
            </div>
          </div>
        )
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Request Closure Status
 * Purpose: Track request closure state, evidence, and confirmation
 * Primary layout: REQUEST CLOSURE CHECKPOINT
 * Main zones: closure state tabs | closure sheet | readiness checklist | evidence strip
 * Why this layout fits: closure needs verification and evidence
 * How it differs from related pages: not lifecycle layout (Request Status)
 */
export function RequestClosureStatusPage() {
  const [state, setState] = useState('Closure pending');
  const [selected, setSelected] = useState<RequestRecord | null>(requestRecords[0]);
  const states = ['Closure pending', 'Evidence missing', 'Returned', 'Closed accepted'];

  const closureRows = requestRecords.map((r) => ({
    ...r,
    closureState: r.stage === 'Closed' ? 'Closed accepted' : r.sla === 'At Risk' ? 'Evidence missing' : 'Closure pending',
  }));

  const filtered = state === 'all' ? closureRows : closureRows.filter((r) => r.closureState === state);

  const columns: TrackerSheetColumn<typeof closureRows[0]>[] = [
    { header: 'ID', width: '90px', frozen: true, accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Closure State', width: '130px', accessor: (r) => <TrackerStatusPill status={r.closureState} /> },
    { header: 'Owner', width: '110px', accessor: (r) => r.owner },
    { header: 'Evidence', width: '100px', accessor: (r) => r.closureState === 'Evidence missing' ? 'Missing' : 'Attached' },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.requestClosureStatus}>
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TrackerTabRail
        tabs={states.map((s) => ({ id: s, label: s, count: closureRows.filter((r) => r.closureState === s).length }))}
        activeId={state}
        onChange={setState}
      />
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-auto">
          <TrackerSheet columns={columns} rows={filtered} selectedId={selected?.id} onRowClick={setSelected} getRowId={(r) => r.id} />
        </div>
        {selected && (
          <TrackerChecklistPanel
            title="Closure Readiness"
            items={[
              { label: 'Fulfilment complete', done: selected.stage !== 'Awaiting Input' },
              { label: 'Evidence attached', done: selected.closureState !== 'Evidence missing' },
              { label: 'Requester confirmation', done: selected.closureState === 'Closed accepted' },
              { label: 'Audit trail complete', done: !!selected.auditEvents?.length },
            ]}
          />
        )}
      </div>
      <TrackerDocumentActions placement="evidence" />
    </div>
    </TrackerPageFrame>
  );
}
