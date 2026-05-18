import React, { useEffect, useState } from 'react';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { DetailPanel } from '../components/DetailPanel';
import { StatusPill } from '../components/StatusPill';
import { getUnits, getKpiSets } from '../services/platform.service';
import type { Unit, KpiSet } from '../types/platform';
import { toast } from 'sonner';
import { Shield, Target, AlertTriangle } from 'lucide-react';
export function ExecutiveEnterprisePage() {
  const [activeTab, setActiveTab] = useState('Enterprise Health');
  const [units, setUnits] = useState<Unit[]>([]);
  const [kpiSets, setKpiSets] = useState<KpiSet[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const tabs = ['Enterprise Health', 'Strategic Initiatives', 'Governance', 'SLA Exposure', 'Value Delivery'];
  useEffect(() => {
    Promise.all([getUnits(), getKpiSets()]).then(([u, k]) => {
      setUnits(u);
      setKpiSets(k);
    });
  }, []);
  const handleEscalate = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Executive escalation created in prototype mode');
  };
  const unitColumns = [{
    header: 'Unit Name',
    accessor: (row: Unit) => <span className="font-medium">{row.name}</span>
  }, {
    header: 'Health',
    accessor: (row: Unit) => <StatusPill status={row.health} />
  }, {
    header: 'Action',
    accessor: (row: Unit) => <button onClick={handleEscalate} className="text-xs font-medium text-danger hover:underline">
          Escalate Concern
        </button>
  }];
  const enterpriseKpis = kpiSets.find((k) => k.id === 'KPI-8001');
  return <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Enterprise Execution
        </h1>
        <p className="text-text-secondary">
          Executive visibility into strategy-to-work traceability, governance,
          and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Strategy-to-Work Traceability" value="90%" status="success" />
        <KpiTile label="Task Governance Completeness" value="95%" status="success" />
        <KpiTile label="Request Accountability" value="85%" status="warning" />
        <KpiTile label="Execution Quality" value="76%" status="info" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">
                Unit Performance
              </h2>
            </div>
            <DataTable columns={unitColumns} rows={units.filter((u) => u.id !== 'UNT-000')} onRowClick={setSelectedEntity} />
          </div>

          {enterpriseKpis && <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-primary">
                  Enterprise KPIs
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {enterpriseKpis.metrics.map((metric, i) => <div key={i} className="p-4 border border-border-subtle rounded-card" onClick={() => setSelectedEntity(enterpriseKpis)}>
                    <div className="text-sm font-medium text-text-secondary mb-2">
                      {metric.label}
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-primary">
                        {metric.value}
                      </div>
                      <div className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                        {metric.trend}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={16} className="text-secondary" />
              Strategic Initiatives
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-border-subtle rounded-card hover:border-border-strong transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-primary">
                    OUT-6001: Q2 Platform Migration
                  </h4>
                  <StatusPill status="On Track" />
                </div>
                <div className="w-full bg-border-subtle rounded-full h-1.5 mt-4">
                  <div className="bg-primary h-1.5 rounded-full" style={{
                  width: '72%'
                }} />
                </div>
                <p className="text-xs text-text-muted mt-2 text-right">
                  72% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-border-default p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={16} className="text-danger" />
              Governance Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-danger-surface border border-danger/20 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-danger" />
                  <span className="text-sm font-medium text-danger-text">
                    Audit Exceptions
                  </span>
                </div>
                <span className="text-sm font-bold text-danger">7</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-surface border border-warning/20 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-warning-text" />
                  <span className="text-sm font-medium text-warning-text">
                    Closure Quality Risks
                  </span>
                </div>
                <span className="text-sm font-bold text-warning-text">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEntity && <DetailPanel entity={selectedEntity} type="kpi" // Generic render
    onClose={() => setSelectedEntity(null)} />}
    </div>;
}