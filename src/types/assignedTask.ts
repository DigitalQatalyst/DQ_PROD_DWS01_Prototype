export type AssignedTaskStatus = 'In Progress' | 'Needs Evidence' | 'Blocked' | 'Overdue' | 'Pending Review' | 'Ready for Closure';
export type AssignedTaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type AssignedTaskRisk = 'Low' | 'Medium' | 'High' | 'Critical';
export type EvidenceStatus = 'Uploaded' | 'Linked' | 'Missing' | 'Required';

export interface AssignedTaskEvidence {
  id: string;
  type: 'XLSX' | 'PDF' | 'Link' | 'File';
  title: string;
  description: string;
  status: EvidenceStatus;
  addedBy: string;
  date: string;
}

export interface AssignedTask {
  id: string;
  title: string;
  context: string;
  priority: AssignedTaskPriority;
  status: AssignedTaskStatus;
  dueDate: string;
  dueLabel: string;
  risk: AssignedTaskRisk;
  evidenceUploaded: number;
  evidenceRequired: number;
  nextAction: string;
  details: {
    businessContext: string;
    linkedRequest: string;
    linkedOutcome: string;
    stakeholders: string[];
    unit: string;
    team: string;
    purpose: string;
    method: string;
    owner: string;
    contributors: string[];
    startDate: string;
    targetDueDate: string;
    expectedOutcome: string;
    currentOutcome: string;
    completionCriteria: string;
    reviewNote: string;
    checklist: Array<{ id: string; label: string; completed: boolean }>;
    evidence: AssignedTaskEvidence[];
    activity: Array<{ id: string; actor: string; note: string; timestamp: string }>;
  };
}
