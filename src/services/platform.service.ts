import {
  personas,
  users,
  units,
  teams,
  tasks,
  requests,
  approvals,
  workflows,
  queues,
  knowledgeAssets,
  auditEvents,
  kpiSets } from
'../mocks/platform.mock';

// In a real app this might use env vars, but we'll default to mock data
export const getPersonas = async () => personas;
export const getUsers = async () => users;
export const getUnits = async () => units;
export const getTeams = async () => teams;
export const getTasks = async () => tasks;
export const getRequests = async () => requests;
export const getApprovals = async () => approvals;
export const getWorkflows = async () => workflows;
export const getQueues = async () => queues;
export const getKnowledgeAssets = async () => knowledgeAssets;
export const getAuditEvents = async () => auditEvents;
export const getKpiSets = async () => kpiSets;

// --- Knowledge Discovery ---
import {
  knowledgeAssetsFull,
  knowledgeDetailRecords,
  linkedWorkRecords,
  relatedKnowledgeRecords,
  knowledgeFeedbackRecords,
  knowledgeReviewQueue,
  knowledgeExecutiveSignals,
  suggestedTasksFromGuide
} from '../mocks/knowledgeDiscovery.mock';

export const getKnowledgeAssetsFull = async () => knowledgeAssetsFull;
export const getKnowledgeDetail = async (id: string) => knowledgeDetailRecords.find(d => d.assetId === id);
export const getKnowledgeFeedback = async () => knowledgeFeedbackRecords;
export const getKnowledgeReviewQueue = async () => knowledgeReviewQueue;
export const getKnowledgeSignals = async () => knowledgeExecutiveSignals;
export const getSuggestedTasksFromGuide = async () => suggestedTasksFromGuide;

// --- Task Library ---
import {
  taskTemplateCategories,
  taskTemplatesFull,
  templatePrefillRules,
  governedTasks,
  taskInstanceEdits,
  taskChecklistRecords,
  taskEvidenceRecords,
  taskReviewRecords,
  taskExecutiveSignals
} from '../mocks/taskLibrary.mock';

export const getTaskTemplateCategories = async () => taskTemplateCategories;
export const getTaskTemplatesFull = async () => taskTemplatesFull;
export const getTaskTemplateDetail = async (id: string) => taskTemplatesFull.find(t => t.id === id); // Mocking detail as same for now
export const getTemplatePrefillRules = async () => templatePrefillRules;
export const getGovernedTasks = async () => governedTasks;
export const getTaskInstanceEdits = async () => taskInstanceEdits;
export const getTaskChecklistRecords = async () => taskChecklistRecords;
export const getTaskEvidenceRecords = async () => taskEvidenceRecords;
export const getTaskReviewRecords = async () => taskReviewRecords;
export const getTaskSignals = async () => taskExecutiveSignals;