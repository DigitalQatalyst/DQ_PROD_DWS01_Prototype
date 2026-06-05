import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestsConsole } from '../../context/RequestsConsoleContext';
import { RequestsConsoleKpiStrip } from '../../components/requests-console/RequestsConsoleKpiStrip';
import { RequestsConsoleTabs } from '../../components/requests-console/RequestsConsoleTabs';
import { QueueViewSelector } from '../../components/requests-console/QueueViewSelector';
import {
  RequestsFilterPanel,
  emptyRequestsFilters,
  type RequestsFilterState,
} from '../../components/requests-console/RequestsFilterPanel';
import { RequestsTable } from '../../components/requests-console/RequestsTable';
import type { FulfilmentRequestRow, QueueViewId, RequestsConsoleTab } from '../../types/requestsConsole';
import {
  applyPanelFilters,
  computeKpis,
  DEFAULT_CONSOLE_KPIS,
  filterByQueueView,
  filterByTab,
} from '../../utils/requestsConsoleFilters';

function hasPanelFilters(filters: RequestsFilterState): boolean {
  return Object.values(filters).some((v) => v !== '');
}

function hasContextFilters(
  tab: RequestsConsoleTab,
  queue: QueueViewId,
  filters: RequestsFilterState
): boolean {
  return tab !== 'All Requests' || queue !== 'all' || hasPanelFilters(filters);
}

export function RequestsConsolePage() {
  const navigate = useNavigate();
  const { state } = useRequestsConsole();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<RequestsConsoleTab>('All Requests');
  const [activeQueue, setActiveQueue] = useState<QueueViewId>('all');
  const [filters, setFilters] = useState<RequestsFilterState>(emptyRequestsFilters);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => [...new Set(state.requests.map((r) => r.category))], [state.requests]);
  const owners = useMemo(() => [...new Set(state.requests.map((r) => r.owner))], [state.requests]);
  const queues = useMemo(() => [...new Set(state.requests.map((r) => r.queue))], [state.requests]);

  const filteredRows = useMemo(() => {
    let rows = state.requests;
    rows = filterByTab(rows, activeTab);
    rows = filterByQueueView(rows, activeQueue);
    rows = applyPanelFilters(rows, filters);
    return rows;
  }, [state.requests, activeTab, activeQueue, filters]);

  const kpiValues = useMemo(() => {
    if (!hasContextFilters(activeTab, activeQueue, filters)) {
      return DEFAULT_CONSOLE_KPIS;
    }
    return computeKpis(filteredRows);
  }, [activeTab, activeQueue, filters, filteredRows]);

  const handleClearAll = () => {
    setActiveTab('All Requests');
    setActiveQueue('all');
    setFilters(emptyRequestsFilters);
  };

  const openDetail = (row: FulfilmentRequestRow) => {
    navigate(`/stage-03/requests-console/${row.id}`);
  };

  const openProgress = (row: FulfilmentRequestRow, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stage-03/requests-console/${row.id}/progress`);
  };

  const openEvidence = (row: FulfilmentRequestRow, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stage-03/requests-console/${row.id}`);
  };

  const openHandoff = (row: FulfilmentRequestRow, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stage-03/requests-console/${row.id}/handoff`);
  };

  const openEscalate = (row: FulfilmentRequestRow, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/stage-03/requests-console/${row.id}/escalate`);
  };

  const handleNextAction = (row: FulfilmentRequestRow, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (row.nextAction) {
      case 'Update Progress':
        openProgress(row, e);
        break;
      case 'Add Evidence':
        openEvidence(row, e);
        break;
      case 'Handoff':
        openHandoff(row, e);
        break;
      case 'Escalate':
      case 'Inspect Escalation':
        openEscalate(row, e);
        break;
      case 'Mark Fulfilled':
        toast.success(`Marked ${row.id} as fulfilled (prototype)`);
        break;
      default:
        openDetail(row);
    }
    toast.success(`${row.nextAction} — ${row.id}`, { duration: 3000 });
  };

  const rowActionToast = (label: string, row: FulfilmentRequestRow, e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigate(path);
    toast.success(`${label} — ${row.id}`, { duration: 3000 });
  };

  return (
    <div className="bg-[#F6F6FB] min-h-full pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Stage 03</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">Requests Console</h1>
            <p className="text-sm text-text-secondary max-w-2xl">
              Track fulfilment, owner progress, SLA exposure, closure quality, and queue health.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => toast.info('Export placeholder — not connected in prototype', { duration: 3000 })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-button border border-border-strong bg-white text-sm font-semibold text-primary hover:bg-surface transition-colors"
            >
              <Download size={16} />
              Export
            </button>
            <button
              type="button"
              onClick={() => toast.info('Console settings placeholder — configuration is read-only in this prototype', { duration: 3000 })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-button border border-border-strong bg-white text-sm font-semibold text-primary hover:bg-surface transition-colors"
            >
              <Settings size={16} />
              Console settings
            </button>
          </div>
        </header>

        <RequestsConsoleKpiStrip values={kpiValues} loading={loading} />
        <RequestsConsoleTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <QueueViewSelector activeQueue={activeQueue} onQueueChange={setActiveQueue} />

        <div className="min-w-0">
          <RequestsFilterPanel
            filters={filters}
            onChange={setFilters}
            resultCount={filteredRows.length}
            onClear={handleClearAll}
            categories={categories}
            owners={owners}
            queues={queues}
          />
          <RequestsTable
            rows={filteredRows}
            loading={loading}
            onRowClick={openDetail}
            onUpdateProgress={(row, e) => rowActionToast('Update Progress', row, e, `/stage-03/requests-console/${row.id}/progress`)}
            onAddEvidence={openEvidence}
            onHandoff={(row, e) => rowActionToast('Handoff', row, e, `/stage-03/requests-console/${row.id}/handoff`)}
            onEscalate={(row, e) => rowActionToast('Escalate', row, e, `/stage-03/requests-console/${row.id}/escalate`)}
            onNextAction={handleNextAction}
            onClearFilters={handleClearAll}
          />
        </div>
      </div>
    </div>
  );
}
