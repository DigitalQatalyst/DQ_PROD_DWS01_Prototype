import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { OwnerBadge } from '../components/OwnerBadge';
import { StatusPill } from '../components/StatusPill';
import { getUnits, getTeams } from '../services/platform.service';
import type { KpiSet, Team, Unit } from '../types/platform';
import { toast } from 'sonner';
import { ShieldAlert, Target, Activity } from 'lucide-react';
export function UnitVisibilityPage() {
  const [activeTab, setActiveTab] = useState('Unit Health');
  const [unit, setUnit] = useState<Unit | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const tabs = ['Unit Health', 'SLA Trends', 'Governance Risks', 'Outcomes', 'Teams'];
  useEffect(() => {
    Promise.all([getUnits(), getTeams()]).then(([u, t]) => {
      const myUnit = u.find((unit) => unit.id === 'UNT-001');
      if (myUnit) {
        setUnit(myUnit);
        setTeams(t.filter((team) => team.unitId === myUnit.id));
      }
    });
  }, []);
  const handleIntervention = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Governance intervention created in prototype mode');
  };
  const teamColumns = [{
    header: 'Team Name',
    accessor: (row: Team) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'Lead',
    accessor: (row: Team) => <OwnerBadge userId={row.leadUserId} />
  }, {
    header: 'Flow Health',
    accessor: (row: Team) => <StatusPill status={row.flowHealth} />
  }, {
    header: 'Action',
    accessor: (row: Team) => <button onClick={handleIntervention} className="text-xs font-medium text-danger hover:underline">
          Intervene
        </button>
  }];
  if (!unit) return null;
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {unit.name} Visibility
        </h1>
        <p className="text-text-secondary">
          Monitor unit health, team performance, and strategic outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Unit Health" value={unit.health} status={unit.health === 'On Track' ? 'success' : unit.health === 'Watch' ? 'warning' : 'danger'} />
        <KpiTile label="SLA On Track" value="84%" trend="+6%" status="success" />
        <KpiTile label="Governance Exceptions" value="7" trend="+2" status="danger" />
        <KpiTile label="Outcome Progress" value="72%" trend="+4%" status="info" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Team Health
              </h2>
            </div>
            <DataTable columns={teamColumns} rows={teams} onRowClick={setSelectedTeam} />
          </div>

          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Target size={20} className="text-secondary" />
                Outcome Tracking
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-border-subtle rounded-card hover:border-border-strong transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary">
                      OUT-6001: Q2 Platform Migration
                    </h3>
                    <StatusPill status="On Track" />
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    Migrate legacy services to DWS.01 architecture.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-primary">72%</span>
                      </div>
                      <div className="w-full bg-border-subtle rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{
                        width: '72%'
                      }} />
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span>Linked Tasks: 45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-danger" />
              SLA Exposure
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-danger-surface border border-danger/20 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-danger uppercase">
                    Breached
                  </span>
                  <span className="text-xs font-medium text-danger">
                    TSK-1004
                  </span>
                </div>
                <p className="text-sm text-danger-text font-medium">
                  Governance dashboard copy
                </p>
                <p className="text-xs text-danger-text/80 mt-1">
                  TM-001 • 2 days overdue
                </p>
              </div>
              <div className="p-3 bg-warning-surface border border-warning/20 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-warning-text uppercase">
                    At Risk
                  </span>
                  <span className="text-xs font-medium text-warning-text">
                    TSK-1002
                  </span>
                </div>
                <p className="text-sm text-warning-text font-medium">
                  Request intake card patterns
                </p>
                <p className="text-xs text-warning-text/80 mt-1">
                  TM-001 • Due in 4 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTeam && (
        <DetailPanel
          entity={selectedTeam as unknown as KpiSet}
          type="kpi"
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>;
}