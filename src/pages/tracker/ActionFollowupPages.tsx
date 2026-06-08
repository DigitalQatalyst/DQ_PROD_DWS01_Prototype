/**
 * ACTION & FOLLOW-UP TRACKING PAGES — Group 3
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  LedgerShell,
  TrackerSheet,
  TrackerTabRail,
  TrackerBulkActionBar,
  TrackerLedgerRow,
  TrackerSlideInPanel,
  TrackerMonoId,
  TrackerStatusPill,
  TrackerSourceStrip,
  TrackerPageFrame,
  buildTrackerRowColumns,
  type TrackerSheetColumn,
} from '../../components/TrackerSharedComponents';
import { TRACKER_PAGE_META } from '../../data/trackerPageMeta';
import {
  workingSessions,
  sessionActions,
  meetingGroups,
  followUpRows,
  AGE_BUCKETS,
  currentUser,
  type WorkingSession,
  type SessionAction,
  type MeetingGroup,
  type TrackerRow,
  type AgeBucket,
} from '../../data/trackerAreaData';

/**
 * Page: Working Session Actions
 * Purpose: Track session actions and conversion to governed work
 * Primary layout: SESSION ACTION CONVERSION SHEET
 * Main zones: session list | actions sheet | conversion panel | status summary
 * Why this layout fits: main job is converting session actions into governed records
 * How it differs from related pages: not generic follow-up sheet
 */
export function WorkingSessionActionsPage() {
  const [session, setSession] = useState<WorkingSession>(workingSessions[0]);
  const [selected, setSelected] = useState<SessionAction | null>(null);
  const actions = sessionActions.filter((a) => a.sessionId === session.id);

  const columns: TrackerSheetColumn<SessionAction>[] = [
    { header: 'ID', width: '90px', accessor: (a) => <TrackerMonoId value={a.id} /> },
    { header: 'Action', accessor: (a) => a.text },
    { header: 'Owner', width: '110px', accessor: (a) => a.owner },
    { header: 'Conversion', width: '140px', accessor: (a) => <TrackerStatusPill status={a.conversionStatus} variant={a.conversionStatus === 'Unlinked' ? 'warning' : 'success'} /> },
    { header: 'Linked Record', width: '110px', accessor: (a) => a.linkedRecord ? <TrackerMonoId value={a.linkedRecord} /> : '—' },
  ];

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.workingSessionActions}
      kpis={[
        { label: 'Total actions', value: String(session.actionCount), status: 'info' },
        { label: 'Converted', value: String(session.convertedCount), status: 'success' },
        { label: 'Unlinked', value: String(session.actionCount - session.convertedCount), status: 'warning' },
        { label: 'Sessions', value: String(workingSessions.length), status: 'info' },
      ]}
    >
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="w-56 shrink-0 overflow-y-auto rounded-card border border-border-subtle bg-white shadow-sm">
          <div className="border-b border-border-subtle p-3 text-sm font-bold text-primary">Sessions</div>
          {workingSessions.map((s) => (
            <button key={s.id} onClick={() => setSession(s)} className={`w-full border-b border-border-subtle p-3 text-left text-sm ${session.id === s.id ? 'bg-info-surface' : 'hover:bg-surface'}`}>
              <TrackerMonoId value={s.id} />
              <div className="font-medium text-primary">{s.title}</div>
              <div className="text-xs text-text-muted">{s.date} · {s.actionCount} actions</div>
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col overflow-auto">
          <TrackerSheet columns={columns} rows={actions} selectedId={selected?.id} onRowClick={setSelected} getRowId={(a) => a.id} />
        </div>
        <div className="w-72 shrink-0 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Conversion Panel</h3>
          {selected ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-text-secondary">{selected.text}</p>
              {['Link to Task', 'Link to Request', 'Link to Decision', 'Mark Follow-up Only'].map((action) => (
                <button key={action} onClick={() => toast.success(`${action} recorded.`)} className="w-full rounded-button border border-border-default py-2 text-xs font-bold text-primary hover:bg-surface">{action}</button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-muted">Select an action to convert</p>
          )}
        </div>
      </div>
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: Meeting Follow-ups
 * Purpose: Track meeting follow-ups with meeting context
 * Primary layout: MEETING FOLLOW-UP REGISTER
 * Main zones: date filter | grouped register | meeting context | slide-in panel
 * Why this layout fits: meeting context matters; rows tied to meeting source
 * How it differs from related pages: not session conversion layout
 */
export function MeetingFollowupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<MeetingGroup | null>(meetingGroups[0]);
  const [expandedFu, setExpandedFu] = useState<string | null>(null);

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.meetingFollowups}>
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex gap-2">
        <input type="date" defaultValue="2026-06-01" className="rounded-button border border-border-subtle px-3 py-1.5 text-sm" />
        <select className="rounded-button border border-border-subtle px-3 py-1.5 text-sm">
          <option>All sources</option>
          <option>Team Standup</option>
          <option>Governance</option>
        </select>
      </div>
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-y-auto rounded-card border border-border-subtle bg-white shadow-sm">
          {meetingGroups.map((group) => (
            <div key={group.id} className="border-b border-border-subtle">
              <button
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-4 text-left ${selectedGroup?.id === group.id ? 'bg-info-surface' : 'hover:bg-surface'}`}
              >
                <div className="text-sm font-bold text-primary">{group.title}</div>
                <div className="mt-1 text-xs text-text-muted">{group.date} · {group.attendees.join(', ')}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {group.decisions.map((d) => (
                    <span key={d} className="rounded-pill bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{d}</span>
                  ))}
                </div>
              </button>
              {group.followUps.map((fu) => (
                <div key={fu.id} className="border-t border-border-subtle pl-8">
                  <button onClick={() => setExpandedFu(expandedFu === fu.id ? null : fu.id)} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-surface">
                    <TrackerMonoId value={fu.id} />
                    <span className="flex-1">{fu.text}</span>
                    <TrackerStatusPill status={fu.status} />
                  </button>
                  {expandedFu === fu.id && (
                    <div className="border-t border-border-subtle bg-surface px-4 py-2 text-xs space-y-1">
                      <div>Owner: {fu.owner}</div>
                      {fu.completionNote && <div>Note: {fu.completionNote}</div>}
                      {fu.linkedRecords && <div>Linked: {fu.linkedRecords.join(', ')}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <TrackerSlideInPanel open={!!selectedGroup} onClose={() => setSelectedGroup(null)} title="Meeting Context">
          {selectedGroup && (
            <div className="space-y-3 text-sm">
              <div><strong>Attendees:</strong> {selectedGroup.attendees.join(', ')}</div>
              <div><strong>Decisions:</strong> {selectedGroup.decisions.join('; ')}</div>
              <div><strong>Unlinked follow-ups:</strong> {selectedGroup.followUps.filter((f) => !f.linkedRecords?.length).length}</div>
            </div>
          )}
        </TrackerSlideInPanel>
      </div>
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: Assigned Follow-ups
 * Purpose: Personal/team ownership tracker for assigned follow-ups
 * Primary layout: FOLLOW-UP OWNERSHIP SHEET
 * Main zones: ownership toggles | owner-focused sheet | quick update | bulk bar
 * Why this layout fits: user needs to act on ownership and next action
 * How it differs from related pages: not grouped by meeting/session
 */
export function AssignedFollowupsPage() {
  const [toggle, setToggle] = useState('Assigned to me');
  const [selected, setSelected] = useState<TrackerRow | null>(null);
  const toggles = ['Assigned to me', 'Assigned by me', 'Team follow-ups', 'Due soon'];

  const filtered = followUpRows.filter((r) => {
    if (toggle === 'Assigned to me') return r.owner === currentUser;
    if (toggle === 'Due soon') return r.status !== 'Completed';
    return true;
  });

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.assignedFollowups}>
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TrackerTabRail tabs={toggles.map((t) => ({ id: t, label: t }))} activeId={toggle} onChange={setToggle} />
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-auto">
          <TrackerSheet columns={buildTrackerRowColumns()} rows={filtered} selectedId={selected?.id} onRowClick={setSelected} getRowId={(r) => r.id} />
        </div>
        {selected && (
          <div className="w-72 shrink-0 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-primary">Quick Update</h3>
            <div className="mt-3 space-y-2 text-sm">
              <TrackerMonoId value={selected.id} />
              <textarea placeholder="Update note..." className="w-full rounded-lg border border-border-subtle p-2 text-sm" rows={3} />
              <button onClick={() => toast.success('Update saved.')} className="w-full rounded-button bg-primary py-2 text-xs font-bold text-white">Save Update</button>
            </div>
          </div>
        )}
      </div>
      <TrackerBulkActionBar selectedCount={selected ? 1 : 0} actions={[{ label: 'Bulk Reminder', onClick: () => toast.info('Reminders sent.') }, { label: 'Bulk Update', onClick: () => {} }]} />
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: Overdue Follow-ups
 * Purpose: Recover follow-ups that are late
 * Primary layout: OVERDUE RECOVERY REGISTER
 * Main zones: ageing buckets | grouped sheet | recovery panel | completeness indicator
 * Why this layout fits: page should feel like recovery management
 * How it differs from related pages: not Assigned Follow-ups layout
 */
export function OverdueFollowupsPage() {
  const [bucket, setBucket] = useState<AgeBucket>(AGE_BUCKETS[0]);
  const [selected, setSelected] = useState<TrackerRow | null>(null);
  const overdue = followUpRows.filter((r) => r.status === 'Overdue' || (r.daysOpen && r.daysOpen > 0));

  const groups = AGE_BUCKETS.map((b) => ({
    id: b,
    label: b,
    rows: overdue.filter((r) => r.ageBucket === b || (!r.ageBucket && b === '1 day')),
  }));

  return (
    <TrackerPageFrame
      {...TRACKER_PAGE_META.overdueFollowups}
      kpis={AGE_BUCKETS.map((b) => ({
        label: b,
        value: String(overdue.filter((r) => r.ageBucket === b || (!r.ageBucket && b === '1 day')).length),
        status: b === '8+ days' ? 'danger' as const : b === '4-7 days' ? 'warning' as const : 'info' as const,
      }))}
    >
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <TrackerTabRail tabs={AGE_BUCKETS.map((b) => ({ id: b, label: b, count: overdue.filter((r) => r.ageBucket === b).length }))} activeId={bucket} onChange={(id) => setBucket(id as AgeBucket)} />
      <div className="flex flex-1 min-h-0 gap-3">
        <div className="flex-1 overflow-auto">
          <TrackerSheet columns={buildTrackerRowColumns({ emphasize: 'daysOpen' })} groups={groups} selectedId={selected?.id} onRowClick={setSelected} getRowId={(r) => r.id} />
        </div>
        <div className="w-72 shrink-0 rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Recovery Actions</h3>
          {selected ? (
            <div className="mt-3 space-y-2">
              {['Send Reminder', 'Reassign', 'Escalate', 'Set Recovery Date'].map((a) => (
                <button key={a} onClick={() => toast.success(`${a} recorded.`)} className="w-full rounded-button border border-border-default py-2 text-xs font-bold text-primary">{a}</button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-muted">Select an overdue follow-up</p>
          )}
        </div>
      </div>
    </div>
    </TrackerPageFrame>
  );
}

/**
 * Page: Completed Follow-ups
 * Purpose: Completion ledger for follow-ups
 * Primary layout: FOLLOW-UP COMPLETION LEDGER
 * Main zones: period filters | expandable ledger | evidence/quality panel
 * Why this layout fits: completed follow-ups need proof and traceability
 * How it differs from related pages: not editable like active follow-up pages
 */
export function CompletedFollowupsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const completed = followUpRows.filter((r) => r.status === 'Completed').length
    ? followUpRows.filter((r) => r.status === 'Completed')
    : [{ ...followUpRows[0], id: 'FU-198', title: 'Document outcome baseline', status: 'Completed', progress: 100, closureNote: 'Baseline documented in outcome tracker v1.2', closedAt: '2026-06-04', closedBy: 'Michael Chen' }];

  return (
    <TrackerPageFrame {...TRACKER_PAGE_META.completedFollowups}>
    <LedgerShell
      top={
        <div className="flex gap-2">
          <select className="rounded-button border border-border-subtle px-3 py-1.5 text-sm"><option>2026-W23</option><option>2026-W22</option></select>
          <select className="rounded-button border border-border-subtle px-3 py-1.5 text-sm"><option>All sources</option><option>Meeting</option><option>Session</option></select>
        </div>
      }
      center={
        <div>
          {completed.map((row) => (
            <TrackerLedgerRow key={row.id} row={row} expanded={expandedId === row.id} onToggle={() => setExpandedId(expandedId === row.id ? null : row.id)}>
              {row.closureNote && <p><strong>Completion note:</strong> {row.closureNote}</p>}
              <TrackerSourceStrip source={row.source} />
              {row.closedBy && <p className="text-xs text-text-muted">Closed by {row.closedBy}</p>}
            </TrackerLedgerRow>
          ))}
        </div>
      }
      right={
        <div className="rounded-card border border-border-subtle bg-white p-4 shadow-sm">
          <h3 className="text-sm font-bold text-primary">Evidence & Quality</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>With completion note</span><span className="font-bold">90%</span></div>
            <div className="flex justify-between"><span>With linked outcome</span><span className="font-bold">75%</span></div>
            <div className="flex justify-between"><span>Evidence attached</span><span className="font-bold">80%</span></div>
          </div>
        </div>
      }
    />
    </TrackerPageFrame>
  );
}
