/**
 * BLOCKER & SLA TRACKING PAGES — Group 4
 */

import React, { useState } from 'react';
import { noop } from '../../utils/noop';
import { toast } from 'sonner';
import {
  RecoveryShell,
  LedgerShell,
  TrackerSheet,
  TrackerTabRail,
  TrackerBulkActionBar,
  TrackerLedgerRow,
  TrackerCountdownBadge,
  TrackerMonoId,
  TrackerStatusPill,
  TrackerDocumentActions,
  TrackerPageFrame,
  type TrackerSheetColumn,
} from '../../components/TrackerSharedComponents';
import { TRACKER_PAGE_META } from '../../data/trackerPageMeta';
import {
  blockerRecords,
  slaRecords,
  SLA_TIME_BANDS,
  type BlockerRecord,
  type SlaRecord,
  type BlockerSeverity,
  type SlaTimeBand,
} from '../../data/trackerAreaData';

/**
 * Page: Active Blockers
 * Purpose: Track active blockers and resolution ownership
 * Primary layout: BLOCKER RESOLUTION DESK
 * Main zones: severity rail | severity-grouped sheet | resolution panel | escalation bar
 * Why this layout fits: blockers require active resolution and owner assignment
 * How it differs from related pages: not open register layout
 */
export function ActiveBlockersPage() {
  const [severity, setSeverity] = useState<BlockerSeverity | 'all'>('all');
  const [selected, setSelected] = useState<BlockerRecord | null>(null);

  const filtered = severity === 'all' ? blockerRecords : blockerRecords.filter((b) => b.severity === severity);
  const groups = (['Critical', 'High', 'Medium', 'Low'] as BlockerSeverity[]).map((s) => ({
    id: s,
    label: s,
    rows: blockerRecords.filter((b) => b.severity === s),
  }));

  const columns: TrackerSheetColumn<BlockerRecord>[] = [
    { header: 'ID', width: '90px', frozen: true, accessor: (b) => <TrackerMonoId value={b.id} /> },
    { header: 'Title', accessor: (b) => b.title },
    { header: 'Severity', width: '90px', emphasized: true, accessor: (b) => <TrackerStatusPill status={b.severity} variant={b.severity === 'Critical' ? 'danger' : 'warning'} /> },
    { header: 'Owner', width: '110px', accessor: (b) => b.owner },
    { header: 'Days Open', width: '90px', accessor: (b) => b.daysOpen },
    { header: 'Last Update', width: '100px', accessor: (b) => b.lastUpdate },
    { header: 'Reason', accessor: (b) => b.reason },
  ];

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.activeBlockers}
      kpis={(['Critical', 'High', 'Medium', 'Low'] as BlockerSeverity[]).map((s) => ({
        label: s,
        value: String(blockerRecords.filter((b) => b.severity === s).length),
        status: s === 'Critical' ? 'danger' as const : s === 'High' ? 'warning' as const : 'info' as const,
      }))}
    >
    <RecoveryShell
      left={
        <div className="space-y-1">
          {(['all', 'Critical', 'High', 'Medium', 'Low'] as const).map((s) => (
            <button key={s} onClick={() => setSeverity(s)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-bold ${severity === s ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}>
              {s === 'all' ? 'All severities' : s}
            </button>
          ))}
        </div>
      }
      center={<TrackerSheet columns={columns} rows={filtered} groups={groups} selectedId={selected?.id} onRowClick={setSelected} getRowId={(b) => b.id} />}
      right={
        selected && (
          <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">Resolution Panel</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p>{selected.reason}</p>
              <textarea placeholder="Resolution note..." className="w-full rounded-lg border border-border-subtle p-2 text-sm" rows={3} />
              <button onClick={() => toast.success('Resolution updated.')} className="w-full rounded-button bg-primary py-2 text-xs font-bold text-white">Update Resolution</button>
            </div>
          </div>
        )
      }
      bottom={<TrackerBulkActionBar selectedCount={selected ? 1 : 0} actions={[{ label: 'Escalate Selected', onClick: noop, variant: 'danger' }, { label: 'Assign Owner', onClick: noop }]} />}
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Blocker Ageing
 * Purpose: Show unresolved blockers by age and owner patterns
 * Primary layout: AGEING ANALYSIS SHEET
 * Main zones: owner ageing summary | age-bucket sheet | pattern insight panel
 * Why this layout fits: ageing is about time pressure and patterns
 * How it differs from related pages: not severity-first (Active Blockers)
 */
export function BlockerAgeingPage() {
  const [selected, setSelected] = useState<BlockerRecord | null>(null);

  const ageGroups = [
    { id: '1-3', label: '1–3 days', rows: blockerRecords.filter((b) => b.daysOpen <= 3) },
    { id: '4-7', label: '4–7 days', rows: blockerRecords.filter((b) => b.daysOpen > 3 && b.daysOpen <= 7) },
    { id: '8+', label: '8+ days', rows: blockerRecords.filter((b) => b.daysOpen > 7) },
  ];

  const columns: TrackerSheetColumn<BlockerRecord>[] = [
    { header: 'ID', width: '90px', accessor: (b) => <TrackerMonoId value={b.id} /> },
    { header: 'Title', accessor: (b) => b.title },
    { header: 'Owner', width: '110px', accessor: (b) => b.owner },
    { header: 'Days Open', width: '90px', emphasized: true, accessor: (b) => <span className="font-bold text-red-600">{b.daysOpen}</span> },
    { header: 'Last Update', width: '100px', emphasized: true, accessor: (b) => b.lastUpdate },
    { header: 'Reason', accessor: (b) => b.reason },
  ];

  const totalOpen = blockerRecords.length;
  const avgDays = totalOpen ? Math.round(blockerRecords.reduce((s, b) => s + b.daysOpen, 0) / totalOpen) : 0;
  const eightPlus = blockerRecords.filter((b) => b.daysOpen > 7).length;

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.blockerAgeing}
      kpis={[
        { label: 'Total open', value: String(totalOpen), status: 'info' },
        { label: 'Avg days open', value: String(avgDays), status: 'warning' },
        { label: '8+ days', value: String(eightPlus), status: 'danger' },
        { label: 'Owners affected', value: String(new Set(blockerRecords.map((b) => b.owner)).size), status: 'info' },
      ]}
    >
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {['Daniel Okafor', 'Priya Menon', 'Ibrahim Njoroge'].map((owner) => (
          <div key={owner} className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-xs shadow-sm">
            <span className="font-bold text-primary">{owner}</span>
            <span className="ml-2 text-text-muted">{blockerRecords.filter((b) => b.owner === owner).reduce((s, b) => s + b.daysOpen, 0)} total days</span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-auto">
          <TrackerSheet columns={columns} groups={ageGroups} selectedId={selected?.id} onRowClick={setSelected} getRowId={(b) => b.id} />
        </div>
        <div className="w-72 shrink-0 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Pattern Insights</h3>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Daniel Okafor: 2 repeated vendor blockers</li>
            <li>Missing resolution path on 1 blocker</li>
            <li>Avg days open trending up (+2 vs last week)</li>
          </ul>
        </div>
      </div>
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: SLA At Risk
 * Purpose: Track SLA records approaching breach
 * Primary layout: SLA COUNTDOWN SHEET
 * Main zones: time bands | grouped sheet | mitigation panel | countdown badges
 * Why this layout fits: page is about time-to-breach
 * How it differs from related pages: not severity or age grouping
 */
export function SlaAtRiskPage() {
  const [band, setBand] = useState<SlaTimeBand>(SLA_TIME_BANDS[0]);
  const [selected, setSelected] = useState<SlaRecord | null>(null);
  const atRisk = slaRecords.filter((s) => s.slaState === 'At Risk');

  const groups = SLA_TIME_BANDS.map((b) => ({
    id: b,
    label: b,
    rows: atRisk.filter((s) => s.slaBand === b),
  }));

  const columns: TrackerSheetColumn<SlaRecord>[] = [
    { header: 'ID', width: '90px', accessor: (s) => <TrackerMonoId value={s.id} /> },
    { header: 'Title', accessor: (s) => s.title },
    { header: 'Owner', width: '110px', accessor: (s) => s.owner },
    { header: 'Time Remaining', width: '130px', emphasized: true, accessor: (s) => <TrackerCountdownBadge timeRemaining={s.timeRemaining} urgent={s.slaBand === 'Less than 4 hours'} /> },
    { header: 'Band', width: '120px', accessor: (s) => s.slaBand },
  ];

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.slaAtRisk}
      kpis={SLA_TIME_BANDS.map((b) => ({
        label: b,
        value: String(atRisk.filter((s) => s.slaBand === b).length),
        status: b === 'Less than 4 hours' ? 'danger' as const : b === 'Due today' ? 'warning' as const : 'info' as const,
      }))}
    >
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TrackerTabRail tabs={SLA_TIME_BANDS.map((b) => ({ id: b, label: b, count: atRisk.filter((s) => s.slaBand === b).length }))} activeId={band} onChange={(id) => setBand(id as SlaTimeBand)} />
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-auto">
          <TrackerSheet columns={columns} groups={groups} selectedId={selected?.id} onRowClick={setSelected} getRowId={(s) => s.id} />
        </div>
        {selected && (
          <div className="w-72 shrink-0 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">Mitigation Note</h3>
            <textarea placeholder="Mitigation plan..." className="mt-3 w-full rounded-lg border border-border-subtle p-2 text-sm" rows={4} />
            <button onClick={() => toast.success('Mitigation saved.')} className="mt-2 w-full rounded-button bg-primary py-2 text-xs font-bold text-white">Save Mitigation</button>
          </div>
        )}
      </div>
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: SLA Breached
 * Purpose: Manage breached SLA records and recovery plans
 * Primary layout: BREACH RECOVERY WORKSPACE
 * Main zones: breach controls | breached sheet | recovery plan editor | governance strip
 * Why this layout fits: breached SLAs require recovery planning
 * How it differs from related pages: no countdown styling
 */
export function SlaBreachedPage() {
  const [selected, setSelected] = useState<SlaRecord | null>(slaRecords.find((s) => s.slaState === 'Breached') || null);
  const breached = slaRecords.filter((s) => s.slaState === 'Breached');

  const columns: TrackerSheetColumn<SlaRecord>[] = [
    { header: 'ID', width: '90px', accessor: (s) => <TrackerMonoId value={s.id} /> },
    { header: 'Title', accessor: (s) => s.title },
    { header: 'Owner', width: '110px', accessor: (s) => s.owner },
    { header: 'Breach Reason', accessor: (s) => s.breachReason || '—' },
    { header: 'Recovery Plan', width: '120px', accessor: (s) => !s.recoveryPlan ? <span className="font-bold text-red-600">Missing</span> : 'Drafted' },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.slaBreached}>
    <RecoveryShell
      top={
        <div className="flex gap-3">
          <select className="rounded-button border border-border-subtle px-3 py-1.5 text-sm"><option>All breach reasons</option><option>Approval delay</option></select>
          <select className="rounded-button border border-border-subtle px-3 py-1.5 text-sm"><option>All recovery owners</option></select>
        </div>
      }
      center={
        <>
          <TrackerSheet columns={columns} rows={breached} selectedId={selected?.id} onRowClick={setSelected} getRowId={(s) => s.id} />
          {selected && (
            <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-primary">Recovery Plan Editor</h3>
              <textarea defaultValue={selected.recoveryPlan || ''} placeholder="Document recovery plan..." className="mt-2 w-full rounded-lg border border-border-subtle p-2 text-sm" rows={4} />
              <button onClick={() => toast.success('Recovery plan saved.')} className="mt-2 rounded-button bg-primary px-4 py-2 text-xs font-bold text-white">Save Plan</button>
            </div>
          )}
        </>
      }
      bottom={<TrackerDocumentActions placement="metadata" compact />}
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: SLA Resolved
 * Purpose: Ledger of resolved SLA records with evidence and learning
 * Primary layout: SLA RESOLUTION LEDGER
 * Main zones: quality filters | expandable ledger | recurrence panel
 * Why this layout fits: resolved SLAs are for proof and learning
 * How it differs from related pages: not recovery workspace
 */
export function SlaResolvedPage() {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const resolved = slaRecords.filter((s) => s.slaState === 'Resolved');
  const filters = ['Resolved with evidence', 'Resolved after breach', 'Resolved without evidence', 'Recurring issue flagged'];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.slaResolved}>
    <LedgerShell
      top={
        <TrackerTabRail
          tabs={[{ id: 'all', label: 'All' }, ...filters.map((f) => ({ id: f, label: f }))]}
          activeId={filter}
          onChange={setFilter}
        />
      }
      center={
        <div>
          {resolved.map((s) => (
            <TrackerLedgerRow
              key={s.id}
              row={{ id: s.id, title: s.title, trackerName: 'SLA Tracker', trackerClass: 'Associate', itemType: 'SLA', owner: s.owner, status: 'Resolved', progress: 100, evidence: 'Accepted', nextAction: '—', source: { sourceFile: 'sla-tracker.xlsx', version: 'v2.0', lastModified: '2026-06-07', modifiedBy: s.owner }, closureNote: s.resolutionNote, closedAt: '2026-06-07' }}
              expanded={expandedId === s.id}
              onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
            >
              {s.resolutionNote && <p><strong>Resolution:</strong> {s.resolutionNote}</p>}
              {s.quality && <TrackerStatusPill status={s.quality} variant="success" />}
            </TrackerLedgerRow>
          ))}
        </div>
      }
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Recurrence & Learning</h3>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Access provisioning: 2 recurring breaches this quarter</li>
            <li>Recommendation: pre-approve standard access templates</li>
          </ul>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}
