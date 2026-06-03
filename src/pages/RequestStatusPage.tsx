import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useServiceLifecycle } from '../context/ServiceLifecycleContext';
import { RequestHeaderCard } from '../components/RequestHeaderCard';
import { RequestStatusTimeline } from '../components/RequestStatusTimeline';
import { ApprovalStateCard } from '../components/ApprovalStateCard';
import { FulfilmentNotesCard } from '../components/FulfilmentNotesCard';
import { PendingInformationCard } from '../components/PendingInformationCard';
import { ClosureOutcomeCard } from '../components/ClosureOutcomeCard';
import { AuditTrailCue } from '../components/AuditTrailCue';
import { ServiceEmptyState } from '../components/ServiceEmptyState';

export function RequestStatusPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getRequestById, updateRequestStatus } = useServiceLifecycle();

  const [loading, setLoading] = useState(true);

  const request = requestId ? getRequestById(requestId) : undefined;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [requestId]);

  const handleBackToMyRequests = () => {
    toast.info('My Requests opened in prototype state');
    // For navigation if we wanted: navigate('/workspace/my-requests');
  };

  const handleInfoSubmit = (response: string) => {
    if (requestId) {
      updateRequestStatus(requestId, 'In Review');
      toast.success('Information submitted');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
          <div className="w-32 h-8 bg-border-default animate-pulse rounded mb-6" />
          <div className="bg-white rounded-card h-48 animate-pulse border border-border-default mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-card h-96 animate-pulse border border-border-default" />
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-card h-32 animate-pulse border border-border-default" />
              <div className="bg-white rounded-card h-32 animate-pulse border border-border-default" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-[#F6F6FB] min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <ServiceEmptyState 
            title="Request not found" 
            message={`We couldn't find a request matching the ID "${requestId}".`}
            ctaLabel="Back to My Requests"
            onCtaClick={handleBackToMyRequests}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6FB] min-h-screen pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8">
        
        <button 
          onClick={handleBackToMyRequests}
          className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to My Requests
        </button>

        <div className="mb-8">
          <RequestHeaderCard request={request} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8">
            <RequestStatusTimeline timeline={request.timeline} />
          </div>
          
          {/* Right Rail (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            <ApprovalStateCard approvalState={request.approval} />

            {request.status === 'Returned for Information' && request.pendingInfo && (
              <PendingInformationCard 
                pendingInfo={request.pendingInfo} 
                onSubmit={handleInfoSubmit} 
              />
            )}

            {request.fulfilmentNotes && (
              <FulfilmentNotesCard notes={request.fulfilmentNotes} />
            )}

            {request.status === 'Closed' && request.closureOutcome && (
              <ClosureOutcomeCard outcome={request.closureOutcome} />
            )}

            <AuditTrailCue />
            
          </div>
          
        </div>
      </div>
    </div>
  );
}