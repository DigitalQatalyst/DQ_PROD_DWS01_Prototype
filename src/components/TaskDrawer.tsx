import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Activity,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  Upload,
  ThumbsUp,
  BookOpen,
  GitCommit,
  ChevronRight,
  Target,
  Plus,
  GitBranch } from
'lucide-react';
import type { Task } from '../types/platform';
import { StatusPill } from './StatusPill';
import { SlaBadge } from './SlaBadge';
import { OwnerBadge } from './OwnerBadge';
import { MonoId } from './MonoId';
import { usePersona } from '../context/PersonaContext';
import { toast } from 'sonner';
import {
  governedTasks,
  strategicAspirations,
  objectives,
  outcomes,
  executionRegisters,
  registerItems } from
'../mocks/governedTasks.mock';
import { EditTaskStructureModal } from './EditTaskStructureModal';
import { AddCustomSectionModal } from './AddCustomSectionModal';
import { AddDynamicFieldModal } from './AddDynamicFieldModal';
interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
}
export function TaskDrawer({ task, onClose }: TaskDrawerProps) {
  const { activePersona } = usePersona();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [initialEditTab, setInitialEditTab] = useState('Core Details');
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  if (!task) return null;
  // Merge with governedTasks fixture if available
  const governedData = governedTasks.find((t) => t.id === task.id);
  // Fallback data if not in fixture
  const details = governedData || {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    owner: 'Unknown',
    ownerUserId: task.ownerUserId,
    contributors: [],
    reviewer: task.reviewerUserId || 'USR-003',
    team: task.teamId === 'TM-001' ? 'DWS Core Squad' : 'eCom.DXP Squad',
    unit: 'Digital Platforms',
    dueDate: task.dueDate,
    slaState: task.slaState,
    evidenceState: task.evidenceState,
    structureScore: 0,
    closureQuality: 'Not ready',
    purpose: task.purpose,
    expectedOutput: task.expectedOutput,
    strategicAspirationId: '',
    objectiveId: '',
    outcomeId: '',
    registerId: '',
    registerItemId: '',
    contributionType: '',
    kpiTarget: '',
    contributionStatus: '',
    taskObjectives: [],
    checklist: [],
    updates: [],
    blocker: null,
    evidence: [],
    approval: null,
    linkedKnowledge: [],
    customSections: [],
    audit: [],
    changeHistory: [],
    closureScores: {
      output: 'Pending',
      strategic: 'Pending',
      objective: 'Pending',
      evidence: 'Pending',
      checklist: '0/0',
      sla: 'Pending',
      review: 'Pending'
    }
  };
  const aspiration = strategicAspirations.find(
    (a) => a.id === details.strategicAspirationId
  );
  const objective = objectives.find((o) => o.id === details.objectiveId);
  const outcome = outcomes.find((o) => o.id === details.outcomeId);
  const register = executionRegisters.find((r) => r.id === details.registerId);
  const registerItem = registerItems.find(
    (ri) => ri.id === details.registerItemId
  );
  const handleAction = (action: string) => {
    toast.success(`${action}`);
  };
  const openEditModal = (tab = 'Core Details') => {
    setInitialEditTab(tab);
    setIsEditModalOpen(true);
  };
  const renderSectionTitle = (title: string) =>
  <h3 className="text-[12px] font-[600] text-[#030F35] uppercase tracking-wider mb-4">
      {title}
    </h3>;

  const canEditStructure = [
  'team-lead',
  'unit-lead',
  'admin',
  'hra',
  'support'].
  includes(activePersona.id);
  const isAssociate = activePersona.id === 'associate';
  return (
    <>
      <div className="fixed inset-0 z-[150] bg-transparent" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[44vw] min-w-[560px] max-w-[760px] bg-[#FFFFFF] shadow-[0_0_40px_rgba(3,15,53,0.15)] z-[200] flex flex-col animate-in slide-in-from-right duration-220 ease-out border-l border-[#EEEFF6]">
        {/* 1. Header */}
        <div className="flex-none p-6 border-b border-border-subtle bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                TASK DETAILS
              </span>
              <MonoId value={details.id} />
              <StatusPill status={details.status} />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-button hover:bg-surface text-text-muted hover:text-text-primary transition-colors">
              
              <X size={20} />
            </button>
          </div>
          <h2 className="text-2xl font-bold text-[#111118] mb-4">
            {details.title}
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${details.priority === 'High' || details.priority === 'Critical' ? 'bg-danger-surface text-danger border-danger/20' : details.priority === 'Medium' ? 'bg-warning-surface text-warning-text border-warning/20' : 'bg-surface text-text-secondary border-border-default'}`}>
              
              Priority: {details.priority}
            </span>
            <SlaBadge state={details.slaState as any} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F6F6FB]">
          {/* 2. Core Details */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Owner
                </span>
                <OwnerBadge userId={details.ownerUserId} />
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Contributors
                </span>
                <div className="flex -space-x-2">
                  {details.contributors.length > 0 ?
                  details.contributors.map((c) =>
                  <OwnerBadge key={c} userId={c} />
                  ) :

                  <span className="text-sm text-text-muted">None</span>
                  }
                </div>
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Reviewer / approver
                </span>
                <OwnerBadge userId={details.reviewer} />
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Team / unit
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {details.team}
                </span>
                <span className="text-xs text-text-muted block mt-0.5">
                  {details.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Due date / SLA target
                </span>
                <span className="text-sm font-mono font-medium text-text-primary">
                  {details.dueDate}
                </span>
                <span className="text-xs text-text-muted block mt-0.5">
                  {details.slaState}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Current state
                </span>
                <StatusPill status={details.status} />
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Last update
                </span>
                <span className="text-sm font-medium text-text-primary">
                  2 hours ago
                </span>
              </div>
              <div>
                <span className="text-xs text-[#5F607F] block mb-1.5">
                  Created by / date
                </span>
                <span className="text-sm font-medium text-text-primary">
                  System
                </span>
                <span className="text-xs text-text-muted block mt-0.5 font-mono">
                  2026-05-01
                </span>
              </div>
            </div>
          </div>

          {/* 3. Strategic Context */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FB5535]" />
            <div className="flex items-center justify-between mb-4">
              {renderSectionTitle('STRATEGIC CONTEXT')}
              {canEditStructure &&
              <button
                onClick={() => openEditModal('Strategic Context')}
                className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E]">
                
                  Edit context
                </button>
              }
            </div>

            {aspiration ?
            <div className="space-y-5">
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Strategic Aspiration
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {aspiration.title}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Objective
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {objective?.title}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Outcome
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary">
                      {outcome?.title}
                    </span>
                    <span className="text-xs font-bold text-success">
                      {outcome?.progress}%
                    </span>
                  </div>
                  <div className="w-full max-w-xs bg-border-subtle rounded-full h-1.5 mt-2">
                    <div
                    className="bg-success h-1.5 rounded-full"
                    style={{
                      width: `${outcome?.progress || 0}%`
                    }} />
                  
                  </div>
                </div>
                <div className="pt-4 border-t border-border-subtle grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <span className="text-xs text-[#5F607F] block mb-1">
                      Linked Execution Register
                    </span>
                    <div className="flex items-center gap-2">
                      <MonoId value={register?.id || ''} />
                      <span className="text-sm font-medium text-text-primary">
                        {register?.title}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-[#5F607F] block mb-1">
                      Register Item
                    </span>
                    <div className="flex items-center justify-between bg-surface p-3 rounded-lg border border-border-subtle">
                      <div className="flex items-center gap-2">
                        <MonoId value={registerItem?.id || ''} />
                        <span className="text-sm font-medium text-text-primary">
                          {registerItem?.title}
                        </span>
                      </div>
                      <button
                      onClick={() =>
                      handleAction(
                        `Opening linked register item ${registerItem?.id}.`
                      )
                      }
                      className="text-xs font-medium text-primary hover:underline">
                      
                        Open linked register item
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#5F607F] block mb-1">
                      Contribution Type
                    </span>
                    <span className="text-sm text-text-primary">
                      {details.contributionType}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#5F607F] block mb-1">
                      Current Contribution Status
                    </span>
                    <StatusPill status={details.contributionStatus} />
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-[#5F607F] block mb-1">
                      KPI / Target
                    </span>
                    <span className="text-sm text-text-primary">
                      {details.kpiTarget}
                    </span>
                  </div>
                </div>
              </div> :

            <div className="p-6 text-center border border-dashed border-border-strong rounded-lg bg-warning-surface/30">
                <AlertCircle size={24} className="text-warning mx-auto mb-2" />
                <p className="text-sm text-text-secondary mb-3">
                  This task is missing strategic context.
                </p>
                {canEditStructure &&
              <button
                onClick={() => openEditModal('Strategic Context')}
                className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors">
                
                    Link strategic context
                  </button>
              }
              </div>
            }
          </div>

          {/* 4. Purpose */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('PURPOSE')}
            <p className="text-sm text-text-secondary leading-relaxed">
              {details.purpose}
            </p>
          </div>

          {/* 5. Expected Output */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('EXPECTED OUTPUT')}
            <p className="text-sm text-text-secondary leading-relaxed">
              {details.expectedOutput}
            </p>
          </div>

          {/* 6. Objectives */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="flex items-center justify-between mb-4">
              {renderSectionTitle('OBJECTIVES')}
              {!isAssociate &&
              <button
                onClick={() => handleAction('Objective added locally.')}
                className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E] flex items-center gap-1">
                
                  <Plus size={14} />
                  Add objective
                </button>
              }
            </div>
            {details.taskObjectives && details.taskObjectives.length > 0 ?
            <div className="space-y-3">
                {details.taskObjectives.map((obj) =>
              <div
                key={obj.id}
                className="p-4 rounded-lg border border-border-subtle bg-surface">
                
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <MonoId value={obj.id} />
                        <p className="text-sm font-medium text-text-primary mt-1">
                          {obj.statement}
                        </p>
                      </div>
                      <StatusPill status={obj.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border-default">
                      <div>
                        <span className="text-xs text-text-muted block mb-1">
                          Target / success measure
                        </span>
                        <span className="text-xs text-text-secondary">
                          {obj.target}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-text-muted block mb-1">
                          Owner
                        </span>
                        <span className="text-xs font-medium text-text-primary">
                          {obj.owner}
                        </span>
                      </div>
                    </div>
                  </div>
              )}
              </div> :

            <div className="p-4 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">
                  No specific objectives defined for this task.
                </p>
              </div>
            }
          </div>

          {/* 7. Checklist */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="flex items-center justify-between mb-3">
              {renderSectionTitle('CHECKLIST')}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-primary">
                  {details.checklist.filter((c) => c.done).length} of{' '}
                  {details.checklist.length} complete
                </span>
                {canEditStructure &&
                <button
                  onClick={() => openEditModal('Checklist')}
                  className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E]">
                  
                    Edit checklist
                  </button>
                }
              </div>
            </div>
            <div className="w-full bg-border-subtle rounded-full h-2.5 mb-6">
              <div
                className="bg-[#FB5535] h-2.5 rounded-full transition-all"
                style={{
                  width: details.checklist.length ?
                  `${details.checklist.filter((c) => c.done).length / details.checklist.length * 100}%` :
                  '0%'
                }} />
              
            </div>

            <div className="space-y-4">
              {['Setup', 'Execution', 'Evidence', 'Closure'].map((group) => {
                const items = details.checklist.filter((c) => c.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group}>
                    <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                      {group}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) =>
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg border border-border-subtle bg-surface/50">
                        
                          <div className="mt-0.5">
                            {item.done ?
                          <CheckCircle2
                            size={18}
                            className="text-success" /> :


                          <Circle
                            size={18}
                            className="text-border-strong" />

                          }
                          </div>
                          <span
                          className={`text-sm font-medium ${item.done ? 'text-text-primary line-through opacity-70' : 'text-text-primary'}`}>
                          
                            {item.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>);

              })}
            </div>
          </div>

          {/* 8. Updates Timeline */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="flex items-center justify-between mb-4">
              {renderSectionTitle('UPDATES')}
              <button
                onClick={() => handleAction('Update composer opened.')}
                className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E] flex items-center gap-1">
                
                <MessageSquare size={14} />
                Add update
              </button>
            </div>
            {details.updates.length > 0 ?
            <div className="space-y-4">
                {details.updates.map((update) =>
              <div
                key={update.id}
                className="p-4 rounded-lg border border-border-subtle bg-surface">
                
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {update.author}
                        </span>
                        <span className="text-xs text-text-muted">
                          • {update.role}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted">
                        {update.timestamp}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-100 text-primary mb-2">
                        {update.type}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{update.text}</p>
                  </div>
              )}
              </div> :

            <div className="p-4 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">No updates yet.</p>
              </div>
            }
          </div>

          {/* 9. Blockers */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('BLOCKERS')}
            {details.blocker ?
            <div className="p-4 rounded-lg border border-danger/20 bg-danger-surface">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-danger" />
                    <MonoId value={details.blocker.id} />
                    <span className="text-xs font-bold text-danger uppercase tracking-wider">
                      Severity: {details.blocker.severity}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-danger">
                    Age: {details.blocker.age}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-danger/70 block mb-1">
                      Owner
                    </span>
                    <span className="text-sm font-medium text-danger">
                      {details.blocker.owner}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-danger/70 block mb-1">
                      Escalation Status
                    </span>
                    <span className="text-sm font-medium text-danger">
                      {details.blocker.escalated ?
                    'Escalated' :
                    'Not Escalated'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs text-danger/70 block mb-1">
                      Description
                    </span>
                    <p className="text-sm text-danger">
                      {details.blocker.desc}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-danger/70 block mb-1">
                      Resolution path
                    </span>
                    <p className="text-sm text-danger">
                      {details.blocker.path}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                  onClick={() => handleAction('Review blocker')}
                  className="px-3 py-1.5 bg-danger text-white text-sm font-medium rounded hover:bg-danger/90 transition-colors">
                  
                    Review blocker
                  </button>
                  <button
                  onClick={() => handleAction('Escalate blocker')}
                  className="px-3 py-1.5 bg-white text-danger border border-danger/20 text-sm font-medium rounded hover:bg-danger-surface transition-colors">
                  
                    Escalate
                  </button>
                </div>
              </div> :

            <div className="p-6 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">
                  No active blockers for this task.
                </p>
              </div>
            }
          </div>

          {/* 10. Evidence */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {renderSectionTitle('EVIDENCE')}
                <StatusPill status={details.evidenceState} />
              </div>
              <button
                onClick={() => handleAction('Evidence upload simulated.')}
                className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E] flex items-center gap-1">
                
                <Upload size={14} />
                Attach evidence
              </button>
            </div>
            {details.evidence && details.evidence.length > 0 ?
            <div className="space-y-3">
                {details.evidence.map((file, i) =>
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-border-subtle hover:bg-surface transition-colors">
                
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-navy-100 text-primary flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary block">
                          {file.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          {file.type} • {file.size} • Uploaded by{' '}
                          {file.uploader} • {file.timestamp}
                        </span>
                        <span className="text-xs text-text-secondary block mt-1">
                          Relevance: {file.note}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 text-text-muted hover:text-primary transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
              )}
              </div> :

            <div className="p-6 text-center border border-dashed border-border-strong rounded-lg bg-warning-surface/30">
                <AlertCircle size={24} className="text-warning mx-auto mb-2" />
                <p className="text-sm text-text-secondary">
                  Missing required evidence for closure.
                </p>
              </div>
            }
          </div>

          {/* 11. Approvals & Decisions */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('APPROVALS & DECISIONS')}
            {details.approval ?
            <div className="p-4 rounded-lg border border-border-subtle bg-surface">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-text-primary">
                    {details.approval.type}
                  </span>
                  <StatusPill status={details.approval.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-text-muted block mb-1">
                      Approver
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {details.approval.approver}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1">
                      Decision Date
                    </span>
                    <span className="text-sm text-text-primary">
                      {details.approval.date}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-text-muted block mb-1">
                      Rationale
                    </span>
                    <span className="text-sm text-text-secondary">
                      {details.approval.rationale}
                    </span>
                  </div>
                </div>
                {!isAssociate &&
              <div className="flex gap-3 pt-4 border-t border-border-default">
                    <button
                  onClick={() => handleAction('Approve')}
                  className="px-3 py-1.5 bg-success text-white text-sm font-medium rounded hover:bg-success/90 transition-colors">
                  
                      Approve
                    </button>
                    <button
                  onClick={() => handleAction('Return')}
                  className="px-3 py-1.5 bg-white border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-surface transition-colors">
                  
                      Return
                    </button>
                    <button
                  onClick={() => handleAction('Request changes')}
                  className="px-3 py-1.5 bg-white border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-surface transition-colors">
                  
                      Request changes
                    </button>
                  </div>
              }
              </div> :

            <div className="p-6 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">
                  No approval required for this task.
                </p>
              </div>
            }
          </div>

          {/* 12. Linked Knowledge */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('LINKED KNOWLEDGE')}
            {details.linkedKnowledge && details.linkedKnowledge.length > 0 ?
            <div className="grid grid-cols-1 gap-3">
                {details.linkedKnowledge.map((k) =>
              <div
                key={k.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border-subtle hover:border-primary/30 transition-colors cursor-pointer group">
                
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-primary">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                          {k.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-text-muted">
                            {k.type}
                          </span>
                          <span className="text-[10px] text-text-muted">•</span>
                          <span className="text-[10px] text-success font-medium">
                            {k.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open guide
                    </button>
                  </div>
              )}
              </div> :

            <div className="p-4 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">No linked knowledge.</p>
              </div>
            }
          </div>

          {/* 13. Custom Sections & 14. Dynamic Fields */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            <div className="flex items-center justify-between mb-4">
              {renderSectionTitle('CUSTOM SECTIONS')}
              {canEditStructure &&
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="text-sm font-medium text-[#FB5535] hover:text-[#E04A2E] flex items-center gap-1">
                
                  <Plus size={14} />
                  Add section
                </button>
              }
            </div>

            {details.customSections && details.customSections.length > 0 ?
            <div className="space-y-4">
                {details.customSections.map((section) =>
              <div
                key={section.id}
                className="border border-border-subtle rounded-lg overflow-hidden">
                
                    <div className="bg-surface p-4 border-b border-border-subtle flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          {section.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                          <span>{section.fieldCount} fields</span>
                          <span>•</span>
                          <span>
                            {section.required ? 'Required' : 'Optional'}
                          </span>
                          <span>•</span>
                          <span>Visible to: {section.visibleTo}</span>
                          <span>•</span>
                          <span>Editable by: {section.editableBy}</span>
                        </div>
                      </div>
                      {canEditStructure &&
                  <button
                    onClick={() => setIsAddFieldModalOpen(true)}
                    className="text-xs font-medium text-primary hover:underline">
                    
                          + Add field
                        </button>
                  }
                    </div>
                    <div className="p-4 space-y-4 bg-white">
                      {section.fields.map((field) =>
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-4 items-center">
                    
                          <div className="col-span-4">
                            <span className="text-sm font-medium text-text-primary block">
                              {field.label}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="px-1.5 py-0.5 bg-surface border border-border-subtle rounded text-[10px] text-text-secondary">
                                {field.type}
                              </span>
                              {field.required &&
                        <span className="text-[10px] text-danger">
                                  Required
                                </span>
                        }
                            </div>
                          </div>
                          <div className="col-span-8">
                            {field.type === 'Long text' ?
                      <textarea
                        readOnly={!canEditStructure && !isAssociate}
                        defaultValue={field.value}
                        className="w-full px-3 py-2 bg-surface border border-border-strong rounded text-sm focus:outline-none focus:border-primary"
                        rows={2} /> :


                      <input
                        type="text"
                        readOnly={!canEditStructure && !isAssociate}
                        defaultValue={field.value}
                        className="w-full px-3 py-2 bg-surface border border-border-strong rounded text-sm focus:outline-none focus:border-primary" />

                      }
                          </div>
                        </div>
                  )}
                    </div>
                  </div>
              )}
              </div> :

            <div className="p-6 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted mb-3">
                  No custom sections defined.
                </p>
                {canEditStructure &&
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="px-4 py-2 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors">
                
                    Add section
                  </button>
              }
              </div>
            }
          </div>

          {/* 15. Audit Trail */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('AUDIT TRAIL')}
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-subtle">
              {details.audit.map((event, i) =>
              <div
                key={i}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border-subtle bg-surface">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-text-primary">
                        {event.action}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        {event.timestamp}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary">
                      {event.actor} • {event.object}
                    </span>
                    <span className="text-[10px] text-text-muted block mt-1">
                      ID: {event.eventId}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 16. Task Structure History */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('TASK STRUCTURE HISTORY')}
            {details.changeHistory && details.changeHistory.length > 0 ?
            <div className="space-y-3">
                {details.changeHistory.map((history, i) =>
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border-subtle bg-surface">
                
                    <div className="mt-0.5 text-primary">
                      <GitCommit size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {history.version}
                          </span>
                          <span className="text-xs text-text-muted">
                            • {history.changedBy}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {history.date}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-1">
                        {history.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>Section: {history.affectedSection}</span>
                        <span>Reason: {history.reason}</span>
                      </div>
                    </div>
                  </div>
              )}
              </div> :

            <div className="p-4 text-center border border-dashed border-border-strong rounded-lg">
                <p className="text-sm text-text-muted">
                  No structure changes recorded.
                </p>
              </div>
            }
          </div>

          {/* 17. Closure Quality */}
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#D8D9E6] p-5">
            {renderSectionTitle('CLOSURE QUALITY')}
            <div className="p-4 rounded-lg border border-border-subtle bg-surface mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-text-primary">
                  Overall Status
                </span>
                <StatusPill status={details.closureQuality} />
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Output clarity
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.output}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Strategic alignment
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.strategic}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Objective completion
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.objective}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Evidence completeness
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.evidence}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Checklist completion
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.checklist}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    SLA performance
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.sla}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#5F607F] block mb-1">
                    Review status
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {details.closureScores.review}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
              handleAction(`Closure review requested for ${details.id}.`)
              }
              className="w-full py-2.5 bg-white border border-border-strong text-text-primary text-sm font-medium rounded-button hover:bg-surface transition-colors flex items-center justify-center gap-2">
              
              <ShieldCheck size={16} />
              Request closure review
            </button>
          </div>
        </div>

        {/* Role-aware Action Bar */}
        <div className="flex-none p-4 border-t border-border-subtle bg-white sticky bottom-0 z-10">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {canEditStructure &&
            <button
              onClick={() => openEditModal('Core Details')}
              className="flex-none min-w-[160px] bg-[#030F35] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#0a1b54] transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              
                <GitBranch size={16} />
                Edit task structure
              </button>
            }

            {activePersona.id === 'associate' &&
            <>
                <button
                onClick={() => handleAction('Add update')}
                className="flex-1 min-w-[120px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Add update
                </button>
                <button
                onClick={() => handleAction('Attach evidence')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Attach evidence
                </button>
                <button
                onClick={() => handleAction('Raise blocker')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Raise blocker
                </button>
              </>
            }
            {activePersona.id === 'scrum-master' &&
            <>
                <button
                onClick={() => handleAction('Add review note')}
                className="flex-1 min-w-[120px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Add review note
                </button>
                <button
                onClick={() => handleAction('Send reminder')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Send reminder
                </button>
                <button
                onClick={() => handleAction('Escalate blocker')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Escalate blocker
                </button>
              </>
            }
            {activePersona.id === 'team-lead' &&
            <>
                <button
                onClick={() => handleAction('Approve / Return')}
                className="flex-1 min-w-[120px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Approve / Return
                </button>
                <button
                onClick={() => handleAction('Reassign owner')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Reassign owner
                </button>
              </>
            }
            {activePersona.id === 'unit-lead' &&
            <>
                <button
                onClick={() => handleAction('Trigger intervention')}
                className="flex-1 min-w-[140px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Trigger intervention
                </button>
                <button
                onClick={() => handleAction('Add governance note')}
                className="flex-1 min-w-[140px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Add governance note
                </button>
              </>
            }
            {activePersona.id === 'hra' &&
            <>
                <button
                onClick={() => handleAction('Approve / Return HRA item')}
                className="flex-1 min-w-[180px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Approve / Return HRA item
                </button>
                <button
                onClick={() => handleAction('Verify policy')}
                className="flex-1 min-w-[120px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Verify policy
                </button>
              </>
            }
            {activePersona.id === 'admin' &&
            <>
                <button
                onClick={() => handleAction('Inspect audit trail')}
                className="flex-1 min-w-[140px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Inspect audit trail
                </button>
                <button
                onClick={() => handleAction('Review permission context')}
                className="flex-1 min-w-[180px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Review permission context
                </button>
              </>
            }
            {activePersona.id === 'support' &&
            <>
                <button
                onClick={() => handleAction('Route request')}
                className="flex-1 min-w-[120px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Route request
                </button>
                <button
                onClick={() => handleAction('Request missing input')}
                className="flex-1 min-w-[160px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Request missing input
                </button>
              </>
            }
            {activePersona.id === 'ceo' &&
            <>
                <button
                onClick={() => handleAction('Add executive note')}
                className="flex-1 min-w-[140px] bg-[#FB5535] text-white py-2 px-4 rounded-button text-sm font-medium hover:bg-[#E04A2E] transition-colors whitespace-nowrap">
                
                  Add executive note
                </button>
                <button
                onClick={() => handleAction('Escalate critical item')}
                className="flex-1 min-w-[160px] bg-white border border-border-strong text-text-primary py-2 px-4 rounded-button text-sm font-medium hover:bg-surface transition-colors whitespace-nowrap">
                
                  Escalate critical item
                </button>
              </>
            }
          </div>
        </div>
      </div>

      {isEditModalOpen &&
      <EditTaskStructureModal
        initialTab={initialEditTab}
        onClose={() => setIsEditModalOpen(false)} />

      }
      {isAddSectionModalOpen &&
      <AddCustomSectionModal
        onClose={() => setIsAddSectionModalOpen(false)} />

      }
      {isAddFieldModalOpen &&
      <AddDynamicFieldModal onClose={() => setIsAddFieldModalOpen(false)} />
      }
    </>);

}