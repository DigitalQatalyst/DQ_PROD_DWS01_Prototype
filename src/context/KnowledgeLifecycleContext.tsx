import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  KnowledgeAssetFull, 
  KnowledgeDetailRecord, 
  KnowledgeFeedbackRecord, 
  KnowledgeReviewQueueItem,
  ApplicabilityRecord,
  AcknowledgementRecord,
  LinkedWorkRecord,
  RelatedKnowledgeRecord,
  FeedbackType,
  ReviewQueueStatus
} from '../types/knowledgeDiscovery';
import { 
  getKnowledgeAssetsFull, 
  getKnowledgeDetail,
  getKnowledgeFeedback,
  getKnowledgeReviewQueue,
  getApplicabilityRecords,
  getLinkedWorkRecords,
  getRelatedKnowledgeRecords,
  getAcknowledgementRecords
} from '../services/platform.service';

interface AttachTarget {
  targetId: string;
  targetTitle: string;
  targetType: 'Task' | 'Request';
}

interface KnowledgeContextType {
  assets: KnowledgeAssetFull[];
  feedback: KnowledgeFeedbackRecord[];
  reviewQueue: KnowledgeReviewQueueItem[];
  applicability: ApplicabilityRecord[];
  linkedWork: LinkedWorkRecord[];
  relatedKnowledge: RelatedKnowledgeRecord[];
  acknowledgements: AcknowledgementRecord[];
  isLoading: boolean;
  getAssetDetail: (id: string) => Promise<KnowledgeDetailRecord | undefined>;
  getApplicabilityForAsset: (assetId: string) => ApplicabilityRecord | undefined;
  getLinkedWorkForAsset: (assetId: string) => LinkedWorkRecord[];
  getRelatedKnowledgeForAsset: (assetId: string) => RelatedKnowledgeRecord[];
  getAcknowledgementForAsset: (assetId: string) => AcknowledgementRecord | undefined;
  submitFeedback: (assetId: string, feedbackType: FeedbackType, comment?: string) => void;
  markReviewComplete: (queueId: string, newStatus?: ReviewQueueStatus) => void;
  attachKnowledge: (assetId: string, target: AttachTarget) => void;
  acknowledgeGuidance: (assetId: string) => void;
  flagOutdated: (assetId: string, reason: string) => void;
  requestUpdate: (assetId: string, suggestion: string) => void;
}

const KnowledgeLifecycleContext = createContext<KnowledgeContextType | undefined>(undefined);

export function KnowledgeLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<KnowledgeAssetFull[]>([]);
  const [feedback, setFeedback] = useState<KnowledgeFeedbackRecord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<KnowledgeReviewQueueItem[]>([]);
  const [applicability, setApplicability] = useState<ApplicabilityRecord[]>([]);
  const [linkedWork, setLinkedWork] = useState<LinkedWorkRecord[]>([]);
  const [relatedKnowledge, setRelatedKnowledge] = useState<RelatedKnowledgeRecord[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<AcknowledgementRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [assetsData, feedbackData, reviewData, appData, linkedData, relatedData, ackData] = await Promise.all([
        getKnowledgeAssetsFull(),
        getKnowledgeFeedback(),
        getKnowledgeReviewQueue(),
        getApplicabilityRecords(),
        getLinkedWorkRecords(),
        getRelatedKnowledgeRecords(),
        getAcknowledgementRecords()
      ]);
      setAssets(assetsData);
      setFeedback(feedbackData);
      setReviewQueue(reviewData);
      setApplicability(appData);
      setLinkedWork(linkedData);
      setRelatedKnowledge(relatedData);
      setAcknowledgements(ackData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const getAssetDetail = async (id: string) => getKnowledgeDetail(id);

  const getApplicabilityForAsset = (assetId: string) =>
    applicability.find(a => a.assetId === assetId);

  const getLinkedWorkForAsset = (assetId: string) =>
    linkedWork.filter(l => l.knowledgeId === assetId);

  const getRelatedKnowledgeForAsset = (assetId: string) =>
    relatedKnowledge.filter(r => r.fromAssetId === assetId);

  const getAcknowledgementForAsset = (assetId: string) =>
    acknowledgements.find(a => a.assetId === assetId);

  const submitFeedback = (assetId: string, feedbackType: FeedbackType, comment?: string) => {
    const newFeedback: KnowledgeFeedbackRecord = {
      id: `FDB-${Date.now()}`,
      assetId,
      feedbackType,
      submittedBy: 'Associate',
      status: feedbackType === 'Useful' ? 'Logged' : 'Pending Review',
      comment,
      createdAt: new Date().toISOString()
    };
    setFeedback(prev => [newFeedback, ...prev]);

    // If flagging outdated or requesting update, add to review queue
    if (feedbackType === 'Outdated' || feedbackType === 'Missing Detail' || feedbackType === 'Unclear' || feedbackType === 'Wrong Owner') {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        const queueItem: KnowledgeReviewQueueItem = {
          id: `KRQ-${Date.now()}`,
          assetId,
          assetTitle: asset.title,
          queueReason: feedbackType === 'Outdated' ? 'Outdated flag' : feedbackType === 'Missing Detail' ? 'Missing detail' : feedbackType === 'Unclear' ? 'Unclear guidance' : 'Wrong owner',
          feedbackType,
          owner: 'Knowledge Content Owner',
          slaDue: 'Due in 5 days',
          status: 'Pending Review'
        };
        setReviewQueue(prev => [queueItem, ...prev]);
      }
    }
  };

  const markReviewComplete = (queueId: string, newStatus: ReviewQueueStatus = 'Completed') => {
    setReviewQueue(prev =>
      prev.map(item => item.id === queueId ? { ...item, status: newStatus } : item)
    );
  };

  const attachKnowledge = (assetId: string, target: AttachTarget) => {
    const newLink: LinkedWorkRecord = {
      id: `LNK-${Date.now()}`,
      knowledgeId: assetId,
      targetId: target.targetId,
      targetTitle: target.targetTitle,
      targetType: target.targetType,
      targetStatus: 'In Progress',
      targetOwner: 'Associate'
    };
    setLinkedWork(prev => [newLink, ...prev]);
    setAssets(prev =>
      prev.map(a => a.id === assetId ? { ...a, linkedWorkCount: a.linkedWorkCount + 1 } : a)
    );
  };

  const acknowledgeGuidance = (assetId: string) => {
    setAcknowledgements(prev =>
      prev.map(a => a.assetId === assetId ? { ...a, state: 'Acknowledged' } : a)
    );
  };

  const flagOutdated = (assetId: string, reason: string) => {
    submitFeedback(assetId, 'Outdated', reason);
  };

  const requestUpdate = (assetId: string, suggestion: string) => {
    submitFeedback(assetId, 'Missing Detail', suggestion);
  };

  return (
    <KnowledgeLifecycleContext.Provider value={{
      assets,
      feedback,
      reviewQueue,
      applicability,
      linkedWork,
      relatedKnowledge,
      acknowledgements,
      isLoading,
      getAssetDetail,
      getApplicabilityForAsset,
      getLinkedWorkForAsset,
      getRelatedKnowledgeForAsset,
      getAcknowledgementForAsset,
      submitFeedback,
      markReviewComplete,
      attachKnowledge,
      acknowledgeGuidance,
      flagOutdated,
      requestUpdate
    }}>
      {children}
    </KnowledgeLifecycleContext.Provider>
  );
}

export function useKnowledgeLifecycle() {
  const context = useContext(KnowledgeLifecycleContext);
  if (context === undefined) {
    throw new Error('useKnowledgeLifecycle must be used within a KnowledgeLifecycleProvider');
  }
  return context;
}
