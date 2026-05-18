import React, { useState } from 'react';
import {
  X,
  Mail,
  ArrowRight,
  Play,
  Eye,
  Copy,
  CheckCircle2 } from
'lucide-react';
import { toast } from 'sonner';
interface DirectoryRoutePanelProps {
  entity: any;
  activePersona: any;
  onClose: () => void;
  onRouteRequest: (entity: any) => void;
  onAssignTask: (entity: any) => void;
}
export function DirectoryRoutePanel({
  entity,
  activePersona,
  onClose,
  onRouteRequest,
  onAssignTask
}: DirectoryRoutePanelProps) {
  const [copied, setCopied] = useState(false);
  if (!entity) return null;
  const isUser = 'role' in entity;
  const isQueue = 'newCount' in entity;
  const isTeam =
  'leadUserId' in entity && !('unitId' in entity && !('leadUserId' in entity)); // rough check
  const handleCopy = () => {
    setCopied(true);
    toast.success('Contact route copied.');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleViewResponsibilities = () => {
    toast(`Opening responsibilities for ${entity.name} in prototype context.`);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-900/40 backdrop-blur-sm">
      <div className="w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border-default bg-surface shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                {isUser ?
                'Owner / Expert' :
                isQueue ?
                'Support Queue' :
                'Team / Unit'}
              </div>
              <h2 className="text-xl font-bold text-primary">{entity.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-primary hover:bg-white rounded-lg transition-colors">
              
              <X size={20} />
            </button>
          </div>
          {isUser &&
          <div className="text-sm font-medium text-primary mb-2">
              {entity.role}
            </div>
          }
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-text-secondary">Available for routing</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Card Simulation */}
          <div className="bg-white border border-border-default rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-primary mb-4">
              Contact Details
            </h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Unit</span>
                <span className="font-medium text-primary">
                  Digital Platforms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Responsibility</span>
                <span className="font-medium text-primary">
                  {isQueue ? 'Triage & Fulfilment' : 'Execution & Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Contact Route</span>
                <span className="font-medium text-primary font-mono text-xs">
                  {entity.id}@dws.internal
                </span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2 bg-surface text-primary font-semibold text-sm rounded-button hover:bg-navy-50 transition-colors">
              
              {copied ?
              <CheckCircle2 size={16} className="text-success" /> :

              <Copy size={16} />
              }
              {copied ? 'Copied' : 'Copy contact route'}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary mb-2">Actions</h3>

            <button
              onClick={() => onRouteRequest(entity)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left">
              
              <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowRight size={20} />
              </div>
              <div>
                <div className="font-semibold text-primary">
                  Route request to this owner
                </div>
                <div className="text-xs text-text-secondary">
                  Open intake wizard with owner pre-filled
                </div>
              </div>
            </button>

            <button
              onClick={() => onAssignTask(entity)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left">
              
              <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <Play size={20} />
              </div>
              <div>
                <div className="font-semibold text-primary">
                  Assign task to this owner
                </div>
                <div className="text-xs text-text-secondary">
                  Create a governed task assigned here
                </div>
              </div>
            </button>

            <button
              onClick={handleViewResponsibilities}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left">
              
              <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <Eye size={20} />
              </div>
              <div>
                <div className="font-semibold text-primary">
                  View owner responsibilities
                </div>
                <div className="text-xs text-text-secondary">
                  See owned services, templates, and workload
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>);

}