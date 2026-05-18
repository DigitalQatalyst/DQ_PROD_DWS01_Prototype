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