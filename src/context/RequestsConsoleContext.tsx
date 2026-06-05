import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  FulfilmentRequestRow,
  FulfilmentStatus,
  OwnerQueueView,
  RequestCategory,
  SlaRecord,
  ProgressUpdate,
  EvidenceRecord,
  HandoffEvent,
  EscalationRecord,
  ClosureReviewRecord,
  LinkedWorkRecord,
  HealthSignal,
  ConfigReference,
} from '../types/requestsConsole';
import { VALID_TRANSITIONS } from '../types/requestsConsole';
import { fulfilmentRequestRows } from '../mocks/requestsConsole.mock';
import {
  ownerQueueViews,
  requestCategories,
  slaRecords,
  progressUpdates,
  evidenceRecords,
  handoffEvents,
  escalationRecords,
  closureReviewRecords,
  linkedWorkRecords,
  healthSignals,
  configReferences,
} from '../mocks/requestsConsoleExtended.mock';

// ─── State Shape ────────────────────────────────────────────────────

interface RequestsConsoleState {
  requests: FulfilmentRequestRow[];
  ownerQueues: OwnerQueueView[];
  categories: RequestCategory[];
  slaRecords: SlaRecord[];
  progressUpdates: ProgressUpdate[];
  evidenceRecords: EvidenceRecord[];
  handoffEvents: HandoffEvent[];
  escalationRecords: EscalationRecord[];
  closureReviews: ClosureReviewRecord[];
  linkedWork: LinkedWorkRecord[];
  healthSignals: HealthSignal[];
  configReferences: ConfigReference[];
}

// ─── Action Types ───────────────────────────────────────────────────

type RequestsConsoleAction =
  | { type: 'UPDATE_STATUS'; requestId: string; status: FulfilmentStatus }
  | { type: 'ADD_PROGRESS_UPDATE'; update: ProgressUpdate }
  | { type: 'ADD_EVIDENCE'; evidence: EvidenceRecord }
  | { type: 'UPDATE_EVIDENCE'; evidenceId: string; updates: Partial<EvidenceRecord> }
  | { type: 'ADD_HANDOFF'; handoff: HandoffEvent }
  | { type: 'COMPLETE_HANDOFF'; handoffId: string }
  | { type: 'ADD_ESCALATION'; escalation: EscalationRecord }
  | { type: 'ADD_CLOSURE_REVIEW'; review: ClosureReviewRecord }
  | { type: 'UPDATE_CLOSURE_REVIEW'; reviewId: string; updates: Partial<ClosureReviewRecord> }
  | { type: 'REOPEN_REQUEST'; requestId: string; reopenReason: string };

// ─── Reducer ────────────────────────────────────────────────────────

function requestsReducer(
  state: RequestsConsoleState,
  action: RequestsConsoleAction
): RequestsConsoleState {
  switch (action.type) {
    case 'UPDATE_STATUS': {
      const { requestId, status } = action;
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === requestId ? { ...r, fulfilmentStatus: status } : r
        ),
      };
    }

    case 'ADD_PROGRESS_UPDATE': {
      return {
        ...state,
        progressUpdates: [...state.progressUpdates, action.update],
      };
    }

    case 'ADD_EVIDENCE': {
      return {
        ...state,
        evidenceRecords: [...state.evidenceRecords, action.evidence],
        requests: state.requests.map((r) =>
          r.id === action.evidence.requestId
            ? { ...r, evidenceState: action.evidence.evidenceState }
            : r
        ),
      };
    }

    case 'UPDATE_EVIDENCE': {
      return {
        ...state,
        evidenceRecords: state.evidenceRecords.map((e) =>
          e.id === action.evidenceId ? { ...e, ...action.updates } : e
        ),
      };
    }

    case 'ADD_HANDOFF': {
      return {
        ...state,
        handoffEvents: [...state.handoffEvents, action.handoff],
      };
    }

    case 'COMPLETE_HANDOFF': {
      const handoff = state.handoffEvents.find((h) => h.id === action.handoffId);
      if (!handoff) return state;
      return {
        ...state,
        handoffEvents: state.handoffEvents.map((h) =>
          h.id === action.handoffId ? { ...h, status: 'Complete' as const } : h
        ),
        requests: state.requests.map((r) =>
          r.id === handoff.requestId
            ? { ...r, owner: handoff.toOwner, queue: handoff.toQueue }
            : r
        ),
      };
    }

    case 'ADD_ESCALATION': {
      return {
        ...state,
        escalationRecords: [...state.escalationRecords, action.escalation],
      };
    }

    case 'ADD_CLOSURE_REVIEW': {
      return {
        ...state,
        closureReviews: [...state.closureReviews, action.review],
      };
    }

    case 'UPDATE_CLOSURE_REVIEW': {
      return {
        ...state,
        closureReviews: state.closureReviews.map((cr) =>
          cr.id === action.reviewId ? { ...cr, ...action.updates } : cr
        ),
      };
    }

    case 'REOPEN_REQUEST': {
      const { requestId, reopenReason } = action;
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === requestId
            ? { ...r, fulfilmentStatus: 'Reopened' as const, closureQuality: 'Reopened' as const }
            : r
        ),
        closureReviews: state.closureReviews.map((cr) =>
          cr.requestId === requestId
            ? { ...cr, closureStatus: 'Reopened', reopenReason }
            : cr
        ),
      };
    }

    default:
      return state;
  }
}

// ─── Initial State ──────────────────────────────────────────────────

const initialState: RequestsConsoleState = {
  requests: fulfilmentRequestRows,
  ownerQueues: ownerQueueViews,
  categories: requestCategories,
  slaRecords,
  progressUpdates,
  evidenceRecords,
  handoffEvents,
  escalationRecords,
  closureReviews: closureReviewRecords,
  linkedWork: linkedWorkRecords,
  healthSignals,
  configReferences,
};

// ─── Context Shape ──────────────────────────────────────────────────

interface RequestsConsoleContextType {
  state: RequestsConsoleState;

  // Lookups
  getRequestById: (id: string) => FulfilmentRequestRow | undefined;
  getProgressUpdates: (requestId: string) => ProgressUpdate[];
  getEvidence: (requestId: string) => EvidenceRecord | undefined;
  getSlaRecord: (requestId: string) => SlaRecord | undefined;
  getHandoffs: (requestId: string) => HandoffEvent[];
  getEscalations: (requestId: string) => EscalationRecord[];
  getClosureReview: (requestId: string) => ClosureReviewRecord | undefined;
  getLinkedWork: (requestId: string) => LinkedWorkRecord[];
  getOwnerQueue: (queueName: string) => OwnerQueueView | undefined;

  // Mutations
  updateStatus: (requestId: string, status: FulfilmentStatus) => void;
  addProgressUpdate: (update: Omit<ProgressUpdate, 'id'>) => void;
  addEvidence: (evidence: Omit<EvidenceRecord, 'id'>) => void;
  startHandoff: (handoff: Omit<HandoffEvent, 'id' | 'status'>) => void;
  completeHandoff: (handoffId: string) => void;
  addEscalation: (escalation: Omit<EscalationRecord, 'id'>) => void;
  sendToClosureReview: (requestId: string) => void;
  acceptClosure: (requestId: string) => void;
  rejectClosure: (requestId: string, reason: string) => void;
  reopenRequest: (requestId: string, reason: string) => void;

  // Helpers
  canTransition: (current: FulfilmentStatus, target: FulfilmentStatus) => boolean;
}

const RequestsConsoleContext = createContext<RequestsConsoleContextType | undefined>(undefined);

// ─── ID Generators ──────────────────────────────────────────────────

let nextProgressId = 3007;
let nextEvidenceId = 6006;
let nextHandoffId = 5005;
let nextEscalationId = 5005;
let nextClosureReviewId = 8006;

// ─── Provider ───────────────────────────────────────────────────────

export function RequestsConsoleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(requestsReducer, initialState);

  // ── Lookups ──────────────────────────────────────────────────────

  const getRequestById = useCallback(
    (id: string) => state.requests.find((r) => r.id === id),
    [state.requests]
  );

  const getProgressUpdates = useCallback(
    (requestId: string) => state.progressUpdates.filter((p) => p.requestId === requestId),
    [state.progressUpdates]
  );

  const getEvidence = useCallback(
    (requestId: string) => state.evidenceRecords.find((e) => e.requestId === requestId),
    [state.evidenceRecords]
  );

  const getSlaRecord = useCallback(
    (requestId: string) => state.slaRecords.find((s) => s.requestId === requestId),
    [state.slaRecords]
  );

  const getHandoffs = useCallback(
    (requestId: string) => state.handoffEvents.filter((h) => h.requestId === requestId),
    [state.handoffEvents]
  );

  const getEscalations = useCallback(
    (requestId: string) => state.escalationRecords.filter((e) => e.requestId === requestId),
    [state.escalationRecords]
  );

  const getClosureReview = useCallback(
    (requestId: string) => state.closureReviews.find((cr) => cr.requestId === requestId),
    [state.closureReviews]
  );

  const getLinkedWork = useCallback(
    (requestId: string) => state.linkedWork.filter((lw) => lw.requestId === requestId),
    [state.linkedWork]
  );

  const getOwnerQueue = useCallback(
    (queueName: string) => state.ownerQueues.find((oq) => oq.queueName === queueName),
    [state.ownerQueues]
  );

  // ── Helpers ──────────────────────────────────────────────────────

  const canTransition = useCallback(
    (current: FulfilmentStatus, target: FulfilmentStatus) => {
      return VALID_TRANSITIONS[current]?.includes(target) ?? false;
    },
    []
  );

  // ── Mutations ────────────────────────────────────────────────────

  const updateStatus = useCallback(
    (requestId: string, status: FulfilmentStatus) => {
      const request = state.requests.find((r) => r.id === requestId);
      if (!request) {
        toast.error(`Request ${requestId} not found`);
        return;
      }
      if (!canTransition(request.fulfilmentStatus, status)) {
        toast.error(`Cannot transition from ${request.fulfilmentStatus} to ${status}`);
        return;
      }
      dispatch({ type: 'UPDATE_STATUS', requestId, status });
      toast.success(`${requestId} updated to ${status}`);
    },
    [state.requests, canTransition]
  );

  const addProgressUpdate = useCallback(
    (update: Omit<ProgressUpdate, 'id'>) => {
      const newUpdate: ProgressUpdate = {
        ...update,
        id: `PRG-${nextProgressId++}`,
      };
      dispatch({ type: 'ADD_PROGRESS_UPDATE', update: newUpdate });
      toast.success('Progress update saved');
    },
    []
  );

  const addEvidence = useCallback(
    (evidence: Omit<EvidenceRecord, 'id'>) => {
      const newEvidence: EvidenceRecord = {
        ...evidence,
        id: `EVD-${nextEvidenceId++}`,
      };
      dispatch({ type: 'ADD_EVIDENCE', evidence: newEvidence });
      toast.success('Evidence added');
    },
    []
  );

  const startHandoff = useCallback(
    (handoff: Omit<HandoffEvent, 'id' | 'status'>) => {
      const newHandoff: HandoffEvent = {
        ...handoff,
        id: `HND-${nextHandoffId++}`,
        status: 'Pending',
      };
      dispatch({ type: 'ADD_HANDOFF', handoff: newHandoff });
      toast.success('Handoff initiated');
    },
    []
  );

  const completeHandoff = useCallback(
    (handoffId: string) => {
      dispatch({ type: 'COMPLETE_HANDOFF', handoffId });
      toast.success('Handoff completed');
    },
    []
  );

  const addEscalation = useCallback(
    (escalation: Omit<EscalationRecord, 'id'>) => {
      const newEscalation: EscalationRecord = {
        ...escalation,
        id: `ESC-FUL-${nextEscalationId++}`,
      };
      dispatch({ type: 'ADD_ESCALATION', escalation: newEscalation });
      dispatch({ type: 'UPDATE_STATUS', requestId: escalation.requestId, status: 'Escalated' });
      toast.success('Request escalated');
    },
    []
  );

  const sendToClosureReview = useCallback(
    (requestId: string) => {
      const request = state.requests.find((r) => r.id === requestId);
      if (!request) return;
      if (!canTransition(request.fulfilmentStatus, 'Closure Review')) {
        toast.error(`Cannot send ${request.fulfilmentStatus} request to Closure Review`);
        return;
      }
      dispatch({ type: 'UPDATE_STATUS', requestId, status: 'Closure Review' });
      const newReview: ClosureReviewRecord = {
        id: `CLR-FUL-${nextClosureReviewId++}`,
        requestId,
        evidenceQuality: 'Pending',
        outcomeQuality: 'Pending Review',
        closureStatus: 'Pending Review',
        reviewer: 'Lead',
        reopenReason: '',
      };
      dispatch({ type: 'ADD_CLOSURE_REVIEW', review: newReview });
      toast.success(`${requestId} sent to Closure Review`);
    },
    [state.requests, canTransition]
  );

  const acceptClosure = useCallback(
    (requestId: string) => {
      const review = state.closureReviews.find((cr) => cr.requestId === requestId);
      if (!review) {
        toast.error('No closure review found for this request');
        return;
      }
      dispatch({
        type: 'UPDATE_CLOSURE_REVIEW',
        reviewId: review.id,
        updates: { closureStatus: 'Closed', evidenceQuality: 'Accepted', outcomeQuality: 'Accepted' },
      });
      dispatch({ type: 'UPDATE_STATUS', requestId, status: 'Closed' });
      toast.success(`${requestId} closure accepted`);
    },
    [state.closureReviews]
  );

  const rejectClosure = useCallback(
    (requestId: string, reason: string) => {
      const review = state.closureReviews.find((cr) => cr.requestId === requestId);
      if (!review) {
        toast.error('No closure review found for this request');
        return;
      }
      dispatch({
        type: 'UPDATE_CLOSURE_REVIEW',
        reviewId: review.id,
        updates: { closureStatus: 'Rejected', reopenReason: reason },
      });
      toast.success(`${requestId} closure rejected — returned for correction`);
    },
    [state.closureReviews]
  );

  const reopenRequest = useCallback(
    (requestId: string, reason: string) => {
      if (!canTransition('Closed', 'Reopened')) {
        toast.error('Request cannot be reopened');
        return;
      }
      dispatch({ type: 'REOPEN_REQUEST', requestId, reopenReason: reason });
      toast.success(`${requestId} reopened`);
    },
    [canTransition]
  );

  // ── Value ────────────────────────────────────────────────────────

  const value: RequestsConsoleContextType = {
    state,
    getRequestById,
    getProgressUpdates,
    getEvidence,
    getSlaRecord,
    getHandoffs,
    getEscalations,
    getClosureReview,
    getLinkedWork,
    getOwnerQueue,
    updateStatus,
    addProgressUpdate,
    addEvidence,
    startHandoff,
    completeHandoff,
    addEscalation,
    sendToClosureReview,
    acceptClosure,
    rejectClosure,
    reopenRequest,
    canTransition,
  };

  return (
    <RequestsConsoleContext.Provider value={value}>
      {children}
    </RequestsConsoleContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useRequestsConsole() {
  const context = useContext(RequestsConsoleContext);
  if (context === undefined) {
    throw new Error('useRequestsConsole must be used within a RequestsConsoleProvider');
  }
  return context;
}
