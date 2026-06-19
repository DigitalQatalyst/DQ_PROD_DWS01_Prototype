export const SUBMITTED_REQUEST_STATUSES = new Set([
  'Submitted',
  'Pending Approval',
  'In Fulfilment',
  'In Review',
  'New',
  'Routed',
]);

export function myRequestsTabForStatus(status: string): string {
  if (status === 'Draft') return 'Drafts';
  if (status === 'Closed') return 'Closed';
  if (status === 'Pending Info') return 'Pending Info';
  if (status === 'In Review') return 'In Review';
  return 'Submitted';
}

export function workspaceTabForStatus(status: string): string {
  if (status === 'Draft') return 'Drafts';
  if (status === 'Closed' || status === 'Completed') return 'Completed';
  if (['Awaiting Input', 'Pending Info', 'Returned for Information'].includes(status)) {
    return 'Awaiting Input';
  }
  if (status === 'In Fulfilment') return 'In Fulfilment';
  if (status === 'Rejected') return 'Rejected';
  if (SUBMITTED_REQUEST_STATUSES.has(status)) return 'Submitted';
  return 'All';
}

export function isSubmittedRequestStatus(status: string): boolean {
  return SUBMITTED_REQUEST_STATUSES.has(status);
}

export function formatLocalStorageRequest(r: Record<string, unknown>) {
  const rawDate = (r.lastUpdate || r.lastUpdated || r.submittedAt || '') as string;
  let lastUpdate = rawDate;
  if (rawDate && rawDate.includes('T')) {
    try {
      const d = new Date(rawDate);
      lastUpdate = `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      lastUpdate = 'Just now';
    }
  } else if (!rawDate) {
    lastUpdate = 'Just now';
  }

  return {
    ...r,
    title: (r.title as string) || (r.service as string) || 'Unknown Request',
    type: (r.type as string) || 'Request',
    dueDate: (r.dueDate as string) || 'Pending',
    source: (r.source as string) || (r.category as string) || 'Unknown',
    lastUpdate,
    owner: (r.owner as string) || 'Unassigned',
    status: (r.status as string) || 'Submitted',
    priority: (r.priority as string) || (r.urgency as string) || 'Normal',
    expectedOutcome: (r.expectedOutcome as string) || '',
    category: (r.category as string) || 'Platform Support',
    queueId: (r.queueId as string) || 'default',
    slaState:
      r.sla === 'At Risk' ? 'At Risk' : r.sla === 'Breached' ? 'Breached' : 'On Track',
    requesterUserId: 'USR-001',
    ownerUserId: 'USR-002',
  };
}

export const MY_REQUESTS_PATH = '/services/service-hub/my-requests';

export function myRequestsHref(requestId?: string): string {
  if (!requestId) return MY_REQUESTS_PATH;
  return `${MY_REQUESTS_PATH}?highlight=${encodeURIComponent(requestId)}`;
}
