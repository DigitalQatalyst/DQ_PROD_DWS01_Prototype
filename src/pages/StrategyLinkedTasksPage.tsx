import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { SlaBadge } from '../components/SlaBadge';
import { OwnerBadge } from '../components/OwnerBadge';
import { FilterBar } from '../components/FilterBar';
import {
  governedTasks,
  strategicAspirations,
  objectives,
  executionRegisters } from
'../mocks/governedTasks.mock';
import { toast } from 'sonner';
export function StrategyLinkedTasksPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const tabs = [
  'All',
  'Linked to Objectives',
  'Missing Strategic Context',
  'At Risk',
  'Ready for Review'];

  const filteredTasks = governedTasks.filter((t) => {
    const matchesSearch =
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Linked to Objectives')
    return matchesSearch && t.objectiveId;
    if (activeTab === 'Missing Strategic Context')
    return matchesSearch && !t.objectiveId;
    if (activeTab === 'At Risk')
    return matchesSearch && t.slaState === 'At Risk';
    if (activeTab === 'Ready for Review')
    return matchesSearch && t.closureQuality === 'Ready for review';
    return matchesSearch;
  });
  const linkedTasks = governedTasks.filter((t) => t.objectiveId).length;
  const objectivesSupported = new Set(
    governedTasks.filter((t) => t.objectiveId).map((t) => t.objectiveId)
  ).size;
  const atRisk = governedTasks.filter((t) => t.slaState === 'At Risk').length;
  const missingContext = governedTasks.filter((t) => !t.objectiveId).length;
  const columns = [
  {
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  },
  {
    header: 'Title',
    accessor: (row: any) =>
    <span
      className="font-medium text-text-primary truncate max-w-[200px] block"
      title={row.title}>
      
          {row.title}
        </span>

  },
  {
    header: 'Aspiration',
    accessor: (row: any) => {
      const asp = strategicAspirations.find(
        (a) => a.id === row.strategicAspirationId
      );
      return (
        <span className="text-sm text-text-secondary truncate max-w-[150px] block">
            {asp?.title || '-'}
          </span>);

    }
  },
  {
    header: 'Objective',
    accessor: (row: any) => {
      const obj = objectives.find((o) => o.id === row.objectiveId);
      return (
        <span className="text-sm text-text-secondary truncate max-w-[150px] block">
            {obj?.title || '-'}
          </span>);

    }
  },
  {
    header: 'Linked Register',
    accessor: (row: any) => {
      const reg = executionRegisters.find((r) => r.id === row.registerId);
      if (!reg) return <span className="text-sm text-text-muted">-</span>;
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.success(
              `Opening linked register item ${row.registerItemId}.`
            );
          }}
          className="flex items-center gap-1 hover:bg-surface px-2 py-1 rounded transition-colors">
          
            <MonoId value={row.registerId} />
          </button>);

    }
  },
  {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  },
  {
    header: 'Status',
    accessor: (row: any) => <StatusPill status={row.status} />
  },
  {
    header: 'SLA',
    accessor: (row: any) => <SlaBadge state={row.slaState} />
  },
  {
    header: 'Evidence',
    accessor: (row: any) => <StatusPill status={row.evidenceState} />
  },
  {
    header: 'Closure Readiness',
    accessor: (row: any) => <StatusPill status={row.closureQuality} />
  }];

  return (
    <RolePageScaffold
      eyebrow="ENTERPRISE EXECUTION"
      title="Strategy-linked Task View"
      purpose="See how daily tasks contribute to strategic aspirations, objectives, outcomes, and execution registers.">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile
          label="Linked Tasks"
          value={linkedTasks.toString()}
          status="success" />
        
        <KpiTile
          label="Objectives Supported"
          value={objectivesSupported.toString()}
          status="info" />
        
        <KpiTile
          label="At-Risk Contributions"
          value={atRisk.toString()}
          status="danger" />
        
        <KpiTile
          label="Missing Strategic Context"
          value={missingContext.toString()}
          status="warning" />
        
      </div>

      <FilterBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch} />
      

      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          rows={filteredTasks}
          onRowClick={setSelectedTask}
          emptyMessage="No tasks match your filters." />
        
      </div>

      {selectedTask &&
      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      }
    </RolePageScaffold>);

}