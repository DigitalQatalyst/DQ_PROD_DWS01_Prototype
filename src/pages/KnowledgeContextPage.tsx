import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { BookOpen, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
const mockKnowledge = [{
  id: 'KNO-001',
  title: 'Agile TMS Task Discipline Guide',
  type: 'Playbook',
  relevance: 'High - Matches your active tasks'
}, {
  id: 'KNO-002',
  title: '6xD Execution Reference',
  type: 'Reference',
  relevance: 'Medium - Role default'
}, {
  id: 'KNO-003',
  title: 'Evidence Attachment Standard',
  type: 'Standard',
  relevance: 'High - Required for TSK-1001'
}, {
  id: 'KNO-004',
  title: 'Closure Quality Review Guide',
  type: 'Guide',
  relevance: 'Medium - Upcoming closure'
}];
export function KnowledgeContextPage() {
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
  return <RolePageScaffold eyebrow="My Daily Work" title="Knowledge in Work Context" purpose="Guides and standards automatically surfaced based on your active tasks and role." filterRow={<div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F607F]" size={18} />
          <input type="text" placeholder="Search knowledge..." className="w-full pl-10 pr-4 py-2 bg-white border border-[#D8D9E6] rounded-[8px] text-sm focus:outline-none focus:border-[#030F35]" />
        </div>}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockKnowledge.map((k) => <div key={k.id} className="bg-white rounded-[12px] border border-[#D8D9E6] p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => toast.success('Knowledge guide opened')}>
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
            <div className="pt-4 border-t border-[#EEEFF6] flex items-center justify-between">
              <span className="text-xs text-[#16A34A] font-medium">
                {k.relevance}
              </span>
              <ExternalLink size={14} className="text-[#5F607F] group-hover:text-[#030F35]" />
            </div>
          </div>)}
      </div>
    </RolePageScaffold>;
}