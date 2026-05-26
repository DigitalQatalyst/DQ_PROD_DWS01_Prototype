import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Link as LinkIcon,
  Play,
  AlertCircle,
  Flag,
  CheckCircle2 } from
'lucide-react';
import { toast } from 'sonner';
import { StatusPill } from './StatusPill';
interface KnowledgeActionPanelProps {
  guide: any;
  activePersona: any;
  onClose: () => void;
  onStartTaskFromGuide: (guide: any) => void;
  onRequestUpdate: (guide: any) => void;
}
export function KnowledgeActionPanel({
  guide,
  activePersona,
  onClose,
  onStartTaskFromGuide,
  onRequestUpdate
}: KnowledgeActionPanelProps) {
  const [activeTab, setActiveTab] = useState<'Preview' | 'Actions'>('Actions');
  const [showAttachForm, setShowAttachForm] = useState(false);
  const [attachData, setAttachData] = useState({
    taskId: '',
    reason: '',
    required: false
  });
  if (!guide) return null;
  const handleAttach = () => {
    if (!attachData.taskId) {
      toast.error('Please select a task');
      return;
    }
    toast.success(`Guide linked to ${attachData.taskId} locally.`);
    setShowAttachForm(false);
    setAttachData({
      taskId: '',
      reason: '',
      required: false
    });
  };
  return (
    <div className="fixed inset-0 z-[250] flex justify-end bg-navy-900/40 backdrop-blur-sm">
      <div className="w-full max-w-[440px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border-default bg-surface shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
                {guide.type}
              </div>
              <h2 className="text-xl font-bold text-primary">{guide.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-muted hover:text-primary hover:bg-white rounded-lg transition-colors">
              
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <StatusPill status={guide.status} />
            <span className="text-text-secondary">
              Owner: Knowledge Content Owner
            </span>
            <span className="text-text-muted">Last reviewed: 2 weeks ago</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-default shrink-0">
          {['Actions', 'Preview'].map((tab) =>
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-primary hover:bg-surface'}`}
            onClick={() => setActiveTab(tab as any)}>
            
              {tab}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Preview' ?
          <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-primary mb-2">
                  Summary
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  This guide provides standard operating procedures and
                  reference material for {guide.title.toLowerCase()}. It is
                  maintained by the central governance team and should be
                  referenced during execution.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Used In
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border-default">
                    <span className="text-sm font-medium text-primary">
                      Services
                    </span>
                    <span className="text-xs font-semibold bg-white px-2 py-1 rounded border border-border-subtle">
                      3 linked
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border-default">
                    <span className="text-sm font-medium text-primary">
                      Task Templates
                    </span>
                    <span className="text-xs font-semibold bg-white px-2 py-1 rounded border border-border-subtle">
                      5 linked
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border-default">
                    <span className="text-sm font-medium text-primary">
                      Active Tasks
                    </span>
                    <span className="text-xs font-semibold bg-white px-2 py-1 rounded border border-border-subtle">
                      {guide.linkedTaskIds?.length || 0} linked
                    </span>
                  </div>
                </div>
              </div>
            </div> :

          <div className="space-y-3">
              <button
              onClick={() => setActiveTab('Preview')}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left">
              
                <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="font-semibold text-primary">
                    Open guide preview
                  </div>
                  <div className="text-xs text-text-secondary">
                    Read the full content and context
                  </div>
                </div>
              </button>

              <div className="border border-border-default rounded-xl overflow-hidden">
                <button
                onClick={() => setShowAttachForm(!showAttachForm)}
                className="w-full flex items-center gap-3 p-4 bg-white hover:bg-surface transition-all group text-left">
                
                  <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">
                      Attach to a task
                    </div>
                    <div className="text-xs text-text-secondary">
                      Link this guide to an active work item
                    </div>
                  </div>
                </button>

                {showAttachForm &&
              <div className="p-4 bg-surface border-t border-border-default space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Select Task
                      </label>
                      <select
                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    value={attachData.taskId}
                    onChange={(e) =>
                    setAttachData({
                      ...attachData,
                      taskId: e.target.value
                    })
                    }>
                    
                        <option value="">Select...</option>
                        <option value="TSK-1001">TSK-1001: Q3 Planning</option>
                        <option value="TSK-1002">TSK-1002: System Audit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Reason for attaching
                      </label>
                      <input
                    type="text"
                    className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    value={attachData.reason}
                    onChange={(e) =>
                    setAttachData({
                      ...attachData,
                      reason: e.target.value
                    })
                    }
                    placeholder="e.g. Reference for step 3" />
                  
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <input
                    type="checkbox"
                    checked={attachData.required}
                    onChange={(e) =>
                    setAttachData({
                      ...attachData,
                      required: e.target.checked
                    })
                    } />
                  
                      Required reading for closure
                    </label>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                    onClick={() => setShowAttachForm(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-primary">
                    
                        Cancel
                      </button>
                      <button
                    onClick={handleAttach}
                    className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded hover:bg-navy-800">
                    
                        Attach
                      </button>
                    </div>
                  </div>
              }
              </div>

              <button
              onClick={() => onStartTaskFromGuide(guide)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left">
              
                <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <Play size={20} />
                </div>
                <div>
                  <div className="font-semibold text-primary">
                    Start task from guide
                  </div>
                  <div className="text-xs text-text-secondary">
                    Create a new task with this guide pre-linked
                  </div>
                </div>
              </button>

              <button
              onClick={() => onRequestUpdate(guide)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-primary hover:shadow-sm transition-all group text-left mt-6">
              
                <div className="p-2 bg-surface text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="font-semibold text-primary">
                    Request knowledge update
                  </div>
                  <div className="text-xs text-text-secondary">
                    Suggest changes or additions to this content
                  </div>
                </div>
              </button>

              <button
              onClick={() => {
                toast.success('Content flagged for review.');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 bg-white border border-border-default rounded-xl hover:border-danger hover:shadow-sm transition-all group text-left">
              
                <div className="p-2 bg-danger/10 text-danger rounded-lg group-hover:bg-danger group-hover:text-white transition-colors">
                  <Flag size={20} />
                </div>
                <div>
                  <div className="font-semibold text-danger">
                    Flag outdated content
                  </div>
                  <div className="text-xs text-text-secondary">
                    Report this guide as inaccurate or obsolete
                  </div>
                </div>
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

}
