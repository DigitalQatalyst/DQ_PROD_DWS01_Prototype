import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { CalendarClock, Plus } from 'lucide-react';
import { OwnerBadge } from '../components/OwnerBadge';
import { toast } from 'sonner';
const mockSessions = [{
  id: 'SES-1',
  title: 'Sprint Planning',
  date: 'Today, 10:00 AM',
  actions: 3,
  decisions: 1,
  owner: 'USR-003'
}, {
  id: 'SES-2',
  title: 'Blocker Triage',
  date: 'Yesterday',
  actions: 5,
  decisions: 2,
  owner: 'USR-003'
}];
export function SessionBoardPage() {
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
  return <RolePageScaffold eyebrow="Working Sessions" title="Session Board" purpose="Manage team ceremonies, capture actions, and record decisions." primaryAction={{
    label: 'New Session',
    onClick: () => toast.success('New session created.')
  }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSessions.map((session) => <div key={session.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[#5F607F] mb-3">
              <CalendarClock size={16} />
              <span className="text-xs font-medium">{session.date}</span>
            </div>
            <h3 className="text-lg font-bold text-[#111118] mb-4">
              {session.title}
            </h3>
            <div className="flex items-center justify-between mb-4">
              <OwnerBadge userId={session.owner} />
            </div>
            <div className="flex gap-4 mb-4 text-sm text-[#5F607F]">
              <span>
                <strong>{session.actions}</strong> Actions
              </span>
              <span>
                <strong>{session.decisions}</strong> Decisions
              </span>
            </div>
            <button onClick={() => toast.success('Actions extracted to tasks.')} className="w-full py-2 bg-white border border-[#D8D9E6] text-[#111118] text-sm font-medium rounded-[8px] hover:bg-[#F6F6FB] transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Extract Actions
            </button>
          </div>)}
      </div>
    </RolePageScaffold>;
}