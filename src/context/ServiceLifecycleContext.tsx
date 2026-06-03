import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Service,
  ServiceDetail,
  ServiceRequestRecord,
  ServiceApproval,
  ServiceQueueItem,
  ExecutiveSignal,
  ServiceCategory,
  ServiceRequestStatus,
  ApprovalDecisionState,
  CategoryDemand,
  ServiceOwnerPerformance,
} from '../types/serviceLifecycle';
import {
  services as mockServices,
  serviceDetails as mockDetails,
  serviceRequests as mockRequests,
  serviceApprovals as mockApprovals,
  serviceQueueItems as mockQueueItems,
  executiveSignals as mockSignals,
  serviceCategories as mockCategories,
  categoryDemand as mockCategoryDemand,
  serviceOwnerPerformance as mockServiceOwnerPerformance,
} from '../mocks/serviceLifecycle.mock';

// ─── Context Shape ────────────────────────────────────────────────────

interface ServiceLifecycleContextType {
  // Data
  services: Service[];
  serviceCategories: ServiceCategory[];
  serviceDetails: ServiceDetail[];
  requests: ServiceRequestRecord[];
  approvals: ServiceApproval[];
  queueItems: ServiceQueueItem[];
  signals: ExecutiveSignal[];
  categoryDemand: CategoryDemand[];
  serviceOwnerPerformance: ServiceOwnerPerformance[];

  // Lookups
  getServiceById: (id: string) => Service | undefined;
  getServiceDetailByServiceId: (serviceId: string) => ServiceDetail | undefined;
  getRequestById: (id: string) => ServiceRequestRecord | undefined;
  getRequestsByRequester: (requester: string) => ServiceRequestRecord[];
  getApprovalById: (id: string) => ServiceApproval | undefined;

  // Mutations (prototype in-memory only)
  submitRequest: (serviceId: string, formData: Partial<ServiceRequestRecord>) => ServiceRequestRecord;
  saveDraft: (serviceId: string, formData: Partial<ServiceRequestRecord>) => ServiceRequestRecord;
  updateRequestStatus: (requestId: string, status: ServiceRequestStatus) => void;
  submitApprovalDecision: (approvalId: string, decision: ApprovalDecisionState, rationale: string) => void;
}

const ServiceLifecycleContext = createContext<ServiceLifecycleContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────

let nextRequestNum = 2412; // After the last fixture request

export function ServiceLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [services] = useState<Service[]>(mockServices);
  const [categories] = useState<ServiceCategory[]>(mockCategories);
  const [details] = useState<ServiceDetail[]>(mockDetails);
  const [requests, setRequests] = useState<ServiceRequestRecord[]>(mockRequests);
  const [approvals, setApprovals] = useState<ServiceApproval[]>(mockApprovals);
  const [queueItems] = useState<ServiceQueueItem[]>(mockQueueItems);
  const [signals] = useState<ExecutiveSignal[]>(mockSignals);
  const [categoryDemand] = useState<CategoryDemand[]>(mockCategoryDemand);
  const [serviceOwnerPerformance] = useState<ServiceOwnerPerformance[]>(mockServiceOwnerPerformance);

  // ── Lookups ──────────────────────────────────────────────────────

  const getServiceById = useCallback(
    (id: string) => services.find((s) => s.id === id),
    [services]
  );

  const getServiceDetailByServiceId = useCallback(
    (serviceId: string) => details.find((d) => d.serviceId === serviceId),
    [details]
  );

  const getRequestById = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests]
  );

  const getRequestsByRequester = useCallback(
    (requester: string) => requests.filter((r) => r.requester === requester),
    [requests]
  );

  const getApprovalById = useCallback(
    (id: string) => approvals.find((a) => a.id === id),
    [approvals]
  );

  // ── Mutations ────────────────────────────────────────────────────

  const submitRequest = useCallback(
    (serviceId: string, formData: Partial<ServiceRequestRecord>): ServiceRequestRecord => {
      const service = services.find((s) => s.id === serviceId);
      const requestId = `REQ-${nextRequestNum++}`;
      const now = new Date().toISOString();

      const newRequest: ServiceRequestRecord = {
        id: requestId,
        serviceId,
        service: service?.title ?? 'Unknown Service',
        category: service?.category ?? 'Unknown',
        requester: 'Associate',
        status: service?.approval === 'Not Required' ? 'In Fulfilment' : 'Pending Approval',
        owner: service?.owner ?? 'Unassigned',
        sla: service?.sla ?? 'TBD',
        slaState: 'On Track',
        approval: service?.approvalDetail ?? 'Not required',
        urgency: 'Normal',
        expectedOutcome: '',
        submittedAt: now,
        timeline: [
          {
            timestamp: now,
            label: 'Request Submitted',
            description: `Request created and routed to ${service?.owner ?? 'service owner'}.`,
            status: 'completed',
          },
          {
            timestamp: '',
            label: service?.approval === 'Not Required' ? 'In Fulfilment' : 'Pending Approval',
            description: service?.approval === 'Not Required'
              ? 'Service owner is processing your request.'
              : 'Request requires approval before fulfilment.',
            status: 'active',
          },
          {
            timestamp: '',
            label: 'Closure',
            description: 'Request will be closed after fulfilment.',
            status: 'pending',
          },
        ],
        ...formData,
      };

      try {
        const localRequests = JSON.parse(localStorage.getItem('local_my_requests') || '[]');
        localStorage.setItem('local_my_requests', JSON.stringify([newRequest, ...localRequests]));
        window.dispatchEvent(new Event('local_requests_updated'));
      } catch (e) {
        console.error('Failed to save request to local storage in context', e);
      }

      setRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    [services]
  );

  const saveDraft = useCallback(
    (serviceId: string, formData: Partial<ServiceRequestRecord>): ServiceRequestRecord => {
      const service = services.find((s) => s.id === serviceId);
      const requestId = `REQ-${nextRequestNum++}`;
      const now = new Date().toISOString();

      const draftRequest: ServiceRequestRecord = {
        id: requestId,
        serviceId,
        service: service?.title ?? 'Unknown Service',
        category: service?.category ?? 'Unknown',
        requester: 'Associate',
        status: 'Draft',
        owner: service?.owner ?? 'Unassigned',
        sla: service?.sla ?? 'TBD',
        slaState: 'On Track',
        approval: service?.approvalDetail ?? 'Not required',
        urgency: 'Normal',
        expectedOutcome: '',
        submittedAt: now,
        timeline: [
          {
            timestamp: now,
            label: 'Draft Saved',
            description: 'Request saved as draft. Complete and submit when ready.',
            status: 'active',
          },
        ],
        ...formData,
      };

      try {
        const localRequests = JSON.parse(localStorage.getItem('local_my_requests') || '[]');
        localStorage.setItem('local_my_requests', JSON.stringify([draftRequest, ...localRequests]));
        window.dispatchEvent(new Event('local_requests_updated'));
      } catch (e) {
        console.error('Failed to save draft to local storage in context', e);
      }

      setRequests((prev) => [draftRequest, ...prev]);
      return draftRequest;
    },
    [services]
  );

  const updateRequestStatus = useCallback(
    (requestId: string, status: ServiceRequestStatus) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status,
                timeline: [
                  ...r.timeline.map((e) =>
                    e.status === 'active' ? { ...e, status: 'completed' as const, timestamp: new Date().toISOString() } : e
                  ),
                  {
                    timestamp: new Date().toISOString(),
                    label: status,
                    description: `Status updated to ${status}.`,
                    status: 'active' as const,
                  },
                ],
              }
            : r
        )
      );
    },
    []
  );

  const submitApprovalDecision = useCallback(
    (approvalId: string, decision: ApprovalDecisionState, rationale: string) => {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? { ...a, decisionState: decision, rationale }
            : a
        )
      );

      // Also update the linked request status
      const approval = approvals.find((a) => a.id === approvalId);
      if (approval) {
        const newStatus: ServiceRequestStatus =
          decision === 'Approved'
            ? 'In Fulfilment'
            : decision === 'Rejected'
            ? 'Closed'
            : decision === 'Returned'
            ? 'Returned for Information'
            : 'In Review';

        updateRequestStatus(approval.requestId, newStatus);
      }
    },
    [approvals, updateRequestStatus]
  );

  // ── Value ────────────────────────────────────────────────────────

  const value: ServiceLifecycleContextType = {
    services,
    serviceCategories: categories,
    serviceDetails: details,
    requests,
    approvals,
    queueItems,
    signals,
    categoryDemand,
    serviceOwnerPerformance,
    getServiceById,
    getServiceDetailByServiceId,
    getRequestById,
    getRequestsByRequester,
    getApprovalById,
    submitRequest,
    saveDraft,
    updateRequestStatus,
    submitApprovalDecision,
  };

  return (
    <ServiceLifecycleContext.Provider value={value}>
      {children}
    </ServiceLifecycleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────

export function useServiceLifecycle() {
  const context = useContext(ServiceLifecycleContext);
  if (context === undefined) {
    throw new Error('useServiceLifecycle must be used within a ServiceLifecycleProvider');
  }
  return context;
}
