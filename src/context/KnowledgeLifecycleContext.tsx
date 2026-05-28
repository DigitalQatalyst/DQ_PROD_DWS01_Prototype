import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  KnowledgeAssetFull, 
  KnowledgeDetailRecord, 
  KnowledgeFeedbackRecord, 
  KnowledgeReviewQueueItem 
} from '../types/knowledgeDiscovery';
import { 
  getKnowledgeAssetsFull, 
  getKnowledgeDetail,
  getKnowledgeFeedback,
  getKnowledgeReviewQueue
} from '../services/platform.service';

interface KnowledgeContextType {
  assets: KnowledgeAssetFull[];
  feedback: KnowledgeFeedbackRecord[];
  reviewQueue: KnowledgeReviewQueueItem[];
  isLoading: boolean;
  getAssetDetail: (id: string) => Promise<KnowledgeDetailRecord | undefined>;
  submitFeedback: (assetId: string, feedbackType: any, comment?: string) => void;
  markReviewComplete: (queueId: string) => void;
}

const KnowledgeLifecycleContext = createContext<KnowledgeContextType | undefined>(undefined);

export function KnowledgeLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<KnowledgeAssetFull[]>([]);
  const [feedback, setFeedback] = useState<KnowledgeFeedbackRecord[]>([]);
  const [reviewQueue, setReviewQueue] = useState<KnowledgeReviewQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [assetsData, feedbackData, reviewData] = await Promise.all([
        getKnowledgeAssetsFull(),
        getKnowledgeFeedback(),
        getKnowledgeReviewQueue()
      ]);
      setAssets(assetsData);
      setFeedback(feedbackData);
      setReviewQueue(reviewData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const getAssetDetail = async (id: string) => {
    return getKnowledgeDetail(id);
  };

  const submitFeedback = (assetId: string, feedbackType: any, comment?: string) => {
    const newFeedback: KnowledgeFeedbackRecord = {
      id: `FDB-${Date.now()}`,
      assetId,
      feedbackType,
      submittedBy: 'Current User', // Mocked for now
      status: 'New',
      comment,
      createdAt: new Date().toISOString()
    };
    setFeedback(prev => [newFeedback, ...prev]);
  };

  const markReviewComplete = (queueId: string) => {
    setReviewQueue(prev => prev.map(item => 
      item.id === queueId ? { ...item, status: 'Completed' } : item
    ));
  };

  return (
    <KnowledgeLifecycleContext.Provider value={{
      assets,
      feedback,
      reviewQueue,
      isLoading,
      getAssetDetail,
      submitFeedback,
      markReviewComplete
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
