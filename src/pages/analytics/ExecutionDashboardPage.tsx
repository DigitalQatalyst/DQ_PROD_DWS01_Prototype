import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardWidget } from '../../components/dashboard/DashboardWidget';
import {
  ClosureQualityBars,
  CompletionTrendChart,
  DashboardActionTable,
  PriorityBarChart,
  RecentDecisionsList,
  StatusDonutChart,
  WorkloadByOwnerChart,
} from '../../components/dashboard/ExecutionCharts';
import { KpiTile } from '../../components/KpiTile';
import {
  closureQuality,
  completionTrend,
  executionKpis,
  openActionItems,
  recentDecisions,
  tasksByPriority,
  tasksByStatus,
  workloadByOwner,
} from '../../mocks/executionDashboard.mock';

export function ExecutionDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-8 py-7">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="dq-overline">Analytics</p>
          <h1 className="dq-page-title mt-1">Execution Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-text-secondary">
            Live metrics across task execution, workload, closure quality, and action items.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {executionKpis.map((kpi) => (
            <KpiTile
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              subtitle={kpi.subtitle}
              trend={kpi.trend}
              status={kpi.status}
            />
          ))}
        </section>

        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <DashboardWidget
            title="Tasks by Status"
            action="View all"
            onAction={() => toast.info('Opening full task status view.')}
          >
            <StatusDonutChart segments={tasksByStatus} />
          </DashboardWidget>

          <DashboardWidget title="Tasks by Priority">
            <PriorityBarChart data={tasksByPriority} />
          </DashboardWidget>

          <DashboardWidget title="Completion Trend">
            <CompletionTrendChart data={completionTrend} />
          </DashboardWidget>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardWidget
            title="Workload by Owner"
            action="Reassign"
            onAction={() => toast.info('Reassign workflow opened in prototype mode.')}
          >
            <WorkloadByOwnerChart data={workloadByOwner} />
          </DashboardWidget>

          <DashboardWidget
            title="Recent Decisions"
            action="All"
            onAction={() => navigate('/governance/approvals-management/approval-queue')}
          >
            <RecentDecisionsList items={recentDecisions} />
          </DashboardWidget>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardWidget title="Closure Quality">
            <ClosureQualityBars metrics={closureQuality} />
          </DashboardWidget>

          <DashboardWidget
            title="Open Action Items"
            action="Open Tracker"
            onAction={() => navigate('/tracker/tracker-hub')}
          >
            <DashboardActionTable
              rows={openActionItems}
              onRowClick={() => toast.info('Action item detail opened in prototype mode.')}
            />
          </DashboardWidget>
        </section>
      </div>
    </div>
  );
}
