import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface MarketplaceFeedbackFlowProps {
  activePersona: any;
  onClose: () => void;
}
let feedbackCounter = 1;
export function MarketplaceFeedbackFlow({
  activePersona,
  onClose
}: MarketplaceFeedbackFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    feedbackType: 'Missing Service',
    affectedMarketplace: 'Services',
    affectedItem: '',
    description: '',
    impact: '',
    urgency: 'Medium',
    suggestedFix: ''
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [linkedReqId, setLinkedReqId] = useState<string | null>(null);
  const isStep1Valid = formData.description && formData.impact;
  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
  };
  const handleSubmit = () => {
    const newFbkId = `FBK-NEW-${String(feedbackCounter).padStart(3, '0')}`;
    const newReqId = `REQ-NEW-FBK-${String(feedbackCounter).padStart(3, '0')}`;
    feedbackCounter++;
    setSubmittedId(newFbkId);
    setLinkedReqId(newReqId);
  };
  if (submittedId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              Feedback submitted
            </h2>
            <p className="text-text-secondary mb-6">
              Your feedback has been captured and routed for review.
            </p>

            <div className="bg-surface rounded-xl p-6 text-left mb-8 border border-border-default space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Feedback ID</span>
                <span className="font-mono font-medium text-primary">
                  {submittedId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Linked Request</span>
                <span className="font-mono font-medium text-primary">
                  {linkedReqId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Routed Owner</span>
                <span className="font-medium text-primary">
                  Platform Governance
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate('/workspace/my-requests');
                  onClose();
                }}
                className="w-full py-3 bg-primary text-white font-semibold rounded-button hover:bg-navy-800 transition-colors">
                
                View in My Requests
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-surface text-primary font-semibold rounded-button hover:bg-navy-50 transition-colors border border-border-default">
                
                Return to marketplace
              </button>
            </div>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">
                Marketplace Feedback
              </div>
              <h2 className="text-lg font-bold text-primary">
                Submit Feedback
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-primary hover:bg-white rounded-lg transition-colors">
            
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 ?
          <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Feedback Type
                  </label>
                  <select
                  className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.feedbackType}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    feedbackType: e.target.value
                  })
                  }>
                  
                    <option value="Missing Service">Missing Service</option>
                    <option value="Missing Template">Missing Template</option>
                    <option value="Incorrect Routing">Incorrect Routing</option>
                    <option value="Outdated Content">Outdated Content</option>
                    <option value="General Improvement">
                      General Improvement
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Affected Marketplace
                  </label>
                  <select
                  className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.affectedMarketplace}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    affectedMarketplace: e.target.value
                  })
                  }>
                  
                    <option value="Services">Services</option>
                    <option value="Task Templates">Task Templates</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Work Directory">Work Directory</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Affected Item (Optional)
                </label>
                <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.affectedItem}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  affectedItem: e.target.value
                })
                }
                placeholder="e.g. SRV-001 or 'Onboarding Guide'" />
              
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]"
                value={formData.description}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
                }
                placeholder="Describe the issue or missing capability..." />
              
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Business Impact <span className="text-danger">*</span>
                </label>
                <input
                type="text"
                className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={formData.impact}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  impact: e.target.value
                })
                }
                placeholder="How does this affect your work?" />
              
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">
                  Suggested Fix (Optional)
                </label>
                <textarea
                className="w-full p-2.5 border border-border-default rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[60px]"
                value={formData.suggestedFix}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  suggestedFix: e.target.value
                })
                } />
              
              </div>
            </div> :

          <div className="space-y-6">
              <div className="bg-surface p-5 rounded-xl border border-border-default">
                <h3 className="text-sm font-semibold text-primary mb-4">
                  Routing & Review
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Routed Owner</span>
                    <span className="font-medium text-primary">
                      Platform Governance
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Expected SLA</span>
                    <span className="font-medium text-primary">
                      3 business days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">
                      Status after submission
                    </span>
                    <span className="font-medium text-primary">Triage</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary text-center">
                Submitting this feedback will create a tracked request for the
                Platform Governance team.
              </p>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-between bg-surface shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors">
            
            Cancel
          </button>
          <div className="flex gap-3">
            {step === 2 &&
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-semibold text-primary bg-white border border-border-default rounded-button hover:bg-navy-50 transition-colors">
              
                Back
              </button>
            }
            {step === 1 ?
            <button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`px-6 py-2 text-sm font-semibold rounded-button transition-colors ${isStep1Valid ? 'bg-primary text-white hover:bg-navy-800' : 'bg-surface border border-border-default text-text-disabled cursor-not-allowed'}`}>
              
                Next
              </button> :

            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-semibold bg-orange text-white rounded-button hover:bg-[#e34a2c] transition-colors">
              
                Submit Feedback
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}