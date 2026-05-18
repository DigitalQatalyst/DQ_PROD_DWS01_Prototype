import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { BookOpen, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
const mockGuides = [{
  id: 'KNO-005',
  title: 'HRA Onboarding Workflow Guide',
  type: 'Guide'
}];
export function HraGuidesPage() {
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
  return <RolePageScaffold eyebrow="Knowledge" title="HRA Guides" purpose="Standard operating procedures and guides for HRA workflows.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGuides.map((k) => <div key={k.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => toast.success('Guide opened')}>
            <div className="w-10 h-10 rounded-[8px] bg-[#F3F5FD] text-[#030F35] flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="text-base font-bold text-[#111118] mb-2 group-hover:text-[#030F35] transition-colors">
              {k.title}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F607F] bg-[#F6F6FB] px-2 py-1 rounded">
                {k.type}
              </span>
              <span className="text-[10px] font-mono text-[#5F607F]">
                {k.id}
              </span>
            </div>
            <div className="pt-4 border-t border-[#EEEFF6] flex items-center justify-end">
              <ExternalLink size={14} className="text-[#5F607F] group-hover:text-[#030F35]" />
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}