/**
 * TRACKER HUB PAGES — Group 1
 * Sheet-first, document-aware workspace layouts with purpose-specific compositions.
 */

import React, { useMemo, useState } from 'react';
import {
  WorkbenchShell,
  RegisterShell,
  LedgerShell,
  TrackerDocumentLibrary,
  TrackerDocumentActions,
  TrackerRowInbox,
  TrackerSheet,
  TrackerSlideInPanel,
  TrackerBulkActionBar,
  TrackerLedgerRow,
  TrackerFilterBuilder,
  TrackerTabRail,
  TrackerInterventionPanel,
  TrackerSourceStrip,
  TrackerAuditBlock,
  TrackerEvidenceChips,
  TrackerStatusPill,
  TrackerMonoId,
  TrackerPageFrame,
  buildTrackerRowColumns,
} from '../../components/TrackerSharedComponents';
import { TRACKER_PAGE_META } from '../../data/trackerPageMeta';
import {
  trackerDocuments,
  trackerRows,
  myRowInbox,
  teamMemberWorkloads,
  closedItems,
  TEAM_TRACKER_TABS,
  TRACKER_CLASSES,
  RISK_REASONS,
  interventionPlaybooks,
  type TrackerDocument,
  type TrackerRow,
  type RiskReason,
} from '../../data/trackerAreaData';

/**
 * Page: My Tracker Overview
 * Purpose: Personal access point for tracker documents and rows needing attention
 * Primary layout: PERSONAL TRACKER WORKBENCH
 * Main zones: summary bar | document library | sheet preview | row inbox | recent docs
 * Why this layout fits: user moves between documents and assigned rows
 * How it differs from related pages: not full-screen sheet; not dashboard grid only
 */
export function MyTrackerOverviewPage() {
  const [selectedDoc, setSelectedDoc] = useState<TrackerDocument>(trackerDocuments[0]);
  const [selectedRow, setSelectedRow] = useState<TrackerRow | null>(null);
  const previewRows = trackerRows.filter((r) => r.trackerName === selectedDoc.name || r.trackerName.includes(selectedDoc.name.split(' ')[0]));

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.myTrackerOverview}
      // kpis={[
      //   { label: 'Assigned to me', value: '8', status: 'info' },
      //   { label: 'Due soon', value: '3', status: 'warning' },
      //   { label: 'Missing update', value: '5', status: 'danger' },
      //   { label: 'Needs evidence', value: '2', status: 'warning' },
      // ]}
    >
    <WorkbenchShell
      left={
        <TrackerDocumentLibrary
          documents={trackerDocuments}
          selectedId={selectedDoc.id}
          onSelect={setSelectedDoc}
          showActions
        />
      }
      center={
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-primary">{selectedDoc.name} — Sheet Preview</h2>
            <span className="text-xs text-text-muted">{selectedDoc.sourceFile} · {selectedDoc.version}</span>
          </div>
          <div className="flex-1 overflow-auto">
            <TrackerSheet
              columns={buildTrackerRowColumns()}
              rows={previewRows.length ? previewRows : trackerRows.slice(0, 4)}
              selectedId={selectedRow?.id}
              onRowClick={setSelectedRow}
              readOnly
              getRowId={(r) => r.id}
            />
          </div>
        </div>
      }
      // right={
      //   <TrackerRowInbox rows={myRowInbox} selectedId={selectedRow?.id} onSelect={setSelectedRow} />
      // }
      bottom={
        <div className="rounded-card border border-border-subtle bg-white p-3 shadow-sm">
          <h3 className="mb-2 text-xs font-bold uppercase text-text-muted">Recently Opened</h3>
          <div className="flex gap-3 overflow-x-auto">
            {trackerDocuments.filter((d) => d.lastOpened).map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="shrink-0 rounded-lg border border-border-subtle px-3 py-2 text-left hover:bg-surface"
              >
                <div className="text-sm font-bold text-primary">{doc.name}</div>
                <div className="text-xs text-text-muted">Opened {doc.lastOpened}</div>
              </button>
            ))}
          </div>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Team Tracker Overview
 * Purpose: Lead-level view of team trackers with owner workload inspection
 * Primary layout: TEAM TRACKER COMMAND SHEET
 * Main zones: team tabs | ownership summary | wide sheet | workload panel | action bar
 * Why this layout fits: leads inspect work by owner and team flow
 * How it differs from related pages: no document library (My Tracker)
 */
export function TeamTrackerOverviewPage() {
  const [activeTab, setActiveTab] = useState(TEAM_TRACKER_TABS[0].id);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<TrackerRow | null>(null);
  const tab = TEAM_TRACKER_TABS.find((t) => t.id === activeTab)!;
  const sheetRows = selectedMember
    ? trackerRows.filter((r) => r.owner === selectedMember)
    : trackerRows;

  const teamKpis = [
    { label: 'Team open', value: String(teamMemberWorkloads.reduce((s, m) => s + m.open, 0)), status: 'info' as const },
    { label: 'At risk', value: String(teamMemberWorkloads.reduce((s, m) => s + m.atRisk, 0)), status: 'warning' as const },
    { label: 'Blocked', value: String(teamMemberWorkloads.reduce((s, m) => s + m.blocked, 0)), status: 'danger' as const },
    { label: 'Overdue', value: String(teamMemberWorkloads.reduce((s, m) => s + m.overdue, 0)), status: 'danger' as const },
  ];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.teamTrackerOverview} kpis={teamKpis}>
    <WorkbenchShell
      top={
        <>
          <TrackerTabRail
            tabs={TEAM_TRACKER_TABS.map((t) => ({ id: t.id, label: t.label }))}
            activeId={activeTab}
            onChange={setActiveTab}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {teamMemberWorkloads.map((m) => (
              <button
                key={m.name}
                onClick={() => setSelectedMember(m.name === selectedMember ? null : m.name)}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${selectedMember === m.name ? 'border-primary bg-info-surface' : 'border-border-subtle bg-white hover:bg-surface'}`}
              >
                <div className="font-bold text-primary">{m.name}</div>
                <div className="text-text-muted">{m.open} open · {m.atRisk} at risk · {m.overdue} overdue</div>
              </button>
            ))}
          </div>
        </>
      }
      center={
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <div className="text-sm font-bold text-primary">{tab.label}</div>
          <div className="flex-1 overflow-auto">
            <TrackerSheet
              columns={buildTrackerRowColumns()}
              rows={sheetRows}
              selectedId={selectedRow?.id}
              onRowClick={setSelectedRow}
              getRowId={(r) => r.id}
            />
          </div>
        </div>
      }
      right={
        selectedMember ? (
          <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">{selectedMember} — Workload</h3>
            {(() => {
              const m = teamMemberWorkloads.find((w) => w.name === selectedMember);
              if (!m) return null;
              return (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Open</span><span className="font-bold">{m.open}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">At Risk</span><span className="font-bold text-amber-600">{m.atRisk}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Blocked</span><span className="font-bold text-red-600">{m.blocked}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Overdue</span><span className="font-bold text-red-600">{m.overdue}</span></div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="rounded-card border border-border-subtle bg-surface p-4 text-sm text-text-muted">
            Select a team member to view workload panel
          </div>
        )
      }
      bottom={
        selectedRow && (
          <div className="flex items-center justify-between rounded-card border border-border-subtle bg-white px-4 py-2 shadow-sm">
            <span className="text-sm"><TrackerMonoId value={selectedRow.id} /> — {selectedRow.title}</span>
            <div className="flex gap-2">
              <button className="rounded-button border border-border-default px-3 py-1 text-xs font-bold text-primary">Request Update</button>
              <button className="rounded-button bg-primary px-3 py-1 text-xs font-bold text-white">Assign Review</button>
            </div>
          </div>
        )
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: Open Items
 * Purpose: Aggregated register of all open tracker rows
 * Primary layout: CROSS-TRACKER REGISTER
 * Main zones: filter builder | grouped sheet | slide-in panel
 * Why this layout fits: density and cross-tracker comparison
 * How it differs from related pages: not inbox (My Tracker), not risk intervention
 */
export function OpenItemsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRow, setSelectedRow] = useState<TrackerRow | null>(null);

  const filtered = useMemo(() => {
    return trackerRows.filter((r) => {
      if (filters.trackerClass && filters.trackerClass !== 'all' && r.trackerClass !== filters.trackerClass) return false;
      if (filters.itemType && filters.itemType !== 'all' && r.itemType !== filters.itemType) return false;
      if (filters.owner && filters.owner !== 'all' && r.owner !== filters.owner) return false;
      if (filters.status && filters.status !== 'all' && r.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const groups = TRACKER_CLASSES.map((cls) => ({
    id: cls,
    label: `${cls} Trackers`,
    rows: filtered.filter((r) => r.trackerClass === cls),
  })).filter((g) => g.rows.length > 0);

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.openItems}>
    <RegisterShell
      top={
        <TrackerFilterBuilder
          filters={[
            { key: 'trackerClass', label: 'Class', options: [...TRACKER_CLASSES] },
            { key: 'itemType', label: 'Type', options: ['Request', 'Follow-up', 'Blocker', 'Decision', 'Outcome'] },
            { key: 'owner', label: 'Owner', options: [...new Set(trackerRows.map((r) => r.owner))] },
            { key: 'status', label: 'Status', options: [...new Set(trackerRows.map((r) => r.status))] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
        />
      }
      center={
        <TrackerSheet
          columns={buildTrackerRowColumns()}
          groups={groups}
          selectedId={selectedRow?.id}
          onRowClick={setSelectedRow}
          getRowId={(r) => r.id}
        />
      }
      right={
        <TrackerSlideInPanel open={!!selectedRow} onClose={() => setSelectedRow(null)} title="Row Detail">
          {selectedRow && (
            <div className="space-y-4 text-sm">
              <div><TrackerMonoId value={selectedRow.id} /><h4 className="mt-1 font-bold text-primary">{selectedRow.title}</h4></div>
              <TrackerSourceStrip source={selectedRow.source} />
              <div><span className="text-text-muted">Owner:</span> {selectedRow.owner}</div>
              <div><span className="text-text-muted">Status:</span> <TrackerStatusPill status={selectedRow.status} /></div>
              <div><span className="text-text-muted">Gap:</span> {selectedRow.gap || 'None'}</div>
              <div><span className="text-text-muted">Next action:</span> {selectedRow.nextAction}</div>
            </div>
          )}
        </TrackerSlideInPanel>
      }
    />
    </TrackerPageFrame>
  );
}

/**
 * Page: At-Risk Items
 * Purpose: Intervention page for rows with risk, gaps, blockers, SLA breach
 * Primary layout: RISK INTERVENTION SHEET
 * Main zones: risk tabs | grouped sheet | intervention panel | bulk action bar
 * Why this layout fits: user is intervening, not browsing
 * How it differs from related pages: not Open Items register
 */
export function AtRiskItemsPage() {
  const [activeRisk, setActiveRisk] = useState<RiskReason>(RISK_REASONS[0]);
  const [selectedRow, setSelectedRow] = useState<TrackerRow | null>(null);
  const [selectedCount] = useState(0);

  const atRiskRows = trackerRows.filter((r) => r.riskReason);
  const groups = RISK_REASONS.map((reason) => ({
    id: reason,
    label: reason,
    rows: atRiskRows.filter((r) => r.riskReason === reason),
  })).filter((g) => g.rows.length > 0);

  const activeRows = atRiskRows.filter((r) => r.riskReason === activeRisk);

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.atRiskItems}>
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TrackerTabRail
        tabs={RISK_REASONS.map((r) => ({
          id: r,
          label: r,
          count: atRiskRows.filter((row) => row.riskReason === r).length,
        }))}
        activeId={activeRisk}
        onChange={(id) => setActiveRisk(id as RiskReason)}
      />
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex flex-1 flex-col overflow-auto">
          <TrackerSheet
            columns={buildTrackerRowColumns({ emphasize: 'riskReason' })}
            rows={activeRows}
            groups={groups}
            selectedId={selectedRow?.id}
            onRowClick={setSelectedRow}
            selectable
            getRowId={(r) => r.id}
          />
        </div>
        <div className="w-72 shrink-0">
          <TrackerInterventionPanel
            riskReason={activeRisk}
            playbook={interventionPlaybooks[activeRisk]}
            row={selectedRow}
          />
        </div>
      </div>
      <TrackerBulkActionBar
        selectedCount={selectedCount || (selectedRow ? 1 : 0)}
        actions={[
          { label: 'Request Update', onClick: () => {} },
          { label: 'Escalate', onClick: () => {}, variant: 'danger' },
        ]}
      />
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: Recently Closed Items
 * Purpose: Closure ledger for completed tracker rows with audit proof
 * Primary layout: CLOSURE LEDGER
 * Main zones: period selector | expandable ledger | quality summary | export
 * Why this layout fits: closed rows need auditability and proof
 * How it differs from related pages: read-only ledger, not work queue
 */
export function RecentlyClosedItemsPage() {
  const [period, setPeriod] = useState('2026-W23');
  const [expandedId, setExpandedId] = useState<string | null>(closedItems[0]?.id || null);

  const periods = ['2026-W23', '2026-W22', '2026-W21'];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.recentlyClosedItems}>
    <LedgerShell
      top={
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-button px-4 py-2 text-sm font-bold ${period === p ? 'bg-primary text-white' : 'border border-border-subtle text-primary hover:bg-surface'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <TrackerDocumentActions placement="export" />
        </div>
      }
      center={
        <div>
          <div className="border-b border-border-subtle px-4 py-2 text-sm font-bold text-primary">
            Closure Week — {period}
          </div>
          {closedItems.map((row) => (
            <TrackerLedgerRow
              key={row.id}
              row={row}
              expanded={expandedId === row.id}
              onToggle={() => setExpandedId(expandedId === row.id ? null : row.id)}
            >
              {row.closureNote && <p><strong>Closure note:</strong> {row.closureNote}</p>}
              {row.evidenceItems && <TrackerEvidenceChips items={row.evidenceItems} />}
              {row.auditEvents && <TrackerAuditBlock events={row.auditEvents} />}
              <TrackerSourceStrip source={row.source} />
              {row.closedBy && <p className="text-xs text-text-muted">Closed by {row.closedBy} on {row.closedAt}</p>}
            </TrackerLedgerRow>
          ))}
        </div>
      }
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Closure Quality — {period}</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>With evidence</span><span className="font-bold text-green-600">85%</span></div>
            <div className="flex justify-between"><span>With closure note</span><span className="font-bold">92%</span></div>
            <div className="flex justify-between"><span>Source version linked</span><span className="font-bold">100%</span></div>
          </div>
        </div>
      }
      bottom={
        <div className="flex justify-end gap-2">
          <button className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary">Download Closure Pack</button>
          <button className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Export Ledger</button>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}
