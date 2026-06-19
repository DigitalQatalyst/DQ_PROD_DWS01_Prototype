import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  ClipboardList,
  FileSearch,
  History,
  Link as LinkIcon,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DqButton, DqIconButton } from '../components/DqButton';

type ServiceRequestStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'In Fulfilment'
  | 'New'
  | 'In Review'
  | 'Triaged'
  | 'Unassigned'
  | 'Assigned'
  | 'In Progress'
  | 'Pending Information'
  | 'Awaiting Info'
  | 'On Hold'
  | 'At Risk'
  | 'Breached'
  | 'Overdue'
  | 'Escalated'
  | 'Ready for Closure'
  | 'Closure Review'
  | 'Completed'
  | 'Closed'
  | 'Reopened'
  | 'Cancelled';

type ServiceSlaStatus = 'On Track' | 'At Risk' | 'Breached' | 'Paused' | 'Resolved';

type ServiceRequest = {
  id: string;
  title: string;
  requester: string;
  owner: string;
  queue: string;
  status: ServiceRequestStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  sla: ServiceSlaStatus;
  updated: string;
  nextAction: string;
  service?: string;
  category?: string;
  requesterTeam?: string;
  submittedOn?: string;
  pendingAction?: string;
  dueDate?: string;
  latestUpdate?: string;
  updatedBy?: string;
  requiredInfo?: string;
  missingInformation?: string;
  escalationStatus?: string;
  activitySummary?: string;
  requestedBy?: string;
  closedOn?: string;
  closureStatus?: string;
  rating?: number;
  requestedFor?: string;
  fulfilmentOwner?: string;
  ownerTeam?: string;
  createdAt?: string;
  expectedResolution?: string;
  description?: string;
  requiredInfoPrompt?: string;
  feedback?: string;
};

type RequestComment = { id: string; author: string; body: string; timestamp: string };
type RequestAttachment = { id: string; name: string; type: string; addedBy: string; addedAt: string; status: string };
type RequestActivity = { id: string; actor: string; action: string; timestamp: string };
type RequestTimelineEvent = { id: string; label: string; timestamp: string; actor?: string };

export type ServiceHubView = 'overview' | 'my-requests' | 'pending-actions';
export type ServiceQueueView =
  | 'central-support-queue'
  | 'fulfilment-owner-queue'
  | 'assigned-requests'
  | 'pending-information'
  | 'sla-queue-view'
  | 'closure-review-queue';

const currentUser = 'Amina Hassan';
const savedViewStorageKey = 'dws-service-hub-saved-view';
const serviceHubStorageKey = 'local_my_requests';

function formatHubDate(value?: string): string {
  if (!value) return 'Today';
  if (!value.includes('T')) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Today';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function mapUrgencyToPriority(urgency?: string): ServiceRequest['priority'] {
  const map: Record<string, ServiceRequest['priority']> = {
    Low: 'Low',
    Normal: 'Medium',
    Medium: 'Medium',
    High: 'High',
    Critical: 'Critical',
  };
  return map[urgency ?? 'Normal'] ?? 'Medium';
}

function mapStoredToServiceRequest(record: Record<string, unknown>): ServiceRequest {
  const status = (record.status as ServiceRequestStatus) || 'Submitted';
  const submittedOn = formatHubDate(record.submittedAt as string);

  return {
    id: record.id as string,
    title: (record.title as string) || (record.service as string) || 'Unknown Request',
    requester: (record.requester as string) || currentUser,
    owner: (record.owner as string) || 'Unassigned',
    queue: (record.queue as string) || 'Central Support Queue',
    service: record.service as string,
    category: record.category as string,
    status,
    priority: mapUrgencyToPriority((record.priority as string) || (record.urgency as string)),
    sla: 'On Track',
    updated: submittedOn,
    submittedOn,
    nextAction: status === 'Draft' ? 'Complete and submit draft' : 'Awaiting fulfilment update',
    description: (record.expectedOutcome as string) || '',
    fulfilmentOwner: record.owner as string,
    ownerTeam: record.category as string,
    createdAt: submittedOn,
    requestedFor: currentUser,
  };
}

function loadStoredMyServiceRequests(): ServiceRequest[] {
  try {
    const raw = JSON.parse(localStorage.getItem(serviceHubStorageKey) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map((record) => mapStoredToServiceRequest(record as Record<string, unknown>));
  } catch {
    return [];
  }
}

// Requester-facing requests submitted by the logged-in user. These power the Service Hub tabs.
const seedMyServiceRequests: ServiceRequest[] = [
  {
    id: 'REQ-2024-0587',
    title: 'Access to Finance Dashboard',
    requester: currentUser,
    owner: 'Maya Khan',
    queue: 'Fulfilment Owner Queue',
    service: 'Business Intelligence',
    category: 'Business Intelligence',
    status: 'In Progress',
    sla: 'On Track',
    priority: 'High',
    submittedOn: '12 May 2024',
    updated: '14 May 2024',
    nextAction: 'Provide cost centre details',
    pendingAction: 'Provide cost centre details',
    dueDate: '17 May 2024',
    latestUpdate: 'Fulfilment owner requested cost centre details',
    updatedBy: 'Maya Khan',
    requestedFor: currentUser,
    fulfilmentOwner: 'Maya Khan',
    ownerTeam: 'Business Intelligence',
    createdAt: '12 May 2024 at 09:15',
    expectedResolution: '17 May 2024',
    description:
      'I need access to the Finance Dashboard to monitor budget vs actuals, cash flow, and forecast performance. This will help me prepare monthly management reports and support decision-making for upcoming planning cycles.',
    requiredInfoPrompt: 'Please provide the cost centre(s) you need access to.',
  },
  {
    id: 'REQ-2024-0521',
    title: 'User Account Access',
    requester: currentUser,
    owner: 'Sara Khan',
    queue: 'Closure Review Queue',
    service: 'IAM Services',
    category: 'IAM Services',
    status: 'Completed',
    sla: 'Resolved',
    priority: 'Medium',
    submittedOn: '05 May 2024',
    updated: '07 May 2024',
    nextAction: 'View closure',
    latestUpdate: 'Request completed and closed',
    updatedBy: 'Sara Khan',
    closedOn: '07 May 2024',
    closureStatus: 'Resolved',
    rating: 5,
    requestedFor: currentUser,
    fulfilmentOwner: 'Sara Khan',
    ownerTeam: 'IAM Services',
    createdAt: '05 May 2024 at 11:40',
    expectedResolution: '08 May 2024',
    description: 'Requesting standard user account access to the IAM portal so I can manage my workspace credentials and access approved applications.',
    feedback: 'Resolved quickly and the access works as expected. Thank you.',
  },
  {
    id: 'REQ-2024-0499',
    title: 'Data Extract Request',
    requester: currentUser,
    owner: 'Grace Wanjiru',
    queue: 'Pending Information',
    service: 'Data Services',
    category: 'Data Services',
    status: 'Awaiting Info',
    sla: 'Paused',
    priority: 'Medium',
    submittedOn: '02 May 2024',
    updated: '14 May 2024',
    nextAction: 'Provide missing information',
    pendingAction: 'Provide missing information',
    dueDate: '16 May 2024',
    latestUpdate: 'Service team requested missing information',
    updatedBy: 'Grace Wanjiru',
    requiredInfo: 'Target dataset and date range',
    requestedBy: 'Data Services Team',
    requestedFor: currentUser,
    fulfilmentOwner: 'Grace Wanjiru',
    ownerTeam: 'Data Services',
    createdAt: '02 May 2024 at 14:05',
    expectedResolution: '16 May 2024',
    description: 'Please extract the quarterly sales dataset so I can reconcile regional revenue figures against the finance ledger for the management pack.',
    requiredInfoPrompt: 'Please provide the target dataset and the date range you need extracted.',
  },
  {
    id: 'REQ-2024-0433',
    title: 'Report Issue',
    requester: currentUser,
    owner: 'Omar Ali',
    queue: 'Assigned Requests',
    service: 'Reporting Services',
    category: 'Reporting Services',
    status: 'On Hold',
    sla: 'Paused',
    priority: 'Low',
    submittedOn: '28 Apr 2024',
    updated: '10 May 2024',
    nextAction: 'Awaiting service team update',
    latestUpdate: 'Placed on hold pending service team update',
    updatedBy: 'Omar Ali',
    requestedFor: currentUser,
    fulfilmentOwner: 'Omar Ali',
    ownerTeam: 'Reporting Services',
    createdAt: '28 Apr 2024 at 08:30',
    expectedResolution: '15 May 2024',
    description: 'A scheduled report is failing to render the latest figures. Please investigate the data refresh and restore the correct output.',
  },
  {
    id: 'REQ-2024-0387',
    title: 'Software Installation',
    requester: currentUser,
    owner: 'Workplace Services',
    queue: 'Closure Review Queue',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'Completed',
    sla: 'Resolved',
    priority: 'Low',
    submittedOn: '22 Apr 2024',
    updated: '24 Apr 2024',
    nextAction: 'Rate service',
    pendingAction: 'Submit service rating',
    dueDate: '01 May 2024',
    latestUpdate: 'Software installed and request completed',
    updatedBy: 'Workplace Services',
    closedOn: '24 Apr 2024',
    closureStatus: 'Resolved',
    requestedFor: currentUser,
    fulfilmentOwner: 'Workplace Services',
    ownerTeam: 'Workplace Services',
    createdAt: '22 Apr 2024 at 16:20',
    expectedResolution: '25 Apr 2024',
    description: 'Please install the approved analytics desktop software on my workstation so I can run the reporting toolset locally.',
  },
];

// Operational queue requests used by the Request Queues pages. Each record carries
// enough context to render the shared queue table, filters, and the request detail view.
const serviceRequests: ServiceRequest[] = [
  {
    id: 'REQ-2024-0614',
    title: 'Employee Record Update',
    requester: 'Daniel Otieno',
    requesterTeam: 'People Operations',
    owner: 'Central Support',
    fulfilmentOwner: 'Unassigned',
    ownerTeam: 'Central Support',
    queue: 'Central Support Queue',
    service: 'HR Services',
    category: 'HR Services',
    status: 'New',
    priority: 'Medium',
    sla: 'On Track',
    submittedOn: '14 May 2024',
    dueDate: '20 May 2024',
    updated: '14 May 2024',
    createdAt: '14 May 2024 at 08:10',
    expectedResolution: '20 May 2024',
    nextAction: 'Triage and assign owner',
    escalationStatus: 'Not escalated',
    activitySummary: 'New request awaiting first review by central support.',
    description: 'Please update my recorded job title and reporting line following an internal team move.',
  },
  {
    id: 'REQ-2024-0632',
    title: 'Knowledge Article Correction',
    requester: 'Lina Haddad',
    requesterTeam: 'Knowledge Office',
    owner: 'Central Support',
    fulfilmentOwner: 'Unassigned',
    ownerTeam: 'Knowledge Services',
    queue: 'Central Support Queue',
    service: 'Knowledge Services',
    category: 'Knowledge Services',
    status: 'In Review',
    priority: 'Low',
    sla: 'On Track',
    submittedOn: '13 May 2024',
    dueDate: '21 May 2024',
    updated: '15 May 2024',
    createdAt: '13 May 2024 at 11:25',
    expectedResolution: '21 May 2024',
    nextAction: 'Confirm correction and route to owner',
    escalationStatus: 'Not escalated',
    activitySummary: 'Under first review to confirm the correct knowledge owner.',
    description: 'A published knowledge article references an outdated approval workflow and needs correcting.',
  },
  {
    id: 'REQ-2024-0590',
    title: 'Provision analytics workspace access',
    requester: 'Rohan Patel',
    requesterTeam: 'Analytics',
    owner: 'Central Support',
    fulfilmentOwner: 'Unassigned',
    ownerTeam: 'Central Support',
    queue: 'Central Support Queue',
    service: 'Platform Support',
    category: 'Platform Support',
    status: 'New',
    priority: 'High',
    sla: 'At Risk',
    submittedOn: '12 May 2024',
    dueDate: '16 May 2024',
    updated: '15 May 2024',
    createdAt: '12 May 2024 at 09:40',
    expectedResolution: '16 May 2024',
    nextAction: 'First review required',
    escalationStatus: 'Not escalated',
    activitySummary: 'Unassigned request approaching its first-response target.',
    description: 'Request access to the shared analytics workspace to support quarterly reporting.',
  },
  {
    id: 'REQ-2024-0545',
    title: 'Duplicate license request',
    requester: 'Karim Saleh',
    requesterTeam: 'Operations',
    owner: 'Central Support',
    fulfilmentOwner: 'Central Support',
    ownerTeam: 'Central Support',
    queue: 'Central Support Queue',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'Cancelled',
    priority: 'Low',
    sla: 'Resolved',
    submittedOn: '06 May 2024',
    dueDate: '12 May 2024',
    updated: '08 May 2024',
    closedOn: '08 May 2024',
    closureStatus: 'Cancelled',
    createdAt: '06 May 2024 at 15:05',
    expectedResolution: '12 May 2024',
    nextAction: 'No action required',
    escalationStatus: 'Not escalated',
    activitySummary: 'Cancelled as a duplicate of an existing license request.',
    description: 'Duplicate request for a software license already provisioned under another ticket.',
  },
  {
    id: 'REQ-2024-0660',
    title: 'Admin Coordination Support',
    requester: 'Sophie Laurent',
    requesterTeam: 'Executive Office',
    owner: 'Maya Khan',
    fulfilmentOwner: 'Maya Khan',
    ownerTeam: 'Business Intelligence',
    queue: 'Assigned Requests',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'Assigned',
    priority: 'Medium',
    sla: 'On Track',
    submittedOn: '13 May 2024',
    dueDate: '19 May 2024',
    updated: '15 May 2024',
    createdAt: '13 May 2024 at 10:00',
    expectedResolution: '19 May 2024',
    nextAction: 'Begin coordination tasks',
    latestUpdate: 'Assigned to Maya Khan for handling',
    updatedBy: 'Central Support',
    escalationStatus: 'Not escalated',
    activitySummary: 'Assigned to fulfilment owner and ready to start.',
    description: 'Coordination support required to schedule a cross-team operational review.',
  },
  {
    id: 'REQ-2024-0605',
    title: 'Finance report data correction',
    requester: 'Grace Wanjiru',
    requesterTeam: 'Finance',
    owner: 'Omar Ali',
    fulfilmentOwner: 'Omar Ali',
    ownerTeam: 'Reporting Services',
    queue: 'Assigned Requests',
    service: 'Reporting Services',
    category: 'Reporting Services',
    status: 'In Progress',
    priority: 'Medium',
    sla: 'On Track',
    submittedOn: '11 May 2024',
    dueDate: '18 May 2024',
    updated: '15 May 2024',
    createdAt: '11 May 2024 at 13:15',
    expectedResolution: '18 May 2024',
    nextAction: 'Apply data correction',
    latestUpdate: 'Investigating the source dataset mismatch',
    updatedBy: 'Omar Ali',
    escalationStatus: 'Not escalated',
    activitySummary: 'Fulfilment owner is actively working the correction.',
    description: 'A monthly finance report shows incorrect totals after the latest data refresh.',
  },
  {
    id: 'REQ-2024-0640',
    title: 'Access removal for leaver',
    requester: 'Daniel Otieno',
    requesterTeam: 'People Operations',
    owner: 'Sara Khan',
    fulfilmentOwner: 'Sara Khan',
    ownerTeam: 'IAM Services',
    queue: 'Assigned Requests',
    service: 'IAM Services',
    category: 'IAM Services',
    status: 'Assigned',
    priority: 'High',
    sla: 'At Risk',
    submittedOn: '12 May 2024',
    dueDate: '16 May 2024',
    updated: '15 May 2024',
    createdAt: '12 May 2024 at 16:45',
    expectedResolution: '16 May 2024',
    nextAction: 'Revoke access before due date',
    latestUpdate: 'Access revocation checklist started',
    updatedBy: 'Sara Khan',
    escalationStatus: 'Not escalated',
    activitySummary: 'Assigned request at risk of breaching its SLA target.',
    description: 'Remove all system access for a leaving employee ahead of their final working day.',
  },
  {
    id: 'REQ-2024-0560',
    title: 'Mailbox quota increase',
    requester: 'Karim Saleh',
    requesterTeam: 'Operations',
    owner: 'Workplace Services',
    fulfilmentOwner: 'Workplace Services',
    ownerTeam: 'Workplace Services',
    queue: 'Assigned Requests',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'On Hold',
    priority: 'Low',
    sla: 'Paused',
    submittedOn: '09 May 2024',
    dueDate: '17 May 2024',
    updated: '14 May 2024',
    createdAt: '09 May 2024 at 09:20',
    expectedResolution: '17 May 2024',
    nextAction: 'Awaiting infrastructure window',
    latestUpdate: 'Placed on hold pending a maintenance window',
    updatedBy: 'Workplace Services',
    escalationStatus: 'Not escalated',
    activitySummary: 'On hold while waiting for a scheduled change window.',
    description: 'Increase the shared mailbox storage quota for the operations distribution list.',
  },
  {
    id: 'REQ-2024-0651',
    title: 'Data extract for audit',
    requester: 'Priya Nair',
    requesterTeam: 'Governance',
    owner: 'Grace Wanjiru',
    fulfilmentOwner: 'Grace Wanjiru',
    ownerTeam: 'Data Services',
    queue: 'Pending Information',
    service: 'Data Services',
    category: 'Data Services',
    status: 'Awaiting Info',
    priority: 'Medium',
    sla: 'Paused',
    submittedOn: '10 May 2024',
    dueDate: '17 May 2024',
    updated: '15 May 2024',
    createdAt: '10 May 2024 at 14:30',
    expectedResolution: '17 May 2024',
    nextAction: 'Send reminder for missing details',
    missingInformation: 'Audit scope and reporting period',
    requiredInfo: 'Audit scope and reporting period',
    requiredInfoPrompt: 'Please confirm the audit scope and the reporting period for the extract.',
    latestUpdate: 'Requested missing audit scope from requester',
    updatedBy: 'Grace Wanjiru',
    escalationStatus: 'Not escalated',
    activitySummary: 'SLA paused while waiting for requester information.',
    description: 'Provide a data extract to support an upcoming internal governance audit.',
  },
  {
    id: 'REQ-2024-0670',
    title: 'Dashboard permission change',
    requester: 'Lina Haddad',
    requesterTeam: 'Knowledge Office',
    owner: 'Maya Khan',
    fulfilmentOwner: 'Maya Khan',
    ownerTeam: 'Business Intelligence',
    queue: 'Pending Information',
    service: 'Business Intelligence',
    category: 'Business Intelligence',
    status: 'Awaiting Info',
    priority: 'Low',
    sla: 'Paused',
    submittedOn: '12 May 2024',
    dueDate: '19 May 2024',
    updated: '15 May 2024',
    createdAt: '12 May 2024 at 10:50',
    expectedResolution: '19 May 2024',
    nextAction: 'Awaiting approver confirmation',
    missingInformation: 'Manager approval for elevated access',
    requiredInfo: 'Manager approval for elevated access',
    requiredInfoPrompt: 'Please attach manager approval for the requested dashboard permission change.',
    latestUpdate: 'Awaiting manager approval evidence',
    updatedBy: 'Maya Khan',
    escalationStatus: 'Not escalated',
    activitySummary: 'Paused pending supporting approval evidence.',
    description: 'Change dashboard permissions to allow editing of shared reporting views.',
  },
  {
    id: 'REQ-2024-0702',
    title: 'DWS Platform Access Issue',
    requester: 'David Mwangi',
    requesterTeam: 'Field Operations',
    owner: 'Omar Ali',
    fulfilmentOwner: 'Omar Ali',
    ownerTeam: 'Platform Support',
    queue: 'SLA Queue View',
    service: 'Platform Support',
    category: 'Platform Support',
    status: 'Escalated',
    priority: 'Critical',
    sla: 'Breached',
    submittedOn: '11 May 2024',
    dueDate: '13 May 2024',
    updated: '15 May 2024',
    createdAt: '11 May 2024 at 07:55',
    expectedResolution: '13 May 2024',
    nextAction: 'Resolve escalation urgently',
    escalationStatus: 'Escalated to platform lead',
    activitySummary: 'SLA breached and escalated for urgent resolution.',
    description: 'Users cannot sign in to the DWS platform, blocking field operations.',
  },
  {
    id: 'REQ-2024-0688',
    title: 'SLA breach on payroll integration',
    requester: 'Sophie Laurent',
    requesterTeam: 'Finance',
    owner: 'Sara Khan',
    fulfilmentOwner: 'Sara Khan',
    ownerTeam: 'Data Services',
    queue: 'SLA Queue View',
    service: 'Data Services',
    category: 'Data Services',
    status: 'Escalated',
    priority: 'Critical',
    sla: 'Breached',
    submittedOn: '10 May 2024',
    dueDate: '14 May 2024',
    updated: '15 May 2024',
    createdAt: '10 May 2024 at 08:30',
    expectedResolution: '14 May 2024',
    nextAction: 'Engage integration owner',
    escalationStatus: 'Escalated to data lead',
    activitySummary: 'Breached integration SLA escalated to the data lead.',
    description: 'The nightly payroll integration has failed for two consecutive runs.',
  },
  {
    id: 'REQ-2024-0695',
    title: 'Overdue software license renewal',
    requester: 'Karim Saleh',
    requesterTeam: 'Operations',
    owner: 'Workplace Services',
    fulfilmentOwner: 'Workplace Services',
    ownerTeam: 'Workplace Services',
    queue: 'SLA Queue View',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'In Progress',
    priority: 'High',
    sla: 'At Risk',
    submittedOn: '09 May 2024',
    dueDate: '15 May 2024',
    updated: '15 May 2024',
    createdAt: '09 May 2024 at 12:10',
    expectedResolution: '15 May 2024',
    nextAction: 'Confirm renewal with vendor',
    escalationStatus: 'Not escalated',
    activitySummary: 'In progress but at risk of missing the renewal deadline.',
    description: 'Renew an enterprise software license before it lapses at month end.',
  },
  {
    id: 'REQ-2024-0712',
    title: 'New starter equipment request',
    requester: 'Daniel Otieno',
    requesterTeam: 'People Operations',
    owner: 'Workplace Services',
    fulfilmentOwner: 'Workplace Services',
    ownerTeam: 'Workplace Services',
    queue: 'Closure Review Queue',
    service: 'Workplace Services',
    category: 'Workplace Services',
    status: 'Ready for Closure',
    priority: 'Medium',
    sla: 'On Track',
    submittedOn: '08 May 2024',
    dueDate: '16 May 2024',
    updated: '15 May 2024',
    createdAt: '08 May 2024 at 09:00',
    expectedResolution: '16 May 2024',
    nextAction: 'Review and confirm closure',
    latestUpdate: 'Equipment delivered and set up',
    updatedBy: 'Workplace Services',
    escalationStatus: 'Not escalated',
    activitySummary: 'Work completed and marked ready for closure review.',
    description: 'Provision laptop and peripherals for a new starter joining the operations team.',
  },
  {
    id: 'REQ-2024-0725',
    title: 'Reporting access closed pending rating',
    requester: 'Priya Nair',
    requesterTeam: 'Governance',
    owner: 'Omar Ali',
    fulfilmentOwner: 'Omar Ali',
    ownerTeam: 'Reporting Services',
    queue: 'Closure Review Queue',
    service: 'Reporting Services',
    category: 'Reporting Services',
    status: 'Closed',
    priority: 'Low',
    sla: 'Resolved',
    submittedOn: '05 May 2024',
    dueDate: '12 May 2024',
    updated: '13 May 2024',
    closedOn: '13 May 2024',
    closureStatus: 'Resolved',
    createdAt: '05 May 2024 at 10:35',
    expectedResolution: '12 May 2024',
    nextAction: 'Awaiting requester rating',
    latestUpdate: 'Request closed, rating not yet submitted',
    updatedBy: 'Omar Ali',
    escalationStatus: 'Not escalated',
    activitySummary: 'Closed and resolved but still awaiting a service rating.',
    description: 'Reporting access granted and the request was closed; a rating is still pending.',
  },
  {
    id: 'REQ-2024-0731',
    title: 'Service Request Reopened After Closure',
    requester: 'David Mwangi',
    requesterTeam: 'Field Operations',
    owner: 'Maya Khan',
    fulfilmentOwner: 'Maya Khan',
    ownerTeam: 'Platform Support',
    queue: 'Closure Review Queue',
    service: 'Platform Support',
    category: 'Platform Support',
    status: 'Reopened',
    priority: 'High',
    sla: 'At Risk',
    submittedOn: '07 May 2024',
    dueDate: '16 May 2024',
    updated: '15 May 2024',
    createdAt: '07 May 2024 at 14:20',
    expectedResolution: '16 May 2024',
    nextAction: 'Re-review closure outcome',
    latestUpdate: 'Reopened because the original issue recurred',
    updatedBy: 'David Mwangi',
    escalationStatus: 'Not escalated',
    activitySummary: 'Reopened after closure and needs closure review again.',
    description: 'The previously closed platform issue has returned and the request was reopened.',
  },
];

function mergeMyServiceRequests(): ServiceRequest[] {
  const stored = loadStoredMyServiceRequests();
  const seedIds = new Set(seedMyServiceRequests.map((request) => request.id));
  return [...stored.filter((request) => !seedIds.has(request.id)), ...seedMyServiceRequests];
}

function getAllRequests(): ServiceRequest[] {
  return [...mergeMyServiceRequests(), ...serviceRequests];
}

const queueMeta: Record<ServiceQueueView, { overline: string; title: string; description: string }> = {
  'central-support-queue': {
    overline: 'REQUEST QUEUES',
    title: 'Central Support Queue',
    description: 'Review new, unassigned, and triage-ready service requests before they move into fulfilment.',
  },
  'fulfilment-owner-queue': {
    overline: 'REQUEST QUEUES',
    title: 'Fulfilment Owner Queue',
    description: 'Review request workload by fulfilment owner, team, and active handling state.',
  },
  'assigned-requests': {
    overline: 'REQUEST QUEUES',
    title: 'Assigned Requests',
    description: 'Track assigned service requests that are already being handled by fulfilment owners or teams.',
  },
  'pending-information': {
    overline: 'REQUEST QUEUES',
    title: 'Pending Information',
    description: 'Review requests waiting for missing information, requester input, or supporting evidence.',
  },
  'sla-queue-view': {
    overline: 'REQUEST QUEUES',
    title: 'SLA Queue View',
    description: 'Monitor service requests that are at risk, breached, overdue, escalated, or paused.',
  },
  'closure-review-queue': {
    overline: 'REQUEST QUEUES',
    title: 'Closure Review Queue',
    description: 'Review service requests that are ready for closure, awaiting review, pending rating, or reopened.',
  },
};

// Queue filtering logic. A request can belong to one or more logical queue views
// based on its status, SLA state, owner, and closure state.
function requestsForQueue(view: ServiceQueueView): ServiceRequest[] {
  switch (view) {
    case 'central-support-queue':
      return serviceRequests.filter((request) =>
        ['New', 'In Review', 'Triaged', 'Unassigned'].includes(request.status) ||
        request.fulfilmentOwner === 'Unassigned',
      );
    case 'fulfilment-owner-queue':
      return serviceRequests.filter((request) =>
        Boolean(request.fulfilmentOwner) &&
        request.fulfilmentOwner !== 'Unassigned' &&
        ['Assigned', 'In Progress', 'On Hold', 'Awaiting Info', 'Reopened', 'Ready for Closure'].includes(request.status),
      );
    case 'assigned-requests':
      return serviceRequests.filter((request) =>
        ['Assigned', 'In Progress', 'On Hold', 'Reopened'].includes(request.status) ||
        request.queue === 'Assigned Requests',
      );
    case 'pending-information':
      return serviceRequests.filter((request) =>
        request.status === 'Awaiting Info' ||
        request.status === 'Pending Information' ||
        Boolean(request.missingInformation) ||
        (request.sla === 'Paused' && Boolean(request.missingInformation)),
      );
    case 'sla-queue-view':
      return serviceRequests.filter((request) =>
        ['At Risk', 'Breached', 'Paused'].includes(request.sla) ||
        ['Escalated', 'Overdue'].includes(request.status),
      );
    case 'closure-review-queue':
      return serviceRequests.filter((request) =>
        ['Ready for Closure', 'Closure Review', 'Closed', 'Completed', 'Reopened'].includes(request.status),
      );
    default:
      return serviceRequests;
  }
}

/* -------------------------------------------------------------------------- */
/*                               Service Hub                                   */
/* -------------------------------------------------------------------------- */

type HubTab = 'My Requests' | 'Pending Actions' | 'Recently Updated' | 'Awaiting Information' | 'Closed / Completed';

const hubTabs: HubTab[] = ['My Requests', 'Pending Actions', 'Recently Updated', 'Awaiting Information', 'Closed / Completed'];

type HubFilters = {
  search: string;
  category: string;
  status: string;
  sla: string;
  priority: string;
  owner: string;
  dateRange: string;
};

type HubSort = { key: string | null; direction: 'asc' | 'desc' };

type HubColumn = {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center';
  sortable?: boolean;
  primary?: boolean;
  render: (request: ServiceRequest) => ReactNode;
  sortValue?: (request: ServiceRequest) => string | number;
};

const defaultFilters: HubFilters = {
  search: '',
  category: 'All',
  status: 'All',
  sla: 'All',
  priority: 'All',
  owner: 'All',
  dateRange: 'All dates',
};

const defaultSort: HubSort = { key: null, direction: 'asc' };
const pageSize = 8;

const monthIndex: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseRequestDate(value?: string): number {
  if (!value) return 0;
  const parts = value.trim().split(' ');
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = monthIndex[parts[1] as keyof typeof monthIndex];
    const year = Number(parts[2]);
    if (!Number.isNaN(day) && month !== undefined && !Number.isNaN(year)) {
      return new Date(year, month, day).getTime();
    }
  }
  return 0;
}

function monthLabel(value?: string): string | null {
  if (!value) return null;
  const parts = value.trim().split(' ');
  if (parts.length === 3) return `${parts[1]} ${parts[2]}`;
  return null;
}

export function ServicesHubPage({ view }: { view?: ServiceHubView }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const initialTab: HubTab = view === 'pending-actions' ? 'Pending Actions' : 'My Requests';

  const [myServiceRequests, setMyServiceRequests] = useState<ServiceRequest[]>(() => mergeMyServiceRequests());
  const [activeTab, setActiveTab] = useState<HubTab>(initialTab);
  const [filters, setFilters] = useState<HubFilters>(defaultFilters);
  const [sort, setSort] = useState<HubSort>(defaultSort);
  const [page, setPage] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showRightRail, setShowRightRail] = useState(true);

  useEffect(() => {
    const refresh = () => setMyServiceRequests(mergeMyServiceRequests());
    refresh();
    window.addEventListener('local_requests_updated', refresh);
    return () => window.removeEventListener('local_requests_updated', refresh);
  }, []);

  useEffect(() => {
    setActiveTab(view === 'pending-actions' ? 'Pending Actions' : 'My Requests');
  }, [view]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, filters]);

  const categoryOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.category)), [myServiceRequests]);
  const ownerOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.owner)), [myServiceRequests]);
  const statusOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.status)), [myServiceRequests]);
  const slaOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.sla)), [myServiceRequests]);
  const priorityOptions = useMemo(() => buildOptions(myServiceRequests.map((item) => item.priority)), [myServiceRequests]);
  const dateRangeOptions = useMemo(() => {
    const labels = myServiceRequests
      .map((item) => monthLabel(item.submittedOn))
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => parseRequestDate(`01 ${b}`) - parseRequestDate(`01 ${a}`));
    return ['All dates', ...Array.from(new Set(labels))];
  }, [myServiceRequests]);

  const tabRequests = useMemo(() => requestsForTab(activeTab, myServiceRequests), [activeTab, myServiceRequests]);
  const columns = useMemo(() => columnsForTab(activeTab), [activeTab]);

  const filteredRequests = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const result = tabRequests.filter((request) => {
      const haystack = [
        request.id,
        request.title,
        request.service,
        request.category,
        request.status,
        request.sla,
        request.owner,
        request.requester,
        request.nextAction,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.category !== 'All' && request.category !== filters.category) return false;
      if (filters.status !== 'All' && request.status !== filters.status) return false;
      if (filters.sla !== 'All' && request.sla !== filters.sla) return false;
      if (filters.priority !== 'All' && request.priority !== filters.priority) return false;
      if (filters.owner !== 'All' && request.owner !== filters.owner) return false;
      if (filters.dateRange !== 'All dates' && monthLabel(request.submittedOn) !== filters.dateRange) return false;
      return true;
    });

    if (!sort.key) return result;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return result;
    const direction = sort.direction === 'asc' ? 1 : -1;
    return [...result].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * direction;
      return String(left).localeCompare(String(right)) * direction;
    });
  }, [tabRequests, filters, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRequests = filteredRequests.slice((safePage - 1) * pageSize, safePage * pageSize);

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.sla !== 'All' ||
    filters.priority !== 'All' ||
    filters.owner !== 'All' ||
    filters.dateRange !== 'All dates';

  const summary = {
    total: myServiceRequests.length,
    open: myServiceRequests.filter((item) => !['Completed', 'Closed', 'Draft'].includes(item.status)).length,
    awaiting: myServiceRequests.filter((item) => item.status === 'Awaiting Info').length,
    completed: myServiceRequests.filter((item) => ['Completed', 'Closed'].includes(item.status)).length,
  };

  const recentlyUpdated = useMemo(
    () => [...myServiceRequests].sort((a, b) => parseRequestDate(b.updated) - parseRequestDate(a.updated)).slice(0, 3),
    [myServiceRequests],
  );

  const updateFilter = (key: keyof HubFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => {
    setFilters(defaultFilters);
    setSort(defaultSort);
  };
  const openRequest = (request: ServiceRequest) => navigate(`/services/requests/${request.id}`);

  useEffect(() => {
    if (!highlightId || myServiceRequests.length === 0) return;
    const match = myServiceRequests.find((request) => request.id === highlightId);
    if (!match) return;
    setActiveTab('My Requests');
    openRequest(match);
    setSearchParams({}, { replace: true });
  }, [highlightId, myServiceRequests, navigate, setSearchParams]);
  const onSort = (key: string) =>
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));

  const newRequest = () => navigate('/marketplace/services');
  const saveView = () => {
    localStorage.setItem(savedViewStorageKey, JSON.stringify({ activeTab, filters }));
    toast.success('Service view saved');
  };

  return (
    <div className="w-full px-6 py-6 pb-12 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link className="font-semibold text-primary hover:text-secondary" to="/services">Services</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-text-secondary">Service Hub</span>
      </nav>

      <header className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="dq-overline mb-2">SERVICE HUB</div>
          <h1 className="dq-page-title">Service Hub</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-primary">
            Track your submitted requests, review pending actions, and follow service request progress across DWS.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-start gap-2 xl:justify-end">
          <DqButton variant="orange" onClick={newRequest} className="h-12 px-5"><Plus size={18} strokeWidth={1.5} /> New Request</DqButton>
          <DqButton variant="navy" onClick={saveView} className="h-12 px-5"><Bookmark size={17} strokeWidth={1.5} /> Save View</DqButton>
          <DqIconButton label="Service Hub settings" onClick={() => setSettingsOpen(true)} className="h-12 w-12"><Settings size={19} strokeWidth={1.5} /></DqIconButton>
        </div>
      </header>

      <div className={`grid gap-6 ${showRightRail ? '2xl:grid-cols-[minmax(0,1fr)_360px]' : 'grid-cols-1'}`}>
        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
            <div className="px-5 pt-5">
              <h2 className="text-lg font-semibold text-primary">My Service Requests</h2>
            </div>
            <HubTabs activeTab={activeTab} onChange={setActiveTab} />
            <HubFilterBar
              filters={filters}
              categoryOptions={categoryOptions}
              statusOptions={statusOptions}
              slaOptions={slaOptions}
              priorityOptions={priorityOptions}
              ownerOptions={ownerOptions}
              dateRangeOptions={dateRangeOptions}
              onFilter={updateFilter}
              onClear={clearFilters}
            />
            <HubTable
              columns={columns}
              requests={pagedRequests}
              sort={sort}
              onSort={onSort}
              onOpen={openRequest}
              emptyState={<HubEmptyState tab={activeTab} filtersActive={filtersActive} onClear={clearFilters} onNew={newRequest} />}
            />
            {filteredRequests.length > pageSize && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                total={filteredRequests.length}
                onPrev={() => setPage((current) => Math.max(1, current - 1))}
                onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
              />
            )}
          </section>
        </main>

        {showRightRail && (
          <HubRightRail summary={summary} recent={recentlyUpdated} onOpen={openRequest} onSummaryFilter={(status) => { setActiveTab('My Requests'); updateFilter('status', status); }} />
        )}
      </div>

      <HubSettingsModal
        open={settingsOpen}
        showRightRail={showRightRail}
        onToggleRightRail={() => setShowRightRail((current) => !current)}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function HubTabs({ activeTab, onChange }: { activeTab: HubTab; onChange: (tab: HubTab) => void }) {
  return (
    <div className="dq-tabs mt-2 flex overflow-x-auto px-3" role="tablist" aria-label="Service Hub tabs">
      {hubTabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onChange(tab)}
          className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function HubFilterBar({
  filters,
  categoryOptions,
  statusOptions,
  slaOptions,
  priorityOptions,
  ownerOptions,
  dateRangeOptions,
  onFilter,
  onClear,
}: {
  filters: HubFilters;
  categoryOptions: string[];
  statusOptions: string[];
  slaOptions: string[];
  priorityOptions: string[];
  ownerOptions: string[];
  dateRangeOptions: string[];
  onFilter: (key: keyof HubFilters, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-3 border-b border-border-subtle bg-white p-4 xl:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(140px,1fr))_auto] 2xl:grid-cols-[minmax(220px,1.5fr)_repeat(6,minmax(130px,1fr))_auto]">
      <div className="relative">
        <Search size={17} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search requests..." className="dq-input h-11 pl-10" />
      </div>
      <HubFilterSelect label="Service Category" value={filters.category} options={categoryOptions} onChange={(value) => onFilter('category', value)} />
      <HubFilterSelect label="Status" value={filters.status} options={statusOptions} onChange={(value) => onFilter('status', value)} />
      <HubFilterSelect label="SLA Status" value={filters.sla} options={slaOptions} onChange={(value) => onFilter('sla', value)} />
      <HubFilterSelect label="Priority" value={filters.priority} options={priorityOptions} onChange={(value) => onFilter('priority', value)} />
      <HubFilterSelect label="Owner" value={filters.owner} options={ownerOptions} onChange={(value) => onFilter('owner', value)} />
      <HubFilterSelect label="Date Range" value={filters.dateRange} options={dateRangeOptions} onChange={(value) => onFilter('dateRange', value)} />
      <DqButton variant="outline" onClick={onClear} className="h-11 whitespace-nowrap border-border-default px-4">
        <RotateCcw size={16} strokeWidth={1.5} /> Clear Filters
      </DqButton>
    </div>
  );
}

function HubFilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <span className="absolute left-3 top-1.5 z-10 text-[11px] font-semibold text-text-muted">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-button border-[1.5px] border-border-default bg-white px-3 pb-1.5 pt-5 text-sm font-semibold text-primary outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown size={15} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
    </label>
  );
}

function HubTable({
  columns,
  requests,
  sort,
  onSort,
  onOpen,
  emptyState,
}: {
  columns: HubColumn[];
  requests: ServiceRequest[];
  sort: HubSort;
  onSort: (key: string) => void;
  onOpen: (request: ServiceRequest) => void;
  emptyState: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1080px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 text-xs font-semibold uppercase text-[#454560] ${column.align === 'center' ? 'text-center' : ''}`} style={column.width ? { width: column.width } : undefined}>
                {column.sortable ? (
                  <button onClick={() => onSort(column.key)} className="inline-flex items-center gap-1 hover:text-primary">
                    {column.label} <span className="text-[11px]">{sort.key === column.key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {requests.map((request) => (
            <tr key={`${request.id}-${columns[0].key}`} onClick={() => onOpen(request)} className="cursor-pointer transition hover:bg-navy-50">
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3.5 text-sm ${column.align === 'center' ? 'text-center' : ''}`}>
                  {column.render(request)}
                </td>
              ))}
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14">{emptyState}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function HubEmptyState({ tab, filtersActive, onClear, onNew }: { tab: HubTab; filtersActive: boolean; onClear: () => void; onNew: () => void }) {
  if (filtersActive) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No requests found</h3>
        <p className="mt-1 text-sm text-text-secondary">Try adjusting your search or clearing filters.</p>
        <DqButton variant="outline" onClick={onClear} className="mt-4">Clear Filters</DqButton>
      </div>
    );
  }
  if (tab === 'Pending Actions') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <ClipboardList size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No pending actions</h3>
        <p className="mt-1 text-sm text-text-secondary">You do not have any service request actions waiting for your response.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
      <h3 className="mt-3 text-lg font-bold text-primary">No service requests yet</h3>
      <p className="mt-1 text-sm text-text-secondary">Requests you submit through the Service Marketplace will appear here.</p>
      <DqButton variant="orange" onClick={onNew} className="mt-4">Start New Request</DqButton>
    </div>
  );
}

function Pagination({ page, totalPages, total, onPrev, onNext }: { page: number; totalPages: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border-subtle bg-white px-5 py-3">
      <span className="text-sm font-medium text-text-secondary">Page {page} of {totalPages} · {total} requests</span>
      <div className="flex gap-2">
        <DqButton variant="outline" onClick={onPrev} className="h-9 px-4" disabled={page <= 1}>Previous</DqButton>
        <DqButton variant="outline" onClick={onNext} className="h-9 px-4" disabled={page >= totalPages}>Next</DqButton>
      </div>
    </div>
  );
}

function HubRightRail({
  summary,
  recent,
  onOpen,
  onSummaryFilter,
}: {
  summary: { total: number; open: number; awaiting: number; completed: number };
  recent: ServiceRequest[];
  onOpen: (request: ServiceRequest) => void;
  onSummaryFilter: (status: string) => void;
}) {
  return (
    <aside className="space-y-5">
      <HubRailCard title="Service Summary" action={<ClipboardList size={20} strokeWidth={1.5} />}>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3 px-2 py-2 text-sm font-semibold text-primary"><span>Total Requests</span><span>{summary.total}</span></div>
          <button onClick={() => onSummaryFilter('All')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Open Requests</span><span>{summary.open}</span></button>
          <button onClick={() => onSummaryFilter('Awaiting Info')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Awaiting Information</span><span>{summary.awaiting}</span></button>
          <button onClick={() => onSummaryFilter('Completed')} className="flex w-full items-center justify-between gap-3 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50"><span>Completed Requests</span><span>{summary.completed}</span></button>
        </div>
      </HubRailCard>

      <HubRailCard title="Recently Updated" action={<History size={20} strokeWidth={1.5} />}>
        <div className="space-y-4">
          {recent.map((request) => (
            <button key={request.id} onClick={() => onOpen(request)} className="block w-full rounded-button text-left hover:bg-navy-50">
              <div className="text-sm font-bold text-info-text">{request.title}</div>
              <div className="mt-1 text-sm font-medium text-primary">{request.id} · {request.updated}</div>
            </button>
          ))}
        </div>
      </HubRailCard>

      <HubRailCard title="How it works">
        <p className="text-sm leading-6 text-text-secondary">
          Use <span className="font-semibold text-primary">My Requests</span> to track requests you submitted. Use <span className="font-semibold text-primary">Pending Actions</span> to respond to missing information, comments, closure review, or service rating requests.
        </p>
      </HubRailCard>
    </aside>
  );
}

function HubRailCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border-default bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <h2 className="dq-card-title">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function HubSettingsModal({ open, showRightRail, onToggleRightRail, onClose }: { open: boolean; showRightRail: boolean; onToggleRightRail: () => void; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/25" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-border-default bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">Service Hub Settings</h2>
          <DqIconButton label="Close Service Hub settings" onClick={onClose}><X size={18} strokeWidth={1.5} /></DqIconButton>
        </div>
        <section className="mb-4 rounded-card border border-border-subtle p-4">
          <h3 className="mb-2 text-sm font-bold text-primary">Display</h3>
          <button onClick={onToggleRightRail} className="flex w-full items-center justify-between gap-4 rounded-button px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-navy-50">
            <span>Show summary column</span>
            <span className={`relative h-6 w-11 rounded-full transition ${showRightRail ? 'bg-secondary' : 'bg-border-default'}`}>
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${showRightRail ? 'left-6' : 'left-1'}`} />
            </span>
          </button>
        </section>
        <p className="text-sm text-text-secondary">Additional Service Hub settings will be available in a future update.</p>
        <div className="mt-5 flex justify-end">
          <DqButton variant="orange" onClick={onClose}>Done</DqButton>
        </div>
      </section>
    </>
  );
}

function requestsForTab(tab: HubTab, requests: ServiceRequest[]): ServiceRequest[] {
  switch (tab) {
    case 'Pending Actions':
      return requests.filter((request) => Boolean(request.pendingAction));
    case 'Recently Updated':
      return [...requests].sort((a, b) => parseRequestDate(b.updated) - parseRequestDate(a.updated));
    case 'Awaiting Information':
      return requests.filter((request) => request.status === 'Awaiting Info');
    case 'Closed / Completed':
      return requests.filter((request) => ['Completed', 'Closed'].includes(request.status));
    case 'My Requests':
    default:
      return requests;
  }
}

const requestTitleCell = (request: ServiceRequest) => <span className="font-medium text-primary">{request.title}</span>;
const requestIdCell = (request: ServiceRequest) => <span className="font-bold text-info-text">{request.id}</span>;
const openActionCell = () => (
  <span className="whitespace-nowrap font-bold text-info-text">Open request →</span>
);

function columnsForTab(tab: HubTab): HubColumn[] {
  if (tab === 'Pending Actions') {
    return [
      { key: 'action', label: 'Action', width: '200px', render: (r) => <span className="font-semibold text-primary">{r.pendingAction}</span> },
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '220px', render: requestTitleCell },
      { key: 'service', label: 'Service', width: '160px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
      { key: 'dueDate', label: 'Due Date', width: '120px', sortable: true, render: (r) => <span className="text-primary">{r.dueDate ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.dueDate) },
      { key: 'priority', label: 'Priority', width: '110px', render: (r) => <PriorityBadge priority={r.priority} /> },
      { key: 'status', label: 'Status', width: '130px', render: (r) => <StatusBadge label={r.status} /> },
      { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
    ];
  }
  if (tab === 'Recently Updated') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '210px', render: requestTitleCell },
      { key: 'latestUpdate', label: 'Latest Update', width: '260px', render: (r) => <span className="text-text-secondary">{r.latestUpdate}</span> },
      { key: 'updatedBy', label: 'Updated By', width: '150px', render: (r) => <span className="font-semibold text-primary">{r.updatedBy}</span> },
      { key: 'updated', label: 'Last Updated', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.updated}</span>, sortValue: (r) => parseRequestDate(r.updated) },
      { key: 'status', label: 'Status', width: '130px', render: (r) => <StatusBadge label={r.status} /> },
      { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
    ];
  }
  if (tab === 'Awaiting Information') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '210px', render: requestTitleCell },
      { key: 'requiredInfo', label: 'Required Information', width: '240px', render: (r) => <span className="text-text-secondary">{r.requiredInfo}</span> },
      { key: 'requestedBy', label: 'Requested By', width: '160px', render: (r) => <span className="font-semibold text-primary">{r.requestedBy}</span> },
      { key: 'dueDate', label: 'Due Date', width: '120px', sortable: true, render: (r) => <span className="text-primary">{r.dueDate ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.dueDate) },
      { key: 'sla', label: 'SLA Status', width: '120px', render: (r) => <StatusBadge label={r.sla} /> },
      { key: 'cta', label: 'Action', width: '160px', render: () => <span className="whitespace-nowrap font-bold text-info-text">Provide Information →</span> },
    ];
  }
  if (tab === 'Closed / Completed') {
    return [
      { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
      { key: 'title', label: 'Request Title', width: '220px', render: requestTitleCell },
      { key: 'service', label: 'Service', width: '170px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
      { key: 'closedOn', label: 'Closed On', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.closedOn ?? '—'}</span>, sortValue: (r) => parseRequestDate(r.closedOn) },
      { key: 'closureStatus', label: 'Closure Status', width: '140px', render: (r) => <StatusBadge label={r.closureStatus ?? r.sla} /> },
      { key: 'rating', label: 'Rating', width: '120px', render: (r) => <Rating value={r.rating} /> },
      { key: 'cta', label: 'Action', width: '150px', render: (r) => <span className="whitespace-nowrap font-bold text-info-text">{r.rating ? 'View closure →' : 'Submit rating →'}</span> },
    ];
  }
  return [
    { key: 'id', label: 'Request ID', width: '150px', sortable: true, render: requestIdCell, sortValue: (r) => r.id },
    { key: 'title', label: 'Request Title', width: '200px', sortable: true, render: requestTitleCell, sortValue: (r) => r.title },
    { key: 'service', label: 'Service', width: '160px', render: (r) => <span className="font-medium text-primary">{r.service}</span> },
    { key: 'status', label: 'Status', width: '120px', sortable: true, render: (r) => <StatusBadge label={r.status} />, sortValue: (r) => r.status },
    { key: 'sla', label: 'SLA', width: '110px', render: (r) => <StatusBadge label={r.sla} /> },
    { key: 'priority', label: 'Priority', width: '110px', sortable: true, render: (r) => <PriorityBadge priority={r.priority} />, sortValue: (r) => priorityRank(r.priority) },
    { key: 'submittedOn', label: 'Submitted On', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.submittedOn}</span>, sortValue: (r) => parseRequestDate(r.submittedOn) },
    { key: 'updated', label: 'Last Updated', width: '130px', sortable: true, render: (r) => <span className="text-primary">{r.updated}</span>, sortValue: (r) => parseRequestDate(r.updated) },
    { key: 'nextAction', label: 'Next Action', width: '200px', render: (r) => <span className="text-text-secondary">{r.nextAction}</span> },
    { key: 'cta', label: 'Action', width: '140px', render: openActionCell },
  ];
}

function buildOptions(values: Array<string | undefined>): string[] {
  return ['All', ...Array.from(new Set(values.filter((value): value is string => Boolean(value))))];
}

function priorityRank(priority: ServiceRequest['priority']) {
  return { Low: 1, Medium: 2, High: 3, Critical: 4 }[priority];
}

function PriorityBadge({ priority }: { priority: ServiceRequest['priority'] }) {
  const tone = priority === 'Critical' || priority === 'High' ? 'text-danger' : priority === 'Medium' ? 'text-warning' : 'text-success';
  return <span className={`text-sm font-bold ${tone}`}>{priority}</span>;
}

function Rating({ value }: { value?: number }) {
  if (!value) return <span className="text-sm font-medium text-text-muted">Not rated</span>;
  return <span className="text-sm font-bold text-primary">{'★'.repeat(value)}<span className="text-text-muted">{'★'.repeat(5 - value)}</span></span>;
}

/* -------------------------------------------------------------------------- */
/*                            Request Queues                                  */
/* -------------------------------------------------------------------------- */

type QueueFilters = {
  search: string;
  category: string;
  status: string;
  sla: string;
  priority: string;
  owner: string;
  dueDate: string;
};

const defaultQueueFilters: QueueFilters = {
  search: '',
  category: 'All',
  status: 'All',
  sla: 'All',
  priority: 'All',
  owner: 'All',
  dueDate: 'All dates',
};

const queuePageSize = 8;

function queueOwner(request: ServiceRequest): string {
  return request.fulfilmentOwner || request.ownerTeam || request.owner;
}

export function ServicesQueuePage({ view }: { view: ServiceQueueView }) {
  const navigate = useNavigate();
  const meta = queueMeta[view];
  const baseRequests = useMemo(() => requestsForQueue(view), [view]);

  const [filters, setFilters] = useState<QueueFilters>(defaultQueueFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setFilters(defaultQueueFilters);
    setPage(1);
  }, [view]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const categoryOptions = useMemo(() => buildOptions(baseRequests.map((item) => item.category)), [baseRequests]);
  const statusOptions = useMemo(() => buildOptions(baseRequests.map((item) => item.status)), [baseRequests]);
  const slaOptions = useMemo(() => buildOptions(baseRequests.map((item) => item.sla)), [baseRequests]);
  const priorityOptions = useMemo(() => buildOptions(baseRequests.map((item) => item.priority)), [baseRequests]);
  const ownerOptions = useMemo(() => buildOptions(baseRequests.map((item) => queueOwner(item))), [baseRequests]);
  const dueDateOptions = useMemo(() => {
    const labels = baseRequests
      .map((item) => monthLabel(item.dueDate))
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => parseRequestDate(`01 ${a}`) - parseRequestDate(`01 ${b}`));
    return ['All dates', ...Array.from(new Set(labels))];
  }, [baseRequests]);

  const filteredRequests = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return baseRequests.filter((request) => {
      const haystack = [
        request.id,
        request.title,
        request.requester,
        request.requesterTeam,
        request.service,
        request.category,
        request.status,
        request.sla,
        request.priority,
        request.ownerTeam,
        request.fulfilmentOwner,
        request.owner,
        request.missingInformation,
        request.nextAction,
        request.activitySummary,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.category !== 'All' && request.category !== filters.category) return false;
      if (filters.status !== 'All' && request.status !== filters.status) return false;
      if (filters.sla !== 'All' && request.sla !== filters.sla) return false;
      if (filters.priority !== 'All' && request.priority !== filters.priority) return false;
      if (filters.owner !== 'All' && queueOwner(request) !== filters.owner) return false;
      if (filters.dueDate !== 'All dates' && monthLabel(request.dueDate) !== filters.dueDate) return false;
      return true;
    });
  }, [baseRequests, filters]);

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.sla !== 'All' ||
    filters.priority !== 'All' ||
    filters.owner !== 'All' ||
    filters.dueDate !== 'All dates';

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / queuePageSize));
  const safePage = Math.min(page, totalPages);
  const pagedRequests = filteredRequests.slice((safePage - 1) * queuePageSize, safePage * queuePageSize);

  const updateFilter = (key: keyof QueueFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters(defaultQueueFilters);
  const openRequest = (request: ServiceRequest) => navigate(`/services/requests/${request.id}`);

  return (
    <ServicesPageFrame
      breadcrumbs={[{ label: 'Services', route: '/services' }, { label: 'Request Queues', route: '/services/request-queues' }, { label: meta.title }]}
      overline={meta.overline}
      title={meta.title}
      description={meta.description}
      action={
        <DqButton variant="orange" onClick={() => navigate('/marketplace/services')} className="h-11 px-5">
          <Plus size={17} strokeWidth={1.5} /> New Request
        </DqButton>
      }
    >
      <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <h2 className="text-lg font-semibold text-primary">{meta.title}</h2>
          <span className="text-sm font-medium text-text-secondary">{filteredRequests.length} of {baseRequests.length} requests</span>
        </div>
        <QueueFilterBar
          filters={filters}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          slaOptions={slaOptions}
          priorityOptions={priorityOptions}
          ownerOptions={ownerOptions}
          dueDateOptions={dueDateOptions}
          onFilter={updateFilter}
          onClear={clearFilters}
        />
        <QueueTable
          requests={pagedRequests}
          onOpen={openRequest}
          emptyState={<QueueEmptyState view={view} filtersActive={filtersActive} onClear={clearFilters} />}
        />
        {filteredRequests.length > queuePageSize && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={filteredRequests.length}
            onPrev={() => setPage((current) => Math.max(1, current - 1))}
            onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
          />
        )}
      </section>
    </ServicesPageFrame>
  );
}

const queueColumns = [
  'Request ID',
  'Request Title',
  'Requester',
  'Service',
  'Priority',
  'Status',
  'SLA',
  'Owner / Fulfilment Owner',
  'Due Date',
  'Last Updated',
  'Next Action',
  'Action',
];

function QueueFilterBar({
  filters,
  categoryOptions,
  statusOptions,
  slaOptions,
  priorityOptions,
  ownerOptions,
  dueDateOptions,
  onFilter,
  onClear,
}: {
  filters: QueueFilters;
  categoryOptions: string[];
  statusOptions: string[];
  slaOptions: string[];
  priorityOptions: string[];
  ownerOptions: string[];
  dueDateOptions: string[];
  onFilter: (key: keyof QueueFilters, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-4 grid gap-3 border-y border-border-subtle bg-white p-4 xl:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(140px,1fr))_auto] 2xl:grid-cols-[minmax(220px,1.5fr)_repeat(6,minmax(130px,1fr))_auto]">
      <div className="relative">
        <Search size={17} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search requests..." className="dq-input h-11 pl-10" />
      </div>
      <HubFilterSelect label="Service Category" value={filters.category} options={categoryOptions} onChange={(value) => onFilter('category', value)} />
      <HubFilterSelect label="Status" value={filters.status} options={statusOptions} onChange={(value) => onFilter('status', value)} />
      <HubFilterSelect label="SLA Status" value={filters.sla} options={slaOptions} onChange={(value) => onFilter('sla', value)} />
      <HubFilterSelect label="Priority" value={filters.priority} options={priorityOptions} onChange={(value) => onFilter('priority', value)} />
      <HubFilterSelect label="Owner" value={filters.owner} options={ownerOptions} onChange={(value) => onFilter('owner', value)} />
      <HubFilterSelect label="Due Date" value={filters.dueDate} options={dueDateOptions} onChange={(value) => onFilter('dueDate', value)} />
      <DqButton variant="outline" onClick={onClear} className="h-11 whitespace-nowrap border-border-default px-4">
        <RotateCcw size={16} strokeWidth={1.5} /> Clear Filters
      </DqButton>
    </div>
  );
}

function QueueTable({
  requests,
  onOpen,
  emptyState,
}: {
  requests: ServiceRequest[];
  onOpen: (request: ServiceRequest) => void;
  emptyState: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {queueColumns.map((column) => (
              <th key={column} className="px-4 py-3 text-xs font-semibold uppercase text-[#454560]">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {requests.map((request) => (
            <tr key={request.id} onClick={() => onOpen(request)} className="cursor-pointer transition hover:bg-navy-50">
              <td className="px-4 py-3.5 text-sm"><span className="font-bold text-info-text">{request.id}</span></td>
              <td className="px-4 py-3.5 text-sm"><span className="font-medium text-primary">{request.title}</span></td>
              <td className="px-4 py-3.5 text-sm">
                <span className="font-semibold text-primary">{request.requester}</span>
                {request.requesterTeam && <span className="block text-xs text-text-muted">{request.requesterTeam}</span>}
              </td>
              <td className="px-4 py-3.5 text-sm"><span className="font-medium text-primary">{request.service || request.category || '—'}</span></td>
              <td className="px-4 py-3.5 text-sm"><PriorityBadge priority={request.priority} /></td>
              <td className="px-4 py-3.5 text-sm"><StatusBadge label={request.status} /></td>
              <td className="px-4 py-3.5 text-sm"><SlaBadge label={request.sla} /></td>
              <td className="px-4 py-3.5 text-sm">
                <span className="font-semibold text-primary">{queueOwner(request)}</span>
                {request.ownerTeam && request.ownerTeam !== queueOwner(request) && (
                  <span className="block text-xs text-text-muted">{request.ownerTeam}</span>
                )}
              </td>
              <td className="px-4 py-3.5 text-sm text-primary">{request.dueDate || '—'}</td>
              <td className="px-4 py-3.5 text-sm text-primary">{request.updated}</td>
              <td className="px-4 py-3.5 text-sm text-text-secondary">{request.nextAction}</td>
              <td className="px-4 py-3.5 text-sm">
                <button
                  onClick={(event) => { event.stopPropagation(); onOpen(request); }}
                  className="whitespace-nowrap font-bold text-info-text hover:text-primary"
                >
                  Open Request →
                </button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan={queueColumns.length} className="px-4 py-14">{emptyState}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function QueueEmptyState({ view, filtersActive, onClear }: { view: ServiceQueueView; filtersActive: boolean; onClear: () => void }) {
  if (filtersActive) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No requests found</h3>
        <p className="mt-1 text-sm text-text-secondary">Try adjusting your filters or clearing your search.</p>
        <DqButton variant="outline" onClick={onClear} className="mt-4">Clear Filters</DqButton>
      </div>
    );
  }

  const messages: Record<ServiceQueueView, { title: string; message: string }> = {
    'central-support-queue': {
      title: 'No requests in this queue',
      message: "Requests will appear here when they match this queue's criteria.",
    },
    'fulfilment-owner-queue': {
      title: 'No requests in this queue',
      message: "Requests will appear here when they match this queue's criteria.",
    },
    'assigned-requests': {
      title: 'No requests in this queue',
      message: "Requests will appear here when they match this queue's criteria.",
    },
    'pending-information': {
      title: 'No requests waiting for information',
      message: 'Requests that need requester input or supporting evidence will appear here.',
    },
    'sla-queue-view': {
      title: 'No requests in this queue',
      message: "Requests will appear here when they match this queue's criteria.",
    },
    'closure-review-queue': {
      title: 'No closure reviews pending',
      message: 'Requests ready for closure review will appear here.',
    },
  };

  const { title, message } = messages[view];
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
      <h3 className="mt-3 text-lg font-bold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{message}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Pending Actions                                  */
/* -------------------------------------------------------------------------- */

type PendingActionType =
  | 'Missing Information'
  | 'Comments to Review'
  | 'Evidence Required'
  | 'Closure Review'
  | 'Service Rating'
  | 'Reopened Requests';

type PendingActionCta =
  | 'Provide Info'
  | 'Reply'
  | 'Upload Evidence'
  | 'Review Closure'
  | 'Rate Service'
  | 'Open Request';

type PendingDueLabel = 'Today' | 'Tomorrow' | 'This week' | 'Overdue';

type PendingAction = {
  id: string;
  requestId: string;
  type: PendingActionType;
  action: string;
  cta: PendingActionCta;
  title: string;
  service: string;
  category: string;
  dueLabel: PendingDueLabel;
  priority: ServiceRequest['priority'];
  status: ServiceRequestStatus;
  sla: ServiceSlaStatus;
  owner: string;
  requestedBy: string;
  updated: string;
  missingInformation?: string;
};

// Pending actions are derived from real requests in the shared fixture data. Each
// record links back to an existing request id so CTAs always route to a real request.
const pendingActionsFixture: PendingAction[] = [
  {
    id: 'PA-01',
    requestId: 'REQ-2024-0587',
    type: 'Missing Information',
    action: 'Provide cost centre details',
    cta: 'Provide Info',
    title: 'Access to Finance Dashboard',
    service: 'Business Intelligence',
    category: 'Business Intelligence',
    dueLabel: 'Today',
    priority: 'High',
    status: 'Awaiting Info',
    sla: 'Paused',
    owner: 'Maya Khan',
    requestedBy: 'Maya Khan',
    updated: '14 May 2024',
    missingInformation: 'Cost centre details',
  },
  {
    id: 'PA-02',
    requestId: 'REQ-2024-0433',
    type: 'Comments to Review',
    action: 'Respond to fulfilment comment',
    cta: 'Reply',
    title: 'Report Issue',
    service: 'Reporting Services',
    category: 'Reporting Services',
    dueLabel: 'Tomorrow',
    priority: 'Low',
    status: 'On Hold',
    sla: 'Paused',
    owner: 'Omar Ali',
    requestedBy: 'Omar Ali',
    updated: '10 May 2024',
  },
  {
    id: 'PA-03',
    requestId: 'REQ-2024-0614',
    type: 'Evidence Required',
    action: 'Upload requested evidence',
    cta: 'Upload Evidence',
    title: 'Employee Record Update',
    service: 'HRA Services',
    category: 'HRA Services',
    dueLabel: 'Today',
    priority: 'Medium',
    status: 'Awaiting Info',
    sla: 'Paused',
    owner: 'Central Support',
    requestedBy: 'Central Support',
    updated: '15 May 2024',
    missingInformation: 'Supporting HR document',
  },
  {
    id: 'PA-04',
    requestId: 'REQ-2024-0521',
    type: 'Closure Review',
    action: 'Review closure summary',
    cta: 'Review Closure',
    title: 'User Account Access',
    service: 'IAM Services',
    category: 'IAM Services',
    dueLabel: 'This week',
    priority: 'Medium',
    status: 'Ready for Closure',
    sla: 'Resolved',
    owner: 'Sara Khan',
    requestedBy: 'Sara Khan',
    updated: '07 May 2024',
  },
  {
    id: 'PA-05',
    requestId: 'REQ-2024-0387',
    type: 'Service Rating',
    action: 'Rate completed service',
    cta: 'Rate Service',
    title: 'Software Installation',
    service: 'Workplace Services',
    category: 'Workplace Services',
    dueLabel: 'This week',
    priority: 'Low',
    status: 'Closed',
    sla: 'Resolved',
    owner: 'Workplace Services',
    requestedBy: 'Workplace Services',
    updated: '24 Apr 2024',
  },
  {
    id: 'PA-06',
    requestId: 'REQ-2024-0731',
    type: 'Reopened Requests',
    action: 'Review reopened request',
    cta: 'Open Request',
    title: 'Service Request Reopened After Closure',
    service: 'Platform Support',
    category: 'Platform Support',
    dueLabel: 'Today',
    priority: 'High',
    status: 'Reopened',
    sla: 'On Track',
    owner: 'Maya Khan',
    requestedBy: 'David Mwangi',
    updated: '15 May 2024',
  },
  {
    id: 'PA-07',
    requestId: 'REQ-2024-0499',
    type: 'Missing Information',
    action: 'Provide missing information',
    cta: 'Provide Info',
    title: 'Data Extract Request',
    service: 'Data Services',
    category: 'Data Services',
    dueLabel: 'Overdue',
    priority: 'Medium',
    status: 'Awaiting Info',
    sla: 'Paused',
    owner: 'Grace Wanjiru',
    requestedBy: 'Data Services Team',
    updated: '14 May 2024',
    missingInformation: 'Target dataset and date range',
  },
  {
    id: 'PA-08',
    requestId: 'REQ-2024-0670',
    type: 'Comments to Review',
    action: 'Reply to service team update',
    cta: 'Reply',
    title: 'Dashboard permission change',
    service: 'Business Intelligence',
    category: 'Business Intelligence',
    dueLabel: 'This week',
    priority: 'Low',
    status: 'Awaiting Info',
    sla: 'Paused',
    owner: 'Maya Khan',
    requestedBy: 'Maya Khan',
    updated: '15 May 2024',
  },
  {
    id: 'PA-09',
    requestId: 'REQ-2024-0712',
    type: 'Closure Review',
    action: 'Confirm closure details',
    cta: 'Review Closure',
    title: 'New starter equipment request',
    service: 'Workplace Services',
    category: 'Workplace Services',
    dueLabel: 'This week',
    priority: 'Medium',
    status: 'Ready for Closure',
    sla: 'On Track',
    owner: 'Workplace Services',
    requestedBy: 'Workplace Services',
    updated: '15 May 2024',
  },
];

const pendingTabs = [
  'All Actions',
  'Missing Information',
  'Comments to Review',
  'Closure Review',
  'Service Rating',
  'Reopened Requests',
] as const;
type PendingTab = (typeof pendingTabs)[number];

const pendingActionTypeOptions = [
  'All',
  'Missing Information',
  'Comments to Review',
  'Evidence Required',
  'Closure Review',
  'Service Rating',
  'Reopened Requests',
];

const pendingDueDateOptions = ['All', 'Due Today', 'Due Tomorrow', 'Due This Week', 'Overdue'];

const ctaFocusIntent: Record<PendingActionCta, string | undefined> = {
  'Provide Info': 'info',
  Reply: 'comments',
  'Upload Evidence': 'attachments',
  'Review Closure': 'closure',
  'Rate Service': 'closure',
  'Open Request': undefined,
};

type PendingFilters = {
  search: string;
  actionType: string;
  category: string;
  status: string;
  sla: string;
  priority: string;
  dueDate: string;
  owner: string;
};

const defaultPendingFilters: PendingFilters = {
  search: '',
  actionType: 'All',
  category: 'All',
  status: 'All',
  sla: 'All',
  priority: 'All',
  dueDate: 'All',
  owner: 'All',
};

const pendingViewStorageKey = 'dws-pending-actions-view';

function dueDateMatches(option: string, dueLabel: PendingDueLabel): boolean {
  switch (option) {
    case 'Due Today':
      return dueLabel === 'Today';
    case 'Due Tomorrow':
      return dueLabel === 'Tomorrow';
    case 'Due This Week':
      return dueLabel === 'This week';
    case 'Overdue':
      return dueLabel === 'Overdue';
    default:
      return true;
  }
}

export function PendingActionsPage() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<PendingAction[]>(pendingActionsFixture);
  const [activeTab, setActiveTab] = useState<PendingTab>('All Actions');
  const [filters, setFilters] = useState<PendingFilters>(defaultPendingFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [activeTab, filters]);

  const categoryOptions = useMemo(() => buildOptions(actions.map((item) => item.category)), [actions]);
  const statusOptions = useMemo(() => buildOptions(actions.map((item) => item.status)), [actions]);
  const slaOptions = useMemo(() => buildOptions(actions.map((item) => item.sla)), [actions]);
  const priorityOptions = useMemo(() => buildOptions(actions.map((item) => item.priority)), [actions]);
  const ownerOptions = useMemo(() => buildOptions(actions.map((item) => item.owner)), [actions]);

  const tabActions = useMemo(
    () => (activeTab === 'All Actions' ? actions : actions.filter((item) => item.type === activeTab)),
    [actions, activeTab],
  );

  const tabCounts = useMemo(() => {
    const counts: Record<PendingTab, number> = {
      'All Actions': actions.length,
      'Missing Information': 0,
      'Comments to Review': 0,
      'Closure Review': 0,
      'Service Rating': 0,
      'Reopened Requests': 0,
    };
    actions.forEach((item) => {
      if (item.type in counts) counts[item.type as PendingTab] += 1;
    });
    return counts;
  }, [actions]);

  const filteredActions = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return tabActions.filter((item) => {
      const haystack = [
        item.action,
        item.requestId,
        item.title,
        item.service,
        item.category,
        item.status,
        item.sla,
        item.priority,
        item.owner,
        item.requestedBy,
        item.missingInformation,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (query && !haystack.includes(query)) return false;
      if (filters.actionType !== 'All' && item.type !== filters.actionType) return false;
      if (filters.category !== 'All' && item.category !== filters.category) return false;
      if (filters.status !== 'All' && item.status !== filters.status) return false;
      if (filters.sla !== 'All' && item.sla !== filters.sla) return false;
      if (filters.priority !== 'All' && item.priority !== filters.priority) return false;
      if (filters.owner !== 'All' && item.owner !== filters.owner) return false;
      if (!dueDateMatches(filters.dueDate, item.dueLabel)) return false;
      return true;
    });
  }, [tabActions, filters]);

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.actionType !== 'All' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.sla !== 'All' ||
    filters.priority !== 'All' ||
    filters.dueDate !== 'All' ||
    filters.owner !== 'All';

  const totalPages = Math.max(1, Math.ceil(filteredActions.length / queuePageSize));
  const safePage = Math.min(page, totalPages);
  const pagedActions = filteredActions.slice((safePage - 1) * queuePageSize, safePage * queuePageSize);

  const updateFilter = (key: keyof PendingFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters(defaultPendingFilters);

  const openAction = (action: PendingAction, withFocus: boolean) => {
    const focus = withFocus ? ctaFocusIntent[action.cta] : undefined;
    navigate(`/services/requests/${action.requestId}`, focus ? { state: { focus } } : undefined);
  };

  const refresh = () => {
    setActions([...pendingActionsFixture]);
    toast.success('Pending actions refreshed.');
  };
  const saveView = () => {
    localStorage.setItem(pendingViewStorageKey, JSON.stringify({ activeTab, filters }));
    toast.success('Pending actions view saved.');
  };
  const openSettings = () => toast.info('Pending action settings will be available in a future update.');

  return (
    <ServicesPageFrame
      breadcrumbs={[
        { label: 'Services', route: '/services' },
        { label: 'Service Hub', route: '/services/service-hub' },
        { label: 'Pending Actions' },
      ]}
      overline="SERVICE HUB"
      title="Pending Actions"
      description="Review service request actions that need your response, input, review, or confirmation."
      action={
        <>
          <DqButton variant="outline" onClick={refresh} className="h-11 border-border-default px-4">
            <RefreshCw size={16} strokeWidth={1.5} /> Refresh
          </DqButton>
          <DqButton variant="navy" onClick={saveView} className="h-11 px-4">
            <Bookmark size={16} strokeWidth={1.5} /> Save View
          </DqButton>
          <DqIconButton label="Pending action settings" onClick={openSettings} className="h-11 w-11">
            <Settings size={18} strokeWidth={1.5} />
          </DqIconButton>
        </>
      }
    >
      <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
        <div className="px-5 pt-5">
          <h2 className="text-lg font-semibold text-primary">My Pending Actions</h2>
        </div>
        <PendingActionsTabs activeTab={activeTab} counts={tabCounts} onChange={setActiveTab} />
        <PendingActionsFilterBar
          filters={filters}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          slaOptions={slaOptions}
          priorityOptions={priorityOptions}
          ownerOptions={ownerOptions}
          onFilter={updateFilter}
          onClear={clearFilters}
        />
        <PendingActionsTable
          actions={pagedActions}
          onOpen={(action) => openAction(action, false)}
          onCta={(action) => openAction(action, true)}
          emptyState={
            <PendingActionsEmptyState
              filtersActive={filtersActive}
              activeTab={activeTab}
              onClear={clearFilters}
              onBack={() => navigate('/services/service-hub')}
            />
          }
        />
        {filteredActions.length > queuePageSize && (
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={filteredActions.length}
            onPrev={() => setPage((current) => Math.max(1, current - 1))}
            onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
          />
        )}
      </section>
    </ServicesPageFrame>
  );
}

function PendingActionsTabs({ activeTab, counts, onChange }: { activeTab: PendingTab; counts: Record<PendingTab, number>; onChange: (tab: PendingTab) => void }) {
  return (
    <div className="dq-tabs mt-2 flex overflow-x-auto px-3" role="tablist" aria-label="Pending action categories">
      {pendingTabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onChange(tab)}
          className={`dq-tab whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}
        >
          {tab}
          <span className="ml-2 rounded-pill bg-surface px-1.5 py-0.5 text-[11px] font-bold text-text-secondary">{counts[tab]}</span>
        </button>
      ))}
    </div>
  );
}

function PendingActionsFilterBar({
  filters,
  categoryOptions,
  statusOptions,
  slaOptions,
  priorityOptions,
  ownerOptions,
  onFilter,
  onClear,
}: {
  filters: PendingFilters;
  categoryOptions: string[];
  statusOptions: string[];
  slaOptions: string[];
  priorityOptions: string[];
  ownerOptions: string[];
  onFilter: (key: keyof PendingFilters, value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-3 border-y border-border-subtle bg-white p-4 xl:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(140px,1fr))_auto] 2xl:grid-cols-[minmax(220px,1.4fr)_repeat(7,minmax(118px,1fr))_auto]">
      <div className="relative">
        <Search size={17} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input value={filters.search} onChange={(event) => onFilter('search', event.target.value)} placeholder="Search pending actions..." className="dq-input h-11 pl-10" />
      </div>
      <HubFilterSelect label="Action Type" value={filters.actionType} options={pendingActionTypeOptions} onChange={(value) => onFilter('actionType', value)} />
      <HubFilterSelect label="Service Category" value={filters.category} options={categoryOptions} onChange={(value) => onFilter('category', value)} />
      <HubFilterSelect label="Status" value={filters.status} options={statusOptions} onChange={(value) => onFilter('status', value)} />
      <HubFilterSelect label="SLA Status" value={filters.sla} options={slaOptions} onChange={(value) => onFilter('sla', value)} />
      <HubFilterSelect label="Priority" value={filters.priority} options={priorityOptions} onChange={(value) => onFilter('priority', value)} />
      <HubFilterSelect label="Due Date" value={filters.dueDate} options={pendingDueDateOptions} onChange={(value) => onFilter('dueDate', value)} />
      <HubFilterSelect label="Owner" value={filters.owner} options={ownerOptions} onChange={(value) => onFilter('owner', value)} />
      <DqButton variant="outline" onClick={onClear} className="h-11 whitespace-nowrap border-border-default px-4">
        <RotateCcw size={16} strokeWidth={1.5} /> Clear Filters
      </DqButton>
    </div>
  );
}

const pendingActionColumns = ['Action', 'Request ID', 'Request Title', 'Service', 'Due Date', 'Priority', 'Status', 'SLA', 'Action'];

function PendingDueCell({ dueLabel }: { dueLabel: PendingDueLabel }) {
  const tone = dueLabel === 'Overdue' ? 'text-danger' : dueLabel === 'Today' ? 'text-warning-text' : 'text-primary';
  return <span className={`font-semibold ${tone}`}>{dueLabel}</span>;
}

function PendingActionsTable({
  actions,
  onOpen,
  onCta,
  emptyState,
}: {
  actions: PendingAction[];
  onOpen: (action: PendingAction) => void;
  onCta: (action: PendingAction) => void;
  emptyState: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1120px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface">
            {pendingActionColumns.map((column, columnIndex) => (
              <th key={`${column}-${columnIndex}`} className="px-4 py-3 text-xs font-semibold uppercase text-[#454560]">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-white">
          {actions.map((action) => (
            <tr key={action.id} onClick={() => onOpen(action)} className="cursor-pointer transition hover:bg-navy-50">
              <td className="px-4 py-3.5 text-sm">
                <span className="font-semibold text-primary">{action.action}</span>
                <span className="block text-xs text-text-muted">{action.type}</span>
              </td>
              <td className="px-4 py-3.5 text-sm"><span className="font-bold text-info-text">{action.requestId}</span></td>
              <td className="px-4 py-3.5 text-sm"><span className="font-medium text-primary">{action.title}</span></td>
              <td className="px-4 py-3.5 text-sm"><span className="font-medium text-primary">{action.service}</span></td>
              <td className="px-4 py-3.5 text-sm"><PendingDueCell dueLabel={action.dueLabel} /></td>
              <td className="px-4 py-3.5 text-sm"><PriorityBadge priority={action.priority} /></td>
              <td className="px-4 py-3.5 text-sm"><StatusBadge label={action.status} /></td>
              <td className="px-4 py-3.5 text-sm"><SlaBadge label={action.sla} /></td>
              <td className="px-4 py-3.5 text-sm">
                <button
                  onClick={(event) => { event.stopPropagation(); onCta(action); }}
                  className="rounded-button border border-border-default bg-white px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface"
                >
                  {action.cta}
                </button>
              </td>
            </tr>
          ))}
          {actions.length === 0 && (
            <tr>
              <td colSpan={pendingActionColumns.length} className="px-4 py-14">{emptyState}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PendingActionsEmptyState({
  filtersActive,
  activeTab,
  onClear,
  onBack,
}: {
  filtersActive: boolean;
  activeTab: PendingTab;
  onClear: () => void;
  onBack: () => void;
}) {
  if (filtersActive) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <FileSearch size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No pending actions found</h3>
        <p className="mt-1 text-sm text-text-secondary">Try adjusting your search or clearing filters.</p>
        <DqButton variant="outline" onClick={onClear} className="mt-4">Clear Filters</DqButton>
      </div>
    );
  }
  if (activeTab !== 'All Actions') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <ClipboardList size={38} strokeWidth={1.5} className="text-text-muted" />
        <h3 className="mt-3 text-lg font-bold text-primary">No actions in this category</h3>
        <p className="mt-1 text-sm text-text-secondary">Actions will appear here when service requests need your response.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <ClipboardList size={38} strokeWidth={1.5} className="text-text-muted" />
      <h3 className="mt-3 text-lg font-bold text-primary">No pending actions</h3>
      <p className="mt-1 text-sm text-text-secondary">You do not have any service request actions waiting for your response.</p>
      <DqButton variant="navy" onClick={onBack} className="mt-4">Back to Service Hub</DqButton>
    </div>
  );
}

type RequestContext = 'requester' | 'operational';
type DetailTab = 'Overview' | 'Activity' | 'Comments' | 'Attachments' | 'Timeline' | 'Closure';

const detailTabs: DetailTab[] = ['Overview', 'Activity', 'Comments', 'Attachments', 'Timeline', 'Closure'];
const lifecycleStages = ['Submitted', 'In Review', 'Awaiting Info', 'In Progress', 'Resolved', 'Closed'] as const;
const stageStatusMap: ServiceRequestStatus[] = ['New', 'Triaged', 'Awaiting Info', 'In Progress', 'Ready for Closure', 'Closed'];
const statusOptionsList: ServiceRequestStatus[] = ['New', 'Triaged', 'In Progress', 'Awaiting Info', 'On Hold', 'Escalated', 'Ready for Closure', 'Completed', 'Closed', 'Reopened'];
const slaOptionsList: ServiceSlaStatus[] = ['On Track', 'At Risk', 'Breached', 'Paused', 'Resolved'];
const priorityOptionsList: Array<ServiceRequest['priority']> = ['Low', 'Medium', 'High', 'Critical'];
const fulfilmentOwnerOptions = ['Maya Khan', 'Sara Khan', 'Grace Wanjiru', 'Omar Ali', 'Central Support', 'Workplace Services'];

function stageIndexFromStatus(status: ServiceRequestStatus): number {
  if (['New'].includes(status)) return 0;
  if (['Triaged', 'Unassigned'].includes(status)) return 1;
  if (['Awaiting Info', 'Pending Information'].includes(status)) return 2;
  if (['In Progress', 'On Hold', 'At Risk', 'Escalated', 'Reopened', 'Overdue', 'Breached'].includes(status)) return 3;
  if (['Ready for Closure', 'Closure Review'].includes(status)) return 4;
  if (['Completed', 'Closed'].includes(status)) return 5;
  return 3;
}

function isClosedStatus(status: ServiceRequestStatus) {
  return status === 'Completed' || status === 'Closed';
}

export function ServiceRequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const request = getAllRequests().find((item) => item.id === requestId);
  const myRequests = mergeMyServiceRequests();

  if (!request) {
    return (
      <div className="flex h-full min-w-0 flex-col overflow-hidden px-4 py-4 text-primary lg:px-6">
        <nav className="mb-3 flex shrink-0 flex-wrap items-center gap-2 text-sm font-semibold text-text-secondary" aria-label="Breadcrumb">
          <Link to="/services" className="text-secondary hover:text-primary">Services</Link>
          <span>/</span>
          <Link to="/services/service-hub" className="text-secondary hover:text-primary">Service Hub</Link>
          <span>/</span>
          <span className="font-mono text-xs font-bold text-primary">{requestId}</span>
        </nav>
        <section className="mx-auto mt-16 max-w-lg rounded-card border border-border-default bg-white p-8 text-center shadow-sm">
          <FileSearch className="mx-auto text-text-muted" size={42} strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-bold text-primary">Request not found</h1>
          <p className="mt-2 text-sm text-text-secondary">This request could not be found in the prototype data.</p>
          <DqButton variant="navy" onClick={() => navigate('/services/service-hub')} className="mt-6">Back to Service Hub</DqButton>
        </section>
      </div>
    );
  }

  const context: RequestContext = myRequests.some((item) => item.id === request.id) ? 'requester' : 'operational';
  const list = context === 'requester' ? myRequests : serviceRequests;

  return <RequestDetailView key={request.id} request={request} list={list} context={context} />;
}

function RequestDetailView({ request, list, context }: { request: ServiceRequest; list: ServiceRequest[]; context: RequestContext }) {
  const navigate = useNavigate();
  const location = useLocation();
  const focusIntent = (location.state as { focus?: string } | null)?.focus;
  const initialTab: DetailTab =
    focusIntent === 'comments'
      ? 'Comments'
      : focusIntent === 'attachments'
        ? 'Attachments'
        : focusIntent === 'closure'
          ? 'Closure'
          : 'Overview';
  const [draft, setDraft] = useState<ServiceRequest>(request);
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const [comments, setComments] = useState<RequestComment[]>(() => seedComments(request));
  const [attachments, setAttachments] = useState<RequestAttachment[]>(() => seedAttachments(request));
  const [activity, setActivity] = useState<RequestActivity[]>(() => buildActivity(request));
  const [comment, setComment] = useState('');
  const [infoResponse, setInfoResponse] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [ratingInput, setRatingInput] = useState(request.rating ?? 0);
  const [feedbackInput, setFeedbackInput] = useState(request.feedback ?? '');
  const [dirty, setDirty] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [leftSearch, setLeftSearch] = useState('');
  const [leftPage, setLeftPage] = useState(1);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const infoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusIntent === 'comments') {
      const timer = setTimeout(() => commentRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
    if (focusIntent === 'info') {
      const timer = setTimeout(() => infoRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isRequester = context === 'requester';
  const hubRoute = isRequester ? '/services/service-hub' : '/services/request-queues';
  const sourceLabel = isRequester ? 'Service Hub' : 'Request Queues';
  const panelTitle = isRequester ? 'Service Hub' : 'Request Queue';
  const middleCrumb = isRequester
    ? { label: draft.pendingAction ? 'Pending Actions' : 'My Requests', route: '/services/service-hub' }
    : { label: draft.queue || 'Request Queues', route: '/services/request-queues' };

  const timeline = useMemo(() => buildTimeline(activity), [activity]);
  const stageIndex = stageIndexFromStatus(draft.status);

  const index = list.findIndex((item) => item.id === draft.id);
  const prevId = index > 0 ? list[index - 1].id : null;
  const nextId = index >= 0 && index < list.length - 1 ? list[index + 1].id : null;

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const timeLabel = now.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

  const go = (id: string) => {
    if (dirty) {
      toast.warning('Save changes before navigating away from this request');
      return;
    }
    navigate(`/services/requests/${id}`);
  };
  const back = () => {
    if (dirty) {
      toast.warning('Save changes before leaving this request');
      return;
    }
    navigate(hubRoute);
  };

  const update = (patch: Partial<ServiceRequest>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setDirty(true);
  };

  const logActivity = (action: string, actor = currentUser) => {
    setActivity((current) => [{ id: `act-${Date.now()}`, actor, action, timestamp: 'Just now' }, ...current]);
  };

  const save = () => {
    update({ updated: 'Today' });
    setDirty(false);
    logActivity('Saved changes');
    toast.success('Saved');
  };

  const applyStatus = (status: ServiceRequestStatus, message: string) => {
    setDraft((current) => ({ ...current, status, updated: 'Today' }));
    setDirty(false);
    logActivity(message);
    toast.success(message);
  };

  const provideInformation = () => {
    setActiveTab('Overview');
    setTimeout(() => infoRef.current?.focus(), 60);
  };
  const submitInformation = () => {
    if (!infoResponse.trim()) {
      toast.warning('Enter the requested information before submitting');
      return;
    }
    setComments((current) => [{ id: `cmt-${Date.now()}`, author: currentUser, body: `Provided requested information: ${infoResponse.trim()}`, timestamp: 'Just now' }, ...current]);
    logActivity('Information submitted');
    setDraft((current) => ({ ...current, status: 'In Progress', sla: 'On Track', updated: 'Today' }));
    setInfoResponse('');
    setDirty(false);
    toast.success('Information submitted');
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments((current) => [{ id: `cmt-${Date.now()}`, author: currentUser, body: comment.trim(), timestamp: 'Just now' }, ...current]);
    logActivity('Comment added');
    setComment('');
    toast.success('Comment added');
  };
  const focusComment = () => {
    setActiveTab('Comments');
    setTimeout(() => commentRef.current?.focus(), 60);
  };

  const addAttachment = () => {
    setAttachments((current) => [{ id: `att-${Date.now()}`, name: 'uploaded-evidence.pdf', type: 'File', addedBy: currentUser, addedAt: 'Just now', status: 'Added' }, ...current]);
    logActivity('Attachment added');
    toast.success('Attachment added');
  };
  const addLink = () => {
    if (!linkTitle.trim()) {
      toast.warning('Enter a name for the link');
      return;
    }
    setAttachments((current) => [{ id: `att-${Date.now()}`, name: linkTitle.trim(), type: 'Link', addedBy: currentUser, addedAt: 'Just now', status: linkUrl.trim() || 'Added' }, ...current]);
    logActivity('Evidence link added');
    setLinkTitle('');
    setLinkUrl('');
    setLinkOpen(false);
    toast.success('Link added');
  };

  const reopen = () => {
    applyStatus('Reopened', 'Request reopened');
    setMoreOpen(false);
  };
  const submitRating = () => {
    if (!ratingInput) {
      toast.warning('Select a rating before submitting');
      return;
    }
    setDraft((current) => ({ ...current, rating: ratingInput, feedback: feedbackInput.trim() || current.feedback, updated: 'Today' }));
    logActivity(`Service rated ${ratingInput}/5`);
    toast.success('Rating submitted');
  };

  const updateStage = (targetStatus: ServiceRequestStatus) => {
    if (isRequester) return;
    applyStatus(targetStatus, `Status updated to ${targetStatus}`);
  };

  const showRequiredInfo = Boolean(draft.requiredInfoPrompt) && (draft.status === 'Awaiting Info' || draft.status === 'Pending Information');

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden px-4 py-4 text-primary lg:px-6">
      <nav className="mb-3 flex shrink-0 flex-wrap items-center gap-2 text-sm font-semibold text-text-secondary" aria-label="Breadcrumb">
        <Link to="/services" className="text-secondary hover:text-primary">Services</Link>
        <span>/</span>
        <Link to={hubRoute} className="text-secondary hover:text-primary">{sourceLabel}</Link>
        <span>/</span>
        <Link to={middleCrumb.route} className="text-secondary hover:text-primary">{middleCrumb.label}</Link>
        <span>/</span>
        <span className="font-mono text-xs font-bold text-primary">{draft.id}</span>
      </nav>

      <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] overflow-hidden rounded-card border border-border-default bg-white shadow-sm">
        <aside className="min-h-0 min-w-0 overflow-hidden border-r border-border-default">
          <RequestListPanel
            panelTitle={panelTitle}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            requests={list}
            selectedId={draft.id}
            search={leftSearch}
            onSearch={(value) => { setLeftSearch(value); setLeftPage(1); }}
            onSelect={go}
            onNewRequest={() => navigate('/marketplace/services')}
            page={leftPage}
            pageSize={8}
            onPageChange={setLeftPage}
          />
        </aside>

        <section className="flex min-w-0 flex-col overflow-hidden bg-white">
          <div className="shrink-0 border-b border-border-default bg-white">
            <div className="flex h-[54px] items-center justify-between gap-4 border-b border-border-subtle px-7">
              <div className="flex items-center gap-2">
                <button type="button" onClick={back} className="grid h-8 w-8 place-items-center rounded-button bg-white text-primary hover:bg-navy-50" aria-label="Back">
                  <ArrowLeft size={16} strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => prevId && go(prevId)} disabled={!prevId} className="grid h-8 w-8 place-items-center rounded-button bg-white font-bold text-primary hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40">‹</button>
                <span className="px-3 text-sm font-bold text-primary">{(index >= 0 ? index + 1 : 0)} / {list.length}</span>
                <button type="button" onClick={() => nextId && go(nextId)} disabled={!nextId} className="grid h-8 w-8 place-items-center rounded-button bg-white font-bold text-primary hover:bg-navy-50 disabled:cursor-not-allowed disabled:opacity-40">›</button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={back} className="inline-flex items-center gap-1 rounded-button px-2 py-2 text-sm font-bold text-primary hover:bg-navy-50">
                  <ListChecks size={15} strokeWidth={1.5} /> List
                </button>
                <button type="button" onClick={back} className="grid h-8 w-8 place-items-center rounded-button bg-white text-primary hover:bg-navy-50" aria-label="Close details">
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="px-7 pb-2 pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[30px] font-bold leading-tight text-primary">{draft.title}</h1>
                <StatusBadge label={draft.status} />
                <StatusBadge label={draft.sla} />
                <span className="text-sm font-semibold text-text-secondary">{draft.priority} Priority</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-4 w-1 rounded-full bg-secondary" />
                <div className="text-sm font-semibold text-text-secondary">
                  {draft.service || draft.category || 'Service request'} · Created {draft.createdAt || draft.submittedOn || draft.updated}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 px-7 py-2">
              <RequestHeaderActions
                context={context}
                draft={draft}
                dirty={dirty}
                onProvideInformation={provideInformation}
                onAddComment={focusComment}
                onSave={save}
                onReopen={reopen}
                onStartWorking={() => applyStatus('In Progress', 'Started working on request')}
                onRequestInformation={() => applyStatus('Awaiting Info', 'Information requested')}
                onEscalate={() => applyStatus('Escalated', 'Request escalated')}
                onAddNote={focusComment}
                onMarkReady={() => applyStatus('Ready for Closure', 'Marked ready for closure')}
                onClose={() => applyStatus('Closed', 'Request closed')}
                onToast={(label) => toast.success(`${label} captured for ${draft.id}`)}
                moreOpen={moreOpen}
                onToggleMore={() => setMoreOpen((open) => !open)}
              />
            </div>

            <div className="px-7 pb-4 pt-4">
              <div className="flex items-start">
                {lifecycleStages.map((label, i) => {
                  const isActive = stageIndex === i;
                  const isDone = i < stageIndex;
                  return (
                    <Fragment key={label}>
                      <button
                        type="button"
                        onClick={() => updateStage(stageStatusMap[i])}
                        disabled={isRequester}
                        className={`flex min-w-[80px] flex-col items-center gap-3 ${isRequester ? 'cursor-default' : ''}`}
                      >
                        <span className={`grid h-11 w-11 place-items-center rounded-full border text-base font-bold shadow-sm ${isActive ? 'border-secondary bg-secondary text-white' : isDone ? 'border-secondary bg-orange-50 text-secondary' : 'border-border-default bg-navy-50 text-primary'}`}>
                          {i + 1}
                        </span>
                        <span className={`text-center text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{label}</span>
                      </button>
                      {i < lifecycleStages.length - 1 && (
                        <div className="flex h-11 flex-1 items-center px-2">
                          <div className={`h-0.5 w-full ${i < stageIndex ? 'bg-secondary' : 'bg-border-default'}`} />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>

            <div className="dq-tabs flex overflow-x-auto px-5" role="tablist" aria-label="Request detail tabs">
              {detailTabs.map((tab) => (
                <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`dq-tab min-h-11 whitespace-nowrap ${activeTab === tab ? 'dq-tab-active text-secondary' : ''}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white p-5">
            {activeTab === 'Overview' && (
              <OverviewTab
                draft={draft}
                context={context}
                showRequiredInfo={showRequiredInfo}
                infoResponse={infoResponse}
                infoRef={infoRef}
                onInfoResponse={setInfoResponse}
                onSubmitInformation={submitInformation}
                onUpdate={update}
              />
            )}
            {activeTab === 'Activity' && <RequestActivityTab activity={activity} />}
            {activeTab === 'Comments' && (
              <RequestCommentsTab comments={comments} comment={comment} onComment={setComment} onPost={addComment} inputRef={commentRef} />
            )}
            {activeTab === 'Attachments' && (
              <RequestAttachmentsTab
                attachments={attachments}
                linkOpen={linkOpen}
                linkTitle={linkTitle}
                linkUrl={linkUrl}
                onShowLink={() => setLinkOpen(true)}
                onLinkTitle={setLinkTitle}
                onLinkUrl={setLinkUrl}
                onAddLink={addLink}
                onUpload={addAttachment}
              />
            )}
            {activeTab === 'Timeline' && <RequestTimelineTab events={timeline} />}
            {activeTab === 'Closure' && (
              <RequestClosureTab
                draft={draft}
                rating={ratingInput}
                feedback={feedbackInput}
                onRating={setRatingInput}
                onFeedback={setFeedbackInput}
                onSubmitRating={submitRating}
                onReopen={reopen}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function RequestHeaderActions({
  context,
  draft,
  dirty,
  onProvideInformation,
  onAddComment,
  onSave,
  onReopen,
  onStartWorking,
  onRequestInformation,
  onEscalate,
  onAddNote,
  onMarkReady,
  onClose,
  onToast,
  moreOpen,
  onToggleMore,
}: {
  context: RequestContext;
  draft: ServiceRequest;
  dirty: boolean;
  onProvideInformation: () => void;
  onAddComment: () => void;
  onSave: () => void;
  onReopen: () => void;
  onStartWorking: () => void;
  onRequestInformation: () => void;
  onEscalate: () => void;
  onAddNote: () => void;
  onMarkReady: () => void;
  onClose: () => void;
  onToast: (label: string) => void;
  moreOpen: boolean;
  onToggleMore: () => void;
}) {
  const closed = isClosedStatus(draft.status);
  const canProvideInfo = draft.status === 'Awaiting Info' || draft.status === 'Pending Information';

  if (context === 'requester') {
    return (
      <>
        <div className="flex flex-wrap items-center gap-2">
          {canProvideInfo && (
            <DqButton variant="outline" onClick={onProvideInformation} className="h-10 border-border-default px-4">Provide Information</DqButton>
          )}
          <DqButton variant="outline" onClick={onAddComment} className="h-10 border-border-default px-4"><MessageSquare size={16} strokeWidth={1.5} /> Add Comment</DqButton>
          {closed && (
            <DqButton variant="outline" onClick={onReopen} className="h-10 border-border-default px-4">Reopen Request</DqButton>
          )}
        </div>
        <div className="relative flex items-center gap-2">
          <DqButton variant="outline" onClick={onSave} disabled={!dirty} className="h-10 border-border-default px-4"><Check size={16} strokeWidth={1.5} /> Save</DqButton>
          <DqIconButton label="More request actions" onClick={onToggleMore} className="h-10 w-10"><MoreHorizontal size={18} strokeWidth={1.5} /></DqIconButton>
          {moreOpen && (
            <div className="absolute right-0 top-12 z-20 w-56 rounded-card border border-border-default bg-white p-2 text-sm font-semibold text-primary shadow-lg">
              <button onClick={() => onToast('Copy request link')} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">Copy Request Link</button>
              <button onClick={() => onToast('Print request')} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">Print Request</button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <DqButton variant="outline" onClick={onStartWorking} disabled={closed} className="h-10 border-border-default px-4">Start Working</DqButton>
        <DqButton variant="outline" onClick={() => onToast('Assign / Reassign')} className="h-10 border-border-default px-4">Assign / Reassign</DqButton>
        <DqButton variant="outline" onClick={onRequestInformation} className="h-10 border-border-default px-4">Request Information</DqButton>
        <DqButton variant="outline" onClick={onEscalate} className="h-10 border-border-default px-4">↑ Escalate</DqButton>
        <DqButton variant="outline" onClick={onAddNote} className="h-10 border-border-default px-4"><MessageSquare size={16} strokeWidth={1.5} /> Add Note</DqButton>
      </div>
      <div className="relative flex items-center gap-2">
        <DqButton variant="outline" onClick={onSave} disabled={!dirty} className="h-10 border-border-default px-4"><Check size={16} strokeWidth={1.5} /> Save</DqButton>
        <DqIconButton label="More request actions" onClick={onToggleMore} className="h-10 w-10"><MoreHorizontal size={18} strokeWidth={1.5} /></DqIconButton>
        {moreOpen && (
          <div className="absolute right-0 top-12 z-20 w-60 rounded-card border border-border-default bg-white p-2 text-sm font-semibold text-primary shadow-lg">
            <button onClick={onMarkReady} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">Mark Ready for Closure</button>
            <button onClick={onClose} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">Close Request</button>
            <button onClick={() => onToast('Copy request link')} className="w-full rounded-button px-3 py-2 text-left hover:bg-navy-50">Copy Request Link</button>
          </div>
        )}
      </div>
    </>
  );
}

function RequestListPanel({
  panelTitle,
  dateLabel,
  timeLabel,
  requests,
  selectedId,
  search,
  onSearch,
  onSelect,
  onNewRequest,
  page,
  pageSize,
  onPageChange,
}: {
  panelTitle: string;
  dateLabel: string;
  timeLabel: string;
  requests: ServiceRequest[];
  selectedId: string;
  search: string;
  onSearch: (value: string) => void;
  onSelect: (id: string) => void;
  onNewRequest: () => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const query = search.trim().toLowerCase();
  const filtered = requests.filter((request) => {
    if (!query) return true;
    const haystack = [
      request.id,
      request.title,
      request.service,
      request.category,
      request.status,
      request.sla,
      request.requester,
      request.owner,
      request.fulfilmentOwner,
      request.nextAction,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(query);
  });
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const subLabel = (request: ServiceRequest) => [request.service || request.category, request.status, request.sla].filter(Boolean).join(' · ');
  const sideLabel = (request: ServiceRequest) => {
    if (isClosedStatus(request.status)) return 'Closed';
    if (request.dueDate) return `Due ${request.dueDate}`;
    return request.updated;
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="shrink-0 border-b border-border-default px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-bold leading-tight text-primary">{panelTitle}</h2>
            <p className="mt-1 text-sm font-medium text-primary/80">{dateLabel} · {timeLabel}</p>
          </div>
          <DqButton variant="navy" onClick={onNewRequest} className="h-11 shrink-0 px-4"><Plus size={16} strokeWidth={1.5} /> New Request</DqButton>
        </div>
      </div>

      <div className="shrink-0 border-b border-border-default px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-bold text-primary">{requests.length} Requests</p>
          <div className="relative w-[170px]">
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search list..." className="h-10 w-full rounded-input border border-border-default bg-white px-3 text-sm font-medium text-primary outline-none placeholder:text-text-muted focus:border-primary" />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {requests.length > 0 && filtered.length === 0 && (
          <div className="m-5 rounded-card border border-border-subtle p-4 text-sm font-semibold text-text-secondary">
            No matching requests.
            <div className="mt-1 text-xs">Try adjusting your search.</div>
          </div>
        )}
        {paged.map((request) => {
          const active = request.id === selectedId;
          return (
            <button key={request.id} onClick={() => onSelect(request.id)} className={`w-full border-l-[4px] px-5 py-4 text-left transition ${active ? 'border-secondary bg-orange-50 text-primary' : 'border-transparent hover:bg-navy-50'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-primary">{request.title}</div>
                  <div className="mt-1 truncate text-xs font-semibold text-text-secondary">{subLabel(request)}</div>
                </div>
                <div className={`shrink-0 text-xs font-semibold ${request.sla === 'Breached' ? 'text-danger' : 'text-text-muted'}`}>{sideLabel(request)}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-border-default px-5 py-3">
        <div className="flex items-center justify-between gap-2 text-sm font-medium text-text-muted">
          <span>{start}-{end} of {total}</span>
          <div className="flex gap-1">
            <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="h-9 rounded-button border border-border-default px-3 font-bold text-primary disabled:opacity-40">Previous</button>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="h-9 rounded-button border border-border-default px-3 font-bold text-primary disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({
  draft,
  context,
  showRequiredInfo,
  infoResponse,
  infoRef,
  onInfoResponse,
  onSubmitInformation,
  onUpdate,
}: {
  draft: ServiceRequest;
  context: RequestContext;
  showRequiredInfo: boolean;
  infoResponse: string;
  infoRef: RefObject<HTMLTextAreaElement>;
  onInfoResponse: (value: string) => void;
  onSubmitInformation: () => void;
  onUpdate: (patch: Partial<ServiceRequest>) => void;
}) {
  const operational = context === 'operational';
  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-card border border-border-default bg-white">
        <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">DETAILS</h2>
        <div className="grid gap-x-8 gap-y-2 px-5 py-3 lg:grid-cols-2">
          <div className="space-y-2">
            <DetailRow label="Request ID" value={draft.id} readOnly monospace />
            <DetailRow label="Request title" value={draft.title} readOnly />
            <DetailRow label="Service" value={draft.service || '—'} readOnly />
            <DetailRow label="Service category" value={draft.category || '—'} readOnly />
            <DetailRow label="Submitted by" value={draft.requester} readOnly />
            <DetailRow label="Requested for" value={draft.requestedFor || draft.requester} readOnly />
            {operational
              ? <DetailSelect label="Status" value={draft.status} options={statusOptionsList} onChange={(value) => onUpdate({ status: value as ServiceRequestStatus })} />
              : <DetailRow label="Status" value={draft.status} readOnly />}
            {operational
              ? <DetailSelect label="SLA status" value={draft.sla} options={slaOptionsList} onChange={(value) => onUpdate({ sla: value as ServiceSlaStatus })} />
              : <DetailRow label="SLA status" value={draft.sla} readOnly />}
          </div>
          <div className="space-y-2">
            {operational
              ? <DetailSelect label="Priority" value={draft.priority} options={priorityOptionsList} onChange={(value) => onUpdate({ priority: value as ServiceRequest['priority'] })} />
              : <DetailRow label="Priority" value={draft.priority} readOnly />}
            <DetailRow label="Submitted on" value={draft.submittedOn || '—'} readOnly />
            <DetailRow label="Expected resolution" value={draft.expectedResolution || '—'} readOnly />
            <DetailRow label="Last updated" value={draft.updated} readOnly />
            <DetailRow label="Owner team" value={draft.ownerTeam || draft.owner} readOnly />
            {operational
              ? <DetailSelect label="Fulfilment owner" value={draft.fulfilmentOwner || draft.owner} options={fulfilmentOwnerOptions} onChange={(value) => onUpdate({ fulfilmentOwner: value, owner: value })} />
              : <DetailRow label="Fulfilment owner" value={draft.fulfilmentOwner || draft.owner} readOnly />}
            <DetailRow label="Queue" value={draft.queue} readOnly />
            {operational
              ? <DetailTextInput label="Next action" value={draft.nextAction} onChange={(value) => onUpdate({ nextAction: value })} />
              : <DetailRow label="Next action" value={draft.nextAction} readOnly />}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-card border border-border-default bg-white">
        <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">BUSINESS NEED / CONTEXT</h2>
        <div className="p-5">
          <p className="rounded-card border border-border-subtle bg-surface p-4 text-sm leading-6 text-primary">{draft.description || 'No business justification was provided for this request.'}</p>
        </div>
      </section>

      {showRequiredInfo && (
        <section className="overflow-hidden rounded-card border border-warning/40 bg-white">
          <h2 className="border-b border-border-subtle bg-warning-surface px-5 py-3 text-sm font-bold uppercase tracking-wide text-warning-text">REQUIRED INFORMATION</h2>
          <div className="space-y-3 p-5">
            <p className="text-sm font-semibold text-primary">{draft.requiredInfoPrompt}</p>
            {context === 'requester' ? (
              <>
                <textarea ref={infoRef} value={infoResponse} onChange={(event) => onInfoResponse(event.target.value)} rows={3} placeholder="Type your response..." className="dq-textarea" />
                <DqButton variant="orange" onClick={onSubmitInformation}>Submit Information</DqButton>
              </>
            ) : (
              <p className="text-sm text-text-secondary">Waiting for the requester to provide this information.</p>
            )}
          </div>
        </section>
      )}

      {draft.latestUpdate && (
        <section className="overflow-hidden rounded-card border border-border-default bg-white">
          <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">LATEST UPDATE</h2>
          <div className="p-5">
            <p className="text-sm leading-6 text-primary">{draft.latestUpdate}</p>
            <p className="mt-2 text-xs font-semibold text-text-muted">{draft.updatedBy || draft.owner} · {draft.ownerTeam || draft.owner} · {draft.updated}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function DetailRow({ label, value, monospace }: { label: string; value: string; readOnly?: boolean; monospace?: boolean }) {
  return (
    <div className="grid min-h-8 grid-cols-[140px_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <span className={`px-3 font-semibold text-primary ${monospace ? 'font-mono text-xs font-bold' : ''}`}>{value}</span>
    </div>
  );
}

function DetailTextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid min-h-8 grid-cols-[140px_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-8 rounded-input border border-transparent bg-white px-3 font-semibold text-primary outline-none transition hover:border-border-subtle focus:border-border-default" />
    </label>
  );
}

function DetailSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid min-h-8 grid-cols-[140px_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="font-medium text-text-secondary">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 rounded-input border border-border-default bg-white px-3 font-semibold text-primary outline-none focus:border-primary">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function RequestActivityTab({ activity }: { activity: RequestActivity[] }) {
  if (activity.length === 0) {
    return <DetailEmpty title="No visible activity yet" message="Requester-visible updates will appear here as the request progresses." />;
  }
  return (
    <section className="overflow-hidden rounded-card border border-border-default bg-white">
      <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">ACTIVITY</h2>
      <div className="space-y-4 px-5 py-4">
        {activity.map((entry) => (
          <div key={entry.id} className="border-l-2 border-secondary pl-4 text-sm text-primary">
            <div className="font-bold">{entry.actor}</div>
            <p className="mt-1 leading-6">{entry.action}</p>
            <div className="mt-1 text-xs font-semibold text-text-muted">{entry.timestamp}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestCommentsTab({ comments, comment, onComment, onPost, inputRef }: { comments: RequestComment[]; comment: string; onComment: (value: string) => void; onPost: () => void; inputRef: RefObject<HTMLTextAreaElement> }) {
  return (
    <section className="overflow-hidden rounded-card border border-border-default bg-white">
      <div className="flex items-center justify-between gap-3">
        <h2 className="px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">COMMENTS</h2>
        <span className="px-5 text-xs font-semibold text-text-muted">{comments.length} comments</span>
      </div>
      <div className="space-y-3 border-t border-border-subtle px-5 py-4">
        {comments.length === 0 && (
          <DetailEmpty title="No comments yet" message="Comments from you and the service team will appear here." bordered={false} />
        )}
        {comments.map((entry) => (
          <div key={entry.id} className="rounded-button border border-border-subtle bg-surface px-3 py-2 text-sm text-primary">
            <div className="font-bold">{entry.author}</div>
            <p className="mt-1 leading-6">{entry.body}</p>
            <div className="mt-1 text-xs font-semibold text-text-muted">{entry.timestamp}</div>
          </div>
        ))}
        <textarea ref={inputRef} value={comment} onChange={(event) => onComment(event.target.value)} rows={3} placeholder="Add comment..." className="dq-textarea mt-2" />
        <DqButton variant="navy" onClick={onPost} className="mt-3"><MessageSquare size={15} strokeWidth={1.5} /> Post</DqButton>
      </div>
    </section>
  );
}

function RequestAttachmentsTab({
  attachments,
  linkOpen,
  linkTitle,
  linkUrl,
  onShowLink,
  onLinkTitle,
  onLinkUrl,
  onAddLink,
  onUpload,
}: {
  attachments: RequestAttachment[];
  linkOpen: boolean;
  linkTitle: string;
  linkUrl: string;
  onShowLink: () => void;
  onLinkTitle: (value: string) => void;
  onLinkUrl: (value: string) => void;
  onAddLink: () => void;
  onUpload: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-card border border-border-default bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">ATTACHMENTS &amp; EVIDENCE</h2>
        <div className="flex gap-2">
          <DqButton variant="outline" onClick={onShowLink}><LinkIcon size={15} strokeWidth={1.5} /> Add Link</DqButton>
          <DqButton variant="outline" onClick={onUpload}><Upload size={15} strokeWidth={1.5} /> Add Attachment</DqButton>
        </div>
      </div>
      <div className="border-t border-border-subtle px-5 py-4">
        {linkOpen && (
          <div className="mb-4 grid gap-2 rounded-card border border-border-subtle bg-surface p-3 md:grid-cols-[1fr_1fr_auto]">
            <input value={linkTitle} onChange={(event) => onLinkTitle(event.target.value)} placeholder="Link name" className="dq-input" />
            <input value={linkUrl} onChange={(event) => onLinkUrl(event.target.value)} placeholder="Link URL" className="dq-input" />
            <DqButton variant="navy" onClick={onAddLink}>Save Link</DqButton>
          </div>
        )}
        {attachments.length === 0 ? (
          <DetailEmpty title="No attachments added yet" message="Uploaded files and supporting links will appear here." bordered={false} />
        ) : (
          <div className="space-y-2">
            {attachments.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-button border border-border-subtle bg-surface px-3 py-2 text-sm font-semibold text-primary">
                <span className="inline-flex items-center gap-2"><Paperclip size={14} strokeWidth={1.5} /> {entry.name} · {entry.type}</span>
                <span className="text-xs text-text-muted">{entry.addedBy} · {entry.addedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RequestTimelineTab({ events }: { events: RequestTimelineEvent[] }) {
  if (events.length === 0) {
    return <DetailEmpty title="No visible activity yet" message="Requester-visible updates will appear here as the request progresses." />;
  }
  return (
    <section className="overflow-hidden rounded-card border border-border-default bg-white">
      <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">TIMELINE</h2>
      <div className="space-y-4 px-5 py-4">
        {events.map((entry) => (
          <div key={entry.id} className="border-l-2 border-border-default pl-4 text-sm text-primary">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{entry.label}</span>
              <span className="text-xs font-semibold text-text-muted">{entry.timestamp}</span>
            </div>
            {entry.actor && <div className="mt-1 text-xs font-semibold text-text-secondary">{entry.actor}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestClosureTab({
  draft,
  rating,
  feedback,
  onRating,
  onFeedback,
  onSubmitRating,
  onReopen,
}: {
  draft: ServiceRequest;
  rating: number;
  feedback: string;
  onRating: (value: number) => void;
  onFeedback: (value: string) => void;
  onSubmitRating: () => void;
  onReopen: () => void;
}) {
  const closed = isClosedStatus(draft.status);

  if (!closed) {
    const stageIndex = stageIndexFromStatus(draft.status);
    return (
      <section className="overflow-hidden rounded-card border border-border-default bg-white">
        <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">CLOSURE</h2>
        <div className="space-y-3 p-5 text-sm text-primary">
          <p className="font-bold">Closure not ready</p>
          <p className="text-text-secondary">This request is currently <span className="font-semibold text-primary">{draft.status}</span> and has not reached closure.</p>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Current progress</p>
            <p className="mt-1 font-semibold">{lifecycleStages[stageIndex]} · {Math.round(((stageIndex + 1) / lifecycleStages.length) * 100)}% through the lifecycle</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-text-muted">Still pending</p>
            <p className="mt-1 font-semibold">{draft.nextAction}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-card border border-border-default bg-white">
      <h2 className="border-b border-border-subtle px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary">CLOSURE</h2>
      <div className="space-y-4 p-5 text-sm text-primary">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Closure status</p>
            <p className="mt-1 font-bold">{draft.closureStatus || 'Resolved'}</p>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Closed on</p>
            <p className="mt-1 font-bold">{draft.closedOn || draft.updated}</p>
          </div>
        </div>

        <div className="rounded-card border border-border-subtle p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Service rating</p>
          {draft.rating ? (
            <p className="mt-2 text-lg font-bold text-secondary">{'★'.repeat(draft.rating)}<span className="text-text-muted">{'★'.repeat(5 - draft.rating)}</span></p>
          ) : (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => onRating(value)} aria-label={`Rate ${value}`} className={`text-2xl ${value <= rating ? 'text-secondary' : 'text-border-default'}`}>★</button>
                ))}
              </div>
              <textarea value={feedback} onChange={(event) => onFeedback(event.target.value)} rows={3} placeholder="Add feedback (optional)..." className="dq-textarea mt-3" />
              <DqButton variant="orange" onClick={onSubmitRating} className="mt-3">Submit Rating</DqButton>
            </div>
          )}
          {draft.feedback && <p className="mt-3 rounded-button border border-border-subtle bg-surface px-3 py-2 text-sm leading-6">{draft.feedback}</p>}
        </div>

        <DqButton variant="outline" onClick={onReopen}>Reopen Request</DqButton>
      </div>
    </section>
  );
}

function DetailEmpty({ title, message, bordered = true }: { title: string; message: string; bordered?: boolean }) {
  return (
    <div className={`flex flex-col items-center px-4 py-12 text-center ${bordered ? 'rounded-card border border-border-default bg-white' : ''}`}>
      <FileSearch size={36} strokeWidth={1.5} className="text-text-muted" />
      <h3 className="mt-3 text-lg font-bold text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{message}</p>
    </div>
  );
}

function seedComments(request: ServiceRequest): RequestComment[] {
  if (request.id === 'REQ-2024-0587') {
    return [
      { id: 'cmt-seed-1', author: 'Maya Khan', body: 'Thanks for the request. Could you confirm the cost centre(s) you need access to so we can scope the dashboard permissions?', timestamp: '14 May 2024' },
    ];
  }
  return [];
}

function seedAttachments(request: ServiceRequest): RequestAttachment[] {
  if (request.id === 'REQ-2024-0587') {
    return [{ id: 'att-seed-1', name: 'finance-access-justification.pdf', type: 'File', addedBy: request.requester, addedAt: '12 May 2024', status: 'Submitted' }];
  }
  if (request.id === 'REQ-2024-0521') {
    return [{ id: 'att-seed-2', name: 'manager-approval.eml', type: 'File', addedBy: request.requester, addedAt: '05 May 2024', status: 'Submitted' }];
  }
  return [];
}

function buildActivity(request: ServiceRequest): RequestActivity[] {
  const stage = stageIndexFromStatus(request.status);
  const events: RequestActivity[] = [];
  const team = request.ownerTeam || request.owner;
  events.push({ id: 'seed-submit', actor: request.requester, action: 'Request submitted', timestamp: request.submittedOn || 'Earlier' });
  if (stage >= 1) events.push({ id: 'seed-review', actor: team, action: 'Request reviewed by service team', timestamp: request.submittedOn || 'Earlier' });
  if (request.requiredInfoPrompt || stage === 2) events.push({ id: 'seed-info', actor: request.fulfilmentOwner || team, action: 'Information requested from requester', timestamp: request.updated });
  if (stage >= 3) events.push({ id: 'seed-progress', actor: request.fulfilmentOwner || team, action: 'Request moved to in progress', timestamp: request.updated });
  if (stage >= 4) events.push({ id: 'seed-resolved', actor: request.fulfilmentOwner || team, action: 'Request resolved', timestamp: request.closedOn || request.updated });
  if (stage >= 5) events.push({ id: 'seed-closed', actor: request.fulfilmentOwner || team, action: 'Request closed', timestamp: request.closedOn || request.updated });
  return events.reverse();
}

function buildTimeline(activity: RequestActivity[]): RequestTimelineEvent[] {
  return [...activity].reverse().map((entry) => ({ id: `tl-${entry.id}`, label: entry.action, timestamp: entry.timestamp, actor: entry.actor }));
}

function ServicesPageFrame({
  breadcrumbs,
  overline,
  title,
  description,
  action,
  children,
}: {
  breadcrumbs: Array<{ label: string; route?: string }>;
  overline?: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        {breadcrumbs.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.route ? (
              <Link className="font-semibold text-primary hover:text-secondary" to={item.route}>
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-text-secondary">{item.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <span aria-hidden="true">/</span>}
          </span>
        ))}
      </nav>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {overline && <div className="dq-overline mb-2">{overline}</div>}
          <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{description}</p>
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
      </header>
      {children}
    </main>
  );
}

function badgeTone(label: string): string {
  switch (label) {
    // Green — healthy / resolved / on track
    case 'On Track':
    case 'Resolved':
    case 'Completed':
      return 'bg-success-surface text-success-text';
    // Amber / orange — attention / paused / at risk / in review
    case 'At Risk':
    case 'Paused':
    case 'Awaiting Info':
    case 'Pending Information':
    case 'On Hold':
    case 'In Review':
    case 'Ready for Closure':
    case 'Closure Review':
      return 'bg-warning-surface text-warning-text';
    // Red — breached / critical / escalated / overdue
    case 'Breached':
    case 'Critical':
    case 'Escalated':
    case 'Overdue':
      return 'bg-danger-surface text-danger-text';
    // Blue / navy — active / in-progress states
    case 'New':
    case 'Assigned':
    case 'In Progress':
    case 'Triaged':
    case 'Reopened':
      return 'bg-info-surface text-info-text';
    // Grey — closed / cancelled / neutral states
    case 'Closed':
    case 'Cancelled':
    case 'Unassigned':
    default:
      return 'bg-surface text-text-secondary';
  }
}

function StatusBadge({ label }: { label: string }) {
  return <span className={`rounded-pill px-2.5 py-1 text-xs font-bold ${badgeTone(label)}`}>{label}</span>;
}

function SlaBadge({ label }: { label: ServiceSlaStatus }) {
  return <span className={`rounded-pill px-2.5 py-1 text-xs font-bold ${badgeTone(label)}`}>{label}</span>;
}
