import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { OwnerBadge } from '../components/OwnerBadge';
import { MonoId } from '../components/MonoId';
import { CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
const mockStages = [{
  label: 'Profile Setup',
  done: true
}, {
  label: 'Role Assignment',
  done: true
}, {
  label: 'Policy Acknowledgement',
  done: false
}, {
  label: 'Workspace Access',
  done: false
}, {
  label: 'Knowledge Orientation',
  done: false
}, {
  label: 'Completion Review',
  done: false
}];
export function NewJoinerOnboardingPage() {
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
  return <RolePageScaffold eyebrow="HRA Workflow" title="New Joiner Onboarding" purpose="Track and facilitate the onboarding journey for new employees." primaryAction={{
    label: 'Send Reminder',
    onClick: () => toast.success('Reminder sent to new joiner.')
  }}>
      <div className="max-w-3xl bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#EEEFF6]">
          <div className="flex items-center gap-4">
            <OwnerBadge userId="USR-001" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5F607F]">Linked Request:</span>
              <MonoId value="REQ-2002" />
            </div>
          </div>
          <span className="text-sm font-bold text-[#D97706] bg-[#FFFBEB] px-3 py-1 rounded-full">
            In Progress
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#111118] uppercase tracking-wider mb-4">
          Onboarding Stages
        </h3>
        <div className="space-y-4">
          {mockStages.map((stage, i) => <div key={i} className="flex items-center gap-3 p-3 rounded-[8px] border border-[#EEEFF6] bg-[#F6F6FB]">
              {stage.done ? <CheckCircle2 size={20} className="text-[#16A34A]" /> : <Circle size={20} className="text-[#D8D9E6]" />}
              <span className={`text-sm font-medium ${stage.done ? 'text-[#5F607F] line-through' : 'text-[#111118]'}`}>
                {stage.label}
              </span>
            </div>)}
        </div>
      </div>
    </RolePageScaffold>;
}