import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Save, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { RequestWorkflowContextBanner } from '../components/RequestWorkflowContextBanner';
import { DynamicRequiredFields } from '../components/DynamicRequiredFields';
import { UrgencySelector } from '../components/UrgencySelector';
import { ExpectedOutcomeField } from '../components/ExpectedOutcomeField';
import { RoutingPreviewCard } from '../components/RoutingPreviewCard';
import { ReviewSubmitSummary } from '../components/ReviewSubmitSummary';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { EvidenceUploadStub } from '../components/EvidenceUploadStub';
import { ServiceEmptyState } from '../components/ServiceEmptyState';

export function RequestWorkflowPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { getServiceById, getServiceDetailByServiceId, submitRequest } = useServiceLifecycle();

  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    urgency: 'Normal',
    expectedOutcome: '',
    dynamicFields: {} as Record<string, string>
  });

  const service = serviceId ? getServiceById(serviceId) : undefined;
  const detail = serviceId ? getServiceDetailByServiceId(serviceId) : undefined;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [serviceId]);

  if (loading) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="w-48 h-4 bg-border-default animate-pulse rounded mb-6" />
          <div className="bg-white rounded-card h-96 animate-pulse border border-border-default" />
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <ServiceEmptyState
            title="Service Context Missing"
            message="We could not initiate the request workflow because the selected service details are missing."
            ctaLabel="Return to Catalogue"
            onCtaClick={() => navigate('/marketplaces/services')}
          />
        </div>
      </div>
    );
  }

  const hasSpecificInputs = detail.requiredInputs && detail.requiredInputs.length > 0;

  // Define steps dynamically based on if specific inputs are required
  const steps = [
    { id: 1, label: 'Core Details' },
    ...(hasSpecificInputs ? [{ id: 2, label: 'Specific Information' }] : []),
    { id: hasSpecificInputs ? 3 : 2, label: 'Routing & Review' }
  ];

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps;

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDynamicFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: { ...prev.dynamicFields, [field]: value }
    }));
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return formData.title.trim() !== '' && formData.expectedOutcome.trim() !== '';
    }
    if (currentStep === 2 && hasSpecificInputs) {
      const nonEvidenceInputs = detail.requiredInputs.filter(
        input => !['evidence', 'Evidence', 'Screenshot/evidence', 'Supporting evidence'].includes(input)
      );
      return nonEvidenceInputs.every(input => !!formData.dynamicFields[input]?.trim());
    }
    return true;
  };

  const handleNext = () => {
    setShowValidation(true);
    if (validateCurrentStep()) {
      setShowValidation(false); // Reset so the next step starts clean
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please complete all required fields.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(`/marketplaces/services/${service.id}`);
    }
  };

  const handleSaveDraft = () => {
    const draftId = `REQ-${Math.floor(2000 + Math.random() * 1000)}`;
    toast.success(`Draft saved (${draftId})`);
  };

  const handleSubmit = () => {
    if (!serviceId) return;
    const newRequest = submitRequest(serviceId, {
      urgency: formData.urgency as 'Low' | 'Normal' | 'High' | 'Critical',
      expectedOutcome: formData.expectedOutcome,
    });
    setSubmittedId(newRequest.id);
    window.scrollTo(0, 0);
  };

  if (submittedId) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-12 px-6">
        <ConfirmationCard
          requestId={submittedId}
          detail={detail}
          isApprovalRequired={detail.approval !== 'Not Required'}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-medium text-text-muted mb-6">
          <button onClick={() => navigate('/marketplaces/services')} className="hover:text-primary transition-colors">Marketplaces</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate('/marketplaces/services')} className="hover:text-primary transition-colors">Services</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate(`/marketplaces/services/${service.id}`)} className="hover:text-primary transition-colors truncate max-w-[200px]">{service.title}</button>
          <ChevronRight size={12} />
          <span className="text-text-primary">Start Request</span>
        </div>

        <div className="max-w-4xl">
        <RequestWorkflowContextBanner service={service} />

        <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden">

          {/* Form Header / Stepper */}
          <div className="border-b border-border-default p-6 bg-surface/50">
            <h1 className="text-xl font-bold text-primary mb-6">New Request</h1>

            <div className="flex items-center gap-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isPast = step.id < currentStep;

                return (
                  <React.Fragment key={step.id}>
                    <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isPast ? 'text-success-text' : 'text-text-muted'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isActive ? 'bg-primary text-white border-primary' :
                          isPast ? 'bg-success-surface text-success-text border-success-text/20' :
                            'bg-surface text-text-muted border-border-strong'
                        }`}>
                        {isPast ? <CheckCircle2 size={12} /> : step.id}
                      </div>
                      <span className={`text-sm font-semibold ${isActive || isPast ? '' : 'hidden sm:block'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-px bg-border-strong mx-2" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-8">

            {/* Step 1: Core Details */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1">
                    Request Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className={`w-full p-2.5 bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${showValidation && !formData.title.trim() ? 'border-danger' : 'border-border-strong hover:border-text-muted'
                      }`}
                    placeholder="Briefly summarize your request"
                  />
                  {showValidation && !formData.title.trim() && (
                    <p className="text-xs text-danger mt-1.5 font-medium">Required field.</p>
                  )}
                </div>

                <UrgencySelector
                  value={formData.urgency}
                  onChange={(val) => handleFieldChange('urgency', val)}
                />

                <ExpectedOutcomeField
                  value={formData.expectedOutcome}
                  onChange={(val) => handleFieldChange('expectedOutcome', val)}
                  showValidation={showValidation}
                />

                <EvidenceUploadStub />
              </div>
            )}

            {/* Step 2: Specific Information (if applicable) */}
            {currentStep === 2 && hasSpecificInputs && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <DynamicRequiredFields
                  requiredInputs={detail.requiredInputs.filter(
                    input => !['evidence', 'Evidence', 'Screenshot/evidence', 'Supporting evidence'].includes(input)
                  )}
                  values={formData.dynamicFields}
                  onChange={handleDynamicFieldChange}
                  showValidation={showValidation}
                />
              </div>
            )}

            {/* Step 3: Routing & Review */}
            {isLastStep && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ReviewSubmitSummary
                  title={formData.title}
                  urgency={formData.urgency}
                  expectedOutcome={formData.expectedOutcome}
                  dynamicFields={formData.dynamicFields}
                  requiredInputs={detail.requiredInputs}
                />

                <RoutingPreviewCard
                  detail={detail}
                  urgency={formData.urgency}
                />
              </div>
            )}

          </div>

          {/* Form Footer Actions */}
          <div className="border-t border-border-default p-6 bg-surface/30 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-white border border-border-strong rounded-button hover:bg-surface hover:border-text-muted transition-colors"
              >
                <Save size={16} />
                Save Draft
              </button>

              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-button hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-secondary rounded-button hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Submit Request
                  <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
