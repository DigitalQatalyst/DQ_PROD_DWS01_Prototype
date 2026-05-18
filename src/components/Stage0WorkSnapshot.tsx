import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, AlertOctagon, Activity, CheckSquare, ArrowRight } from 'lucide-react';
import type { Persona } from '../types/platform';
import { roleGuides } from '../mocks/stage0.mock';
interface Stage0WorkSnapshotProps {
  activePersona: Persona;
}
export function Stage0WorkSnapshot({
  activePersona
}: Stage0WorkSnapshotProps) {
  const navigate = useNavigate();
  // Try to get metrics from mock, fallback to defaults
  const metrics = roleGuides[activePersona.id]?.metrics || [];
  const getMetricValue = (label: string, fallback: string) => {
    const metric = metrics.find((m) => m.label.toLowerCase().includes(label.toLowerCase()));
    return metric ? metric.value : fallback;
  };
  const assignedCount = getMetricValue('assigned', '2');
  const blockedCount = getMetricValue('blocker', '1');
  const approvalCount = getMetricValue('approval', '0');
  return <section className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">
          My Work Snapshot
        </h2>
        <p className="text-navy-600 text-sm">
          The system already knows your work.
        </p>
      </div>

      <div className="space-y-6">
        {/* Tiles Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-border rounded-card p-4 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3">
              <ClipboardList size={16} />
            </div>
            <div className="text-2xl font-bold text-navy-900 mb-1">
              {assignedCount}
            </div>
            <div className="text-xs text-navy-600 font-medium mb-3">
              Assigned Tasks
            </div>
            <button onClick={() => navigate('/workspace/my-tasks')} className="text-[10px] font-bold text-secondary hover:text-orange-600 mt-auto text-left">
              View →
            </button>
          </div>

          <div className="bg-white border border-border rounded-card p-4 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3">
              <Clock size={16} />
            </div>
            <div className="text-2xl font-bold text-navy-900 mb-1">3</div>
            <div className="text-xs text-navy-600 font-medium mb-3">
              Due Today
            </div>
            <button onClick={() => navigate('/workspace/my-tasks')} className="text-[10px] font-bold text-secondary hover:text-orange-600 mt-auto text-left">
              View →
            </button>
          </div>

          <div className="bg-white border border-border rounded-card p-4 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3">
              <AlertOctagon size={16} />
            </div>
            <div className="text-2xl font-bold text-navy-900 mb-1">
              {blockedCount}
            </div>
            <div className="text-xs text-navy-600 font-medium mb-3">
              Blocked Work
            </div>
            <button onClick={() => navigate('/workspace/my-tasks')} className="text-[10px] font-bold text-secondary hover:text-orange-600 mt-auto text-left">
              View →
            </button>
          </div>

          <div className="bg-white border border-border rounded-card p-4 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3">
              <Activity size={16} />
            </div>
            <div className="text-2xl font-bold text-navy-900 mb-1">7</div>
            <div className="text-xs text-navy-600 font-medium mb-3">
              Recent Activity
            </div>
            <button onClick={() => navigate('/workspace/my-work')} className="text-[10px] font-bold text-secondary hover:text-orange-600 mt-auto text-left">
              View →
            </button>
          </div>

          <div className="bg-white border border-border rounded-card p-4 flex flex-col">
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary mb-3">
              <CheckSquare size={16} />
            </div>
            <div className="text-2xl font-bold text-navy-900 mb-1">
              {approvalCount}
            </div>
            <div className="text-xs text-navy-600 font-medium mb-3">
              Pending Approvals
            </div>
            <button onClick={() => navigate('/workspace/my-requests')} className="text-[10px] font-bold text-secondary hover:text-orange-600 mt-auto text-left">
              View →
            </button>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface/50">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-border">
            <div className="px-5 py-3 flex items-center gap-4 hover:bg-surface/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-warning shrink-0"></div>
              <div className="text-xs font-mono text-navy-500 shrink-0">
                TSK-1001
              </div>
              <div className="text-sm text-navy-900 truncate flex-grow">
                Stage 0 orientation shell requires an update
              </div>
              <div className="text-xs text-navy-400 shrink-0">10m ago</div>
            </div>
            <div className="px-5 py-3 flex items-center gap-4 hover:bg-surface/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-danger shrink-0"></div>
              <div className="text-xs font-mono text-navy-500 shrink-0">
                TSK-1002
              </div>
              <div className="text-sm text-navy-900 truncate flex-grow">
                Request intake card pattern is blocked
              </div>
              <div className="text-xs text-navy-400 shrink-0">1h ago</div>
            </div>
            <div className="px-5 py-3 flex items-center gap-4 hover:bg-surface/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-success shrink-0"></div>
              <div className="text-xs font-mono text-navy-500 shrink-0">
                REQ-2001
              </div>
              <div className="text-sm text-navy-900 truncate flex-grow">
                Task / Workflow Support request approved
              </div>
              <div className="text-xs text-navy-400 shrink-0">2h ago</div>
            </div>
          </div>
        </div>

        {/* Transition Links */}
        <div className="flex flex-wrap justify-end gap-4 pt-2">
          <button onClick={() => navigate('/workspace/my-tasks')} className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
            View Assigned Work <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/workspace/my-requests')} className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
            Open My Requests <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate(activePersona.defaultRoute)} className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
            Review Pending Actions <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>;
}