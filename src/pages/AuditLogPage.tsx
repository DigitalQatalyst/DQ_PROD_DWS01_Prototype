import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { getAuditEvents } from '../services/platform.service';
import type { AuditEvent } from '../types/platform';
export function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const tabs = ['All', 'Task', 'Request', 'Approval', 'Configuration', 'Access'];
  useEffect(() => {
    getAuditEvents().then(setEvents);
  }, []);
  const filteredEvents = events.filter((e) => {
    const matchesTab = activeTab === 'All' || e.entityType === activeTab || activeTab === 'Configuration' && e.entityType === 'Config';
    const matchesSearch = e.event.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });
  const eventsToday = events.length;
  const warningEvents = events.filter((e) => e.severity === 'Warning').length;
  const criticalEvents = events.filter((e) => e.severity === 'Critical').length;
  const configChanges = events.filter((e) => e.entityType === 'Config').length;
  const columns = [{
    header: 'Event ID',
    accessor: (row: AuditEvent) => <MonoId value={row.id} />
  }, {
    header: 'Event',
    accessor: (row: AuditEvent) => <span className="font-medium">{row.event}</span>
  }, {
    header: 'Actor',
    accessor: (row: AuditEvent) => <OwnerBadge userId={row.actorUserId} />
  }, {
    header: 'Timestamp',
    accessor: (row: AuditEvent) => <MonoId value={row.timestamp} />
  }, {
    header: 'Entity Type',
    accessor: (row: AuditEvent) => <span className="text-xs text-text-muted">{row.entityType}</span>
  }, {
    header: 'Entity ID',
    accessor: (row: AuditEvent) => <MonoId value={row.entityId} />
  }, {
    header: 'Severity',
    accessor: (row: AuditEvent) => <StatusPill status={row.severity} />
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Audit Log</h1>
        <p className="text-text-secondary">
          Immutable record of platform events, decisions, and configuration
          changes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Events Today" value={eventsToday.toString()} status="info" />
        <KpiTile label="Warning Events" value={warningEvents.toString()} status="warning" />
        <KpiTile label="Critical Events" value={criticalEvents.toString()} status="danger" />
        <KpiTile label="Config Changes" value={configChanges.toString()} status="info" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} search={search} onSearchChange={setSearch} />

      <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={filteredEvents} onRowClick={setSelectedEvent} emptyMessage="No audit events found matching your criteria." />
      </div>

      {selectedEvent && <DetailPanel entity={selectedEvent} type="audit" onClose={() => setSelectedEvent(null)} />}
    </div>;
}