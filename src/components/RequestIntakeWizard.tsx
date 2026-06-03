import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePersona } from '../context/PersonaContext';
interface RequestIntakeWizardProps {
  service: any;
  activePersona: any;
  onClose: () => void;
  preFilledOwner?: any;
  preFilledContext?: any;
}
let requestCounter = 1;
export function RequestIntakeWizard({
  service,
  activePersona,
  onClose,
  preFilledOwner,
  preFilledContext
}: RequestIntakeWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    businessReason: '',
    urgency: 'Medium',
    neededByDate: '',
    relatedItem: '',
    ...preFilledContext
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  if (!service) return null;
  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = () => {
    const newId = `REQ-NEW-${String(requestCounter).padStart(3, '0')}`;
    requestCounter++;
    
    try {
      const localRequests = JSON.parse(localStorage.getItem('local_my_requests') || '[]');
      const newRequest = {
        id: newId,
        title: formData.title || service.title,
        type: 'Request',
        status: 'Submitted',
        dueDate: formData.neededByDate || 'Pending',
        priority: formData.urgency || 'Medium',
        owner: service.ownerType || 'Central Queue',
        source: service.category,
        category: service.category,
        description: formData.description,
        nextAction: 'Review the status timeline and provide any required input.',
        related: ['DWS.01 Workspace', service.category, activePersona.name],
        lastUpdate: 'Just now',
        sla: 'On Track'
      };
      localStorage.setItem('local_my_requests', JSON.stringify([newRequest, ...localRequests]));
      window.dispatchEvent(new Event('local_requests_updated'));
      console.log('Saved to local storage:', newRequest);
      toast.success('Saved to local storage.');
    } catch (e) {
      console.error('Failed to save to local storage', e);
      toast.error('Failed to save to local storage.');
    }

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
  formData.description &&
  formData.businessReason &&
  formData.neededByDate;
  // Basic validation for step 2 based on category
  const isStep2Valid = () => {
    switch (service.category) {
      case 'HRA Requests':
        return (
          formData.employeeName && formData.requestType && formData.roleUnit);

      case 'IT & Access Requests':
        return (
          formData.user &&
          formData.system &&
          formData.accessLevel &&
          formData.justification);

      case 'Platform Support':
        return formData.affectedPage && formData.issueType && formData.severity;
      case 'Knowledge / Content Requests':
        return (
          formData.affectedGuide &&
          formData.changeType &&
          formData.impact &&
          formData.suggestedUpdate);

      case 'Task / Workflow Support':
        return (
          formData.linkedTaskId &&
          formData.issueType &&
          formData.expectedResolution &&
          formData.blockerSummary);

      case 'Admin Requests':
        return (
          formData.changeType &&
          formData.affectedUsers &&
          formData.justification &&
          formData.approver);

      case 'Approvals':
        return (
          formData.linkedItem &&
          formData.approvalType &&
          formData.rationale &&
          formData.approver);

      case 'Escalations':
        return (
          formData.linkedWorkItem &&
          formData.severity &&
          formData.escalationReason &&
          formData.requiredDecision &&
          formData.targetOwner);

      default:
        return true;
    }
  };
  const canProceed =
  step === 1 ? isStep1Valid : step === 2 ? isStep2Valid() : true;
  const renderStep1 = () =>
  <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Request Title <span className="text-danger">*</span>
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
        }
        placeholder="Brief summary of the request" />
      
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Category
        </label>
        <div className="inline-flex items-center px-3 py-1.5 bg-surface rounded-md border border-border-subtle text-sm text-text-secondary">
          {service.category}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
        value={formData.description}
        onChange={(e) =>
        setFormData({
          ...formData,
          description: e.target.value
        })
        }
        placeholder="Detailed description of what is needed" />
      
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Business Reason <span className="text-danger">*</span>
        </label>
        <textarea
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
        value={formData.businessReason}
        onChange={(e) =>
        setFormData({
          ...formData,
          businessReason: e.target.value
        })
        }
        placeholder="Why is this request necessary?" />
      
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Urgency
          </label>
          <div className="flex bg-surface p-1 rounded-lg border border-border-subtle">
            {['Low', 'Medium', 'High', 'Critical'].map((u) =>
          <button
            key={u}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${formData.urgency === u ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-primary'}`}
            onClick={() =>
            setFormData({
              ...formData,
              urgency: u
            })
            }>
            
                {u}
              </button>
          )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Needed By Date <span className="text-danger">*</span>
          </label>
          <input
          type="date"
          className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
          value={formData.neededByDate}
          onChange={(e) =>
          setFormData({
            ...formData,
            neededByDate: e.target.value
          })
          } />
        
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Related Item (Optional)
        </label>
        <select
        className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
        value={formData.relatedItem}
        onChange={(e) =>
        setFormData({
          ...formData,
          relatedItem: e.target.value
        })
        }>
        
          <option value="">Select a task, request, or register item...</option>
          <option value="TSK-1001">TSK-1001: Q3 Planning</option>
          <option value="REQ-042">REQ-042: Access Request</option>
        </select>
      </div>
    </div>;

  const renderStep2 = () => {
    switch (service.category) {
      case 'HRA Requests':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Employee / New Joiner Name{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.employeeName || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  employeeName: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Request Type <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.requestType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  requestType: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="onboarding">Onboarding</option>
                <option value="role transition">Role Transition</option>
                <option value="readiness">Readiness</option>
                <option value="policy alignment">Policy Alignment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Role / Unit <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.roleUnit || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  roleUnit: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={formData.supportingDoc || false}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    supportingDoc: e.target.checked
                  })
                  } />
                
                Supporting document required
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                HRA Owner
              </label>
              <div className="p-2.5 bg-surface border border-border-subtle rounded-lg text-text-secondary text-sm">
                HRA Fulfilment Queue
              </div>
            </div>
          </div>);

      case 'IT & Access Requests':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                User Requiring Access <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.user || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  user: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Tool / System / Environment{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.system || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  system: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Access Level <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.accessLevel || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  accessLevel: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Business Justification <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.justification || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  justification: e.target.value
                })
                } />
              
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={formData.managerApproval || false}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    managerApproval: e.target.checked
                  })
                  } />
                
                Manager approval required
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Security Sensitivity
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.sensitivity || 'Normal'}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  sensitivity: e.target.value
                })
                }>
                
                <option value="Normal">Normal</option>
                <option value="Elevated">Elevated</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
          </div>);

      case 'Platform Support':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Affected Page / Module <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.affectedPage || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  affectedPage: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Issue Type <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.issueType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  issueType: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Severity <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.severity || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  severity: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={formData.screenshotAttached || false}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    screenshotAttached: e.target.checked
                  })
                  } />
                
                Screenshot/evidence attached
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Reproduction Notes
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.reproNotes || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  reproNotes: e.target.value
                })
                } />
              
            </div>
          </div>);

      case 'Knowledge / Content Requests':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Affected Guide / Template <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.affectedGuide || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  affectedGuide: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Change Type <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.changeType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  changeType: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="new content">New Content</option>
                <option value="update">Update</option>
                <option value="correction">Correction</option>
                <option value="archive">Archive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Impact <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.impact || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  impact: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Suggested Update <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.suggestedUpdate || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  suggestedUpdate: e.target.value
                })
                } />
              
            </div>
          </div>);

      case 'Task / Workflow Support':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Linked Task ID <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.linkedTaskId || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  linkedTaskId: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Issue Type <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.issueType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  issueType: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="blocker">Blocker</option>
                <option value="ownership">Ownership</option>
                <option value="workflow state">Workflow State</option>
                <option value="closure issue">Closure Issue</option>
                <option value="evidence issue">Evidence Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Expected Resolution <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.expectedResolution || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  expectedResolution: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Current Blocker Summary <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.blockerSummary || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  blockerSummary: e.target.value
                })
                } />
              
            </div>
          </div>);

      case 'Admin Requests':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Change Type <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.changeType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  changeType: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="role">Role</option>
                <option value="unit">Unit</option>
                <option value="team">Team</option>
                <option value="taxonomy">Taxonomy</option>
                <option value="permission">Permission</option>
                <option value="configuration">Configuration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Affected Users / Teams <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.affectedUsers || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  affectedUsers: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Justification <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.justification || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  justification: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Approver <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.approver || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  approver: e.target.value
                })
                } />
              
            </div>
          </div>);

      case 'Approvals':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Linked Task / Request / Register Item{' '}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.linkedItem || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  linkedItem: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Approval Type <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.approvalType || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  approvalType: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Rationale <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.rationale || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  rationale: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={formData.evidenceAttached || false}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    evidenceAttached: e.target.checked
                  })
                  } />
                
                Evidence attached
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Approver <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.approver || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  approver: e.target.value
                })
                } />
              
            </div>
          </div>);

      case 'Escalations':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Linked Work Item <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.linkedWorkItem || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  linkedWorkItem: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Severity <span className="text-danger">*</span>
              </label>
              <select
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.severity || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  severity: e.target.value
                })
                }>
                
                <option value="">Select...</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Escalation Reason <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.escalationReason || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  escalationReason: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Required Decision <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.requiredDecision || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  requiredDecision: e.target.value
                })
                } />
              
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">
                Target Owner <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg"
                value={formData.targetOwner || ''}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  targetOwner: e.target.value
                })
                } />
              
            </div>
          </div>);

      default:
        return (
          <div className="text-text-secondary">
            No additional inputs required for this service.
          </div>);

    }
  };
  const renderStep3 = () =>
  <div className="space-y-8">
      <div className="bg-surface p-6 rounded-xl border border-border-subtle">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Routing & SLA Summary
        </h3>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-text-muted mb-1">Fulfilment Owner</div>
            <div className="font-medium text-primary">
              {service.ownerType || preFilledOwner?.name || 'Central Queue'}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-muted mb-1">SLA</div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info/10 text-info text-xs font-semibold">
              <Clock size={12} />
              {service.sla || 'Standard SLA'}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-muted mb-1">
              Approval Required
            </div>
            <div className="font-medium text-primary">
              {service.approval === 'required' ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-muted mb-1">
              Expected Next State
            </div>
            <div className="font-medium text-primary">Triage / Review</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-text-muted mb-3">Workflow Path</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary bg-white px-2 py-1 rounded border border-border-default shadow-sm">
              Submit
            </span>
            <ArrowRight size={14} className="text-text-muted" />
            <span className="text-text-secondary">Triage</span>
            <ArrowRight size={14} className="text-text-muted" />
            <span className="text-text-secondary">Owner review</span>
            <ArrowRight size={14} className="text-text-muted" />
            <span className="text-text-secondary">Resolution</span>
            <ArrowRight size={14} className="text-text-muted" />
            <span className="text-text-secondary">Closure</span>
          </div>
        </div>
      </div>
    </div>;

  const renderStep4 = () =>
  <div className="space-y-6">
      <div className="bg-surface p-6 rounded-xl border border-border-default">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Review Request
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Title</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.title}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Category</div>
            <div className="col-span-2 font-medium text-primary">
              {service.category}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Owner</div>
            <div className="col-span-2 font-medium text-primary">
              {service.ownerType || preFilledOwner?.name || 'Central Queue'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">SLA</div>
            <div className="col-span-2 font-medium text-primary">
              {service.sla || 'Standard SLA'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">Urgency</div>
            <div className="col-span-2 font-medium text-primary">
              {formData.urgency}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-subtle">
            <div className="col-span-1 text-sm text-text-muted">
              Required Inputs
            </div>
            <div className="col-span-2 font-medium text-success flex items-center gap-1">
              <CheckCircle2 size={14} /> Complete
            </div>
          </div>
          {formData.relatedItem &&
        <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 text-sm text-text-muted">
                Linked Item
              </div>
              <div className="col-span-2 font-medium text-primary">
                {formData.relatedItem}
              </div>
            </div>
        }
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex gap-3">
        <AlertCircle className="text-warning shrink-0" size={20} />
        <div className="text-sm text-warning-dark">
          Please verify all details before submitting. Once submitted, this
          request will be routed to the {service.ownerType || 'Central Queue'}{' '}
          for triage.
        </div>
      </div>
    </div>;

  const getDestinationRoute = () => {
    switch (service.category) {
      case 'HRA Requests':
        return '/support/hra-workflow';
      case 'IT & Access Requests':
        return '/support/central-queue';
      case 'Platform Support':
        return '/support/operations';
      case 'Knowledge / Content Requests':
        return '/knowledge/content-review';
      case 'Task / Workflow Support':
        return '/execution/workflow';
      case 'Admin Requests':
        return '/admin/change-governance';
      case 'Approvals':
        return '/execution/workflow/approvals';
      case 'Escalations':
        return '/execution/workflow/escalations';
      default:
        return '/workspace/my-requests';
    }
  };
  const handleRoute = (route: string) => {
    // Simple mock routing check
    const availableRoutes = [
    '/workspace/my-requests',
    '/support/hra-workflow',
    '/support/central-queue',
    '/admin/change-governance'];

    if (availableRoutes.includes(route)) {
      navigate(route);
    } else {
      toast(`Opening ${route} in prototype context.`);
    }
    onClose();
  };
  if (submittedId) {
    const destRoute = getDestinationRoute();
    const canSeeQueue = ['hra', 'admin', 'support', 'unit-lead'].includes(
      activePersona.id
    );
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Request submitted
            </h2>
            <p className="text-text-secondary mb-6">
              Your request has been captured and routed to{' '}
              {service.ownerType || 'Central Queue'}.
            </p>

            <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-border-default">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <div className="text-xs text-text-muted mb-1">Request ID</div>
                  <div className="font-mono text-sm font-medium text-primary">
                    {submittedId}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">Status</div>
                  <div className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-info/10 text-info">
                    Submitted
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">
                    Owner Queue
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {service.ownerType || 'Central Queue'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted mb-1">SLA</div>
                  <div className="text-sm font-medium text-primary">
                    {service.sla || 'Standard SLA'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleRoute('/workspace/my-requests')}
                className="w-full py-3 bg-primary text-white font-semibold rounded-button hover:bg-navy-800 transition-colors">
                
                View in My Requests
              </button>
              {canSeeQueue &&
              <button
                onClick={() => handleRoute(destRoute)}
                className="w-full py-3 bg-surface text-primary font-semibold rounded-button hover:bg-navy-50 transition-colors border border-border-default">
                
                  Open fulfilment queue
                </button>
              }
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setStep(1);
                    setFormData({});
                  }}
                  className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  
                  Start another request
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  
                  Return to marketplace
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
              {service.category}
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-primary">
                {service.title}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-white border border-border-subtle text-text-secondary">
                {service.ownerType || 'Central Queue'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info border border-info/20">
                SLA: {service.sla || 'Standard'}
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
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
            'Request details',
            'Required inputs',
            'Routing & SLA',
            'Review & submit'].
            map((label, idx) => {
              const s = idx + 1;
              const isActive = step === s;
              const isPast = step > s;
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 relative z-10">
                  
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? 'bg-primary text-white' : isPast ? 'bg-success text-white' : 'bg-surface text-text-muted border border-border-default'}`}>
                    
                    {isPast ? <CheckCircle2 size={16} /> : s}
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                    
                    {label}
                  </span>
                </div>);

            })}
            {/* Connecting lines */}
            <div className="absolute left-[20%] right-[20%] top-[90px] h-0.5 bg-border-default -z-0 hidden md:block" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
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
            {step < 4 ?
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-2 text-sm font-semibold rounded-button transition-colors ${canProceed ? 'bg-primary text-white hover:bg-navy-800' : 'bg-surface border border-border-default text-text-disabled cursor-not-allowed'}`}>
              
                Next
              </button> :

            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-semibold bg-orange text-white rounded-button hover:bg-[#e34a2c] transition-colors">
              
                Submit Request
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}