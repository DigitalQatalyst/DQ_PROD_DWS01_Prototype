import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { getRequests, getQueues } from '../services/platform.service';
import type { RequestRecord, Queue } from '../types/platform';
import { toast } from 'sonner';
import { Inbox, BookOpen, ArrowRight } from 'lucide-react';
export function SupportOperationsPage() {
  const [activeTab, setActiveTab] = useState('New');
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const tabs = ['New', 'Pending Info', 'Routed', 'At Risk', 'Closed'];
  useEffect(() => {
    Promise.all([getRequests(), getQueues()]).then(([r, q]) => {
      setRequests(r);
      setQueues(q);
    });
  }, []);
  const centralQueue = queues.find((q) => q.id === 'QUE-5001');
  const newCount = centralQueue?.newCount || 0;
  const atRiskCount = centralQueue?.atRiskCount || 0;
  const pendingInfoCount = requests.filter((r) => r.status === 'Pending Info').length;
  const handleTriage = (e: React.MouseEvent, req: RequestRecord) => {
    e.stopPropagation();
    setSelectedRequest(req);
  };
  const handleRoute = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request routed to fulfilment owner');
    setShowRouteModal(false);
    setSelectedRequest(null);
  };
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Request closed');
  };
  const columns = [{
    header: 'ID',
    accessor: (row: RequestRecord) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: RequestRecord) => <span className="font-medium truncate max-w-[200px] block">
          {row.title}
        </span>
  }, {
    header: 'Category',
    accessor: (row: RequestRecord) => <span className="text-xs text-text-muted">{row.category}</span>
  }, {
    header: 'Status',
    accessor: (row: RequestRecord) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: RequestRecord) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Action',
    accessor: (row: RequestRecord) => <div className="flex gap-3">
          <button onClick={(e) => handleTriage(e, row)} className="text-xs font-medium text-primary hover:underline">
            Triage
          </button>
          <button onClick={(e) => {
        e.stopPropagation();
        setSelectedRequest(row);
        setShowRouteModal(true);
      }} className="text-xs font-medium text-secondary hover:underline">
            Route
          </button>
          <button onClick={handleClose} className="text-xs font-medium text-success hover:underline">
            Close
          </button>
        </div>
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Support Operations
        </h1>
        <p className="text-text-secondary">
          Triage, route, and fulfil incoming service requests.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="New Requests" value={newCount.toString()} status="info" />
        <KpiTile label="At Risk" value={atRiskCount.toString()} status="warning" />
        <KpiTile label="Pending Info" value={pendingInfoCount.toString()} status="warning" />
        <KpiTile label="Closed Today" value="12" status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Central Support Queue
              </h2>
            </div>
            <DataTable columns={columns} rows={requests} onRowClick={setSelectedRequest} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Inbox size={16} className="text-secondary" />
              Request Triage
            </h3>
            {selectedRequest ? <div className="space-y-4">
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Selected Request
                  </span>
                  <MonoId value={selectedRequest.id} />
                  <p className="text-sm font-medium text-primary mt-1">
                    {selectedRequest.title}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Expected Outcome
                  </span>
                  <p className="text-sm text-text-secondary">
                    {selectedRequest.expectedOutcome}
                  </p>
                </div>
                <div className="pt-4 border-t border-border-subtle space-y-2">
                  <button onClick={() => setShowRouteModal(true)} className="w-full py-2 bg-primary text-white text-sm font-medium rounded-button hover:bg-navy-800 transition-colors">
                    Route to Owner
                  </button>
                  <button onClick={() => toast.success('Evidence attached')} className="w-full py-2 bg-surface text-primary text-sm font-medium rounded-button hover:bg-border-subtle transition-colors">
                    Attach Evidence
                  </button>
                </div>
              </div> : <p className="text-sm text-text-muted italic text-center py-8">
                Select a request to triage.
              </p>}
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen size={16} className="text-info-text" />
              Knowledge Assistance
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-surface rounded border border-border-subtle cursor-pointer hover:border-border-strong transition-colors">
                <h4 className="text-sm font-medium text-primary mb-1">
                  Routing Matrix v2
                </h4>
                <p className="text-xs text-text-muted">
                  Standard operating procedure for request routing.
                </p>
              </div>
              <div className="p-3 bg-surface rounded border border-border-subtle cursor-pointer hover:border-border-strong transition-colors">
                <h4 className="text-sm font-medium text-primary mb-1">
                  SLA Exception Policy
                </h4>
                <p className="text-xs text-text-muted">
                  When to pause or reset SLA timers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && !showRouteModal && <DetailPanel entity={selectedRequest} type="request" onClose={() => setSelectedRequest(null)} />}

      {showRouteModal && selectedRequest && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowRouteModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-primary mb-6">
              Route Request
            </h3>

            <form onSubmit={handleRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Target Queue
                </label>
                <select className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" required>
                  <option value="">Select queue...</option>
                  {queues.map((q) => <option key={q.id} value={q.id}>
                      {q.name}
                    </option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Assign Owner (Optional)
                </label>
                <select className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy">
                  <option value="">Unassigned</option>
                  <option value="USR-005">Grace Wanjiru (HRA)</option>
                  <option value="USR-006">Elena Costa (Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Routing Note
                </label>
                <textarea rows={2} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowRouteModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-navy-800 rounded-button transition-colors flex items-center gap-2">
                  Route
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </>}
    </div>;
}