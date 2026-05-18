import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { getTasks, getRequests } from '../services/platform.service';
import type { Task, RequestRecord } from '../types/platform';
export function SlaDashboardPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [entityType, setEntityType] = useState<'task' | 'request' | null>(null);
  const tabs = ['All', 'Tasks', 'Requests', 'Approvals', 'Escalations'];
  useEffect(() => {
    Promise.all([getTasks(), getRequests()]).then(([t, r]) => {
      setTasks(t);
      setRequests(r);
    });
  }, []);
  const allItems = [...tasks.map((t) => ({
    ...t,
    _type: 'task' as const
  })), ...requests.map((r) => ({
    ...r,
    _type: 'request' as const
  }))];
  const onTrack = allItems.filter((i) => i.slaState === 'On Track').length;
  const atRisk = allItems.filter((i) => i.slaState === 'At Risk').length;
  const breached = allItems.filter((i) => i.slaState === 'Breached').length;
  const met = allItems.filter((i) => i.slaState === 'Met').length;
  const filteredItems = allItems.filter((i) => {
    if (activeTab === 'Tasks') return i._type === 'task';
    if (activeTab === 'Requests') return i._type === 'request';
    if (activeTab === 'Escalations') return i._type === 'request' && (i as RequestRecord).category === 'Escalations';
    // Approvals don't have SLA state in our mock data structure directly, skipping for prototype
    return true;
  });
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Type',
    accessor: (row: any) => <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {row._type}
        </span>
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium truncate max-w-[250px] block">
          {row.title}
        </span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'SLA Status',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">SLA Dashboard</h1>
        <p className="text-text-secondary">
          Monitor cross-platform SLA exposure, aging distribution, and breaches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="On Track" value={onTrack.toString()} status="success" />
        <KpiTile label="At Risk" value={atRisk.toString()} status="warning" />
        <KpiTile label="Breached" value={breached.toString()} status="danger" />
        <KpiTile label="Met" value={met.toString()} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-primary">
                SLA Exposure
              </h2>
            </div>
            <DataTable columns={columns} rows={filteredItems} onRowClick={(row) => {
            setSelectedEntity(row);
            setEntityType(row._type);
          }} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">
              Aging Distribution
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-secondary">
                    0-24 Hours
                  </span>
                  <span className="text-text-muted">45 items</span>
                </div>
                <div className="w-full bg-border-subtle rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{
                  width: '60%'
                }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-secondary">
                    1-3 Days
                  </span>
                  <span className="text-text-muted">22 items</span>
                </div>
                <div className="w-full bg-border-subtle rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{
                  width: '30%'
                }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-secondary">
                    3-7 Days
                  </span>
                  <span className="text-text-muted">8 items</span>
                </div>
                <div className="w-full bg-border-subtle rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{
                  width: '15%'
                }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-text-secondary">
                    7+ Days
                  </span>
                  <span className="text-text-muted">3 items</span>
                </div>
                <div className="w-full bg-border-subtle rounded-full h-2">
                  <div className="bg-danger h-2 rounded-full" style={{
                  width: '5%'
                }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEntity && entityType && <DetailPanel entity={selectedEntity} type={entityType} onClose={() => {
      setSelectedEntity(null);
      setEntityType(null);
    }} />}
    </div>;
}