import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
const REVIEWS = [{
  id: 'CFG-9002',
  title: 'Add new task template: Security Audit',
  type: 'Task Model',
  actor: 'David Mwangi',
  timestamp: '2 hours ago',
  impact: 'Low'
}, {
  id: 'CFG-9004',
  title: 'Modify global SLA rule',
  type: 'SLA Rule',
  actor: 'Elena Costa',
  timestamp: '1 day ago',
  impact: 'High'
}];
export function ConfigReviewPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Administration" title="Configuration Review" purpose="Review and approve pending configuration changes." loading={loading}>
      <div className="space-y-4">
        {REVIEWS.map((review) => <div key={review.id} className="bg-white rounded-card border border-border-default shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ClipboardCheck size={18} className="text-primary" />
                  <span className="text-xs font-mono text-text-muted">
                    {review.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-pill ${review.impact === 'High' ? 'bg-danger-surface text-danger' : 'bg-info-surface text-info-text'}`}>
                    {review.impact} Impact
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {review.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-surface rounded-lg border border-border-subtle">
              <div>
                <span className="text-xs text-text-muted block mb-1">
                  Change Type
                </span>
                <span className="text-sm font-medium">{review.type}</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1">
                  Proposed By
                </span>
                <span className="text-sm font-medium">{review.actor}</span>
              </div>
              <div>
                <span className="text-xs text-text-muted block mb-1">
                  Submitted
                </span>
                <span className="text-sm font-medium">{review.timestamp}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              <button onClick={() => toast.success(`Approved ${review.id}`)} className="px-4 py-2 bg-success text-white text-sm font-medium rounded-button hover:bg-success/90 transition-colors">
                Approve Change
              </button>
              <button onClick={() => toast.success(`Returned ${review.id}`)} className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors">
                Return for Rework
              </button>
              <button onClick={() => toast.success(`Viewed diff for ${review.id}`)} className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors ml-auto">
                View Diff
              </button>
            </div>
          </div>)}
        {REVIEWS.length === 0 && <div className="p-12 text-center border border-dashed border-border-strong rounded-card bg-surface">
            <p className="text-text-secondary">
              No configuration changes pending review.
            </p>
          </div>}
      </div>
    </RolePageScaffold>;
}