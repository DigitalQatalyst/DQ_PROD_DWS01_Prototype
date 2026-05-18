import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { KpiTile } from '../components/KpiTile';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { OwnerBadge } from '../components/OwnerBadge';
import { FilterBar } from '../components/FilterBar';
import { governedTasks } from '../mocks/governedTasks.mock';
import { EditTaskStructureModal } from '../components/EditTaskStructureModal';
import { toast } from 'sonner';
export function TaskStructureReviewPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [editModalTab, setEditModalTab] = useState<string | null>(null);
  const tabs = [
  'All',
  'Missing Objective',
  'Missing Output',
  'Missing Evidence',
  'Weak Closure',
  'Complete'];

  const filteredTasks = governedTasks.filter((t) => {
    const matchesSearch =
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Missing Objective')
    return matchesSearch && !t.objectiveId;
    if (activeTab === 'Missing Output')
    return matchesSearch && !t.expectedOutput;
    if (activeTab === 'Missing Evidence')
    return matchesSearch && t.evidenceState === 'Missing';
    if (activeTab === 'Weak Closure')
    return matchesSearch && t.structureScore < 80;
    if (activeTab === 'Complete') return matchesSearch && t.structureScore >= 90;
    return matchesSearch;
  });
  const tasksReviewed = governedTasks.length;
  const missingObjectives = governedTasks.filter((t) => !t.objectiveId).length;
  const missingEvidence = governedTasks.filter(
    (t) => t.evidenceState === 'Missing'
  ).length;
  const weakClosure = governedTasks.filter((t) => t.structureScore < 80).length;
  const handleAction = (e: React.MouseEvent, action: string, tab?: string) => {
    e.stopPropagation();
    if (tab) {
      setEditModalTab(tab);
    } else {
      toast.success(`${action} simulated locally.`);
    }
  };
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
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  },
  {
    header: 'Structure Score',
    accessor: (row: any) =>
    <span
      className={`font-bold ${row.structureScore >= 90 ? 'text-success' : row.structureScore >= 70 ? 'text-warning' : 'text-danger'}`}>
      
          {row.structureScore}
        </span>

  },
  {
    header: 'Missing Sections',
    accessor: (row: any) => {
      const missing = [];
      if (!row.objectiveId) missing.push('Objective');
      if (!row.expectedOutput) missing.push('Output');
      if (row.evidenceState === 'Missing') missing.push('Evidence');
      if (missing.length === 0)
      return <span className="text-xs text-text-muted">None</span>;
      return (
        <div className="flex flex-wrap gap-1">
            {missing.map((m) =>
          <span
            key={m}
            className="px-1.5 py-0.5 bg-surface border border-border-subtle rounded text-[10px] text-text-secondary">
            
                {m}
              </span>
          )}
          </div>);

    }
  },
  {
    header: 'Strategic Link',
    accessor: (row: any) =>
    <StatusPill status={row.objectiveId ? 'Linked' : 'Missing'} />

  },
  {
    header: 'Evidence Rule',
    accessor: (row: any) =>
    <span className="text-sm text-text-secondary">
          {row.evidenceState === 'Missing' ? 'Missing' : 'Configured'}
        </span>

  },
  {
    header: 'Closure Quality',
    accessor: (row: any) => <StatusPill status={row.closureQuality} />
  },
  {
    header: 'Action',
    accessor: (row: any) =>
    <div className="flex items-center gap-2">
          <button
        onClick={(e) => handleAction(e, 'Review structure', 'Core Details')}
        className="text-xs font-medium text-primary hover:underline whitespace-nowrap">
        
            Review structure
          </button>
          {!row.objectiveId &&
      <button
        onClick={(e) =>
        handleAction(e, 'Link objective', 'Strategic Context')
        }
        className="text-xs font-medium text-primary hover:underline whitespace-nowrap">
        
              Link objective
            </button>
      }
          {row.evidenceState === 'Missing' &&
      <button
        onClick={(e) => handleAction(e, 'Evidence rule added')}
        className="text-xs font-medium text-primary hover:underline whitespace-nowrap">
        
              Add evidence rule
            </button>
      }
        </div>

  }];

  return (
    <RolePageScaffold
      eyebrow="TASK GOVERNANCE"
      title="Task Structure Review"
      purpose="Review tasks missing objective linkage, expected output, evidence rules, checklist completeness, or closure criteria.">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile
          label="Tasks Reviewed"
          value={tasksReviewed.toString()}
          status="info" />
        
        <KpiTile
          label="Missing Objectives"
          value={missingObjectives.toString()}
          status="warning" />
        
        <KpiTile
          label="Missing Evidence Rules"
          value={missingEvidence.toString()}
          status="danger" />
        
        <KpiTile
          label="Weak Closure Criteria"
          value={weakClosure.toString()}
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
      {editModalTab &&
      <EditTaskStructureModal
        initialTab={editModalTab}
        onClose={() => setEditModalTab(null)} />

      }
    </RolePageScaffold>);

}