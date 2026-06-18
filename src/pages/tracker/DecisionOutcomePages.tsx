/**
 * DECISION & OUTCOME TRACKING PAGES — Group 5
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  RegisterShell,
  LedgerShell,
  LifecycleShell,
  TraceabilityShell,
  TrackerSheet,
  TrackerTabRail,
  TrackerDocumentActions,
  TrackerChecklistPanel,
  TrackerAuditBlock,
  TrackerProgressCell,
  TrackerMonoId,
  TrackerStatusPill,
  TrackerPageFrame,
  type TrackerSheetColumn,
} from '../../components/TrackerSharedComponents';
import { TRACKER_PAGE_META } from '../../data/trackerPageMeta';
import {
  decisionRecords,
  outcomeRecords,
  evidenceRecords,
  type DecisionRecord,
  type DecisionStatus,
  type OutcomeRecord,
  type EvidenceStatus,
} from '../../data/trackerAreaData';

/**
 * Page: Decision Log
 * Purpose: Governance decision register
 * Primary layout: DECISION REGISTER WORKBOOK
 * Main zones: source filter | decision register sheet | decision brief | document actions
 * Why this layout fits: decisions need register scanning plus selected context
 * How it differs from related pages: not normal tracker list only
 */
export function DecisionLogPage() {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selected, setSelected] = useState<DecisionRecord | null>(decisionRecords[0]);
  const sources = [...new Set(decisionRecords.map((d) => d.source))];

  const filtered = sourceFilter === 'all' ? decisionRecords : decisionRecords.filter((d) => d.source === sourceFilter);

  const columns: TrackerSheetColumn<DecisionRecord>[] = [
    { header: 'ID', width: '90px', frozen: true, accessor: (d) => <TrackerMonoId value={d.id} /> },
    { header: 'Title', accessor: (d) => d.title },
    { header: 'Source', width: '140px', frozen: true, accessor: (d) => d.source },
    { header: 'Category', width: '100px', accessor: (d) => d.category },
    { header: 'Status', width: '110px', accessor: (d) => <TrackerStatusPill status={d.status} /> },
    { header: 'Owner', width: '110px', accessor: (d) => d.owner },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.decisionLog}>
    <RegisterShell
      top={<TrackerDocumentActions placement="toolbar" />}
      left={
        <div className="space-y-1">
          <button onClick={() => setSourceFilter('all')} className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-bold ${sourceFilter === 'all' ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white'}`}>All sources</button>
          {sources.map((s) => (
            <button key={s} onClick={() => setSourceFilter(s)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${sourceFilter === s ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}>{s}</button>
          ))}
        </div>
      }
      center={<TrackerSheet columns={columns} rows={filtered} selectedId={selected?.id} onRowClick={setSelected} getRowId={(d) => d.id} />}
      right={
        selected && (
          <div className="w-80 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">Decision Brief</h3>
            <div className="mt-3 space-y-3 text-sm">
              <TrackerMonoId value={selected.id} />
              <p className="font-medium text-primary">{selected.title}</p>
              <div><strong>Rationale:</strong> {selected.rationale}</div>
              <div><strong>Linked:</strong> {selected.linkedRecords.map((l) => <TrackerMonoId key={l} value={l} />)}</div>
              <TrackerAuditBlock events={selected.auditEvents} />
            </div>
          </div>
        )
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Decision Status
 * Purpose: Track lifecycle status of decisions with controlled transitions
 * Primary layout: DECISION STATUS CONTROL SHEET
 * Main zones: status tabs | status-grouped sheet | rationale panel
 * Why this layout fits: main job is controlled movement between decision states
 * How it differs from related pages: not Decision Log source/category layout
 */
export function DecisionStatusPage() {
  const [status, setStatus] = useState<DecisionStatus>('Under Review');
  const [selected, setSelected] = useState<DecisionRecord | null>(null);
  const statuses: DecisionStatus[] = ['Proposed', 'Under Review', 'Approved', 'Actioned', 'Superseded', 'Rejected'];

  const groups = statuses.map((s) => ({
    id: s,
    label: s,
    rows: decisionRecords.filter((d) => d.status === s),
  }));

  const filtered = decisionRecords.filter((d) => d.status === status);

  const columns: TrackerSheetColumn<DecisionRecord>[] = [
    { header: 'ID', width: '90px', accessor: (d) => <TrackerMonoId value={d.id} /> },
    { header: 'Title', accessor: (d) => d.title },
    { header: 'Status', width: '110px', emphasized: true, accessor: (d) => <TrackerStatusPill status={d.status} /> },
    { header: 'Owner', width: '110px', accessor: (d) => d.owner },
    { header: 'Linked Records', accessor: (d) => d.linkedRecords.join(', ') || '—' },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.decisionStatus}>
    <LifecycleShell
      top={
        <TrackerTabRail
          tabs={statuses.map((s) => ({ id: s, label: s, count: decisionRecords.filter((d) => d.status === s).length }))}
          activeId={status}
          onChange={(id) => setStatus(id as DecisionStatus)}
        />
      }
      center={<TrackerSheet columns={columns} rows={filtered} groups={groups} selectedId={selected?.id} onRowClick={setSelected} getRowId={(d) => d.id} />}
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Status Change Rationale</h3>
          <p className="mt-1 text-xs text-text-muted">Required for all status transitions</p>
          <textarea placeholder="Document rationale for status change..." className="mt-3 w-full rounded-lg border border-border-subtle p-2 text-sm" rows={4} />
          <button onClick={() => toast.success('Status change recorded with rationale.')} className="mt-2 w-full rounded-button bg-primary py-2 text-xs font-bold text-white">Apply Status Change</button>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Linked Tasks / Requests
 * Purpose: Trace decisions into governed tasks and requests
 * Primary layout: TRACEABILITY WORKBOOK
 * Main zones: decision selector | linked records sheet | gap panel | link actions
 * Why this layout fits: validating whether decisions became governed work
 * How it differs from related pages: not single flat table
 */
export function LinkedTasksRequestsPage() {
  const [selected, setSelected] = useState<DecisionRecord>(decisionRecords[0]);

  const linkedRows = selected.linkedRecords.map((id) => ({
    id,
    type: id.startsWith('TSK') ? 'Task' : id.startsWith('REQ') ? 'Request' : 'Record',
    title: `Linked ${id}`,
    status: 'Active',
    gap: id.startsWith('REQ') ? 'Missing closure evidence' : 'None',
  }));

  const columns: TrackerSheetColumn<typeof linkedRows[0]>[] = [
    { header: 'ID', accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Type', width: '90px', accessor: (r) => r.type },
    { header: 'Title', accessor: (r) => r.title },
    { header: 'Status', width: '100px', accessor: (r) => <TrackerStatusPill status={r.status} /> },
    { header: 'Gap', accessor: (r) => r.gap },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.linkedTasksRequests}>
    <TraceabilityShell
      left={
        <div className="rounded-card border border-border-subtle bg-white shadow-sm">
          <div className="border-b border-border-subtle p-3 text-sm font-bold text-primary">Decisions</div>
          {decisionRecords.map((d) => (
            <button key={d.id} onClick={() => setSelected(d)} className={`w-full border-b border-border-subtle p-3 text-left text-sm ${selected.id === d.id ? 'bg-info-surface' : 'hover:bg-surface'}`}>
              <TrackerMonoId value={d.id} />
              <div className="truncate font-medium text-primary">{d.title}</div>
            </button>
          ))}
        </div>
      }
      center={<TrackerSheet columns={columns} rows={linkedRows} readOnly getRowId={(r) => r.id} />}
      right={
        <TrackerChecklistPanel
          title="Gap Panel"
          items={[
            { label: 'All decisions linked to work', done: selected.linkedRecords.length > 0 },
            { label: 'No weak closure records', done: false },
            { label: 'Evidence attached', done: true },
            { label: 'No SLA risk on linked records', done: true },
          ]}
        />
      }
      bottom={
        <div className="flex gap-2">
          <button onClick={() => toast.info('Link dialog opened.')} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary">Link Record</button>
          <button onClick={() => toast.info('Create follow-up.')} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Create Follow-up</button>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Outcome Progress
 * Purpose: Track progress toward outcomes with narrative context
 * Primary layout: OUTCOME PROGRESS WORKBOOK
 * Main zones: outcome selector | progress sheet | progress narrative panel
 * Why this layout fits: outcomes need sheet tracking and narrative context
 * How it differs from related pages: not Decision Status
 */
export function OutcomeProgressPage() {
  const [selected, setSelected] = useState<OutcomeRecord>(outcomeRecords[0]);

  const sheetRows = outcomeRecords.map((o) => ({
    id: o.id,
    title: o.title,
    progress: o.progressPercent,
    evidence: o.evidenceState,
    milestone: o.nextMilestone,
  }));

  const columns: TrackerSheetColumn<typeof sheetRows[0]>[] = [
    { header: 'ID', accessor: (r) => <TrackerMonoId value={r.id} /> },
    { header: 'Outcome', accessor: (r) => r.title },
    { header: 'Progress', width: '130px', accessor: (r) => <TrackerProgressCell percent={r.progress} /> },
    { header: 'Evidence', width: '140px', accessor: (r) => r.evidence },
    { header: 'Next Milestone', accessor: (r) => r.milestone },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.outcomeProgress}>
    <TraceabilityShell
      top={
        <select value={selected.id} onChange={(e) => setSelected(outcomeRecords.find((o) => o.id === e.target.value)!)} className="rounded-button border border-border-subtle px-4 py-2 text-sm font-bold text-primary">
          {outcomeRecords.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
        </select>
      }
      center={<TrackerSheet columns={columns} rows={sheetRows} selectedId={selected.id} onRowClick={(r) => setSelected(outcomeRecords.find((o) => o.id === r.id)!)} getRowId={(r) => r.id} />}
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Progress Narrative</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div><strong>Baseline:</strong> {selected.baseline}</div>
            <div><strong>Current:</strong> {selected.currentProgress}</div>
            <TrackerProgressCell percent={selected.progressPercent} />
            <div><strong>Evidence:</strong> {selected.evidenceState}</div>
            <div><strong>Next milestone:</strong> {selected.nextMilestone}</div>
            <div><strong>Linked tasks:</strong> {selected.linkedTasks.join(', ')}</div>
          </div>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Outcome Evidence
 * Purpose: Ledger of evidence proving outcome progress or completion
 * Primary layout: EVIDENCE REVIEW LEDGER
 * Main zones: evidence status filter | evidence ledger | review panel | attach actions
 * Why this layout fits: evidence requires review and document handling
 * How it differs from related pages: not outcome progress narrative layout
 */
export function OutcomeEvidencePage() {
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | 'all'>('all');
  const [selected, setSelected] = useState(evidenceRecords[0]);
  const statuses: EvidenceStatus[] = ['Missing', 'Submitted', 'Accepted', 'Returned'];

  const filtered = statusFilter === 'all' ? evidenceRecords : evidenceRecords.filter((e) => e.evidenceStatus === statusFilter);

  const columns: TrackerSheetColumn<typeof evidenceRecords[0]>[] = [
    { header: 'ID', accessor: (e) => <TrackerMonoId value={e.id} /> },
    { header: 'Evidence', accessor: (e) => e.title },
    { header: 'Outcome', accessor: (e) => e.trackerName },
    { header: 'Status', width: '100px', accessor: (e) => <TrackerStatusPill status={e.evidenceStatus} variant={e.evidenceStatus === 'Missing' ? 'danger' : e.evidenceStatus === 'Accepted' ? 'success' : 'warning'} /> },
    { header: 'Owner', width: '110px', accessor: (e) => e.owner },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.outcomeEvidence}>
    <LedgerShell
      top={<TrackerDocumentActions placement="evidence" />}
      left={
        <div className="space-y-1">
          <button onClick={() => setStatusFilter('all')} className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-bold ${statusFilter === 'all' ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white'}`}>All</button>
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${statusFilter === s ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}>{s}</button>
          ))}
        </div>
      }
      center={<TrackerSheet columns={columns} rows={filtered} selectedId={selected.id} onRowClick={setSelected} readOnly getRowId={(e) => e.id} />}
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Evidence Review</h3>
          <div className="mt-3 space-y-3 text-sm">
            <TrackerMonoId value={selected.id} />
            <p className="font-medium text-primary">{selected.title}</p>
            <textarea placeholder="Reviewer note..." className="w-full rounded-lg border border-border-subtle p-2 text-sm" rows={3} />
            <div className="flex gap-2">
              <button onClick={() => toast.success('Evidence accepted.')} className="flex-1 rounded-button bg-primary py-2 text-xs font-bold text-white">Accept</button>
              <button onClick={() => toast.info('Evidence returned.')} className="flex-1 rounded-button border border-border-default py-2 text-xs font-bold text-primary">Return</button>
            </div>
          </div>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}
