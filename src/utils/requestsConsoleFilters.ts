import type { FulfilmentRequestRow, QueueViewId, RequestsConsoleTab } from '../types/requestsConsole';
import { DEFAULT_ASSIGNED_OWNER, QUEUE_VIEW_OPTIONS } from '../types/requestsConsole';
import type { RequestsFilterState } from '../components/requests-console/RequestsFilterPanel';
import type { RequestsConsoleKpiValues } from '../components/requests-console/RequestsConsoleKpiStrip';

export function filterByTab(rows: FulfilmentRequestRow[], tab: RequestsConsoleTab): FulfilmentRequestRow[] {
  switch (tab) {
    case 'All Requests':
      return rows;
    case 'My Assigned':
      return rows.filter((r) => r.owner === DEFAULT_ASSIGNED_OWNER);
    case 'Routed':
      return rows.filter((r) => r.fulfilmentStatus === 'Routed');
    case 'In Fulfilment':
      return rows.filter((r) => r.fulfilmentStatus === 'In Fulfilment');
    case 'Blocked':
      return rows.filter((r) => r.fulfilmentStatus === 'Blocked');
    case 'Escalated':
      return rows.filter((r) => r.fulfilmentStatus === 'Escalated');
    case 'Closure Review':
      return rows.filter((r) => r.fulfilmentStatus === 'Closure Review');
    case 'Closed / Reopened':
      return rows.filter((r) => ['Closed', 'Reopened'].includes(r.fulfilmentStatus));
    default:
      return rows;
  }
}

export function filterByQueueView(rows: FulfilmentRequestRow[], queueId: QueueViewId): FulfilmentRequestRow[] {
  const option = QUEUE_VIEW_OPTIONS.find((q) => q.id === queueId);
  if (!option?.queueMatch) return rows;
  return rows.filter((r) => r.queue === option.queueMatch);
}

function matchesAgeing(row: FulfilmentRequestRow, ageing: string): boolean {
  if (!ageing) return true;
  if (ageing === 'Closed') return row.age === 'Closed';
  if (ageing === 'Under 8h') return row.age.includes('h') && !row.age.includes('d');
  if (ageing === '8h–1d') return row.age.includes('d') && row.age.startsWith('1d');
  if (ageing === '1d+') return row.age.includes('2d') || row.age.includes('1d 8h');
  return true;
}

export function applyPanelFilters(rows: FulfilmentRequestRow[], filters: RequestsFilterState): FulfilmentRequestRow[] {
  const q = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (q) {
      const haystack = [
        row.id,
        row.title,
        row.owner,
        row.requester,
        row.queue,
        row.category,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.queue && row.queue !== filters.queue) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (filters.owner && row.owner !== filters.owner) return false;
    if (filters.priority && row.priority !== filters.priority) return false;
    if (filters.slaState && row.slaState !== filters.slaState) return false;
    if (filters.fulfilmentStatus && row.fulfilmentStatus !== filters.fulfilmentStatus) return false;
    if (filters.recurrence && row.recurrence !== filters.recurrence) return false;
    if (filters.evidenceState && row.evidenceState !== filters.evidenceState) return false;
    if (filters.closureQuality && row.closureQuality !== filters.closureQuality) return false;
    if (!matchesAgeing(row, filters.ageing)) return false;
    return true;
  });
}

export function computeKpis(rows: FulfilmentRequestRow[]): RequestsConsoleKpiValues {
  const active = rows.filter((r) => !['Closed'].includes(r.fulfilmentStatus)).length;
  return {
    active,
    slaAtRisk: rows.filter((r) => r.slaState === 'At Risk').length,
    breached: rows.filter((r) => r.slaState === 'Breached').length,
    blocked: rows.filter((r) => r.fulfilmentStatus === 'Blocked').length,
    closureReview: rows.filter((r) => r.fulfilmentStatus === 'Closure Review').length,
    reopened: rows.filter((r) => r.fulfilmentStatus === 'Reopened').length,
  };
}

/** Default KPI strip values from spec fixture set */
export const DEFAULT_CONSOLE_KPIS: RequestsConsoleKpiValues = {
  active: 27,
  slaAtRisk: 6,
  breached: 2,
  blocked: 4,
  closureReview: 5,
  reopened: 3,
};
