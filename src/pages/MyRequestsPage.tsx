import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { getRequests } from '../services/platform.service';
import type { RequestRecord } from '../types/platform';
import { usePersona } from '../context/PersonaContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
export function MyRequestsPage() {
  const [activeTab, setActiveTab] = useState('Submitted');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoText, setInfoText] = useState('');
  const {
    activePersona
  } = usePersona();
  const navigate = useNavigate();
  const tabs = ['Submitted', 'Drafts', 'Pending Info', 'In Review', 'Closed'];
  useEffect(() => {
    getRequests().then((allRequests) => {
      // Filter for requests where user is requester or owner (if HRA)
      let visible = allRequests.filter((r) => r.requesterUserId === 'USR-001');
      if (activePersona.id === 'hra') {
        visible = allRequests.filter((r) => r.requesterUserId === 'USR-001' || r.ownerUserId === 'USR-005');
      }
      setRequests(visible);
    });
  }, [activePersona]);
  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'Submitted') return r.status !== 'Draft' && r.status !== 'Closed';
    if (activeTab === 'Drafts') return r.status === 'Draft';
    if (activeTab === 'Pending Info') return r.status === 'Pending Info';
    if (activeTab === 'In Review') return r.status === 'In Review';
    if (activeTab === 'Closed') return r.status === 'Closed';
    return true;
  }).filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));
  const submitted = requests.filter((r) => r.status !== 'Draft' && r.status !== 'Closed').length;
  const pendingInfo = requests.filter((r) => r.status === 'Pending Info').length;
  const atRisk = requests.filter((r) => r.slaState === 'At Risk').length;
  const closed = requests.filter((r) => r.status === 'Closed').length;
  const handleProvideInfo = (e: React.MouseEvent, request: RequestRecord) => {
    e.stopPropagation();
    setSelectedRequest(request);
    setShowInfoModal(true);
  };
  const submitInfo = () => {
    toast.success('Information provided in prototype mode');
    setShowInfoModal(false);
    setInfoText('');
    setSelectedRequest(null);
  };
  const columns = [{
    header: 'ID',
    accessor: (row: RequestRecord) => <MonoId value={row.id} />
  }, {
    header: 'Category',
    accessor: (row: RequestRecord) => <span className="text-xs font-medium text-text-muted">
          {row.category}
        </span>
  }, {
    header: 'Title',
    accessor: (row: RequestRecord) => <span className="font-medium truncate max-w-[200px] block" title={row.title}>
          {row.title}
        </span>
  }, {
    header: 'Status',
    accessor: (row: RequestRecord) => <StatusPill status={row.status} />
  }, {
    header: 'SLA',
    accessor: (row: RequestRecord) => <SlaBadge state={row.slaState} />
  }, {
    header: 'Owner',
    accessor: (row: RequestRecord) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Action',
    accessor: (row: RequestRecord) => row.status === 'Pending Info' ? <button onClick={(e) => handleProvideInfo(e, row)} className="text-secondary hover:underline text-sm font-medium">
            Provide Info
          </button> : <span className="text-sm text-text-disabled">View</span>
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Requests</h1>
          <p className="text-text-secondary">
            Track the status of your submitted service requests.
          </p>
        </div>
        <button onClick={() => navigate('/marketplaces/services')} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-button font-medium hover:bg-navy-800 transition-colors">
          <Plus size={16} />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Submitted" value={submitted.toString()} status="info" />
        <KpiTile label="Pending Info" value={pendingInfo.toString()} status="warning" />
        <KpiTile label="At Risk" value={atRisk.toString()} status="danger" />
        <KpiTile label="Closed" value={closed.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} search={search} onSearchChange={setSearch} />

      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={filteredRequests} onRowClick={setSelectedRequest} emptyMessage="No requests found matching your criteria." />
      </div>

      {selectedRequest && !showInfoModal && <DetailPanel entity={selectedRequest} type="request" onClose={() => setSelectedRequest(null)} />}

      {showInfoModal && selectedRequest && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowInfoModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-primary mb-2">
              Provide Information
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Add details for{' '}
              <span className="font-mono">{selectedRequest.id}</span>
            </p>

            <textarea value={infoText} onChange={(e) => setInfoText(e.target.value)} placeholder="Enter the requested information..." rows={4} className="w-full p-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy resize-none mb-4" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowInfoModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                Cancel
              </button>
              <button onClick={submitInfo} disabled={!infoText.trim()} className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-navy-800 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Info
              </button>
            </div>
          </div>
        </>}
    </div>;
}