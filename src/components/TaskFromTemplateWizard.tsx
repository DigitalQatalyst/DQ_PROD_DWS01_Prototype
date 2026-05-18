import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePersona } from '../context/PersonaContext';
import {
  strategicAspirations,
  objectives as govObjectives,
  outcomes as govOutcomes,
  executionRegisters,
  registerItems } from
'../mocks/governedTasks.mock';
const governedTasksMock = {
  strategicAspirations,
  objectives: govObjectives,
  outcomes: govOutcomes,
  executionRegisters,
  registerItems
};
interface TaskFromTemplateWizardProps {
  template: any;
  activePersona: any;
  onClose: () => void;
  preFilledOwner?: any;
  preLinkedKnowledge?: any;
}
let taskCounter = 1;
export function TaskFromTemplateWizard({
  template,
  activePersona,
  onClose,
  preFilledOwner,
  preLinkedKnowledge
}: TaskFromTemplateWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    title: '',
    purpose: '',
    expectedOutput: '',
    owner: preFilledOwner?.id || activePersona.id,
    contributors: [],
    teamUnit: '',
    dueDate: '',
    priority: 'Medium',
    aspiration: '',
    objective: '',
    outcome: '',
    register: '',
    registerItem: '',
    contributionType: '',
    noStrategicContext: false,
    checklist: template?.checklist ?
    Array.from({
      length: template.checklist
    }).map((_, i) => ({
      id: i,
      text: `Template item ${i + 1}`,
      required: true
    })) :
    [],
    evidenceRequired: template?.evidence || false,
    evidenceType: '',
    closureCriteria: '',
    reviewer: '',
    sla: template?.sla || '3-5 business days',
    reviewPath: 'Standard',
    approvalRequired: template?.approval === 'Approval required',
    closureQualityReview: template?.type === 'Closure'
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  if (!template) return null;
  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = () => {
    const newId = `TSK-NEW-${String(taskCounter).padStart(3, '0')}`;
    taskCounter++;
    setSubmittedId(newId);
  };
  const handleClose = () => {
    if (step > 1 && !submittedId) {
      if (window.confirm('Discard this draft?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  const isStep1Valid =
  formData.title &&
  formData.purpose &&
  formData.expectedOutput &&
  formData.owner &&
  formData.dueDate;
  const isStep2Valid =
  formData.noStrategicContext || formData.aspiration && formData.objective;
  const isStep3Valid = formData.checklist.length > 0;
  const isStep4Valid = true;
  const canProceed =
  step === 1 ?
  isStep1Valid :
  step === 2 ?
  isStep2Valid :
  step === 3 ?
  isStep3Valid :
  step === 4 ?
  isStep4Valid :
  true;
  const renderStep1 = () =>
  <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Task Title <span className="text-danger">*</span>
        </label>
        <input
        type="text"
        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none ${!formData.title && step > 1 ? 'border-danger' : 'border-border-default'}`}
        value={formData.title}
        onChange={(e) =>
        setFormData({
          ...formData,
          title: e.target.value
        })
        } />
      
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Template
        </label>
        <div className="inline-flex items-center px-3 py-1.5 bg-surface rounded-md border border-border-subtle text-sm text-text-secondary">
          {template.title}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Purpose <span className="text-danger">*</span>
        </label>
        <textarea
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
        value={formData.purpose}
        onChange={(e) =>
        setFormData({
          ...formData,
          purpose: e.target.value
        })
        } />
      
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Expected Output <span className="text-danger">*</span>
        </label>
        <textarea
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
        value={formData.expectedOutput}
        onChange={(e) =>
        setFormData({
          ...formData,
          expectedOutput: e.target.value
        })
        } />
      
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Owner <span className="text-danger">*</span>
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.owner}
          onChange={(e) =>
          setFormData({
            ...formData,
            owner: e.target.value
          })
          }>
          
            <option value="">Select owner...</option>
            <option value={activePersona.id}>Me ({activePersona.name})</option>
            <option value="USR-002">Sarah Chen</option>
            <option value="USR-003">Marcus Johnson</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Due Date <span className="text-danger">*</span>
          </label>
          <input
          type="date"
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.dueDate}
          onChange={(e) =>
          setFormData({
            ...formData,
            dueDate: e.target.value
          })
          } />
        
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Team / Unit
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.teamUnit}
          onChange={(e) =>
          setFormData({
            ...formData,
            teamUnit: e.target.value
          })
          }>
          
            <option value="">Select team...</option>
            <option value="TM-001">eCom.DXP Squad</option>
            <option value="TM-002">DWS Core Squad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Priority
          </label>
          <div className="flex bg-surface p-1 rounded-lg border border-border-subtle">
            {['Low', 'Medium', 'High', 'Critical'].map((p) =>
          <button
            key={p}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.priority === p ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-primary'}`}
            onClick={() =>
            setFormData({
              ...formData,
              priority: p
            })
            }>
            
                {p}
              </button>
          )}
          </div>
        </div>
      </div>
    </div>;

  const renderStep2 = () =>
  <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-primary">
          Link Strategic Context
        </h3>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
          type="checkbox"
          checked={formData.noStrategicContext}
          onChange={(e) =>
          setFormData({
            ...formData,
            noStrategicContext: e.target.checked
          })
          }
          className="rounded border-border-default text-primary focus:ring-primary/20" />
        
          No strategic context yet
        </label>
      </div>

      {formData.noStrategicContext &&
    <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex gap-3 mb-6">
          <AlertTriangle className="text-warning shrink-0" size={20} />
          <div className="text-sm text-warning-dark">
            This task will appear under{' '}
            <strong>Missing Strategic Context</strong> until linked.
          </div>
        </div>
    }

      <div
      className={`space-y-6 transition-opacity ${formData.noStrategicContext ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Strategic Aspiration
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.aspiration}
          onChange={(e) =>
          setFormData({
            ...formData,
            aspiration: e.target.value,
            objective: ''
          })
          }>
          
            <option value="">Select aspiration...</option>
            {governedTasksMock.strategicAspirations.map((a) =>
          <option key={a.id} value={a.id}>
                {a.id}: {a.title}
              </option>
          )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Objective
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.objective}
          onChange={(e) =>
          setFormData({
            ...formData,
            objective: e.target.value
          })
          }
          disabled={!formData.aspiration}>
          
            <option value="">Select objective...</option>
            {governedTasksMock.objectives.
          filter((o) => o.aspirationId === formData.aspiration).
          map((o) =>
          <option key={o.id} value={o.id}>
                  {o.id}: {o.title}
                </option>
          )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Target Outcome
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.outcome}
          onChange={(e) =>
          setFormData({
            ...formData,
            outcome: e.target.value
          })
          }>
          
            <option value="">Select outcome...</option>
            {governedTasksMock.outcomes.map((o) =>
          <option key={o.id} value={o.id}>
                {o.id}: {o.title}
              </option>
          )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Execution Register
            </label>
            <select
            className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.register}
            onChange={(e) =>
            setFormData({
              ...formData,
              register: e.target.value
            })
            }>
            
              <option value="">Select register...</option>
              {governedTasksMock.executionRegisters.map((r) =>
            <option key={r.id} value={r.id}>
                  {r.id}: {r.title}
                </option>
            )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Register Item
            </label>
            <select
            className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
            value={formData.registerItem}
            onChange={(e) =>
            setFormData({
              ...formData,
              registerItem: e.target.value
            })
            }>
            
              <option value="">Select item...</option>
              {governedTasksMock.registerItems.map((ri) =>
            <option key={ri.id} value={ri.id}>
                  {ri.id}: {ri.title}
                </option>
            )}
            </select>
          </div>
        </div>
      </div>
    </div>;

  const renderStep3 = () =>
  <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Checklist</h3>
          <button
          onClick={() =>
          setFormData({
            ...formData,
            checklist: [
            ...formData.checklist,
            {
              id: Date.now(),
              text: '',
              required: true
            }]

          })
          }
          className="flex items-center gap-1 text-sm font-medium text-info hover:text-info-dark">
          
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {formData.checklist.map((item: any, idx: number) =>
        <div
          key={item.id}
          className="flex items-start gap-3 bg-surface p-3 rounded-lg border border-border-default">
          
              <div className="flex-1">
                <input
              type="text"
              className="w-full p-2 border border-border-default rounded focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              value={item.text}
              placeholder="Checklist item description"
              onChange={(e) => {
                const newChecklist = [...formData.checklist];
                newChecklist[idx].text = e.target.value;
                setFormData({
                  ...formData,
                  checklist: newChecklist
                });
              }} />
            
                <label className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                  <input
                type="checkbox"
                checked={item.required}
                onChange={(e) => {
                  const newChecklist = [...formData.checklist];
                  newChecklist[idx].required = e.target.checked;
                  setFormData({
                    ...formData,
                    checklist: newChecklist
                  });
                }} />
              
                  Required for closure
                </label>
              </div>
              <button
            onClick={() => {
              const newChecklist = formData.checklist.filter(
                (_: any, i: number) => i !== idx
              );
              setFormData({
                ...formData,
                checklist: newChecklist
              });
            }}
            className="p-2 text-text-muted hover:text-danger rounded transition-colors">
            
                <Trash2 size={16} />
              </button>
            </div>
        )}
          {formData.checklist.length === 0 &&
        <div className="text-center py-6 text-sm text-text-muted border border-dashed border-border-strong rounded-lg">
              No checklist items defined.
            </div>
        }
        </div>
      </div>

      <div className="border-t border-border-default pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-primary">
          Evidence & Closure
        </h3>

        <label className="flex items-center gap-2 text-sm font-semibold text-primary">
          <input
          type="checkbox"
          checked={formData.evidenceRequired}
          onChange={(e) =>
          setFormData({
            ...formData,
            evidenceRequired: e.target.checked
          })
          }
          className="rounded border-border-default text-primary focus:ring-primary/20" />
        
          Evidence required for closure
        </label>

        {formData.evidenceRequired &&
      <div>
            <label className="block text-sm font-semibold text-primary mb-1">
              Expected Evidence Type
            </label>
            <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.evidenceType}
          onChange={(e) =>
          setFormData({
            ...formData,
            evidenceType: e.target.value
          })
          }>
          
              <option value="">Select type...</option>
              <option value="document">Document / PDF</option>
              <option value="link">URL / Link</option>
              <option value="screenshot">Screenshot</option>
              <option value="code">Code PR</option>
            </select>
          </div>
      }

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Closure Criteria
          </label>
          <textarea
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
          value={formData.closureCriteria}
          onChange={(e) =>
          setFormData({
            ...formData,
            closureCriteria: e.target.value
          })
          }
          placeholder="What specifically must be true to close this task?" />
        
        </div>
      </div>
    </div>;

  const renderStep4 = () =>
  <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Reviewer / Approver
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.reviewer}
          onChange={(e) =>
          setFormData({
            ...formData,
            reviewer: e.target.value
          })
          }>
          
            <option value="">Select reviewer...</option>
            <option value="USR-004">Alex Manager</option>
            <option value="USR-005">Sam Lead</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            SLA
          </label>
          <select
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.sla}
          onChange={(e) =>
          setFormData({
            ...formData,
            sla: e.target.value
          })
          }>
          
            <option value="Same day">Same day</option>
            <option value="1-2 business days">1-2 business days</option>
            <option value="3-5 business days">3-5 business days</option>
            <option value="5+ business days">5+ business days</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Review Path
        </label>
        <select
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
        value={formData.reviewPath}
        onChange={(e) =>
        setFormData({
          ...formData,
          reviewPath: e.target.value
        })
        }>
        
          <option value="Standard">Standard (Peer Review)</option>
          <option value="Lead">Lead Approval</option>
          <option value="Governance">Governance Board</option>
        </select>
      </div>

      <div className="space-y-3 pt-4 border-t border-border-default">
        <label className="flex items-center gap-2 text-sm font-semibold text-primary">
          <input
          type="checkbox"
          checked={formData.approvalRequired}
          onChange={(e) =>
          setFormData({
            ...formData,
            approvalRequired: e.target.checked
          })
          }
          className="rounded border-border-default text-primary focus:ring-primary/20" />
        
          Formal approval required before closure
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-primary">
          <input
          type="checkbox"
          checked={formData.closureQualityReview}
          onChange={(e) =>
          setFormData({
            ...formData,
            closureQualityReview: e.target.checked
          })
          }
          className="rounded border-border-default text-primary focus:ring-primary/20" />
        
          Requires Closure Quality Review (CQR)
        </label>
      </div>
    </div>;

  const renderStep5 = () =>
  <div className="space-y-6">
      <div className="bg-surface p-6 rounded-xl border border-border-default">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Review Task Structure
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Title</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.title}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Owner</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.owner}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Due Date</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.dueDate}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">
              Strategic Context
            </div>
            <div className="col-span-2 font-medium text-primary">
              {formData.noStrategicContext ?
            <span className="text-warning-dark">
                  Missing (Will be flagged)
                </span> :

            <span className="text-success">
                  Linked ({formData.aspiration})
                </span>
            }
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Checklist</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.checklist.length} items
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 text-sm text-text-muted">Governance</div>
            <div className="col-span-2 font-medium text-primary flex flex-wrap gap-2">
              {formData.evidenceRequired &&
            <span className="px-2 py-0.5 bg-info/10 text-info text-xs rounded">
                  Evidence Req
                </span>
            }
              {formData.approvalRequired &&
            <span className="px-2 py-0.5 bg-warning/10 text-warning-dark text-xs rounded">
                  Approval Req
                </span>
            }
              {formData.closureQualityReview &&
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                  CQR Req
                </span>
            }
              {!formData.evidenceRequired &&
            !formData.approvalRequired &&
            !formData.closureQualityReview &&
            <span className="text-text-secondary">Standard</span>
            }
            </div>
          </div>
        </div>
      </div>
    </div>;

  if (submittedId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Task created
            </h2>
            <p className="text-text-secondary mb-6">
              Your governed task has been created from the template.
            </p>

            <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-border-default">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Task ID</div>
                  <div className="font-mono text-sm font-medium text-primary">
                    {submittedId}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Owner</div>
                  <div className="text-sm font-medium text-primary">
                    {formData.owner}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Due Date</div>
                  <div className="text-sm font-medium text-primary">
                    {formData.dueDate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Context</div>
                  <div
                    className={`text-sm font-medium ${formData.noStrategicContext ? 'text-warning-dark' : 'text-success'}`}>
                    
                    {formData.noStrategicContext ? 'Missing' : 'Linked'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate('/workspace/my-tasks');
                  onClose();
                }}
                className="w-full py-3 bg-primary text-white font-semibold rounded-button hover:bg-navy-800 transition-colors">
                
                Open My Tasks
              </button>
              <button
                onClick={() => {
                  navigate('/execution/tasks/all');
                  onClose();
                }}
                className="w-full py-3 bg-surface text-primary font-semibold rounded-button hover:bg-navy-50 transition-colors border border-border-default">
                
                Open Team Tasks
              </button>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    toast(`Opening task ${submittedId} in prototype context.`);
                    onClose();
                  }}
                  className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  
                  Open Task Detail
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  
                  Return to templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[920px] max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface shrink-0">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
              Create Task
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-primary">
                {template.title}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-white border border-border-subtle text-text-secondary">
                {template.category}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-text-muted hover:text-primary hover:bg-white rounded-lg transition-colors">
            
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-border-default shrink-0">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
            'Task basics',
            'Strategic context',
            'Checklist & evidence',
            'Workflow & review',
            'Review & create'].
            map((label, idx) => {
              const s = idx + 1;
              const isActive = step === s;
              const isPast = step > s;
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? 'bg-primary text-white' : isPast ? 'bg-success text-white' : 'bg-surface text-text-muted border border-border-default'}`}>
                    
                    {isPast ? <CheckCircle2 size={16} /> : s}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                    
                    {label}
                  </span>
                </div>);

            })}
            {/* Connecting lines */}
            <div className="absolute left-[10%] right-[10%] top-[90px] h-0.5 bg-border-default -z-0 hidden md:block" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
            
            Cancel
          </button>
          <div className="flex gap-3">
            {step > 1 &&
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-semibold text-primary bg-white border border-border-default rounded-button hover:bg-navy-50 transition-colors">
              
                Back
              </button>
            }
            {step < 5 ?
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-2 text-sm font-semibold rounded-button transition-colors ${canProceed ? 'bg-primary text-white hover:bg-navy-800' : 'bg-surface border border-border-default text-text-disabled cursor-not-allowed'}`}>
              
                Next
              </button> :

            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-semibold bg-orange text-white rounded-button hover:bg-[#e34a2c] transition-colors">
              
                Create Task
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}