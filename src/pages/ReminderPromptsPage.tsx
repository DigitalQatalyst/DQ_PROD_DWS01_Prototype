import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { Bell, Send } from 'lucide-react';
import { toast } from 'sonner';
const mockPrompts = [{
  id: 'PRM-1',
  title: 'Missing Update Reminder',
  desc: 'Send to owners of tasks without updates in 48h.',
  targetCount: 2
}, {
  id: 'PRM-2',
  title: 'Blocker Escalation Warning',
  desc: 'Send to owners of blockers older than 2 days.',
  targetCount: 1
}, {
  id: 'PRM-3',
  title: 'Missing Evidence Prompt',
  desc: 'Send to owners of tasks nearing closure without evidence.',
  targetCount: 3
}];
export function ReminderPromptsPage() {
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
  return <RolePageScaffold eyebrow="Agile Execution" title="Reminder Prompts" purpose="Pre-built communication templates to enforce operating discipline.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockPrompts.map((prompt) => <div key={prompt.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#F3F5FD] text-[#030F35] flex items-center justify-center">
                <Bell size={20} />
              </div>
              <h3 className="text-base font-bold text-[#111118]">
                {prompt.title}
              </h3>
            </div>
            <p className="text-sm text-[#5F607F] mb-4 flex-1">{prompt.desc}</p>
            <div className="flex items-center justify-between pt-4 border-t border-[#EEEFF6]">
              <span className="text-sm font-medium text-[#D97706]">
                {prompt.targetCount} targets identified
              </span>
              <button onClick={() => toast.success('Prompt sent.')} className="px-4 py-2 bg-[#FB5535] text-white text-sm font-medium rounded-[8px] hover:bg-[#E04A2E] transition-colors flex items-center gap-2">
                <Send size={14} /> Send Prompt
              </button>
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}