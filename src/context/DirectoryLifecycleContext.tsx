import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type {
  AdminOwnershipReview,
  ContactRoute,
  DirectoryActionRecord,
  DirectoryActionType,
  DirectoryActivity,
  DirectoryDetailRecord,
  DirectoryEntry,
  DirectoryLinkedWork,
  OrganisationSignal,
  OwnershipArea
} from '../types/workDirectory';
import {
  getDirectoryActivities,
  getDirectoryAdminReviews,
  getDirectoryContactRoutes,
  getDirectoryDetailRecords,
  getDirectoryEntries,
  getDirectoryLinkedWork,
  getDirectoryOrganisationSignals,
  getDirectoryOwnershipAreas
} from '../services/platform.service';

interface DirectoryActionInput {
  entryId: string;
  actionType: DirectoryActionType;
  targetId?: string;
  reason: string;
  notes?: string;
}

interface DirectoryContextType {
  entries: DirectoryEntry[];
  details: DirectoryDetailRecord[];
  ownershipAreas: OwnershipArea[];
  contactRoutes: ContactRoute[];
  linkedWork: DirectoryLinkedWork[];
  activities: DirectoryActivity[];
  adminReviews: AdminOwnershipReview[];
  organisationSignals: OrganisationSignal[];
  actions: DirectoryActionRecord[];
  isLoading: boolean;
  getEntry: (id?: string) => DirectoryEntry | undefined;
  getDetail: (entryId?: string) => DirectoryDetailRecord | undefined;
  getRelatedEntries: (entry: DirectoryEntry) => DirectoryEntry[];
  getLinkedWorkForEntry: (entryId?: string) => DirectoryLinkedWork[];
  getLinkedWorkItem: (workItemId?: string) => DirectoryLinkedWork | undefined;
  getOwnershipForEntry: (entry?: DirectoryEntry) => OwnershipArea[];
  getRoutesForEntry: (entry?: DirectoryEntry) => ContactRoute[];
  submitDirectoryAction: (input: DirectoryActionInput) => DirectoryActionRecord;
  markAdminReview: (reviewId: string, status?: AdminOwnershipReview['status']) => void;
  flagOwnershipGap: (reviewId: string) => void;
  updateOwnerPlaceholder: (reviewId: string) => void;
}

const DirectoryLifecycleContext = createContext<DirectoryContextType | undefined>(undefined);

const actionStatus: Record<DirectoryActionType, DirectoryActionRecord['status']> = {
  Contact: 'Submitted',
  'Route Request': 'Routed',
  'Assign Task': 'Assigned',
  'Request Review': 'Requested',
  'Handoff Work': 'Routed',
  Escalate: 'Escalated',
  'Open Queue': 'Submitted',
  'View Related Work': 'Submitted'
};

export function DirectoryLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [details, setDetails] = useState<DirectoryDetailRecord[]>([]);
  const [ownership, setOwnership] = useState<OwnershipArea[]>([]);
  const [routes, setRoutes] = useState<ContactRoute[]>([]);
  const [linkedWork, setLinkedWork] = useState<DirectoryLinkedWork[]>([]);
  const [activities, setActivities] = useState<DirectoryActivity[]>([]);
  const [adminReviews, setAdminReviews] = useState<AdminOwnershipReview[]>([]);
  const [signals, setSignals] = useState<OrganisationSignal[]>([]);
  const [actions, setActions] = useState<DirectoryActionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDirectory() {
      setIsLoading(true);
      const [
        entryData,
        detailData,
        ownershipData,
        routeData,
        linkedData,
        activityData,
        reviewData,
        signalData
      ] = await Promise.all([
        getDirectoryEntries(),
        getDirectoryDetailRecords(),
        getDirectoryOwnershipAreas(),
        getDirectoryContactRoutes(),
        getDirectoryLinkedWork(),
        getDirectoryActivities(),
        getDirectoryAdminReviews(),
        getDirectoryOrganisationSignals()
      ]);
      setEntries(entryData);
      setDetails(detailData);
      setOwnership(ownershipData);
      setRoutes(routeData);
      setLinkedWork(linkedData);
      setActivities(activityData);
      setAdminReviews(reviewData);
      setSignals(signalData);
      setIsLoading(false);
    }
    loadDirectory();
  }, []);

  const getEntry = (id?: string) => entries.find((entry) => entry.id === id);
  const getDetail = (entryId?: string) => details.find((detail) => detail.entryId === entryId);
  const getRelatedEntries = (entry: DirectoryEntry) =>
    entry.relatedEntryIds.map((id) => getEntry(id)).filter(Boolean) as DirectoryEntry[];
  const getLinkedWorkForEntry = (entryId?: string) =>
    linkedWork.filter((record) => record.relatedDirectoryEntryId === entryId);
  const getLinkedWorkItem = (workItemId?: string) =>
    linkedWork.find((record) => record.workItemId === workItemId || record.id === workItemId);
  const getOwnershipForEntry = (entry?: DirectoryEntry) =>
    entry ? ownership.filter((record) => entry.ownershipAreas.includes(record.area) || record.owner === entry.name) : [];
  const getRoutesForEntry = (entry?: DirectoryEntry) =>
    entry ? routes.filter((route) => entry.contactRoutes.includes(route.routeType)) : [];

  const submitDirectoryAction = (input: DirectoryActionInput) => {
    const record: DirectoryActionRecord = {
      id: `DACTN-${Date.now()}`,
      entryId: input.entryId,
      actionType: input.actionType,
      targetId: input.targetId,
      reason: input.reason,
      notes: input.notes,
      status: actionStatus[input.actionType],
      createdAt: new Date().toISOString()
    };
    setActions((prev) => [record, ...prev]);

    if (['Route Request', 'Assign Task', 'Request Review', 'Handoff Work', 'Escalate'].includes(input.actionType)) {
      const entry = getEntry(input.entryId);
      const type = input.actionType === 'Assign Task' ? 'Task' : input.actionType === 'Escalate' ? 'Escalation' : 'Request';
      setLinkedWork((prev) => [
        {
          id: `LNK-${Date.now()}`,
          relatedDirectoryEntryId: input.entryId,
          workItemId: input.targetId || record.id,
          title: `${input.actionType} - ${entry?.name || input.entryId}`,
          type,
          status: record.status,
          owner: entry?.name || 'Directory owner',
          targetRoute: `/marketplaces/work-directory/related-work/${input.targetId || record.id}`
        },
        ...prev
      ]);
    }

    toast.success(`${input.actionType} saved in prototype state.`);
    return record;
  };

  const markAdminReview = (reviewId: string, status: AdminOwnershipReview['status'] = 'Reviewed') => {
    setAdminReviews((prev) => prev.map((item) => (item.id === reviewId ? { ...item, status } : item)));
    toast.success('Ownership review updated.');
  };

  const flagOwnershipGap = (reviewId: string) => {
    setAdminReviews((prev) => prev.map((item) => (item.id === reviewId ? { ...item, status: 'Issue Flagged' } : item)));
    toast.warning('Ownership gap flagged in prototype state.');
  };

  const updateOwnerPlaceholder = (reviewId: string) => {
    setAdminReviews((prev) =>
      prev.map((item) =>
        item.id === reviewId
          ? { ...item, status: 'Needs Review', action: `${item.action} - placeholder opened` }
          : item
      )
    );
    toast.info('Update owner placeholder opened in prototype state.');
  };

  return (
    <DirectoryLifecycleContext.Provider
      value={{
        entries,
        details,
        ownershipAreas: ownership,
        contactRoutes: routes,
        linkedWork,
        activities,
        adminReviews,
        organisationSignals: signals,
        actions,
        isLoading,
        getEntry,
        getDetail,
        getRelatedEntries,
        getLinkedWorkForEntry,
        getLinkedWorkItem,
        getOwnershipForEntry,
        getRoutesForEntry,
        submitDirectoryAction,
        markAdminReview,
        flagOwnershipGap,
        updateOwnerPlaceholder
      }}
    >
      {children}
    </DirectoryLifecycleContext.Provider>
  );
}

export function useDirectoryLifecycle() {
  const context = useContext(DirectoryLifecycleContext);
  if (!context) {
    throw new Error('useDirectoryLifecycle must be used within a DirectoryLifecycleProvider');
  }
  return context;
}
