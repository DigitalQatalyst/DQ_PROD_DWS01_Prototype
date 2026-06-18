export interface TrackerPageMeta {
  subtitle: string;
  title: string;
  purpose: string;
}

export const TRACKER_PAGE_META = {
  myTrackerOverview: {
    subtitle: 'Tracker Hub',
    title: 'My Tracker Overview',
    purpose: 'Personal access point for tracker documents and rows needing your attention — move between documents and assigned rows.',
  },
  teamTrackerOverview: {
    subtitle: 'Tracker Hub',
    title: 'Team Tracker Overview',
    purpose: 'Lead-level view of team trackers with ownership summary, workload inspection, and row review actions.',
  },
  openItems: {
    subtitle: 'Tracker Hub',
    title: 'Open Items',
    purpose: 'Aggregated register of all open tracker rows across accessible documents for cross-tracker comparison.',
  },
  atRiskItems: {
    subtitle: 'Tracker Hub',
    title: 'At-Risk Items',
    purpose: 'Intervention page for rows with risk, gaps, blockers, missing evidence, SLA breach, or no update.',
  },
  recentlyClosedItems: {
    subtitle: 'Tracker Hub',
    title: 'Recently Closed Items',
    purpose: 'Closure ledger for completed tracker rows with evidence, closure notes, audit trail, and source versions.',
  },
  submittedRequests: {
    subtitle: 'Request Status Tracker',
    title: 'Submitted Requests',
    purpose: 'Tracker sheet for submitted requests across categories, showing queue status, SLA, and fulfilment progress.',
  },
  requestDrafts: {
    subtitle: 'Request Status Tracker',
    title: 'Request Drafts',
    purpose: 'Recovery workspace for incomplete draft request rows — complete missing fields and resume or submit.',
  },
  requestStatus: {
    subtitle: 'Request Status Tracker',
    title: 'Request Status',
    purpose: 'Request lifecycle tracker showing where each request is in its journey with stage notes and audit events.',
  },
  pendingInformation: {
    subtitle: 'Request Status Tracker',
    title: 'Pending Information',
    purpose: 'Resolution desk for requests blocked by missing information — respond, remind, and track SLA impact.',
  },
  requestClosureStatus: {
    subtitle: 'Request Status Tracker',
    title: 'Request Closure Status',
    purpose: 'Track request closure state, evidence, requester confirmation, and returned reasons with readiness checks.',
  },
  workingSessionActions: {
    subtitle: 'Action & Follow-up Tracker',
    title: 'Working Session Actions',
    purpose: 'Track actions created during working sessions and convert them into governed tasks, requests, or decisions.',
  },
  meetingFollowups: {
    subtitle: 'Action & Follow-up Tracker',
    title: 'Meeting Follow-ups',
    purpose: 'Track meeting follow-ups with meeting context — attendees, decisions, linked records, and completion notes.',
  },
  assignedFollowups: {
    subtitle: 'Action & Follow-up Tracker',
    title: 'Assigned Follow-ups',
    purpose: 'Personal and team ownership tracker for assigned follow-ups with quick updates and bulk reminders.',
  },
  overdueFollowups: {
    subtitle: 'Action & Follow-up Tracker',
    title: 'Overdue Follow-ups',
    purpose: 'Recovery register for late follow-ups grouped by ageing bucket with reminder, reassign, and escalation actions.',
  },
  completedFollowups: {
    subtitle: 'Action & Follow-up Tracker',
    title: 'Completed Follow-ups',
    purpose: 'Completion ledger for follow-ups with proof, linked outcomes, evidence, and closure quality summary.',
  },
  activeBlockers: {
    subtitle: 'Blocker & SLA Tracker',
    title: 'Active Blockers',
    purpose: 'Track currently active blockers by severity with resolution ownership and escalation actions.',
  },
  blockerAgeing: {
    subtitle: 'Blocker & SLA Tracker',
    title: 'Blocker Ageing',
    purpose: 'Show unresolved blockers by age and owner patterns to surface time pressure and repeated issues.',
  },
  slaAtRisk: {
    subtitle: 'Blocker & SLA Tracker',
    title: 'SLA At Risk',
    purpose: 'Track SLA records approaching breach grouped by time remaining with mitigation planning.',
  },
  slaBreached: {
    subtitle: 'Blocker & SLA Tracker',
    title: 'SLA Breached',
    purpose: 'Manage breached SLA records with recovery plans, governance notes, and document attachments.',
  },
  slaResolved: {
    subtitle: 'Blocker & SLA Tracker',
    title: 'SLA Resolved',
    purpose: 'Ledger of resolved SLA records with evidence, closure quality, and recurring issue learning.',
  },
  decisionLog: {
    subtitle: 'Decision & Outcome Tracker',
    title: 'Decision Log',
    purpose: 'Governance decision register with rationale, linked records, source documents, and audit trail.',
  },
  decisionStatus: {
    subtitle: 'Decision & Outcome Tracker',
    title: 'Decision Status',
    purpose: 'Track lifecycle status of decisions with controlled transitions and required rationale notes.',
  },
  linkedTasksRequests: {
    subtitle: 'Decision & Outcome Tracker',
    title: 'Linked Tasks / Requests',
    purpose: 'Trace decisions into governed tasks and requests — validate links, gaps, and weak closure.',
  },
  outcomeProgress: {
    subtitle: 'Decision & Outcome Tracker',
    title: 'Outcome Progress',
    purpose: 'Track progress toward outcomes with baseline, current progress, evidence state, and next milestones.',
  },
  outcomeEvidence: {
    subtitle: 'Decision & Outcome Tracker',
    title: 'Outcome Evidence',
    purpose: 'Ledger of evidence proving outcome progress or completion with review actions and document handling.',
  },
} as const satisfies Record<string, TrackerPageMeta>;
