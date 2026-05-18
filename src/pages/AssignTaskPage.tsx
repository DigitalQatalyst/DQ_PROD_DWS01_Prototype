import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { toast } from 'sonner';
export function AssignTaskPage() {
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
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Task created from Team Lead view.');
  };
  return <RolePageScaffold eyebrow="Team Execution" title="Assign Task" purpose="Create and assign a new governed task to a team member.">
      <div className="max-w-2xl bg-white rounded-[12px] border border-[#D8D9E6] p-6 shadow-sm">
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#111118] mb-1.5">
              Task Title
            </label>
            <input type="text" className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35]" placeholder="e.g. Update API documentation" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111118] mb-1.5">
              Purpose
            </label>
            <textarea className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35] h-20" placeholder="Why does this task exist?" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111118] mb-1.5">
                Owner
              </label>
              <select className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35]">
                <option>Amina Hassan</option>
                <option>David Mwangi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111118] mb-1.5">
                Due Date
              </label>
              <input type="date" className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111118] mb-1.5">
              Expected Output
            </label>
            <textarea className="w-full px-3 py-2 border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35] h-20" placeholder="What is the specific deliverable?" required />
          </div>
          <div className="pt-4 border-t border-[#EEEFF6] flex justify-end">
            <button type="submit" className="px-6 py-2 bg-[#FB5535] text-white text-sm font-medium rounded-[8px] hover:bg-[#E04A2E] transition-colors">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </RolePageScaffold>;
}