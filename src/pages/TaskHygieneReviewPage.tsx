import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { DataTable } from '../components/DataTable';
import { TaskDrawer } from '../components/TaskDrawer';
import { MonoId } from '../components/MonoId';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const mockTasks = [{
  id: 'TSK-1004',
  title: 'Prepare governance dashboard copy',
  ownerUserId: 'USR-003',
  issues: ['Missing Purpose', 'No Due Date']
}, {
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  ownerUserId: 'USR-001',
  issues: ['Empty Checklist']
}];
export function TaskHygieneReviewPage() {
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const columns = [{
    header: 'ID',
    accessor: (row: any) => <MonoId value={row.id} />
  }, {
    header: 'Title',
    accessor: (row: any) => <span className="font-medium text-[#111118]">{row.title}</span>
  }, {
    header: 'Owner',
    accessor: (row: any) => <OwnerBadge userId={row.ownerUserId} />
  }, {
    header: 'Hygiene Issues',
    accessor: (row: any) => <div className="flex gap-1 flex-wrap">
          {row.issues.map((issue: string, i: number) => <span key={i} className="text-[10px] uppercase tracking-wider bg-[#FFFBEB] text-[#D97706] px-2 py-0.5 rounded">
              {issue}
            </span>)}
        </div>
  }, {
    header: 'Action',
    accessor: (row: any) => <button onClick={(e) => {
      e.stopPropagation();
      toast.success('Review note added.');
    }} className="text-xs font-medium text-[#030F35] hover:underline">
          Add Note
        </button>
  }];
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Agile Execution" title="Task Hygiene Review" purpose="Identify tasks missing required metadata like purpose, due dates, or checklists.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-hidden">
        <DataTable columns={columns} rows={mockTasks} onRowClick={setSelectedTask} />
      </div>
      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </RolePageScaffold>;
}