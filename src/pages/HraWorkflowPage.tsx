import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { getRequests, getApprovals } from '../services/platform.service';
import type { RequestRecord, Approval } from '../types/platform';
import { toast } from 'sonner';
import { CheckSquare, AlertCircle } from 'lucide-react';
export function HraWorkflowPage() {
  const [activeTab, setActiveTab] = useState('Onboarding');
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnRationale, setReturnRationale] = useState('');
  const tabs = ['Onboarding', 'Role Transition', 'HRA Requests', 'Policy Checks', 'Returned'];
  useEffect(() => {
    Promise.all([getRequests(), getApprovals()]).then(([r, a]) => {
      setRequests(r.filter((req) => req.category === 'HRA Requests'));
      setApprovals(a.filter((app) => app.type === 'HRA Request Approval'));
    });
  }, []);
  const hraRequestsCount = requests.length;
  const returnedCount = approvals.filter((a) => a.status === 'Returned').length;
  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('HRA request approved in prototype mode');
  };
  const handleReturnClick = (e: React.MouseEvent, req: RequestRecord) => {
    e.stopPropagation();
    setSelectedRequest(req);
    setShowReturnModal(true);
  };
  const submitReturn = () => {
    toast.warning('Request returned to sender');
    setShowReturnModal(false);
    setReturnRationale('');
    setSelectedRequest(null);
  };
  const columns = [{
    header: 'ID',
    accessor: (row: RequestRecord) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: RequestRecord) => <span className="font-medium">{row.title}</span>
  }, {
    header: 'Requester',
    accessor: (row: RequestRecord) => <OwnerBadge userId={row.requesterUserId} />
  }, {
    header: 'Status',
    accessor: (row: RequestRecord) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: RequestRecord) => <div className="flex gap-2">
          <button onClick={handleApprove} className="text-xs font-medium text-success hover:underline">
            Approve
          </button>
          <button onClick={(e) => handleReturnClick(e, row)} className="text-xs font-medium text-danger hover:underline">
            Return
          </button>
        </div>
  }];
  // Mock checklist state
  const [checklist, setChecklist] = useState({
    c1: true,
    c2: true,
    c3: false,
    c4: false
  });
  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">HRA Workflow</h1>
        <p className="text-text-secondary">
          Manage onboarding, role transitions, and HR policy compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="HRA Requests" value={hraRequestsCount.toString()} status="info" />
        <KpiTile label="Onboarding Workflows" value="5" status="info" />
        <KpiTile label="Policy Checks Pending" value="2" status="warning" />
        <KpiTile label="Returned Items" value={returnedCount.toString()} status="danger" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-primary">
                HRA Request Queue
              </h2>
            </div>
            <DataTable columns={columns} rows={requests} onRowClick={setSelectedRequest} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckSquare size={16} className="text-secondary" />
              Onboarding Checklist
            </h3>
            <p className="text-xs text-text-muted mb-4">
              REQ-2002: New joiner onboarding
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={checklist.c1} onChange={() => toggleChecklist('c1')} className="mt-1 text-primary focus:ring-primary rounded-sm" />
                <div>
                  <span className={`text-sm font-medium ${checklist.c1 ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    Identity Verification
                  </span>
                  <p className="text-xs text-text-muted">
                    ID documents verified and stored.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={checklist.c2} onChange={() => toggleChecklist('c2')} className="mt-1 text-primary focus:ring-primary rounded-sm" />
                <div>
                  <span className={`text-sm font-medium ${checklist.c2 ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    Contract Signed
                  </span>
                  <p className="text-xs text-text-muted">
                    Employment contract executed.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={checklist.c3} onChange={() => toggleChecklist('c3')} className="mt-1 text-primary focus:ring-primary rounded-sm" />
                <div>
                  <span className={`text-sm font-medium ${checklist.c3 ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    Policy Acknowledgement
                  </span>
                  <p className="text-xs text-danger">Missing evidence</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={checklist.c4} onChange={() => toggleChecklist('c4')} className="mt-1 text-primary focus:ring-primary rounded-sm" />
                <div>
                  <span className={`text-sm font-medium ${checklist.c4 ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    IT Provisioning
                  </span>
                  <p className="text-xs text-text-muted">
                    Hardware and access requested.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-danger" />
              Workforce Readiness
            </h3>
            <div className="p-4 bg-surface rounded border border-border-subtle">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-primary">
                  Compliance Training
                </span>
                <span className="text-xs font-bold text-danger">82%</span>
              </div>
              <div className="w-full bg-border-subtle rounded-full h-1.5 mb-2">
                <div className="bg-danger h-1.5 rounded-full" style={{
                width: '82%'
              }} />
              </div>
              <p className="text-xs text-text-muted">
                Below 90% threshold. 14 associates overdue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && !showReturnModal && <DetailPanel entity={selectedRequest} type="request" onClose={() => setSelectedRequest(null)} />}

      {showReturnModal && selectedRequest && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowReturnModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-danger mb-2">
              Return Request
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Provide a rationale for returning{' '}
              <span className="font-mono">{selectedRequest.id}</span>
            </p>

            <textarea value={returnRationale} onChange={(e) => setReturnRationale(e.target.value)} placeholder="Why is this being returned? What is missing?" rows={4} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-error resize-none mb-4" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                Cancel
              </button>
              <button onClick={submitReturn} disabled={!returnRationale.trim()} className="px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-danger/90 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Return Request
              </button>
            </div>
          </div>
        </>}
    </div>;
}