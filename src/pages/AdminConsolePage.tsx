import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { getUsers, getPersonas, getAuditEvents } from '../services/platform.service';
import type { User, Persona, AuditEvent } from '../types/platform';
import { toast } from 'sonner';
import { Settings, Shield, Users, Activity, Link as LinkIcon } from 'lucide-react';
export function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState('Users & Roles');
  const [users, setUsers] = useState<User[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const tabs = ['Users & Roles', 'Task Model', 'Request Categories', 'Workflow Rules', 'SLA Rules', 'Integrations', 'AI Settings'];
  useEffect(() => {
    Promise.all([getUsers(), getPersonas(), getAuditEvents()]).then(([u, p, a]) => {
      setUsers(u);
      setPersonas(p);
      setAuditEvents(a);
    });
  }, []);
  const handleEditRole = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowRoleModal(true);
  };
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration change saved in prototype mode');
    setShowRoleModal(false);
    setSelectedUser(null);
  };
  const columns = [{
    header: 'ID',
    accessor: (row: User) => <MonoId value={row.id} />
  }, {
    header: 'Name',
    accessor: (row: User) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'Role',
    accessor: (row: User) => <span className="text-sm">{row.role}</span>
  }, {
    header: 'Unit ID',
    accessor: (row: User) => <MonoId value={row.unitId} />
  }, {
    header: 'Persona',
    accessor: (row: User) => <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted bg-surface px-2 py-1 rounded">
          {row.personaId}
        </span>
  }, {
    header: 'Action',
    accessor: (row: User) => <button onClick={(e) => handleEditRole(e, row)} className="text-xs font-medium text-secondary hover:underline">
          Edit Role
        </button>
  }];
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Administration Console
        </h1>
        <p className="text-text-secondary">
          Configure platform rules, manage access, and monitor integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Active Users" value={users.length.toString()} status="info" />
        <KpiTile label="Roles Configured" value={personas.length.toString()} status="success" />
        <KpiTile label="Active Rules" value="18" status="info" />
        <KpiTile label="Audit Events Today" value={auditEvents.length.toString()} status="warning" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {activeTab === 'Users & Roles' && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  User & Role Management
                </h2>
              </div>
              <DataTable columns={columns} rows={users} onRowClick={setSelectedUser} />
            </div>}

          {activeTab === 'Integrations' && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-card border border-border-default p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
                    <LinkIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Microsoft Teams
                  </h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Notification routing and chat-based approvals.
                </p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-success">Connected</span>
                  <span className="text-secondary hover:underline">
                    Configure
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-card border border-border-default p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
                    <LinkIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Outlook
                  </h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Calendar sync for working sessions and reminders.
                </p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-success">Connected</span>
                  <span className="text-secondary hover:underline">
                    Configure
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-card border border-border-default p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
                    <LinkIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    SharePoint / OneDrive
                  </h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Evidence attachment storage and document sync.
                </p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-success">Connected</span>
                  <span className="text-secondary hover:underline">
                    Configure
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-card border border-border-default p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-navy-50 flex items-center justify-center text-primary">
                    <LinkIcon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Planner
                  </h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Task sync for external visibility.
                </p>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-text-muted">Disconnected</span>
                  <span className="text-secondary hover:underline">
                    Connect
                  </span>
                </div>
              </div>
            </div>}

          {activeTab !== 'Users & Roles' && activeTab !== 'Integrations' && <div className="bg-white rounded-card border border-border-default p-12 text-center shadow-sm">
              <Settings size={48} className="text-secondary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-primary mb-2">
                {activeTab} Configuration
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                This configuration surface is available in the full platform.
              </p>
              <div className="inline-block bg-orange-100 text-orange-900 text-xs font-semibold px-3 py-1 rounded-pill">
                Coming in Prototype Shell expansion
              </div>
            </div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={16} className="text-secondary" />
              SLA Rule Preview
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-surface rounded border border-border-subtle">
                <h4 className="text-sm font-medium text-primary mb-1">
                  Standard Task SLA
                </h4>
                <p className="text-xs text-text-muted mb-2">
                  Warning at 80% of duration. Breach at 100%.
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white border border-border-strong px-1.5 py-0.5 rounded text-text-secondary">
                    Active
                  </span>
                  <span className="text-[10px] bg-white border border-border-strong px-1.5 py-0.5 rounded text-text-secondary">
                    Global
                  </span>
                </div>
              </div>
              <div className="p-3 bg-surface rounded border border-border-subtle">
                <h4 className="text-sm font-medium text-primary mb-1">
                  Critical Escalation SLA
                </h4>
                <p className="text-xs text-text-muted mb-2">
                  Warning at 2 hours. Breach at 4 hours.
                </p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white border border-border-strong px-1.5 py-0.5 rounded text-text-secondary">
                    Active
                  </span>
                  <span className="text-[10px] bg-white border border-border-strong px-1.5 py-0.5 rounded text-text-secondary">
                    Priority: Critical
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={16} className="text-info-text" />
              Recent Audit Events
            </h3>
            <div className="space-y-4">
              {auditEvents.slice(0, 3).map((event) => <div key={event.id} className="relative pl-4 border-l-2 border-border-subtle">
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${event.severity === 'Critical' ? 'bg-danger' : event.severity === 'Warning' ? 'bg-warning' : 'bg-primary'}`} />
                  <p className="text-sm font-medium text-primary">
                    {event.event}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {event.timestamp} • {event.actorUserId}
                  </p>
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {selectedUser && !showRoleModal && <DetailPanel entity={selectedUser as any} type="kpi" // Generic render
    onClose={() => setSelectedUser(null)} />}

      {showRoleModal && selectedUser && <>
          <div className="fixed inset-0 bg-navy-950/20 backdrop-blur-sm z-[250]" onClick={() => setShowRoleModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-modal shadow-xl border border-border-default p-6 w-full max-w-md z-[300]">
            <h3 className="text-lg font-bold text-primary mb-2">
              Edit Role Scope
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              Configure access for{' '}
              <span className="font-semibold">{selectedUser.name}</span>
            </p>

            <form onSubmit={handleSaveRole} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Persona Assignment
                </label>
                <select className="w-full h-10 px-3 rounded-button border border-border-strong text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring-navy" defaultValue={selectedUser.personaId}>
                  {personas.map((p) => <option key={p.id} value={p.id}>
                      {p.name} ({p.role})
                    </option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  Additional Permissions
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 text-primary focus:ring-primary rounded-sm" />
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        Bypass Approval Rules
                      </span>
                      <p className="text-xs text-text-muted">
                        Allow user to self-approve tasks.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 text-primary focus:ring-primary rounded-sm" />
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        Manage Templates
                      </span>
                      <p className="text-xs text-text-muted">
                        Allow user to create and edit task templates.
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 text-primary focus:ring-primary rounded-sm" />
                    <div>
                      <span className="text-sm font-medium text-text-primary">
                        View Cross-Unit Analytics
                      </span>
                      <p className="text-xs text-text-muted">
                        Allow visibility into other units' performance.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface rounded-button transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-navy-800 rounded-button transition-colors">
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </>}
    </div>;
}