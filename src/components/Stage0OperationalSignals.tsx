import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, AlertOctagon, CheckSquare, Clock } from 'lucide-react';
export function Stage0OperationalSignals() {
  const navigate = useNavigate();
  return <section className="max-w-5xl mx-auto">
      <div className="bg-surface border border-border rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-navy-600 tracking-wider uppercase">
            Live Operational Signals
          </h2>
          <span className="text-xs text-navy-400">Updated just now</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate('/workspace/my-tasks')} className="flex items-center gap-4 p-4 rounded-card bg-white border border-border hover:border-primary/30 hover:bg-surface transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">3</span>
                <div className="w-2 h-2 rounded-full bg-warning"></div>
              </div>
              <p className="text-xs text-navy-600 font-medium leading-tight">
                Tasks awaiting review
              </p>
            </div>
          </button>

          <button onClick={() => navigate('/workspace/my-tasks')} className="flex items-center gap-4 p-4 rounded-card bg-white border border-border hover:border-primary/30 hover:bg-surface transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <AlertOctagon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">2</span>
                <div className="w-2 h-2 rounded-full bg-danger"></div>
              </div>
              <p className="text-xs text-navy-600 font-medium leading-tight">
                Blockers unresolved
              </p>
            </div>
          </button>

          <button onClick={() => navigate('/workspace/my-requests')} className="flex items-center gap-4 p-4 rounded-card bg-white border border-border hover:border-primary/30 hover:bg-surface transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
              <CheckSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">1</span>
                <div className="w-2 h-2 rounded-full bg-warning"></div>
              </div>
              <p className="text-xs text-navy-600 font-medium leading-tight">
                Request pending approval
              </p>
            </div>
          </button>

          <button onClick={() => navigate('/workspace/my-tasks')} className="flex items-center gap-4 p-4 rounded-card bg-white border border-border hover:border-primary/30 hover:bg-surface transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">5</span>
                <div className="w-2 h-2 rounded-full bg-danger"></div>
              </div>
              <p className="text-xs text-navy-600 font-medium leading-tight">
                Overdue actions
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>;
}