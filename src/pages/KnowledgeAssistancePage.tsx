import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { BookOpen, Search } from 'lucide-react';
import { toast } from 'sonner';
const KNOWLEDGE = [{
  id: 'KNO-006',
  title: 'Support Queue Triage Guide',
  type: 'Playbook',
  usage: 'High',
  lastUpdated: '2 weeks ago'
}, {
  id: 'KNO-007',
  title: 'Access Provisioning Standard',
  type: 'Standard',
  usage: 'Medium',
  lastUpdated: '1 month ago'
}, {
  id: 'KNO-008',
  title: 'Common Platform Errors',
  type: 'Reference',
  usage: 'High',
  lastUpdated: '3 days ago'
}];
export function KnowledgeAssistancePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Support Operations" title="Knowledge Assistance" purpose="Quick access to support playbooks and resolution guides." loading={loading}>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input type="text" placeholder="Search support knowledge base..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-strong rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KNOWLEDGE.map((kno) => <div key={kno.id} className="bg-white rounded-card border border-border-default shadow-sm p-5 hover:border-primary/30 transition-colors group">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-surface flex items-center justify-center text-primary shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-primary group-hover:text-primary transition-colors">
                  {kno.title}
                </h3>
                <span className="text-xs font-mono text-text-muted">
                  {kno.id}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
              <div>
                <span className="block text-xs text-text-muted">Type</span>
                {kno.type}
              </div>
              <div>
                <span className="block text-xs text-text-muted">Usage</span>
                {kno.usage}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border-subtle">
              <button onClick={() => toast.success(`Opened guide ${kno.id}`)} className="flex-1 py-1.5 bg-surface text-text-primary text-sm font-medium rounded hover:bg-border-subtle transition-colors">
                Open guide
              </button>
              <button onClick={() => toast.success(`Attached guide ${kno.id} to active request`)} className="flex-1 py-1.5 bg-white border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-surface transition-colors">
                Attach guide
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}