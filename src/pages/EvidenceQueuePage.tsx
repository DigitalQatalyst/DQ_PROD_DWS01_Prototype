import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
const mockEvidenceTasks = [{
  id: 'TSK-1001',
  title: 'Build Stage 0 orientation shell',
  evidenceState: 'Partial',
  missing: ['Closure Report']
}, {
  id: 'TSK-1002',
  title: 'Finalise request intake card pattern',
  evidenceState: 'Missing',
  missing: ['Design Spec', 'Approval Sign-off']
}];
export function EvidenceQueuePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="Workspace" title="Evidence Queue" purpose="Tasks requiring evidence attachment before they can proceed to closure review.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockEvidenceTasks.map((task) => <div key={task.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <MonoId value={task.id} />
              <StatusPill status={task.evidenceState} />
            </div>
            <h3 className="text-base font-bold text-[#111118] mb-4">
              {task.title}
            </h3>
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] p-3 mb-4">
              <div className="flex items-center gap-2 text-[#DC2626] mb-2">
                <AlertCircle size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Missing Required Evidence
                </span>
              </div>
              <ul className="list-disc list-inside text-sm text-[#DC2626]">
                {task.missing.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <button onClick={() => toast.success('Evidence upload simulated.')} className="w-full py-2 bg-white border border-[#D8D9E6] text-[#111118] text-sm font-medium rounded-[8px] hover:bg-[#F6F6FB] transition-colors flex items-center justify-center gap-2">
              <Upload size={16} /> Attach Evidence
            </button>
          </div>)}
      </div>
    </RolePageScaffold>;
}