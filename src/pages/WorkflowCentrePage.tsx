import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { getWorkflows, getApprovals, getTasks, getRequests } from '../services/platform.service';
import type { WorkflowItem, Approval, Task, RequestRecord } from '../types/platform';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
export function WorkflowCentrePage() {
  const [activeTab, setActiveTab] = useState('Pending Approvals');
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [entityType, setEntityType] = useState<'workflow' | 'approval' | 'task' | 'request' | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnRationale, setReturnRationale] = useState('');
  const tabs = ['Pending Approvals', 'Escalations', 'SLA Risks', 'Handoffs', 'Decision Log'];
  useEffect(() => {
    Promise.all([getWorkflows(), getApprovals(), getTasks(), getRequests()]).then(([w, a, t, r]) => {
      setWorkflows(w);
      setApprovals(a);
      setTasks(t);
      setRequests(r);
    });
  }, []);
  const pendingApprovals = approvals.filter((a) => a.status === 'Pending').length;
  const escalations = requests.filter((r) => r.category === 'Escalations').length;
  const slaRisks = tasks.filter((t) => t.slaState === 'At Risk' || t.slaState === 'Breached').length + requests.filter((r) => r.slaState === 'At Risk' || r.slaState === 'Breached').length;
  const decisionsLogged = approvals.filter((a) => a.status !== 'Pending').length;
  const handleApprove = (e: React.MouseEvent, approval: Approval) => {
    e.stopPropagation();
    toast.success('Approval recorded in prototype mode');
  };
  const handleReturnClick = (e: React.MouseEvent, approval: Approval) => {
    e.stopPropagation();
    setSelectedEntity(approval);
    setEntityType('approval');
    setShowReturnModal(true);
  };
  const submitReturn = () => {
    toast.warning('Item returned with rationale');
    setShowReturnModal(false);
    setReturnRationale('');
    setSelectedEntity(null);
    setEntityType(null);
  };
  const approvalColumns = [{
    header: 'ID',
    accessor: (row: Approval) => <MonoId value={row.id} />
  }, {
    header: 'Type',
    accessor: (row: Approval) => <span className="font-medium">{row.type}</span>
  }, {
    header: 'Linked To',
    accessor: (row: Approval) => <MonoId value={row.linkedTaskId || row.linkedRequestId || ''} />
  }, {
    header: 'Approver',
    accessor: (row: Approval) => <OwnerBadge userId={row.approverUserId} />
  }, {
    header: 'Status',
    accessor: (row: Approval) => <StatusPill status={row.status} />
  }, {
    header: 'Action',
    accessor: (row: Approval) => row.status === 'Pending' ? <div className="flex gap-2">
            <button onClick={(e) => handleApprove(e, row)} className="text-xs font-medium text-success hover:underline flex items-center gap-1">
              <CheckCircle size={14} /> Approve
            </button>
            <button onClick={(e) => handleReturnClick(e, row)} className="text-xs font-medium text-danger hover:underline flex items-center gap-1">
              <XCircle size={14} /> Return
            </button>
          </div> : <span className="text-xs text-text-disabled">Completed</span>
  }];
  const workflowColumns = [{
    header: 'ID',
    accessor: (row: WorkflowItem) => <MonoId value={row.id} />
  }, {
    header: 'Name',
    accessor: (row: WorkflowItem) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'State',
    accessor: (row: WorkflowItem) => <span className="text-sm">{row.state}</span>
  }, {
    header: 'SLA',
    accessor: (row: WorkflowItem) => <span className="text-xs font-medium text-warning-text">
          {row.slaLabel}
        </span>
  }, {
    header: 'Linked To',
    accessor: (row: WorkflowItem) => <MonoId value={row.linkedTaskId || row.linkedRequestId || ''} />
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Workflow Centre
        </h1>
        <p className="text-text-secondary">
          Manage approvals, escalations, and cross-functional handoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Pending Approvals" value={pendingApprovals.toString()} status="info" />
        <KpiTile label="Escalations" value={escalations.toString()} status="danger" />
        <KpiTile label="SLA Risks" value={slaRisks.toString()} status="warning" />
        <KpiTile label="Decisions Logged" value={decisionsLogged.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {activeTab === 'Pending Approvals' && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-primary">
                  Approval Queue
                </h2>
              </div>
              <DataTable columns={approvalColumns} rows={approvals.filter((a) => a.status === 'Pending')} onRowClick={(row) => {
            setSelectedEntity(row);
            setEntityType('approval');
          }} />
            </div>}

          {activeTab === 'Decision Log' && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-primary">
                  Decision Log
                </h2>
              </div>
              <DataTable columns={approvalColumns} rows={approvals.filter((a) => a.status !== 'Pending')} onRowClick={(row) => {
            setSelectedEntity(row);
            setEntityType('approval');
          }} />
            </div>}

          {(activeTab === 'Escalations' || activeTab === 'SLA Risks' || activeTab === 'Handoffs') && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-primary">
                  Active Workflows
                </h2>
              </div>
              <DataTable columns={workflowColumns} rows={workflows} onRowClick={(row) => {
            setSelectedEntity(row);
            setEntityType('workflow');
          }} />
            </div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-danger" />
              Active Escalations
            </h3>
            <div className="space-y-4">
              {requests.filter((r) => r.category === 'Escalations' || r.urgency === 'High').slice(0, 3).map((req) => <div key={req.id} onClick={() => {
              setSelectedEntity(req);
              setEntityType('request');
            }} className="p-3 bg-danger-surface border border-danger/20 rounded cursor-pointer hover:border-danger transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <MonoId value={req.id} />
                      <span className="text-[10px] font-bold uppercase text-danger">
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm font-medium text-danger-text mb-2">
                      {req.title}
                    </p>
                    <OwnerBadge userId={req.ownerUserId} />
                  </div>)}
            </div>
          </div>
        </div>
      </div>

      {selectedEntity && entityType && !showReturnModal && <DetailPanel entity={selectedEntity} type={entityType} onClose={() => {
      setSelectedEntity(null);
      setEntityType(null);
    }} />}

      {showReturnModal && selectedEntity && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowReturnModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-danger mb-2">
              Return Approval
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Provide a rationale for returning{' '}
              <span className="font-mono">{selectedEntity.id}</span>
            </p>

            <textarea value={returnRationale} onChange={(e) => setReturnRationale(e.target.value)} placeholder="Why is this being returned? What needs to be fixed?" rows={4} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-error resize-none mb-4" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReturnModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                Cancel
              </button>
              <button onClick={submitReturn} disabled={!returnRationale.trim()} className="px-4 py-2 text-sm font-medium bg-danger text-white hover:bg-danger/90 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Return Item
              </button>
            </div>
          </div>
        </>}
    </div>;
}