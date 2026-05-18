import React, { useEffect } from 'react';
import { X, Clock, FileText, ShieldCheck, Settings, AlertTriangle, BookOpen, BarChart3, ArrowUpRight } from 'lucide-react';
import { MonoId } from './MonoId';
import { StatusPill } from './StatusPill';
import { OwnerBadge } from './OwnerBadge';
import { toast } from 'sonner';
export type EntityType = 'request' | 'approval' | 'config' | 'audit' | 'knowledge' | 'dashboard' | 'escalation';
interface EntityDrawerProps {
  type: EntityType;
  data: any;
  onClose: () => void;
}
export function EntityDrawer({
  type,
  data,
  onClose
}: EntityDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  if (!data) return null;
  const getIcon = () => {
    switch (type) {
      case 'request':
        return <FileText size={16} />;
      case 'approval':
        return <ShieldCheck size={16} />;
      case 'config':
        return <Settings size={16} />;
      case 'audit':
        return <Clock size={16} />;
      case 'knowledge':
        return <BookOpen size={16} />;
      case 'dashboard':
        return <BarChart3 size={16} />;
      case 'escalation':
        return <ArrowUpRight size={16} />;
      default:
        return <FileText size={16} />;
    }
  };
  const getLabel = () => {
    switch (type) {
      case 'request':
        return 'REQUEST DETAILS';
      case 'approval':
        return 'APPROVAL DETAILS';
      case 'config':
        return 'CONFIGURATION DETAILS';
      case 'audit':
        return 'AUDIT EVENT';
      case 'knowledge':
        return 'KNOWLEDGE ASSET';
      case 'dashboard':
        return 'DASHBOARD DETAILS';
      case 'escalation':
        return 'ESCALATION DETAILS';
      default:
        return 'DETAILS';
    }
  };
  const handleAction = (action: string) => {
    toast.success(`${action} simulated.`);
  };
  return <>
      <div className="fixed inset-0 z-[150] bg-transparent" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-[#FFFFFF] shadow-[0_0_40px_rgba(3,15,53,0.15)] z-[200] flex flex-col animate-in slide-in-from-right duration-220 ease-out border-l border-[#EEEFF6]">
        {/* Header */}
        <div className="flex-none p-6 border-b border-[#EEEFF6] bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#5F607F]">
              {getIcon()}
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {getLabel()}
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-[#F6F6FB] text-[#5F607F] hover:text-[#111118] transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <MonoId value={data.id || 'ID-000'} />
            {data.status && <StatusPill status={data.status} />}
          </div>
          <h2 className="text-xl font-bold text-[#111118]">
            {data.title || data.name || 'Entity Title'}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F6F6FB]">
          <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-4 space-y-4">
            {data.ownerUserId && <div>
                <span className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider block mb-2">
                  Owner
                </span>
                <OwnerBadge userId={data.ownerUserId} />
              </div>}
            {data.linkedTaskId && <div>
                <span className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider block mb-2">
                  Linked Task
                </span>
                <MonoId value={data.linkedTaskId} />
              </div>}
            {data.linkedRequestId && <div>
                <span className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider block mb-2">
                  Linked Request
                </span>
                <MonoId value={data.linkedRequestId} />
              </div>}
          </div>

          <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-4">
            <span className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider block mb-2">
              Summary
            </span>
            <p className="text-sm text-[#2E2E42] leading-relaxed">
              {data.summary || data.description || data.expectedOutcome || 'No summary provided for this entity.'}
            </p>
          </div>

          <div className="bg-white rounded-[12px] border border-[#D8D9E6] p-4">
            <span className="text-[11px] font-semibold text-[#5F607F] uppercase tracking-wider block mb-4">
              Timeline
            </span>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#EEEFF6]">
              {[1, 2].map((i) => <div key={i} className="relative flex items-start gap-3">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-[#030F35] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#111118]">
                      Event {i}
                    </p>
                    <p className="text-xs text-[#5F607F]">
                      2 hours ago • System
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-4 border-t border-[#EEEFF6] bg-white">
          <div className="flex gap-3">
            <button onClick={() => handleAction('Primary action')} className="flex-1 bg-[#FB5535] text-white py-2 px-4 rounded-[8px] text-sm font-medium hover:bg-[#E04A2E] transition-colors">
              Take Action
            </button>
            <button onClick={() => handleAction('Secondary action')} className="flex-1 bg-white border border-[#D8D9E6] text-[#111118] py-2 px-4 rounded-[8px] text-sm font-medium hover:bg-[#F6F6FB] transition-colors">
              Review
            </button>
          </div>
        </div>
      </div>
    </>;
}