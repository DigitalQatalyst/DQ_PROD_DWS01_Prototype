import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TaskTemplateFull,
  GovernedTaskInstance,
  TaskReviewRecord
} from '../types/taskLibrary';
import { 
  getTaskTemplatesFull,
  getGovernedTasks,
  getTaskReviewRecords
} from '../services/platform.service';

interface TaskContextType {
  templates: TaskTemplateFull[];
  tasks: GovernedTaskInstance[];
  reviews: TaskReviewRecord[];
  isLoading: boolean;
  createTaskFromTemplate: (templateId: string, overrides: Partial<GovernedTaskInstance>) => GovernedTaskInstance;
  updateTaskStatus: (taskId: string, status: GovernedTaskInstance['status']) => void;
  submitTaskForReview: (taskId: string) => void;
  approveReview: (reviewId: string) => void;
}

const TaskLifecycleContext = createContext<TaskContextType | undefined>(undefined);

export function TaskLifecycleProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<TaskTemplateFull[]>([]);
  const [tasks, setTasks] = useState<GovernedTaskInstance[]>([]);
  const [reviews, setReviews] = useState<TaskReviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [templatesData, tasksData, reviewsData] = await Promise.all([
        getTaskTemplatesFull(),
        getGovernedTasks(),
        getTaskReviewRecords()
      ]);
      setTemplates(templatesData);
      setTasks(tasksData);
      setReviews(reviewsData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const createTaskFromTemplate = (templateId: string, overrides: Partial<GovernedTaskInstance>) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const newTask: GovernedTaskInstance = {
      id: `TSK-${Date.now()}`,
      templateId: template.id,
      templateTitle: template.title,
      title: overrides.title || template.title,
      purpose: template.purpose,
      ownerUserId: 'Current User', // Mocked
      teamId: 'TM-001',
      status: 'Draft',
      priority: 'Medium',
      slaState: 'On Track',
      dueDate: overrides.dueDate || new Date().toISOString(),
      expectedOutput: template.expectedOutput,
      checklistDone: 0,
      checklistTotal: template.checklistItems.length,
      evidenceState: template.evidenceRequired ? 'Missing' : ('Not Required' as any),
      knowledgeIds: template.relatedKnowledgeIds || [],
      deviations: [],
      blockerState: 'Clear',
      ...overrides
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: GovernedTaskInstance['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const submitTaskForReview = (taskId: string) => {
    updateTaskStatus(taskId, 'Review Needed');
    const newReview: TaskReviewRecord = {
      id: `REV-${Date.now()}`,
      taskId,
      reviewerUserId: 'USR-REVIEWER',
      reviewerRole: 'Reviewer',
      decisionState: 'Pending'
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const approveReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, decisionState: 'Approved' } : r
    ));
    // Also update task if needed, simplified for prototype
  };

  return (
    <TaskLifecycleContext.Provider value={{
      templates,
      tasks,
      reviews,
      isLoading,
      createTaskFromTemplate,
      updateTaskStatus,
      submitTaskForReview,
      approveReview
    }}>
      {children}
    </TaskLifecycleContext.Provider>
  );
}

export function useTaskLifecycle() {
  const context = useContext(TaskLifecycleContext);
  if (context === undefined) {
    throw new Error('useTaskLifecycle must be used within a TaskLifecycleProvider');
  }
  return context;
}
