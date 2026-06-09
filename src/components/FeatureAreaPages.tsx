import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, FileText, ShieldCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from './DataTable';
import { KpiTile } from './KpiTile';
import { MonoId } from './MonoId';
import { StatusPill } from './StatusPill';
import {
  featureAreaIds,
  getFeature,
  getFeatureArea,
  getFeatureGroup,
  type Feature,
  type FeatureAction,
  type FeatureArea,
  type FeatureGroup,
  type FeatureRecord,
  type RiskLevel,
} from '../data/featureAreas';
import { AssignedWorkPage } from '../pages/AssignedWorkPage';
import { KanbanBoardPage } from '../pages/KanbanBoardPage';

const filterChips = ['All', 'Healthy', 'Needs Attention', 'At Risk', 'Recently Updated'];
const workspaceTabs = ['Overview', 'Records', 'Insights', 'Actions', 'Evidence'];

function panelClass(extra = '') {
  return `rounded-card border border-border-subtle bg-white shadow-sm ${extra}`;
}

export function Breadcrumbs({ items }: { items: { label: string; route?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-text-muted">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span>/</span>}
          {item.route ? (
            <Link to={item.route} className="font-semibold text-text-secondary hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-primary">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const config = {
    Low: 'bg-success-surface text-success-text',
    Medium: 'bg-warning-surface text-warning-text',
    High: 'bg-danger-surface text-danger-text',
    Critical: 'bg-danger text-white',
  }[riskLevel];
  return <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-bold ${config}`}>{riskLevel} Risk</span>;
}

export function OwnerBadge({ owner, role }: { owner: string; role: string }) {
  const initials = owner
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-primary">{initials}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-primary">{owner}</span>
        <span className="block truncate text-xs text-text-muted">{role}</span>
      </span>
    </div>
  );
}

function KpiStrip({ kpis }: { kpis: FeatureArea['kpis'] }) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiTile key={kpi.label} label={kpi.label} value={kpi.value} trend={kpi.trend} status={kpi.status} />
      ))}
    </section>
  );
}

export function FeatureGroupCard({ group }: { group: FeatureGroup }) {
  return (
    <Link to={group.route} className={`${panelClass('block p-5 transition-colors hover:bg-navy-50')}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary">{group.label}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{group.description}</p>
        </div>
        <StatusPill status={group.healthStatus} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {group.kpis.slice(0, 4).map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border-subtle bg-surface p-3">
            <div className="text-xs font-semibold text-text-muted">{kpi.label}</div>
            <div className="mt-1 text-xl font-bold text-primary">{kpi.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-info-text">
        Open feature group <ArrowRight size={16} />
      </div>
    </Link>
  );
}

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link to={feature.route} className={`${panelClass('block p-5 transition-colors hover:bg-navy-50')}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-primary">{feature.label}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.description}</p>
        </div>
        <ArrowRight size={18} className="mt-1 shrink-0 text-text-muted" />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <StatusPill status={feature.status} />
        <RiskBadge riskLevel={feature.riskLevel} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner Role</div>
          <div className="mt-1 font-semibold text-primary">{feature.ownerRole}</div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Primary Metric</div>
          <div className="mt-1 font-semibold text-primary">{feature.primaryMetric}</div>
        </div>
      </div>
    </Link>
  );
}

export function InsightCard({ insight }: { insight: string }) {
  return (
    <article className={panelClass('p-5')}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-info-surface text-info-text">
        <BarChart3 size={18} />
      </div>
      <p className="text-sm font-semibold leading-6 text-primary">{insight}</p>
    </article>
  );
}

export function ActionList({ actions, approvalMode = false }: { actions: FeatureAction[]; approvalMode?: boolean }) {
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div key={action.label} className={`${panelClass('flex flex-wrap items-center justify-between gap-4 p-4')}`}>
          <div>
            <h3 className="text-sm font-bold text-primary">{action.label}</h3>
            <p className="mt-1 text-xs text-text-muted">{action.owner} · Due {action.dueDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={action.status} />
            <button
              onClick={() => toast.success(`${action.label} recorded locally.`)}
              className="rounded-button bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-navy-800">
              {approvalMode && action.label.includes('Approve') ? 'Approve' : 'Act'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EvidenceList({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <button
          key={item}
          onClick={() => toast.info(`${item} opened in prototype mode.`)}
          className={`${panelClass('flex items-center gap-3 p-4 text-left transition-colors hover:bg-surface')}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-primary">
            {index % 2 === 0 ? <FileText size={18} /> : <ShieldCheck size={18} />}
          </span>
          <span>
            <span className="block text-sm font-bold text-primary">{item}</span>
            <span className="mt-1 block text-xs text-text-muted">Reference is simulated for this prototype.</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function FilterChips({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterChips.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-pill px-3 py-1.5 text-xs font-bold transition-colors ${
            value === filter ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-navy-50 hover:text-primary'
          }`}>
          {filter}
        </button>
      ))}
    </div>
  );
}

function matchesFeatureFilter(feature: Feature, filter: string) {
  if (filter === 'All') return true;
  if (filter === 'Healthy') return ['Healthy', 'On Track', 'Active', 'Approved'].includes(feature.status);
  if (filter === 'Needs Attention') return ['Needs Attention', 'Pending Review', 'Under Review', 'Action Required', 'Change Required'].includes(feature.status);
  if (filter === 'At Risk') return feature.riskLevel === 'High' || feature.riskLevel === 'Critical' || feature.status === 'At Risk';
  return feature.sampleRecords.some((record) => ['Today', '1h ago', '2h ago', '2026-06-05'].includes(record.lastUpdated));
}

function matchesRecordFilter(record: FeatureRecord, filter: string) {
  if (filter === 'All') return true;
  if (filter === 'Healthy') return ['Healthy', 'On Track', 'Completed', 'Approved', 'Active', 'Monitoring'].includes(record.status);
  if (filter === 'Needs Attention') return ['Needs Attention', 'Pending Review', 'Under Review', 'Action Required', 'Evidence Missing', 'Change Required'].includes(record.status);
  if (filter === 'At Risk') return record.riskLevel === 'High' || record.riskLevel === 'Critical' || record.status === 'At Risk' || record.status === 'Overdue' || record.status === 'Blocked';
  return ['Today', '1h ago', '2h ago', '2026-06-05'].includes(record.lastUpdated);
}

export function RecordTable({ records, areaLabel, onOpen }: { records: FeatureRecord[]; areaLabel: string; onOpen: (record: FeatureRecord) => void }) {
  const reviewHeader = areaLabel === 'Performance' || areaLabel === 'Tasks' || areaLabel === 'Services' ? 'Due Date' : 'Review Date';
  const priorityHeader = areaLabel === 'Governance' ? 'Severity / Priority' : 'Priority';
  const columns: Column<FeatureRecord>[] = [
    { header: 'ID', accessor: (record) => <MonoId value={record.id} />, width: '110px' },
    {
      header: 'Title',
      accessor: (record) => (
        <div>
          <div className="font-bold text-primary">{record.title}</div>
          <div className="text-xs text-text-muted">{record.feature}</div>
        </div>
      ),
    },
    { header: 'Owner', accessor: (record) => <OwnerBadge owner={record.owner} role={record.ownerRole} /> },
    { header: 'Status', accessor: (record) => <StatusPill status={record.status} /> },
    { header: priorityHeader, accessor: (record) => <StatusPill status={record.severity || record.priority || 'Medium'} /> },
    { header: reviewHeader, accessor: (record) => record.reviewDate || record.dueDate || '2026-06-14' },
    { header: 'Last Updated', accessor: (record) => record.lastUpdated },
    {
      header: 'Action',
      accessor: (record) => (
        <button
          onClick={(event) => {
            event.stopPropagation();
            toast.success(`${record.nextAction} logged locally.`);
          }}
          className="rounded-button border border-border-default px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface">
          Act
        </button>
      ),
      width: '90px',
    },
  ];

  return <DataTable columns={columns} rows={records} onRowClick={onOpen} emptyMessage="No records match the selected filter." />;
}

export function DetailDrawer({ record, onClose }: { record: FeatureRecord | null; onClose: () => void }) {
  if (!record) return null;
  const dateLabel = record.reviewDate ? 'Review Date' : 'Due Date';
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed bottom-0 right-0 top-0 z-[200] w-full max-w-xl overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b border-border-subtle bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <MonoId value={record.id} />
                <StatusPill status={record.status} />
                <RiskBadge riskLevel={record.riskLevel} />
              </div>
              <h2 className="mt-3 text-xl font-bold text-primary">{record.title}</h2>
            </div>
            <button onClick={onClose} aria-label="Close drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="space-y-5 bg-surface p-6">
          <section className={panelClass('p-4')}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Feature" value={record.feature} />
              {record.insightCategory && <Field label="Insight Category" value={record.insightCategory} />}
              <Field label="Owner" value={record.owner} />
              <Field label="Owner Role" value={record.ownerRole} />
              <Field label="Unit" value={record.unit} />
              <Field label={dateLabel} value={record.reviewDate || record.dueDate || '2026-06-14'} />
              <Field label="Last Updated" value={record.lastUpdated} />
              <Field label="Evidence / Source Status" value={record.evidenceStatus || record.sourceStatus || 'Review Required'} />
              <Field label="Priority / Severity" value={record.severity || record.priority || 'Medium'} />
              {record.configurationImpact && <Field label="Configuration Impact" value={record.configurationImpact} wide />}
            </div>
          </section>
          <section className={panelClass('p-4')}>
            <h3 className="text-sm font-bold text-primary">Timeline</h3>
            <div className="mt-4 space-y-3">
              {record.timeline.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
          {record.decisionHistory && (
            <section className={panelClass('p-4')}>
              <h3 className="text-sm font-bold text-primary">Decision or Resolution History</h3>
              <div className="mt-3 space-y-2">
                {record.decisionHistory.map((item) => (
                  <div key={item} className="rounded-lg bg-surface px-3 py-2 text-sm text-text-secondary">{item}</div>
                ))}
              </div>
            </section>
          )}
          <section className={panelClass('p-4')}>
            <h3 className="text-sm font-bold text-primary">Next Recommended Action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.nextAction}</p>
            <button onClick={() => toast.success('Recommended action recorded locally.')} className="mt-4 rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">
              Record Action
            </button>
          </section>
        </div>
      </aside>
    </>
  );
}

function Field({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-primary">{value}</div>
    </div>
  );
}

export function FeatureAreaLandingPage({ area }: { area: FeatureArea }) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <Breadcrumbs items={[{ label: area.label }]} />
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{area.label}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{area.description}</p>
        </div>
        <button onClick={() => toast.info(`${area.label} summary prepared locally.`)} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">
          Prepare Summary
        </button>
      </header>

      <KpiStrip kpis={area.kpis} />

      <section className="mt-6">
        <h2 className="mb-4 text-lg font-bold text-primary">Feature Groups</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {area.featureGroups.map((group) => <FeatureGroupCard key={group.id} group={group} />)}
        </div>
      </section>

      <section className={`${panelClass('mt-6 p-5')}`}>
        <h2 className="text-lg font-bold text-primary">Priority Signals</h2>
        <p className="mt-1 text-sm text-text-secondary">Operational records requiring review, evidence, or recovery action.</p>
        <div className="mt-4">
          <PrioritySignalTable records={area.prioritySignals} />
        </div>
      </section>
    </div>
  );
}

function PrioritySignalTable({ records }: { records: FeatureRecord[] }) {
  const [drawerRecord, setDrawerRecord] = useState<FeatureRecord | null>(null);
  return (
    <>
      <RecordTable records={records} areaLabel={records[0]?.featureArea || 'Performance'} onOpen={setDrawerRecord} />
      <DetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />
    </>
  );
}

export function FeatureGroupPage({ area, group }: { area: FeatureArea; group: FeatureGroup }) {
  const [filter, setFilter] = useState('All');
  const visibleFeatures = useMemo(() => group.features.filter((feature) => matchesFeatureFilter(feature, filter)), [filter, group.features]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <Breadcrumbs items={[{ label: area.label, route: area.route }, { label: group.label }]} />
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{group.label}</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{group.description}</p>
      </header>
      <KpiStrip kpis={group.kpis} />
      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-primary">Features</h2>
          <FilterChips value={filter} onChange={setFilter} />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {visibleFeatures.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
        </div>
      </section>
    </div>
  );
}

export function FeatureWorkspacePage({ area, group, feature }: { area: FeatureArea; group: FeatureGroup; feature: Feature }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [filter, setFilter] = useState('All');
  const [drawerRecord, setDrawerRecord] = useState<FeatureRecord | null>(null);
  const visibleRecords = useMemo(() => feature.sampleRecords.filter((record) => matchesRecordFilter(record, filter)), [feature.sampleRecords, filter]);
  const approvalMode = area.label === 'Governance' && feature.label.toLowerCase().includes('approval');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <Breadcrumbs items={[{ label: area.label, route: area.route }, { label: group.label, route: group.route }, { label: feature.label }]} />
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{feature.label}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{feature.description}</p>
        </div>
        <button onClick={() => toast.info(`${feature.label} review note drafted locally.`)} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">
          Draft Review Note
        </button>
      </header>
      <KpiStrip kpis={feature.kpis} />

      <section className={`${panelClass('mt-6 overflow-hidden')}`}>
        <div className="flex flex-wrap gap-1 border-b border-border-subtle px-5 pt-3">
          {workspaceTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold ${
                activeTab === tab ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'
              }`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === 'Overview' && <OverviewTab area={area} group={group} feature={feature} />}
          {activeTab === 'Records' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-primary">Records</h2>
                <FilterChips value={filter} onChange={setFilter} />
              </div>
              <RecordTable records={visibleRecords} areaLabel={area.label} onOpen={setDrawerRecord} />
            </div>
          )}
          {activeTab === 'Insights' && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {feature.insights.map((insight) => <InsightCard key={insight} insight={insight} />)}
            </div>
          )}
          {activeTab === 'Actions' && <ActionList actions={feature.actions} approvalMode={approvalMode} />}
          {activeTab === 'Evidence' && <EvidenceList items={feature.evidence} />}
        </div>
      </section>
      <DetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />
    </div>
  );
}

function OverviewTab({ area, group, feature }: { area: FeatureArea; group: FeatureGroup; feature: Feature }) {
  const cards = [
    {
      title: `${area.label} Summary`,
      icon: ClipboardList,
      body: `${feature.label} is tracked through ${feature.sampleRecords.length} current records across ${group.label.toLowerCase()} with owner, status, risk, and evidence visibility.`,
    },
    {
      title: area.label === 'Analytics' ? 'Trend and Health' : area.label === 'Governance' ? 'Control and Discipline Health' : area.label === 'Administration' ? 'Configuration Health' : area.label === 'Tasks' ? 'Task Health' : area.label === 'Services' ? 'Service Health' : 'Performance Health',
      icon: BarChart3,
      body: `${feature.status} status with ${feature.riskLevel.toLowerCase()} risk and a primary metric of ${feature.primaryMetric}.`,
    },
    {
      title: area.label === 'Analytics' ? 'Signal Source' : 'Ownership',
      icon: ShieldCheck,
      body: `${feature.ownerRole} owns review cadence, evidence quality, and next-action discipline for this workspace.`,
    },
    {
      title: area.label === 'Administration' ? 'Pending Changes' : area.label === 'Governance' ? 'Current Exceptions' : 'Current Signals',
      icon: CheckCircle2,
      body: feature.insights[0],
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.title} className={panelClass('p-5')}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-primary">
              <Icon size={19} />
            </div>
            <h2 className="text-lg font-bold text-primary">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{card.body}</p>
          </article>
        );
      })}
    </div>
  );
}

export function FeatureAreaRoute({ areaId: fixedAreaId }: { areaId?: string }) {
  const { areaId: paramAreaId } = useParams();
  const areaId = fixedAreaId || paramAreaId;
  if (!areaId || !featureAreaIds.includes(areaId)) return <Navigate to="/home" replace />;
  const area = getFeatureArea(areaId);
  return area ? <FeatureAreaLandingPage area={area} /> : <Navigate to="/home" replace />;
}

export function FeatureGroupRoute({ areaId: fixedAreaId, groupId: fixedGroupId }: { areaId?: string; groupId?: string }) {
  const { areaId: paramAreaId, groupId: paramGroupId } = useParams();
  const areaId = fixedAreaId || paramAreaId;
  const groupId = fixedGroupId || paramGroupId;
  const area = getFeatureArea(areaId);
  const group = getFeatureGroup(areaId, groupId);
  if (area?.id === 'tasks' && group?.features[0]?.route) {
    return <Navigate to={group.features[0].route} replace />;
  }
  return area && group ? <FeatureGroupPage area={area} group={group} /> : <Navigate to={`/${areaId || 'home'}`} replace />;
}

export function FeatureWorkspaceRoute({ areaId: fixedAreaId, groupId: fixedGroupId, featureId: fixedFeatureId }: { areaId?: string; groupId?: string; featureId?: string }) {
  const { areaId: paramAreaId, groupId: paramGroupId, featureId: paramFeatureId } = useParams();
  const areaId = fixedAreaId || paramAreaId;
  const groupId = fixedGroupId || paramGroupId;
  const featureId = fixedFeatureId || paramFeatureId;
  const area = getFeatureArea(areaId);
  const group = getFeatureGroup(areaId, groupId);
  const feature = getFeature(areaId, groupId, featureId);
  if (feature?.route === '/tasks/my-work/assigned-tasks') return <AssignedWorkPage />;
  if (feature?.route === '/tasks/task-board/kanban-view') return <KanbanBoardPage />;
  return area && group && feature ? <FeatureWorkspacePage area={area} group={group} feature={feature} /> : <Navigate to={`/${areaId || 'home'}`} replace />;
}
