import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { OwnerBadge } from '../components/OwnerBadge';
import { MonoId } from '../components/MonoId';
import { toast } from 'sonner';
import { MessageSquare, Paperclip } from 'lucide-react';
const mockUpdates = [{
  id: 'UPD-1',
  taskId: 'TSK-1001',
  taskTitle: 'Build Stage 0 orientation shell',
  author: 'USR-001',
  time: '2 hours ago',
  type: 'Progress',
  text: 'Stage 0 hero and routing structure completed.'
}, {
  id: 'UPD-2',
  taskId: 'TSK-1002',
  taskTitle: 'Finalise request intake card pattern',
  author: 'USR-001',
  time: '1 day ago',
  type: 'Blocker',
  text: 'Blocked by missing fulfilment rule.'
}, {
  id: 'UPD-3',
  taskId: 'TSK-1005',
  taskTitle: 'Align HRA onboarding request flow',
  author: 'USR-005',
  time: '2 days ago',
  type: 'Evidence',
  text: 'Attached initial flow diagram.'
}];
export function MyUpdatesPage() {
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [updateText, setUpdateText] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const handleSubmit = () => {
    if (!updateText.trim()) return;
    toast.success('Progress update added.');
    setUpdateText('');
    setComposerOpen(false);
  };
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-32 bg-surface rounded w-full"></div>
      </div>;
  }
  return <RolePageScaffold eyebrow="My Daily Work" title="My Updates" purpose="Timeline of progress updates, blockers, and decisions across your assigned work." primaryAction={{
    label: 'Add Update',
    onClick: () => setComposerOpen(true)
  }}>
      {composerOpen && <div className="mb-8 bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-[#5F607F]" />
            <span className="text-sm font-semibold text-[#111118]">
              New Update
            </span>
          </div>
          <textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder="What's the latest progress?" className="w-full h-24 p-3 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35] resize-none mb-4" />
          <div className="flex items-center justify-between">
            <button className="text-[#5F607F] hover:text-[#111118] flex items-center gap-1 text-sm font-medium transition-colors">
              <Paperclip size={16} /> Attach
            </button>
            <div className="flex gap-3">
              <button onClick={() => setComposerOpen(false)} className="px-4 py-2 text-sm font-medium text-[#5F607F] hover:text-[#111118]">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#FB5535] text-white text-sm font-medium rounded-[8px] hover:bg-[#E04A2E]">
                Post Update
              </button>
            </div>
          </div>
        </div>}

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[28px] before:-translate-x-px before:h-full before:w-0.5 before:bg-[#EEEFF6]">
        {mockUpdates.map((update) => <div key={update.id} className="relative flex items-start gap-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-[#F6F6FB] bg-white shrink-0 z-10">
              <OwnerBadge userId={update.author} />
            </div>
            <div className="flex-1 bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F3F5FD] text-[#030F35]">
                    {update.type}
                  </span>
                  <span className="text-xs text-[#5F607F]">{update.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5F607F]">on task</span>
                  <MonoId value={update.taskId} />
                </div>
              </div>
              <p className="text-sm text-[#2E2E42] mb-3">{update.text}</p>
              <div className="text-xs font-medium text-[#111118] bg-[#F6F6FB] px-3 py-2 rounded-[8px] inline-block">
                {update.taskTitle}
              </div>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}