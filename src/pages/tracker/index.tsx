/**
 * TRACKER FEATURE AREA - INDEX
 *
 * All 25 Tracker pages organized by feature group.
 * Each page has a distinct layout strategy tied to its operational purpose.
 *
 * LAYOUT DIVERSITY RULES:
 * - Register dominant: Open Items, Submitted Requests, Decision Log
 * - Ledger-style: Recently Closed, Completed Follow-ups, SLA Resolved, Outcome Evidence
 * - Recovery/resolution: Request Drafts, Pending Information, Overdue Follow-ups, Active Blockers, SLA Breached
 * - Lifecycle/status-control: Request Status, Decision Status
 * - Workbook home: My Tracker Overview, Team Tracker Overview
 * - Traceability: Linked Tasks/Requests, Outcome Progress
 *
 * PAGE HEADER CONVENTION:
 * - Every page uses TrackerPageFrame with group subtitle, title, and purpose (matches task-area styling)
 * - Summary pages use TrackerKpiGrid with TaskKpiTile-style cards above the layout body
 */

// ====================================================================================
// GROUP 1: REQUEST STATUS TRACKING (5 pages)
// Design Language: Category sheet, draft recovery, lifecycle, resolution desk, checkpoint
// ====================================================================================
export {
  SubmittedRequestsPage, // Request category tracker
  RequestDraftsPage, // Draft recovery workspace
  RequestStatusPage, // Lifecycle sheet
  PendingInformationPage, // Missing-info resolution desk
  RequestClosureStatusPage, // Request closure checkpoint
} from "./RequestStatusPages";

// ====================================================================================
// GROUP 3: ACTION & FOLLOW-UP TRACKING (5 pages)
// Design Language: Session conversion, meeting register, ownership sheet, recovery register, completion ledger
// ====================================================================================
export {
  WorkingSessionActionsPage, // Session action conversion sheet
  MeetingFollowupsPage, // Meeting follow-up register
  AssignedFollowupsPage, // Follow-up ownership sheet
  OverdueFollowupsPage, // Overdue recovery register
  CompletedFollowupsPage, // Follow-up completion ledger
} from "./ActionFollowupPages";

// ====================================================================================
// GROUP 4: BLOCKER & SLA TRACKING (5 pages)
// Design Language: Resolution desk, ageing analysis, countdown sheet, breach recovery, resolution ledger
// ====================================================================================
export {
  ActiveBlockersPage, // Blocker resolution desk
  BlockerAgeingPage, // Ageing analysis sheet
  SlaAtRiskPage, // SLA countdown sheet
  SlaBreachedPage, // Breach recovery workspace
  SlaResolvedPage, // SLA resolution ledger
} from "./BlockerSlaPages";

// ====================================================================================
// GROUP 5: DECISION & OUTCOME TRACKING (5 pages)
// Design Language: Decision register, status control, traceability, outcome progress, evidence ledger
// ====================================================================================
export {
  DecisionLogPage, // Decision register workbook
  DecisionStatusPage, // Decision status control sheet
  LinkedTasksRequestsPage, // Traceability workbook
  OutcomeProgressPage, // Outcome progress workbook
  OutcomeEvidencePage, // Evidence review ledger
} from "./DecisionOutcomePages";

/**
 * PAGE DESIGN MATRIX
 *
 * Page                      | Operational Question                    | Primary Layout                  | Why This Pattern Fits                     | How It Differs
 * ========================= | ======================================= | =============================== | ========================================= | ================================
 * My Tracker Overview       | What needs my attention today?          | Personal tracker workbench      | Move between docs and assigned rows       | Doc library + inbox, not full sheet
 * Team Tracker Overview     | Where is team pressure building?        | Team tracker command sheet      | Inspect work by owner and team flow       | Tabs + workload panel, not doc library
 * Open Items                | What open records exist across trackers?  | Cross-tracker register          | Density and cross-tracker comparison    | Full-width grouped register
 * At-Risk Items             | What items need intervention?           | Risk intervention sheet         | Prioritize risk reason and escalation     | Risk tabs + playbook, not register
 * Recently Closed Items     | What was the closure outcome?           | Closure ledger                  | Audit proof for closed rows               | Expandable read-only ledger
 *
 * Submitted Requests        | What requests are in flight?            | Request category tracker        | Users think by category and queue         | Category tabs + sheet, not card grid
 * Request Drafts            | What drafts need completion?            | Draft recovery workspace        | Drafts are incomplete records             | Checklist recovery, not sheet table
 * Request Status            | Where is my request now?                | Lifecycle sheet                 | Request movement through stages           | Stepper + lifecycle sheet
 * Pending Information       | What info is missing?                   | Missing-info resolution desk    | Resolving missing information             | Response workspace, not category sheet
 * Request Closure Status  | Is request ready to close?              | Request closure checkpoint      | Closure verification and evidence         | Checkpoint tabs, not lifecycle
 *
 * Working Session Actions   | Are session actions linked to work?     | Session action conversion sheet | Convert actions to governed records       | Session list + conversion panel
 * Meeting Follow-ups        | What decisions were made?               | Meeting follow-up register      | Meeting context preserved                 | Grouped by meeting, not session layout
 * Assigned Follow-ups       | What's due?                             | Follow-up ownership sheet       | Act on ownership and next action          | Ownership toggles, not meeting groups
 * Overdue Follow-ups        | What needs recovery?                    | Overdue recovery register       | Age = urgency for recovery                | Ageing buckets, not ownership sheet
 * Completed Follow-ups      | Was follow-up completed with outcome?   | Follow-up completion ledger     | Proof and traceability                    | Read-only expandable ledger
 *
 * Active Blockers           | What blockers need resolution?          | Blocker resolution desk         | Severity drives intervention              | Severity rail + resolution panel
 * Blocker Ageing            | How long are blockers open?             | Ageing analysis sheet           | Time pressure and patterns                | Age buckets + insights, not severity-first
 * SLA At Risk               | What's about to breach?                 | SLA countdown sheet             | Time remaining is critical                | Countdown badges, not age/severity
 * SLA Breached              | What breaches need recovery?            | Breach recovery workspace       | Recovery planning required                | Recovery plan editor, not countdown
 * SLA Resolved              | Was SLA resolved properly?              | SLA resolution ledger           | Proof and learning from resolution        | Quality filters + recurrence panel
 *
 * Decision Log              | What decisions were made?               | Decision register workbook      | Governance trail with decision brief      | Source filter + register sheet
 * Decision Status           | Is decision actioned?                   | Decision status control sheet   | Controlled status transitions             | Status tabs + rationale, not source filter
 * Linked Tasks/Requests     | Is decision linked to work?             | Traceability workbook           | Validate decisions became governed work   | Decision selector + gap panel
 * Outcome Progress          | Is outcome being achieved?              | Outcome progress workbook       | Sheet + narrative progress context        | Progress cells + narrative panel
 * Outcome Evidence          | Is there proof of outcome?              | Evidence review ledger          | Evidence review and document handling     | Status filter + review panel
 */
