import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { MarketplaceDetailHeader } from '../components/marketplace/MarketplaceDetailHeader';
import { DynamicRequiredFields } from '../components/DynamicRequiredFields';
import { UrgencySelector } from '../components/UrgencySelector';
import { ExpectedOutcomeField } from '../components/ExpectedOutcomeField';
import { RoutingPreviewCard } from '../components/RoutingPreviewCard';
import { ReviewSubmitSummary } from '../components/ReviewSubmitSummary';
import { ConfirmationCard } from '../components/ConfirmationCard';
import { EvidenceUploadStub } from '../components/EvidenceUploadStub';
import { ServiceEmptyState } from '../components/ServiceEmptyState';
import { RequestWorkflowContextRail } from '../components/RequestWorkflowContextRail';
import {
  buildStartRequestTrail,
  resolveMarketplaceStage,
} from '../utils/marketplaceBreadcrumbs';

export function RequestWorkflowPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = resolveMarketplaceStage(searchParams.get('from'), 'deploy');
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
      <div className="min-h-screen bg-surface py-8">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="mb-6 h-4 w-64 animate-pulse rounded bg-border-default" />
          <div className="mb-8 h-24 animate-pulse rounded bg-border-default/60" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="dq-card h-96 animate-pulse lg:col-span-8" />
            <div className="dq-card h-96 animate-pulse lg:col-span-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!service || !detail) {
    return (
      <div className="min-h-screen bg-surface py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <ServiceEmptyState
            title="Service Context Missing"
            message="We could not initiate the request workflow because the selected service details are missing."
            ctaLabel="Return to Catalogue"
            onCtaClick={() => navigate(`/marketplace/services?from=${stage}`)}
          />
        </div>
      </div>
    );
  }

  const hasSpecificInputs = detail.requiredInputs && detail.requiredInputs.length > 0;

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
      setShowValidation(false);
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
      navigate(`/marketplace/services/${service.id}?from=${stage}`);
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
      <div className="min-h-screen bg-surface py-12 px-6">
        <ConfirmationCard
          requestId={submittedId}
          detail={detail}
          isApprovalRequired={detail.approval !== 'Not Required'}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-8 lg:px-8">
        <MarketplaceDetailHeader
          breadcrumbItems={buildStartRequestTrail(stage, service.title, service.id)}
          title={service.title}
          lede={detail.purpose}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="dq-card overflow-hidden p-0">
            <div className="border-b border-border-default bg-surface/50 px-6 py-6">
              <h2 className="dq-section-title mb-6">New Request</h2>

              <div className="flex items-center gap-4">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isPast = step.id < currentStep;

                  return (
                    <React.Fragment key={step.id}>
                      <div
                        className={`flex items-center gap-2 ${
                          isActive
                            ? 'text-primary'
                            : isPast
                              ? 'text-success-text'
                              : 'text-text-muted'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                            isActive
                              ? 'border-primary bg-primary text-white'
                              : isPast
                                ? 'border-success-text/20 bg-success-surface text-success-text'
                                : 'border-border-strong bg-surface text-text-muted'
                          }`}
                        >
                          {isPast ? <CheckCircle2 size={12} /> : step.id}
                        </div>
                        <span
                          className={`text-sm font-semibold ${isActive || isPast ? '' : 'hidden sm:block'}`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="relative mx-2 h-px flex-1 bg-border-strong">
                          {isPast && (
                            <div className="absolute inset-0 bg-success-text/40" />
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="p-8">
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-7 duration-300">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-primary">
                      Request Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className={`w-full rounded-button border bg-white p-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-secondary/20 ${
                        showValidation && !formData.title.trim()
                          ? 'border-danger'
                          : 'border-border-strong hover:border-text-muted'
                      }`}
                      placeholder="Briefly summarize your request"
                    />
                    {showValidation && !formData.title.trim() && (
                      <p className="mt-1.5 text-xs font-medium text-danger">Required field.</p>
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

              {currentStep === 2 && hasSpecificInputs && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <DynamicRequiredFields
                    requiredInputs={detail.requiredInputs.filter(
                      input =>
                        !['evidence', 'Evidence', 'Screenshot/evidence', 'Supporting evidence'].includes(
                          input
                        )
                    )}
                    values={formData.dynamicFields}
                    onChange={handleDynamicFieldChange}
                    showValidation={showValidation}
                  />
                </div>
              )}

              {isLastStep && (
                <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-300">
                  <ReviewSubmitSummary
                    title={formData.title}
                    urgency={formData.urgency}
                    expectedOutcome={formData.expectedOutcome}
                    dynamicFields={formData.dynamicFields}
                    requiredInputs={detail.requiredInputs}
                  />

                  <RoutingPreviewCard detail={detail} urgency={formData.urgency} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border-default bg-surface/30 px-6 py-6">
              <button
                type="button"
                onClick={handleBack}
                className="dq-btn dq-btn-ghost text-text-secondary hover:text-primary"
              >
                <ArrowLeft size={16} />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="dq-btn dq-btn-outline"
                >
                  <Save size={16} />
                  Save Draft
                </button>

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="dq-btn dq-btn-navy"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="dq-btn dq-btn-orange"
                  >
                    Submit Request
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>

          <div className="lg:col-span-4">
            <RequestWorkflowContextRail
              detail={detail}
              steps={steps}
              currentStep={currentStep}
              stage={stage}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
