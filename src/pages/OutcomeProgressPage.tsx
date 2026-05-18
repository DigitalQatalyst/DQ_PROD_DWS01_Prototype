import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { MonoId } from '../components/MonoId';
import { Target, Link as LinkIcon } from 'lucide-react';
export function OutcomeProgressPage() {
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
  return <RolePageScaffold eyebrow="Unit Visibility" title="Outcome Progress" purpose="Track strategic outcomes against linked execution tasks.">
      <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-[8px] bg-[#F3F5FD] text-[#030F35] flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MonoId value="OUT-6001" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#16A34A] px-2 py-0.5 rounded">
                On Track
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#111118]">
              Deploy Stage 0 Orientation
            </h2>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#111118]">Overall Progress</span>
            <span className="text-[#030F35]">65%</span>
          </div>
          <div className="w-full bg-[#EEEFF6] rounded-full h-3">
            <div className="bg-[#030F35] h-3 rounded-full" style={{
            width: '65%'
          }} />
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#111118] mb-3">
          Linked Execution
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#EEEFF6] bg-[#F6F6FB]">
            <div className="flex items-center gap-3">
              <LinkIcon size={16} className="text-[#5F607F]" />
              <MonoId value="TSK-1001" />
              <span className="text-sm font-medium text-[#111118]">
                Build Stage 0 orientation shell
              </span>
            </div>
            <span className="text-xs font-bold text-[#D97706]">
              In Progress
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-[8px] border border-[#EEEFF6] bg-[#F6F6FB]">
            <div className="flex items-center gap-3">
              <LinkIcon size={16} className="text-[#5F607F]" />
              <MonoId value="TSK-1008" />
              <span className="text-sm font-medium text-[#111118]">
                Review enterprise execution health
              </span>
            </div>
            <span className="text-xs font-bold text-[#D97706]">
              Review Needed
            </span>
          </div>
        </div>
      </div>
    </RolePageScaffold>;
}