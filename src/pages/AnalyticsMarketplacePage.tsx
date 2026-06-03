import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Clock3,
  Database,
  Eye,
  FileText,
  FilterX,
  GitBranch,
  Link2,
  Lock,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Share2,
  ShieldCheck,
  Target,
  UserRound
} from 'lucide-react';
import { toast } from 'sonner';
import { FilterBar } from '../components/FilterBar';
import { KpiTile } from '../components/KpiTile';
import { MarketplaceTopFilterBar } from '../components/MarketplaceTopFilterBar';
import type { FilterGroup } from '../components/MarketplaceFilterPanel';
import { DashboardAccessPanel } from '../components/DashboardAccessPanel';
import { MonoId } from '../components/MonoId';
import { StatusPill } from '../components/StatusPill';
import { usePersona } from '../context/PersonaContext';

type AnalyticsPermission = 'Available' | 'Restricted' | 'Requires Approval';

interface AnalyticsAsset {
  id: string;
  title: string;
  type: string;
  category: string;
  permission: AnalyticsPermission;
  audience: string;
  dataScope: string;
  updateFrequency: string;
  owner: string;
  metrics: string[];
  metricChips: string[];
  destination: string;
  description: string;
  lastRefreshed: string;
}

interface AnalyticsDetailRecord {
  id: string;
  assetId: string;
  purpose: string;
  questions: string[];
  metrics: string[];
  sourceObjects: string[];
  permission: AnalyticsPermission;
  destination: string;
  linkedWorkCount: number;
  dataQuality: string;
  lastReviewed: string;
  reviewDue: string;
  version: string;
}

type AccessRequestStatus = 'Pending' | 'Rejected' | 'Approved';

interface AnalyticsAccessRequestRecord {
  id: string;
  assetId: string;
  assetTitle: string;
  requestedBy: string;
  reason: string;
  approvalOwner: string;
  sla: string;
  status: AccessRequestStatus;
  requestedAudience: string;
  rejectionReason?: string;
}

type FeedbackSeverity = 'Low' | 'Medium' | 'High';

interface AnalyticsFeedbackRecord {
  id: string;
  assetId: string;
  feedbackType: string;
  submittedBy: string;
  severity: FeedbackSeverity;
  status: string;
  comment?: string;
  missingMetric?: string;
}

interface LeadReviewQueueRecord {
  id: string;
  assetId: string;
  queueReason: string;
  owner: string;
  reviewDue: string;
  status: string;
  sourceType: 'Access Requests' | 'Data Issues' | 'Metric Change Requests' | 'Usage Feedback';
  note?: string;
}

interface ExecutiveAnalyticsSignalRecord {
  id: string;
  signal: string;
  value: string;
  status: 'Info' | 'Success' | 'Warning' | 'Danger';
  linksTo: string;
}

const analyticsAssets: AnalyticsAsset[] = [
  {
    id: 'ANL-001',
    title: 'My Performance Snapshot',
    type: 'Personal Dashboard',
    category: 'Personal',
    permission: 'Available',
    audience: 'Associate',
    dataScope: 'Personal',
    updateFrequency: 'Near real-time',
    owner: 'Lead',
    metrics: ['Active items by status', 'SLA adherence rate', 'Closure quality score'],
    metricChips: ['Associate Performance', 'SLA', 'Closure Quality'],
    destination: '/workspace/my-work',
    description: 'Personal execution metrics, closure quality, and SLA adherence for owned work.',
    lastRefreshed: 'Today, 09:20'
  },
  {
    id: 'ANL-002',
    title: 'Team Execution Dashboard',
    type: 'Team Dashboard',
    category: 'Team',
    permission: 'Requires Approval',
    audience: 'Lead',
    dataScope: 'Team',
    updateFrequency: 'Daily',
    owner: 'Lead',
    metrics: ['Team workload', 'Blocker count', 'Review needs'],
    metricChips: ['Workload', 'Blockers', 'Closure Quality'],
    destination: '/workspace/team-work',
    description: 'Team workload, flow health, blockers, and review needs for active delivery.',
    lastRefreshed: 'Today, 07:00'
  },
  {
    id: 'ANL-003',
    title: 'Unit Visibility Dashboard',
    type: 'Unit Dashboard',
    category: 'Unit',
    permission: 'Restricted',
    audience: 'Lead',
    dataScope: 'Unit',
    updateFrequency: 'Daily',
    owner: 'Lead',
    metrics: ['Outcome progress', 'Governance exposure', 'SLA trend'],
    metricChips: ['Outcome Progress', 'Governance Health', 'SLA'],
    destination: '/workspace/unit-visibility',
    description: 'Unit health, governance exposure, outcome progress, and SLA trend signals.',
    lastRefreshed: 'Today, 07:15'
  },
  {
    id: 'ANL-004',
    title: 'SLA Dashboard',
    type: 'SLA View',
    category: 'SLA',
    permission: 'Available',
    audience: 'Lead',
    dataScope: 'Team',
    updateFrequency: 'Near real-time',
    owner: 'Lead',
    metrics: ['Breach risk', 'Ageing', 'Escalation exposure'],
    metricChips: ['SLA', 'Blockers'],
    destination: '/intelligence/sla',
    description: 'SLA breach risk, ageing, and escalation exposure across active work.',
    lastRefreshed: 'Today, 09:35'
  },
  {
    id: 'ANL-005',
    title: 'Governance Dashboard',
    type: 'Governance Report',
    category: 'Governance',
    permission: 'Requires Approval',
    audience: 'Lead',
    dataScope: 'Unit',
    updateFrequency: 'Weekly',
    owner: 'Lead',
    metrics: ['Governance exceptions', 'Approval exposure', 'Evidence gaps'],
    metricChips: ['Governance Health', 'Closure Quality'],
    destination: '/intelligence/governance',
    description: 'Governance exceptions, approval exposure, and evidence gaps requiring review.',
    lastRefreshed: 'Monday, 08:00'
  },
  {
    id: 'ANL-006',
    title: 'Outcome Progress View',
    type: 'Outcome View',
    category: 'Outcome',
    permission: 'Available',
    audience: 'Lead',
    dataScope: 'Unit',
    updateFrequency: 'Weekly',
    owner: 'Lead',
    metrics: ['Outcome progress', 'Delivery alignment', 'Intervention needs'],
    metricChips: ['Outcome Progress', 'Workload'],
    destination: '/intelligence/outcomes',
    description: 'Outcome progress, delivery alignment, and intervention needs for unit goals.',
    lastRefreshed: 'Monday, 08:30'
  },
  {
    id: 'ANL-007',
    title: 'CEO Enterprise Dashboard',
    type: 'Executive Dashboard',
    category: 'Executive',
    permission: 'Restricted',
    audience: 'Executives',
    dataScope: 'Enterprise',
    updateFrequency: 'Daily',
    owner: 'Lead',
    metrics: ['Enterprise performance', 'SLA exposure', 'Governance risk'],
    metricChips: ['Associate Performance', 'SLA', 'Governance Health'],
    destination: '/intelligence/executive',
    description: 'Enterprise performance, SLA exposure, and governance risk for executive oversight.',
    lastRefreshed: 'Today, 06:45'
  },
  {
    id: 'ANL-008',
    title: 'Closure Quality Signal',
    type: 'Insight Signal',
    category: 'Outcome',
    permission: 'Available',
    audience: 'Lead',
    dataScope: 'Team',
    updateFrequency: 'Live mock',
    owner: 'Lead',
    metrics: ['Closure quality', 'Evidence completeness', 'Review state'],
    metricChips: ['Closure Quality', 'Governance Health'],
    destination: '/intelligence/closure-quality',
    description: 'Insight signal for closure quality, evidence completeness, and review state.',
    lastRefreshed: 'Live mock'
  }
];

const analyticsDetails: AnalyticsDetailRecord[] = [
  {
    id: 'DET-ANL-001',
    assetId: 'ANL-001',
    purpose: 'Shows personal execution metrics, active work status, SLA adherence, closure quality, and trend over time.',
    questions: ['Where is my work stuck?', 'Am I meeting SLA expectations?', 'Is closure quality improving?'],
    metrics: ['Active items by status', 'SLA adherence rate', 'Closure quality score'],
    sourceObjects: ['Tasks', 'Requests', 'SLAs'],
    permission: 'Available',
    destination: '/workspace/my-work',
    linkedWorkCount: 3,
    dataQuality: 'Healthy',
    lastReviewed: '2026-05-28',
    reviewDue: '2026-06-28',
    version: 'v1.2'
  },
  {
    id: 'DET-ANL-002',
    assetId: 'ANL-002',
    purpose: 'Shows team workload, flow health, blockers, missing updates, overdue work, and review needs.',
    questions: ['Where is the team blocked?', 'Which tasks need intervention?', 'Are updates and closure quality healthy?'],
    metrics: ['Team workload', 'Blocker count'],
    sourceObjects: ['Tasks', 'Blockers', 'Reviews', 'SLAs'],
    permission: 'Requires Approval',
    destination: '/workspace/team-work',
    linkedWorkCount: 5,
    dataQuality: 'Warning',
    lastReviewed: '2026-05-24',
    reviewDue: '2026-06-24',
    version: 'v1.1'
  },
  {
    id: 'DET-ANL-004',
    assetId: 'ANL-004',
    purpose: 'Shows SLA adherence, breach risk, ageing, and escalation exposure.',
    questions: ['Which items are at risk?', 'What is breached?', 'Where is intervention needed?'],
    metrics: ['Breach risk', 'Ageing', 'Escalation exposure'],
    sourceObjects: ['SLAs', 'Escalations', 'Requests', 'Tasks'],
    permission: 'Available',
    destination: '/intelligence/sla',
    linkedWorkCount: 4,
    dataQuality: 'Healthy',
    lastReviewed: '2026-05-30',
    reviewDue: '2026-06-30',
    version: 'v1.3'
  },
  {
    id: 'DET-ANL-005',
    assetId: 'ANL-005',
    purpose: 'Shows governance exceptions, approval exposure, evidence gaps, and audit signals.',
    questions: ['Which governance records need review?', 'Where are evidence or approval gaps?'],
    metrics: ['Governance exceptions', 'Approval exposure', 'Evidence gaps'],
    sourceObjects: ['Governance Records', 'Evidence Records', 'Approvals'],
    permission: 'Requires Approval',
    destination: '/intelligence/governance',
    linkedWorkCount: 6,
    dataQuality: 'Issue Reported',
    lastReviewed: '2026-05-20',
    reviewDue: '2026-06-20',
    version: 'v1.0'
  }
];

const allSourceObjects = ['Tasks', 'Requests', 'Approvals', 'SLAs', 'Blockers', 'Closure Records', 'Evidence Records', 'Governance Records', 'Outcome Records'];

const linkedWorkRecords = [
  { id: 'TSK-2401', type: 'Task', title: 'Improve closure evidence quality', status: 'In Progress' },
  { id: 'REQ-2401', type: 'Request', title: 'Access and permission review', status: 'Pending' },
  { id: 'REV-3001', type: 'Review', title: 'Weekly team execution review', status: 'Awaiting Review' },
  { id: 'DEC-1001', type: 'Decision', title: 'Outcome intervention note', status: 'Draft' }
];

const linkedInsightRecords = [
  { id: 'LIN-001', assetId: 'ANL-001', linkedItem: 'TSK-2401 - Improve closure quality', type: 'Task', insightNote: 'Closure score is improving but evidence is still missing.', status: 'Linked' },
  { id: 'LIN-002', assetId: 'ANL-004', linkedItem: 'REQ-2401 - Access & Permission Request', type: 'Request', insightNote: 'SLA risk needs owner intervention.', status: 'Linked' },
  { id: 'LIN-003', assetId: 'ANL-002', linkedItem: 'REV-3001 - Weekly Team Review', type: 'Review', insightNote: 'Blocker trend requires review discussion.', status: 'Linked' },
  { id: 'LIN-004', assetId: 'ANL-006', linkedItem: 'DEC-1001 - Outcome intervention note', type: 'Decision', insightNote: 'Outcome progress is below expected weekly trajectory.', status: 'Linked' }
];

const followUpTaskRecords = [
  { id: 'TSK-ANL-001', assetId: 'ANL-001', taskTitle: 'Improve evidence quality for closed tasks', owner: 'Associate', due: 'Due in 2 days', status: 'Draft', linksTo: 'LIN-001' },
  { id: 'TSK-ANL-002', assetId: 'ANL-004', taskTitle: 'Resolve SLA breach risk on pending requests', owner: 'Lead', due: 'Due tomorrow', status: 'Created', linksTo: 'LIN-002' },
  { id: 'TSK-ANL-003', assetId: 'ANL-002', taskTitle: 'Review blocker ageing in team execution', owner: 'Lead', due: 'Due in 1 day', status: 'Created', linksTo: 'LIN-003' },
  { id: 'TSK-ANL-004', assetId: 'ANL-006', taskTitle: 'Prepare outcome recovery action note', owner: 'Lead', due: 'Due this week', status: 'Draft', linksTo: 'LIN-004' }
];

const linkTargets = {
  Task: [
    { id: 'TSK-2401', title: 'Improve closure quality', type: 'Task', status: 'In Progress', owner: 'Associate' },
    { id: 'TSK-2405', title: 'Closure Quality Review', type: 'Task', status: 'Review Needed', owner: 'Lead' }
  ],
  Request: [
    { id: 'REQ-2401', title: 'Access & Permission Request', type: 'Request', status: 'Pending', owner: 'Lead' },
    { id: 'REQ-2405', title: 'Task support request', type: 'Request', status: 'Submitted', owner: 'Support' }
  ],
  Review: [
    { id: 'REV-3001', title: 'Weekly Team Review', type: 'Review', status: 'Awaiting Review', owner: 'Lead' },
    { id: 'REV-3002', title: 'Closure Review', type: 'Review', status: 'In Review', owner: 'Lead' }
  ],
  Decision: [
    { id: 'DEC-1001', title: 'Outcome intervention note', type: 'Decision', status: 'Draft', owner: 'Lead' },
    { id: 'DEC-1004', title: 'Delivery intervention note', type: 'Decision', status: 'New', owner: 'Unit Lead' }
  ]
} as const;

const analyticsAccessRequests: AnalyticsAccessRequestRecord[] = [
  {
    id: 'ARQ-3001',
    assetId: 'ANL-002',
    assetTitle: 'Team Execution Dashboard',
    requestedBy: 'Associate',
    reason: 'Need team view for sprint review support.',
    approvalOwner: 'Lead',
    sla: '1 business day',
    status: 'Pending',
    requestedAudience: 'Lead'
  },
  {
    id: 'ARQ-3002',
    assetId: 'ANL-003',
    assetTitle: 'Unit Visibility Dashboard',
    requestedBy: 'Lead',
    reason: 'Need unit view for delivery health review.',
    approvalOwner: 'Lead',
    sla: '1 business day',
    status: 'Rejected',
    requestedAudience: 'Lead',
    rejectionReason: 'Unit-level visibility requires an active delivery health review owner.'
  },
  {
    id: 'ARQ-3003',
    assetId: 'ANL-005',
    assetTitle: 'Governance Dashboard',
    requestedBy: 'Lead',
    reason: 'Need governance view for closure review.',
    approvalOwner: 'Lead',
    sla: '1 business day',
    status: 'Approved',
    requestedAudience: 'Lead'
  },
  {
    id: 'ARQ-3004',
    assetId: 'ANL-007',
    assetTitle: 'CEO Enterprise Dashboard',
    requestedBy: 'Lead',
    reason: 'Need enterprise view for leadership briefing.',
    approvalOwner: 'Lead',
    sla: '2 business days',
    status: 'Pending',
    requestedAudience: 'Executives'
  }
];

const analyticsFeedbackRecords: AnalyticsFeedbackRecord[] = [
  { id: 'AFB-1001', assetId: 'ANL-001', feedbackType: 'Useful', submittedBy: 'Associate', severity: 'Low', status: 'Logged' },
  { id: 'AFB-1002', assetId: 'ANL-004', feedbackType: 'Data looks wrong', submittedBy: 'Lead', severity: 'High', status: 'Pending Review' },
  { id: 'AFB-1003', assetId: 'ANL-002', feedbackType: 'Missing metric', submittedBy: 'Lead', severity: 'Medium', status: 'Metric Change Requested' },
  { id: 'AFB-1004', assetId: 'ANL-006', feedbackType: 'Hard to interpret', submittedBy: 'Lead', severity: 'Medium', status: 'Update Requested' },
  { id: 'AFB-1005', assetId: 'ANL-003', feedbackType: 'Access issue', submittedBy: 'Associate', severity: 'Medium', status: 'Pending Access Review' }
];

const leadReviewQueueRecords: LeadReviewQueueRecord[] = [
  { id: 'LRQ-5001', assetId: 'ANL-004', queueReason: 'Data issue', owner: 'Lead', reviewDue: 'Due today', status: 'Pending Review', sourceType: 'Data Issues' },
  { id: 'LRQ-5002', assetId: 'ANL-002', queueReason: 'Metric change request', owner: 'Lead', reviewDue: 'Due in 3 days', status: 'Update Required', sourceType: 'Metric Change Requests' },
  { id: 'LRQ-5003', assetId: 'ANL-003', queueReason: 'Access issue', owner: 'Lead', reviewDue: 'Due tomorrow', status: 'Access Review', sourceType: 'Access Requests' },
  { id: 'LRQ-5004', assetId: 'ANL-006', queueReason: 'Interpretation issue', owner: 'Lead', reviewDue: 'Due in 5 days', status: 'Review Scheduled', sourceType: 'Usage Feedback' }
];

const executiveAnalyticsSignals: ExecutiveAnalyticsSignalRecord[] = [
  { id: 'SIG-ANL-9001', signal: 'Analytics assets opened this week', value: '36', status: 'Info', linksTo: 'Analytics Discovery' },
  { id: 'SIG-ANL-9002', signal: 'Insights linked to work', value: '14', status: 'Success', linksTo: 'Linked Insights' },
  { id: 'SIG-ANL-9003', signal: 'Access requests pending', value: '4', status: 'Warning', linksTo: 'Access Requests' },
  { id: 'SIG-ANL-9004', signal: 'Data issues pending', value: '2', status: 'Danger', linksTo: 'Lead Review Queue' },
  { id: 'SIG-ANL-9005', signal: 'High-risk SLA signals', value: '5', status: 'Danger', linksTo: 'SLA Dashboard' },
  { id: 'SIG-ANL-9006', signal: 'Outcome views used this week', value: '9', status: 'Success', linksTo: 'Outcome View' }
];

const usageByTypeRecords = [
  { type: 'Personal Dashboard', opened: 12, trend: '+4', risk: 'Low' },
  { type: 'Team Dashboard', opened: 8, trend: '+2', risk: 'Medium' },
  { type: 'SLA View', opened: 7, trend: '+3', risk: 'High' },
  { type: 'Governance Report', opened: 4, trend: '+1', risk: 'Medium' },
  { type: 'Outcome View', opened: 9, trend: '+2', risk: 'Low' },
  { type: 'Insight Signal', opened: 6, trend: '+3', risk: 'Medium' }
];

const insightLinkedWorkSummary = [
  { type: 'Task', count: 5 },
  { type: 'Request', count: 3 },
  { type: 'Review', count: 4 },
  { type: 'Decision', count: 2 }
];

const mostUsedAnalyticsRecords = [
  { assetId: 'ANL-001', opened: 12, linkedWork: 5, feedbackState: 'Useful' },
  { assetId: 'ANL-004', opened: 7, linkedWork: 3, feedbackState: 'Data issue' },
  { assetId: 'ANL-006', opened: 9, linkedWork: 4, feedbackState: 'Update requested' },
  { assetId: 'ANL-002', opened: 8, linkedWork: 2, feedbackState: 'Metric requested' }
];

const tabs = ['All', 'Personal', 'Team', 'Unit', 'SLA', 'Governance', 'Outcome', 'Executive'];

const filterGroups: FilterGroup[] = [
  {
    id: 'type',
    label: 'Dashboard Type',
    options: [
      'Personal Dashboard',
      'Team Dashboard',
      'Unit Dashboard',
      'SLA View',
      'Governance Report',
      'Outcome View',
      'Executive Dashboard',
      'Insight Signal'
    ].map((value) => ({ value, label: value }))
  },
  {
    id: 'permission',
    label: 'Permission',
    options: ['Available', 'Restricted', 'Requires Approval'].map((value) => ({ value, label: value }))
  },
  {
    id: 'metrics',
    label: 'Metrics Included',
    options: ['SLA', 'Blockers', 'Closure Quality', 'Workload', 'Governance Health', 'Outcome Progress', 'Associate Performance'].map((value) => ({ value, label: value }))
  },
  {
    id: 'frequency',
    label: 'Update Frequency',
    options: ['Live mock', 'Near real-time', 'Daily', 'Weekly'].map((value) => ({ value, label: value }))
  },
  {
    id: 'audience',
    label: 'Audience',
    options: ['Associate', 'Lead', 'Executives'].map((value) => ({ value, label: value }))
  },
  {
    id: 'scope',
    label: 'Data Scope',
    options: ['Personal', 'Team', 'Unit', 'Enterprise'].map((value) => ({ value, label: value }))
  }
];

export function AnalyticsMarketplacePage() {
  const { activePersona } = usePersona();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [recommendedActive, setRecommendedActive] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<AnalyticsAsset | null>(null);
  const [accessAsset, setAccessAsset] = useState<AnalyticsAsset | null>(null);
  const [permissionOverrides, setPermissionOverrides] = useState<Record<string, AnalyticsPermission>>(() => readAnalyticsPermissionOverrides());
  const isLoading = false;
  const hasError = false;

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const clearFilters = () => {
    setFilterValues({});
    setSearch('');
    setRecommendedActive(false);
    setActiveTab('All');
  };

  const effectiveAssets = useMemo(() => analyticsAssets.map((asset) => applyPermissionOverride(asset, permissionOverrides)), [permissionOverrides]);

  const markAssetAvailable = (assetId: string) => {
    setPermissionOverrides((current) => {
      const next = { ...current, [assetId]: 'Available' as AnalyticsPermission };
      writeAnalyticsPermissionOverrides(next);
      return next;
    });
  };

  const filteredAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return effectiveAssets.filter((asset) => {
      const matchesTab = activeTab === 'All' || asset.category === activeTab;
      const searchable = [
        asset.title,
        asset.type,
        asset.owner,
        asset.audience,
        asset.dataScope,
        asset.description,
        ...asset.metrics,
        ...asset.metricChips
      ].join(' ').toLowerCase();
      const matchesSearch = normalizedSearch === '' || searchable.includes(normalizedSearch);
      const matchesType = !filterValues.type?.length || filterValues.type.includes(asset.type);
      const matchesPermission = !filterValues.permission?.length || filterValues.permission.includes(asset.permission);
      const matchesMetrics = !filterValues.metrics?.length || filterValues.metrics.some((metric) => asset.metricChips.includes(metric));
      const matchesFrequency = !filterValues.frequency?.length || filterValues.frequency.includes(asset.updateFrequency);
      const matchesAudience = !filterValues.audience?.length || filterValues.audience.includes(asset.audience);
      const matchesScope = !filterValues.scope?.length || filterValues.scope.includes(asset.dataScope);
      const matchesRecommended = !recommendedActive || isRecommendedForPersona(asset, activePersona.id);
      return matchesTab && matchesSearch && matchesType && matchesPermission && matchesMetrics && matchesFrequency && matchesAudience && matchesScope && matchesRecommended;
    });
  }, [activePersona.id, activeTab, effectiveAssets, filterValues, recommendedActive, search]);

  const visibleCount = filteredAssets.filter((asset) => asset.permission === 'Available').length;

  if (isLoading) return <AnalyticsLoadingState />;

  if (hasError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-card border border-danger/20 bg-danger-surface p-6 text-danger-text">
          <h1 className="text-lg font-bold">Analytics assets could not be loaded in prototype state.</h1>
          <p className="mt-2 text-sm">Refresh the prototype or clear filters to retry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-primary">
            <BarChart3 size={24} />
          </span>
          Analytics Discovery
        </h1>
        <p className="mt-2 max-w-4xl text-base text-text-secondary">
          Discover permitted dashboards, reports, outcome views, SLA views, governance reports, and performance surfaces.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Dashboards Visible" value={String(visibleCount)} status="info" />
        <KpiTile label="SLA Views" value={String(effectiveAssets.filter((asset) => asset.category === 'SLA').length)} status="warning" />
        <KpiTile label="Governance Reports" value={String(effectiveAssets.filter((asset) => asset.category === 'Governance').length)} status="danger" />
        <KpiTile label="Outcome Views" value={String(effectiveAssets.filter((asset) => asset.category === 'Outcome').length)} status="success" />
      </div>

      <FilterBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <MarketplaceTopFilterBar
          searchPlaceholder="Search dashboards, reports, metrics, owners, audiences, or scopes"
          searchValue={search}
          onSearchChange={setSearch}
          groups={filterGroups}
          values={filterValues}
          onChange={handleFilterChange}
          recommendedActive={recommendedActive}
          onRecommendedChange={setRecommendedActive}
          onClearAll={clearFilters}
        />
      </div>

      <p className="mt-4 text-sm text-text-muted">
        Showing <strong className="text-text-primary">{filteredAssets.length}</strong> of <strong className="text-text-primary">{analyticsAssets.length}</strong> analytics assets
      </p>

      {filteredAssets.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <AnalyticsCard
              key={asset.id}
              asset={asset}
              onOpenDetail={() => navigate(`/marketplaces/analytics/${asset.id}`)}
              onOpenDashboard={() => setPreviewAsset(asset)}
              onRequestAccess={() => setAccessAsset(asset)}
            />
          ))}
        </div>
      ) : (
        <EmptyAnalyticsState onClear={clearFilters} />
      )}

      {previewAsset && (
        <DashboardAccessPanel
          dashboard={toDashboardPreview(previewAsset)}
          activePersona={activePersona}
          isPermitted={previewAsset.permission === 'Available'}
          onClose={() => setPreviewAsset(null)}
          onRequestAccess={() => {
            setAccessAsset(previewAsset);
            setPreviewAsset(null);
          }}
        />
      )}

      {accessAsset && (
        <AnalyticsAccessRequestFlow
          asset={accessAsset}
          activePersona={activePersona}
          onClose={() => setAccessAsset(null)}
          onApproved={() => markAssetAvailable(accessAsset.id)}
        />
      )}
    </div>
  );
}

export function AnalyticsDetailPage() {
  const { analyticsId } = useParams();
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const [permissionOverrides, setPermissionOverrides] = useState<Record<string, AnalyticsPermission>>(() => readAnalyticsPermissionOverrides());
  const asset = analyticsAssets.find((item) => item.id === analyticsId);
  const effectiveAsset = asset ? applyPermissionOverride(asset, permissionOverrides) : undefined;
  const detail = asset ? getAnalyticsDetail(asset) : undefined;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [linkFlow, setLinkFlow] = useState<string | null>(null);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const isLoading = false;
  const hasError = false;

  const markAssetAvailable = (assetId: string) => {
    setPermissionOverrides((current) => {
      const next = { ...current, [assetId]: 'Available' as AnalyticsPermission };
      writeAnalyticsPermissionOverrides(next);
      return next;
    });
  };

  if (isLoading) return <AnalyticsDetailLoadingState />;

  if (hasError) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-card border border-danger/20 bg-danger-surface p-6 text-danger-text">
          <h1 className="text-lg font-bold">Analytics details could not be loaded in prototype state.</h1>
          <p className="mt-2 text-sm">Return to Analytics Discovery or refresh the prototype.</p>
        </div>
      </div>
    );
  }

  if (!effectiveAsset || !detail) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-warning" />
        <h1 className="mb-2 text-2xl font-bold text-primary">Analytics asset not found</h1>
        <p className="mb-6 text-text-secondary">The requested analytics record is missing from the prototype fixtures.</p>
        <button onClick={() => navigate('/marketplaces/analytics')} className="rounded-button bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700">
          Return to Analytics Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <AnalyticsDetailHero asset={effectiveAsset} detail={detail} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <section className="space-y-6 xl:col-span-8">
          <AnalyticsInfoCard title="Purpose" icon={<Target size={18} className="text-primary" />}>
            <p className="text-sm leading-6 text-text-secondary">{detail.purpose}</p>
          </AnalyticsInfoCard>

          <AnalyticsInfoCard title="Questions Answered" icon={<MessageSquare size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {detail.questions.map((question) => (
                <div key={question} className="rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-text-primary">{question}</div>
              ))}
            </div>
          </AnalyticsInfoCard>

          <AnalyticsInfoCard title="Metrics Included" icon={<BarChart3 size={18} className="text-primary" />}>
            <div className="space-y-3">
              {detail.metrics.map((metric, index) => (
                <div key={metric} className="rounded-lg border border-border-subtle bg-surface px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-text-primary">{metric}</p>
                      <p className="mt-1 text-xs text-text-muted">{metricDefinition(metric)}</p>
                    </div>
                    <StatusPill status={index === 0 ? 'Healthy' : index === 1 ? 'Warning' : 'Info'} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-secondary">Interpretation: {metricInterpretation(metric)}</p>
                  <p className="mt-2 text-xs font-semibold text-primary">Source link: {detail.sourceObjects[index % detail.sourceObjects.length]}</p>
                </div>
              ))}
            </div>
          </AnalyticsInfoCard>

          <AnalyticsInfoCard title="Data Scope" icon={<Database size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DetailFact label="Scope" value={effectiveAsset.dataScope} />
              <DetailFact label="Visibility boundary" value={scopeBoundary(effectiveAsset.dataScope)} />
              <DetailFact label="Included data" value={detail.sourceObjects.join(', ')} />
              <DetailFact label="Excluded data" value="Private messages, raw HR records, and unrestricted enterprise detail." />
            </div>
          </AnalyticsInfoCard>

          <AnalyticsInfoCard title="Source Objects" icon={<FileText size={18} className="text-primary" />}>
            <div className="flex flex-wrap gap-2">
              {allSourceObjects.map((source) => (
                <span key={source} className={`rounded-pill border px-2.5 py-1 text-xs font-semibold ${detail.sourceObjects.includes(source) ? 'border-border-subtle bg-surface text-text-secondary' : 'border-border-subtle bg-white text-text-muted opacity-60'}`}>
                  {source}
                </span>
              ))}
            </div>
          </AnalyticsInfoCard>

          <AnalyticsInfoCard title="Interpretation Guidance" icon={<AlertCircle size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                'Warning states mean review the owner, due date, and linked blockers before acting.',
                'Low scores usually indicate missing evidence, stale updates, or unresolved review notes.',
                'Spikes should be checked against recent task, request, SLA, or governance activity.',
                'SLA risk and breach indicators require owner intervention before escalation exposure grows.',
                'Blocker signals should be linked to a task, request, review, or decision for follow-up.'
              ].map((item) => <p key={item} className="rounded-lg bg-surface px-4 py-3 text-sm leading-6 text-text-secondary">{item}</p>)}
            </div>
          </AnalyticsInfoCard>

          <AccessPermissionPanel asset={effectiveAsset} detail={detail} />

          <AnalyticsInfoCard title="Linked Work & Decisions" icon={<Link2 size={18} className="text-primary" />}>
            <div className="space-y-3">
              {linkedWorkRecords.map((record) => (
                <div key={record.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle px-4 py-3">
                  <div>
                    <MonoId value={record.id} />
                    <p className="mt-1 font-bold text-text-primary">{record.title}</p>
                    <p className="text-xs text-text-muted">{record.type}</p>
                  </div>
                  <StatusPill status={record.status} />
                </div>
              ))}
            </div>
          </AnalyticsInfoCard>

          <RelatedAnalyticsGrid currentAsset={effectiveAsset} />

          <AnalyticsInfoCard title="Governance & Trust" icon={<ShieldCheck size={18} className="text-primary" />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DetailFact label="Owner" value={effectiveAsset.owner} />
              <DetailFact label="Data steward" value="Analytics Governance Lead" />
              <DetailFact label="Version" value={detail.version} />
              <DetailFact label="Data quality" value={detail.dataQuality} />
              <DetailFact label="Last refreshed" value={effectiveAsset.lastRefreshed} />
              <DetailFact label="Last reviewed" value={detail.lastReviewed} />
              <DetailFact label="Review due" value={detail.reviewDue} />
              <DetailFact label="Permission scope" value={effectiveAsset.permission} />
              <DetailFact label="Destination" value={detail.destination} />
            </div>
          </AnalyticsInfoCard>

          <AnalyticsFeedbackPanel asset={effectiveAsset} activePersona={activePersona} selectedType={feedbackType} onSelect={setFeedbackType} />
        </section>

        <AnalyticsActionRail
          asset={effectiveAsset}
          onOpenDashboard={() => setPreviewOpen(true)}
          onRequestAccess={() => setAccessOpen(true)}
          onLinkInsight={setLinkFlow}
          onCreateFollowUp={() => setFollowUpOpen(true)}
          onShare={() => toast.success('Summary prepared in prototype state.')}
          onReportIssue={() => setFeedbackType('Data looks wrong')}
          onMetricChange={() => setFeedbackType('Missing metric')}
        />
      </div>

      {previewOpen && (
        <DashboardAccessPanel
          dashboard={toDashboardPreview(effectiveAsset)}
          activePersona={activePersona}
          isPermitted={effectiveAsset.permission === 'Available'}
          onClose={() => setPreviewOpen(false)}
          onRequestAccess={() => {
            setPreviewOpen(false);
            setAccessOpen(true);
          }}
        />
      )}
      {accessOpen && (
        <AnalyticsAccessRequestFlow
          asset={effectiveAsset}
          activePersona={activePersona}
          onClose={() => setAccessOpen(false)}
          onApproved={() => markAssetAvailable(effectiveAsset.id)}
        />
      )}
      {linkFlow && <InsightLinkFlow targetType={linkFlow} asset={effectiveAsset} onClose={() => setLinkFlow(null)} />}
      {followUpOpen && <FollowUpTaskFlow asset={effectiveAsset} onClose={() => setFollowUpOpen(false)} />}
    </div>
  );
}

export function AnalyticsLeadReviewQueuePage() {
  const [items, setItems] = useState<LeadReviewQueueRecord[]>(() => [...leadReviewQueueRecords, ...readStoredLeadReviewQueue()]);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedId, setSelectedId] = useState(items[0]?.id || '');
  const selected = items.find((item) => item.id === selectedId) || items[0];
  const tabs = ['All', 'Access Requests', 'Data Issues', 'Metric Change Requests', 'Usage Feedback', 'Review Due'];
  const filtered = items.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Review Due') return item.status !== 'Reviewed' && item.reviewDue.toLowerCase().includes('due');
    return item.sourceType === activeTab;
  });

  const updateItem = (id: string, status: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    toast.success(status === 'Reviewed' ? 'Review item marked reviewed.' : 'Review item updated.');
  };

  const approveAccess = (item: LeadReviewQueueRecord) => {
    const next = { ...readAnalyticsPermissionOverrides(), [item.assetId]: 'Available' as AnalyticsPermission };
    writeAnalyticsPermissionOverrides(next);
    updateStoredAccessRequestStatus(item.assetId, 'Approved');
    updateItem(item.id, 'Reviewed');
    toast.success('Access approved and analytics permission updated in prototype state.');
  };

  const rejectAccess = (item: LeadReviewQueueRecord, reason: string) => {
    if (!reason.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    updateStoredAccessRequestStatus(item.assetId, 'Rejected', reason.trim());
    updateItem(item.id, 'Reviewed');
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-primary"><ShieldCheck size={28} /> Analytics Review Queue</h1>
        <p className="mt-2 max-w-4xl text-text-secondary">Review analytics access requests, data issues, metric change requests, interpretation issues, and usage feedback routed to the Lead.</p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Pending Access" value={String(items.filter((item) => item.sourceType === 'Access Requests' && item.status !== 'Reviewed').length)} status="warning" />
        <KpiTile label="Data Issues" value={String(items.filter((item) => item.sourceType === 'Data Issues').length)} status="danger" />
        <KpiTile label="Metric Requests" value={String(items.filter((item) => item.sourceType === 'Metric Change Requests').length)} status="info" />
        <KpiTile label="Review Due" value={String(items.filter((item) => item.status !== 'Reviewed').length)} status="warning" />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-pill px-4 py-2 text-xs font-bold ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-primary ring-1 ring-border-default hover:bg-surface'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-card border border-border-default bg-white shadow-sm xl:col-span-2">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-bold text-primary">No analytics review items</p>
              <p className="mt-1 text-sm text-text-secondary">The selected queue state is clear.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filtered.map((item) => {
                const asset = analyticsAssets.find((asset) => asset.id === item.assetId);
                return (
                  <button key={item.id} onClick={() => setSelectedId(item.id)} className={`flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface ${selected?.id === item.id ? 'bg-orange-50/70' : ''}`}>
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">{item.id}</span>
                      <p className="mt-1 font-bold text-primary">{item.queueReason}</p>
                      <p className="text-sm text-text-secondary">{asset?.title || item.assetId} / Owner: {item.owner}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={item.reviewDue} />
                      <StatusPill status={item.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <LeadReviewActionPanel
          item={selected}
          onApproveAccess={approveAccess}
          onRejectAccess={rejectAccess}
          onMarkReviewed={(item) => updateItem(item.id, 'Reviewed')}
          onMetricUpdate={(item) => updateItem(item.id, 'Update Required')}
          onDataCorrection={(item) => updateItem(item.id, 'Correction Requested')}
        />
      </div>
    </div>
  );
}

export function AnalyticsExecutiveSignalPage() {
  const navigate = useNavigate();
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const isLoading = false;
  const noData = executiveAnalyticsSignals.length === 0;
  const highRisk = Number(executiveAnalyticsSignals.find((signal) => signal.id === 'SIG-ANL-9004')?.value || 0) > 0 || Number(executiveAnalyticsSignals.find((signal) => signal.id === 'SIG-ANL-9005')?.value || 0) > 0;

  const inspectSignal = (signal: ExecutiveAnalyticsSignalRecord) => {
    setSelectedSignal(signal.id);
    if (signal.id === 'SIG-ANL-9003') navigate('/analytics/review');
    if (signal.id === 'SIG-ANL-9004') navigate('/analytics/review');
    if (signal.id === 'SIG-ANL-9005') toast.info('High-risk signal opened in prototype state.');
  };

  if (isLoading) return <AnalyticsSignalsLoadingState />;

  if (noData) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Analytics Signals</h1>
          <p className="mt-2 text-text-secondary">Aggregate usage, access demand, data-quality issues, high-risk insight signals, and insight-linked work.</p>
        </header>
        <div className="rounded-card border border-dashed border-border-default bg-white py-16 text-center">
          <p className="font-bold text-primary">No analytics signals yet</p>
          <p className="mt-1 text-sm text-text-secondary">Signal records will appear here when prototype data is available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-primary"><BarChart3 size={28} /> Analytics Signals</h1>
        <p className="mt-2 max-w-4xl text-text-secondary">Aggregate usage, access demand, data-quality issues, high-risk insight signals, and insight-linked work across Analytics Discovery.</p>
      </header>

      {highRisk && (
        <div className="mb-6 rounded-card border border-danger/20 bg-danger-surface px-5 py-4 text-sm font-semibold text-danger-text">
          High-risk analytics signals are active. Review SLA risk and pending data-quality issues.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {executiveAnalyticsSignals.map((signal) => (
          <button key={signal.id} onClick={() => inspectSignal(signal)} className={`rounded-card border p-4 text-left shadow-sm transition-all hover:border-secondary ${selectedSignal === signal.id ? 'border-secondary ring-2 ring-secondary/20' : 'border-border-default bg-white'}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{signal.signal}</p>
            <p className="mt-3 text-2xl font-bold text-primary">{signal.value}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <StatusPill status={signal.status} />
              <span className="text-[11px] font-semibold text-text-muted">{signal.linksTo}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AnalyticsUsageByTypeCard selectedType={selectedType} onSelect={setSelectedType} />
        <div className="space-y-6">
          <InsightLinkedWorkCard />
          <AccessDemandCard onOpen={() => navigate('/analytics/review')} />
          <DataQualityIssueCard onOpen={() => navigate('/analytics/review')} />
          <HighRiskInsightCard onOpen={() => toast.info('High-risk signal opened in prototype state.')} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LeadReviewHealthTable onRowOpen={(item) => {
          if (item.id) navigate('/analytics/review');
          else toast.info('Lead review item opened in prototype state.');
        }} />
        <MostUsedAnalyticsTable />
      </div>
    </div>
  );
}

function AnalyticsCard({
  asset,
  onOpenDetail,
  onOpenDashboard,
  onRequestAccess
}: {
  asset: AnalyticsAsset;
  onOpenDetail: () => void;
  onOpenDashboard: () => void;
  onRequestAccess: () => void;
}) {
  const available = asset.permission === 'Available';
  return (
    <article onClick={onOpenDetail} className="flex min-h-[360px] cursor-pointer flex-col rounded-card border border-border-default bg-white p-6 shadow-sm shadow-navy-100/40 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-primary">
          <BarChart3 size={21} />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <AnalyticsTypeBadge type={asset.type} />
          <PermissionBadge permission={asset.permission} />
        </div>
      </div>

      <MonoId value={asset.id} />
      <h2 className="mt-2 text-lg font-bold text-primary">{asset.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">{asset.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {asset.metricChips.map((metric) => <MetricChip key={metric} value={metric} />)}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <CardFact icon={<RefreshCw size={13} />} label="Update" value={asset.updateFrequency} />
        <CardFact icon={<UserRound size={13} />} label="Audience" value={asset.audience} />
        <CardFact icon={<ShieldCheck size={13} />} label="Scope" value={asset.dataScope} />
        <CardFact icon={<Clock3 size={13} />} label="Owner" value={asset.owner} />
      </div>

      <p className="mt-3 text-xs font-semibold text-text-muted">Last refreshed: {asset.lastRefreshed}</p>

      <div className="mt-auto grid grid-cols-1 gap-2 border-t border-border-subtle pt-4 sm:grid-cols-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            available ? onOpenDashboard() : onRequestAccess();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-button bg-secondary px-3 py-2.5 text-xs font-bold text-white hover:bg-orange-600"
        >
          {available ? 'Open Dashboard' : 'Request Access'}
          {available ? <ArrowRight size={14} /> : <Lock size={14} />}
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetail();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-button border border-border-default px-3 py-2.5 text-xs font-bold text-primary hover:bg-surface"
        >
          <Eye size={14} />
          View Details
        </button>
      </div>
    </article>
  );
}

function LeadReviewActionPanel({
  item,
  onApproveAccess,
  onRejectAccess,
  onMarkReviewed,
  onMetricUpdate,
  onDataCorrection
}: {
  item?: LeadReviewQueueRecord;
  onApproveAccess: (item: LeadReviewQueueRecord) => void;
  onRejectAccess: (item: LeadReviewQueueRecord, reason: string) => void;
  onMarkReviewed: (item: LeadReviewQueueRecord) => void;
  onMetricUpdate: (item: LeadReviewQueueRecord) => void;
  onDataCorrection: (item: LeadReviewQueueRecord) => void;
}) {
  const [note, setNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  if (!item) {
    return (
      <aside className="rounded-card border border-border-default bg-white p-6 shadow-sm">
        <p className="text-sm text-text-muted">Select a review item to inspect it.</p>
      </aside>
    );
  }
  const asset = analyticsAssets.find((asset) => asset.id === item.assetId);
  return (
    <aside className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <MonoId value={item.id} />
          <h2 className="mt-2 text-xl font-bold text-primary">{item.queueReason}</h2>
          <p className="mt-1 text-sm text-text-secondary">{asset?.title || item.assetId}</p>
        </div>
        <StatusPill status={item.status} />
      </div>
      <div className="space-y-3">
        <DetailFact label="Owner" value={item.owner} />
        <DetailFact label="Review due" value={item.reviewDue} />
        <DetailFact label="Source" value={item.sourceType} />
      </div>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-primary">Lead note</span>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-[88px] w-full rounded-button border border-border-default px-3 py-2 text-sm" placeholder="Add review note" />
      </label>
      {item.sourceType === 'Access Requests' && (
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-primary">Reject reason</span>
          <input value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} className="h-10 w-full rounded-button border border-border-default px-3 text-sm" placeholder="Required when rejecting access" />
        </label>
      )}
      <div className="mt-5 space-y-2">
        {item.sourceType === 'Access Requests' && (
          <>
            <button onClick={() => onApproveAccess(item)} className="w-full rounded-button bg-success/10 px-4 py-2.5 text-sm font-bold text-success hover:bg-success/20">Approve Access</button>
            <button onClick={() => onRejectAccess(item, rejectReason)} className="w-full rounded-button bg-danger-surface px-4 py-2.5 text-sm font-bold text-danger-text hover:bg-danger/20">Reject Access</button>
          </>
        )}
        <button onClick={() => onMetricUpdate(item)} className="w-full rounded-button border border-border-default px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface">Request Metric Update</button>
        <button onClick={() => onDataCorrection(item)} className="w-full rounded-button border border-border-default px-4 py-2.5 text-sm font-bold text-primary hover:bg-surface">Request Data Correction</button>
        <button onClick={() => onMarkReviewed(item)} className="w-full rounded-button bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600">Mark Reviewed</button>
      </div>
    </aside>
  );
}

function AnalyticsUsageByTypeCard({ selectedType, onSelect }: { selectedType: string | null; onSelect: (type: string) => void }) {
  const relatedAssets = selectedType ? analyticsAssets.filter((asset) => asset.type === selectedType).slice(0, 3) : [];
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-primary">Analytics Usage By Type</h2>
      <div className="space-y-3">
        {usageByTypeRecords.map((record) => (
          <button key={record.type} onClick={() => onSelect(record.type)} className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left ${selectedType === record.type ? 'border-secondary bg-orange-50' : 'border-border-subtle hover:border-secondary'}`}>
            <div>
              <p className="font-bold text-primary">{record.type}</p>
              <p className="text-xs text-text-muted">{record.opened} opens / trend {record.trend}</p>
            </div>
            <StatusPill status={record.risk} />
          </button>
        ))}
      </div>
      {relatedAssets.length > 0 && (
        <div className="mt-5 rounded-lg bg-surface p-4">
          <p className="mb-3 text-sm font-bold text-primary">Related sample assets</p>
          <div className="space-y-2">
            {relatedAssets.map((asset) => <Link key={asset.id} to={`/marketplaces/analytics/${asset.id}`} className="block text-sm font-semibold text-primary hover:underline">{asset.id} - {asset.title}</Link>)}
          </div>
        </div>
      )}
    </section>
  );
}

function InsightLinkedWorkCard() {
  return (
    <section className="rounded-card border border-border-default bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-primary">Insight-Linked Work</h2>
      <div className="grid grid-cols-2 gap-3">
        {insightLinkedWorkSummary.map((item) => (
          <div key={item.type} className="rounded-lg bg-surface px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{item.type}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{item.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccessDemandCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-full rounded-card border border-warning/20 bg-warning-surface p-5 text-left shadow-sm hover:border-warning">
      <h2 className="text-lg font-bold text-primary">Access Demand</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailFact label="Pending access" value="4" />
        <DetailFact label="Approval SLA" value="1 business day" />
        <DetailFact label="Top restricted asset" value="CEO Enterprise Dashboard" />
      </div>
    </button>
  );
}

function DataQualityIssueCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-full rounded-card border border-danger/20 bg-danger-surface p-5 text-left shadow-sm hover:border-danger">
      <h2 className="text-lg font-bold text-primary">Data Quality Issues</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailFact label="Pending issues" value="2" />
        <DetailFact label="Highest severity" value="High" />
        <DetailFact label="Affected asset" value="SLA Dashboard" />
      </div>
    </button>
  );
}

function HighRiskInsightCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="w-full rounded-card border border-danger/20 bg-white p-5 text-left shadow-sm hover:border-danger">
      <h2 className="text-lg font-bold text-primary">High-Risk Insights</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['SLA risk', 'Governance exposure', 'Outcome delay', 'Closure quality'].map((label, index) => (
          <div key={label} className="rounded-lg bg-surface px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
            <p className="mt-2 text-xl font-bold text-primary">{index === 0 ? '5' : index + 1}</p>
          </div>
        ))}
      </div>
    </button>
  );
}

function LeadReviewHealthTable({ onRowOpen }: { onRowOpen: (item: LeadReviewQueueRecord) => void }) {
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-primary">Lead Review Health</h2>
      <div className="overflow-hidden rounded-lg border border-border-subtle">
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              {['Queue reason', 'Owner', 'Due', 'Status'].map((heading) => <th key={heading} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">{heading}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {leadReviewQueueRecords.map((item) => (
              <tr key={item.id} onClick={() => onRowOpen(item)} className="cursor-pointer hover:bg-surface/60">
                <td className="px-4 py-3 font-bold text-primary">{item.queueReason}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{item.owner}</td>
                <td className="px-4 py-3"><StatusPill status={item.reviewDue} /></td>
                <td className="px-4 py-3"><StatusPill status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MostUsedAnalyticsTable() {
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-primary">Most-Used Analytics</h2>
      <div className="space-y-3">
        {mostUsedAnalyticsRecords.map((record) => {
          const asset = analyticsAssets.find((item) => item.id === record.assetId);
          return (
            <Link key={record.assetId} to={`/marketplaces/analytics/${record.assetId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-subtle px-4 py-3 hover:border-secondary">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{record.assetId}</span>
                <p className="mt-1 font-bold text-primary">{asset?.title || record.assetId}</p>
                <p className="text-xs text-text-muted">{asset?.type}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-pill bg-surface px-2.5 py-1 text-xs font-bold text-text-secondary">{record.opened} opens</span>
                <span className="rounded-pill bg-surface px-2.5 py-1 text-xs font-bold text-text-secondary">{record.linkedWork} links</span>
                <StatusPill status={record.feedbackState} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AnalyticsSignalsLoadingState() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-28 animate-pulse rounded-card bg-white" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-card bg-white" />)}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-card bg-white" />
        <div className="h-96 animate-pulse rounded-card bg-white" />
      </div>
    </div>
  );
}

function AnalyticsDetailHero({ asset, detail }: { asset: AnalyticsAsset; detail: AnalyticsDetailRecord }) {
  return (
    <section className="mb-8 rounded-card border border-border-default bg-white p-8 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-text-muted">
        <Link to="/marketplaces/analytics" className="font-semibold text-primary hover:underline">Stage 01 Marketplaces</Link>
        <span>/</span>
        <Link to="/marketplaces/analytics" className="font-semibold text-primary hover:underline">Analytics Discovery</Link>
        <span>/</span>
        <span>{asset.title}</span>
      </div>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <AnalyticsTypeBadge type={asset.type} />
            <PermissionBadge permission={asset.permission} />
            <MonoId value={asset.id} />
          </div>
          <h1 className="text-3xl font-bold text-primary">{asset.title}</h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{detail.purpose}</p>
        </div>
        <div className="grid min-w-[320px] grid-cols-2 gap-3 text-sm">
          <DetailFact label="Owner" value={asset.owner} />
          <DetailFact label="Audience" value={asset.audience} />
          <DetailFact label="Data scope" value={asset.dataScope} />
          <DetailFact label="Update" value={asset.updateFrequency} />
          <DetailFact label="Last refreshed" value={asset.lastRefreshed} />
          <DetailFact label="Linked work" value={String(detail.linkedWorkCount)} />
        </div>
      </div>
      <div className="mt-5 rounded-lg bg-surface px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Recommended destination</p>
        <p className="mt-1 font-mono text-sm font-semibold text-primary">{detail.destination}</p>
      </div>
    </section>
  );
}

function AccessPermissionPanel({ asset, detail }: { asset: AnalyticsAsset; detail: AnalyticsDetailRecord }) {
  const restricted = asset.permission === 'Restricted';
  const approval = asset.permission === 'Requires Approval';
  return (
    <AnalyticsInfoCard title="Access / Permission" icon={<Lock size={18} className="text-primary" />}>
      {(restricted || approval) && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-semibold ${restricted ? 'border-danger/20 bg-danger-surface text-danger-text' : 'border-warning/20 bg-warning-surface text-warning-text'}`}>
          {restricted ? 'This analytics asset is restricted for the current prototype context.' : 'This analytics asset requires an access reason and Lead approval before opening.'}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DetailFact label="Access status" value={detail.permission} />
        <DetailFact label="Eligible audience" value={asset.audience} />
        <DetailFact label="Approval owner" value="Lead" />
        <DetailFact label="Access SLA" value={approval ? '1 business day' : restricted ? '2 business days' : 'Immediate'} />
        <DetailFact label="Reason required" value={asset.permission === 'Available' ? 'No' : 'Yes'} />
        <DetailFact label="Current request state" value={asset.permission === 'Available' ? 'Not required' : approval ? 'Not requested' : 'Restricted'} />
      </div>
    </AnalyticsInfoCard>
  );
}

function RelatedAnalyticsGrid({ currentAsset }: { currentAsset: AnalyticsAsset }) {
  const related = analyticsAssets.filter((asset) => asset.id !== currentAsset.id && (asset.category === currentAsset.category || asset.dataScope === currentAsset.dataScope)).slice(0, 3);
  return (
    <AnalyticsInfoCard title="Related Analytics" icon={<GitBranch size={18} className="text-primary" />}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {related.map((asset) => (
          <Link key={asset.id} to={`/marketplaces/analytics/${asset.id}`} className="rounded-lg border border-border-subtle p-4 hover:border-secondary">
            <MonoId value={asset.id} />
            <p className="mt-2 font-bold text-primary">{asset.title}</p>
            <p className="mt-1 text-xs text-text-muted">{asset.type} / {asset.dataScope}</p>
          </Link>
        ))}
      </div>
    </AnalyticsInfoCard>
  );
}

function AnalyticsFeedbackPanel({
  asset,
  activePersona,
  selectedType,
  onSelect
}: {
  asset: AnalyticsAsset;
  activePersona: any;
  selectedType: string | null;
  onSelect: (type: string) => void;
}) {
  const options = ['Useful', 'Data looks wrong', 'Missing metric', 'Hard to interpret', 'Access issue'];
  const [comment, setComment] = useState('');
  const [missingMetric, setMissingMetric] = useState('');
  const [severity, setSeverity] = useState<FeedbackSeverity>('Low');
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<AnalyticsFeedbackRecord | null>(null);

  const selectOption = (option: string) => {
    onSelect(option);
    setError('');
    setConfirmation(null);
    if (option === 'Useful') setSeverity('Low');
    if (option === 'Data looks wrong') setSeverity('High');
    if (option === 'Missing metric' || option === 'Hard to interpret' || option === 'Access issue') setSeverity('Medium');
  };

  const submit = () => {
    if (!selectedType) {
      setError('Select a feedback option before submitting.');
      return;
    }
    if (['Data looks wrong', 'Hard to interpret', 'Access issue'].includes(selectedType) && !comment.trim()) {
      setError('Comment is required for this feedback type.');
      return;
    }
    if (selectedType === 'Missing metric' && !missingMetric.trim()) {
      setError('Missing metric is required for metric change feedback.');
      return;
    }
    const record: AnalyticsFeedbackRecord = {
      id: `AFB-${Date.now().toString().slice(-4)}`,
      assetId: asset.id,
      feedbackType: selectedType,
      submittedBy: activePersona?.role || activePersona?.name || 'Associate',
      severity,
      status: feedbackStatus(selectedType),
      comment,
      missingMetric
    };
    setConfirmation(record);
    setError('');
    writeStoredAnalyticsFeedback(record);
    writeStoredLeadReviewQueue(feedbackToQueueItem(record));
    toast.success('Analytics feedback submitted in prototype state.');
  };

  return (
    <AnalyticsInfoCard title="Analytics Feedback" icon={<MessageSquare size={18} className="text-primary" />}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button key={option} onClick={() => selectOption(option)} className={`rounded-pill px-3 py-2 text-xs font-bold ${selectedType === option ? 'bg-primary text-white' : 'border border-border-default bg-white text-primary hover:bg-surface'}`}>
            {option}
          </button>
        ))}
      </div>
      {selectedType === 'Missing metric' && (
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-primary">Missing metric</span>
          <input value={missingMetric} onChange={(event) => setMissingMetric(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm" placeholder="Name the missing metric" />
        </label>
      )}
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-primary">Comment</span>
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="min-h-[96px] w-full rounded-button border border-border-default px-3 py-2 text-sm" placeholder={selectedType ? `Add context for: ${selectedType}` : 'Add feedback context'} />
      </label>
      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-primary">Severity</span>
        <select value={severity} onChange={(event) => setSeverity(event.target.value as FeedbackSeverity)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
          {['Low', 'Medium', 'High'].map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text-secondary">Routed owner: Lead</p>
      {error && <p className="mt-3 rounded-lg bg-danger-surface px-3 py-2 text-sm font-semibold text-danger-text">{error}</p>}
      {confirmation && <FeedbackConfirmationCard record={confirmation} />}
      <div className="mt-3 flex justify-end">
        <button onClick={submit} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Submit Feedback</button>
      </div>
    </AnalyticsInfoCard>
  );
}

function FeedbackConfirmationCard({ record }: { record: AnalyticsFeedbackRecord }) {
  return (
    <section className="mt-4 rounded-card border border-success/20 bg-success-surface p-4">
      <h3 className="font-bold text-primary">Feedback submitted</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailFact label="Feedback ID" value={record.id} />
        <DetailFact label="Status" value={record.status} />
        <DetailFact label="Routed owner" value="Lead" />
        <DetailFact label="Review due" value={record.severity === 'High' ? 'Due today' : 'Due in 3 days'} />
      </div>
    </section>
  );
}

function AnalyticsActionRail({
  asset,
  onOpenDashboard,
  onRequestAccess,
  onLinkInsight,
  onCreateFollowUp,
  onShare,
  onReportIssue,
  onMetricChange
}: {
  asset: AnalyticsAsset;
  onOpenDashboard: () => void;
  onRequestAccess: () => void;
  onLinkInsight: (type: string) => void;
  onCreateFollowUp: () => void;
  onShare: () => void;
  onReportIssue: () => void;
  onMetricChange: () => void;
}) {
  const primaryAvailable = asset.permission === 'Available';
  const actions = [
    { label: 'Link Insight to Task', icon: Link2, run: () => onLinkInsight('Task') },
    { label: 'Link Insight to Request', icon: Link2, run: () => onLinkInsight('Request') },
    { label: 'Link Insight to Review', icon: Link2, run: () => onLinkInsight('Review') },
    { label: 'Link Insight to Decision', icon: Link2, run: () => onLinkInsight('Decision') },
    { label: 'Create Follow-up Task', icon: PlusCircle, run: onCreateFollowUp },
    { label: 'Share Summary', icon: Share2, run: onShare },
    { label: 'Report Data Issue', icon: AlertCircle, run: onReportIssue },
    { label: 'Request Metric Change', icon: BarChart3, run: onMetricChange }
  ];
  return (
    <aside className="xl:col-span-4">
      <div className="sticky top-[88px] rounded-card border border-border-default bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">Analytics actions</h2>
        <button onClick={primaryAvailable ? onOpenDashboard : onRequestAccess} className="mb-3 flex w-full items-center justify-center gap-2 rounded-button bg-secondary px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">
          {primaryAvailable ? <BarChart3 size={16} /> : <Lock size={16} />}
          {primaryAvailable ? 'Open Dashboard' : 'Request Access'}
        </button>
        <div className="space-y-2">
          {actions.map(({ label, icon: Icon, run }) => (
            <button key={label} onClick={run} className="flex w-full items-center gap-3 rounded-button border border-border-default px-3 py-2.5 text-left text-sm font-bold text-primary hover:bg-surface">
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function AnalyticsAccessRequestFlow({
  asset,
  activePersona,
  onClose,
  onApproved
}: {
  asset: AnalyticsAsset;
  activePersona: any;
  onClose: () => void;
  onApproved: () => void;
}) {
  const existingRequest = getStoredAnalyticsAccessRequest(asset.id) || analyticsAccessRequests.find((request) => request.assetId === asset.id);
  const [request, setRequest] = useState<AnalyticsAccessRequestRecord | undefined>(existingRequest);
  const [reason, setReason] = useState(existingRequest?.status === 'Rejected' ? '' : existingRequest?.reason || '');
  const [requestedAudience, setRequestedAudience] = useState(existingRequest?.requestedAudience || audienceForPersona(activePersona?.id));
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!existingRequest || existingRequest.status === 'Rejected');
  const isLoading = false;

  if (isLoading) {
    return (
      <PrototypeModal title="Request Analytics Access" onClose={onClose}>
        <div className="h-28 animate-pulse rounded-card bg-surface" />
        <div className="mt-4 h-32 animate-pulse rounded-card bg-surface" />
      </PrototypeModal>
    );
  }

  const submit = () => {
    if (!reason.trim()) {
      setError('Reason is required to request analytics access.');
      return;
    }
    const nextRequest: AnalyticsAccessRequestRecord = {
      id: 'ARQ-3005',
      assetId: asset.id,
      assetTitle: asset.title,
      requestedBy: activePersona?.role || activePersona?.name || 'Associate',
      reason: reason.trim(),
      approvalOwner: 'Lead',
      sla: asset.dataScope === 'Enterprise' ? '2 business days' : '1 business day',
      status: 'Pending',
      requestedAudience,
      rejectionReason: undefined
    };
    setError('');
    setRequest(nextRequest);
    setIsEditing(false);
    writeStoredAnalyticsAccessRequest(nextRequest);
    toast.success('Access request submitted in prototype state.');
  };

  const approveInPrototype = () => {
    if (!request) return;
    const approved = { ...request, status: 'Approved' as AccessRequestStatus };
    setRequest(approved);
    writeStoredAnalyticsAccessRequest(approved);
    onApproved();
    toast.success('Analytics access approved in prototype state.');
  };

  const rejectInPrototype = () => {
    if (!request) return;
    const rejected = {
      ...request,
      status: 'Rejected' as AccessRequestStatus,
      rejectionReason: 'Prototype lead rejected this request pending clearer business context.'
    };
    setRequest(rejected);
    writeStoredAnalyticsAccessRequest(rejected);
    toast.warning('Analytics access request rejected in prototype state.');
  };

  const resetRejected = () => {
    setReason('');
    setError('');
    setIsEditing(true);
  };

  return (
    <PrototypeModal title="Request Analytics Access" onClose={onClose}>
      <AccessRequestContextBanner asset={asset} />

      {request && !isEditing ? (
        <AccessRequestConfirmation
          request={request}
          asset={asset}
          onClose={onClose}
          onRequestAgain={resetRejected}
          onApprove={approveInPrototype}
          onReject={rejectInPrototype}
        />
      ) : (
        <>
          <label className="mt-5 block space-y-2">
            <span className="text-sm font-bold text-primary">Request reason <span className="text-danger">*</span></span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={`min-h-[120px] w-full rounded-button border px-3 py-2 text-sm ${error ? 'border-danger' : 'border-border-default'}`}
              placeholder="Explain why this analytics asset is needed"
            />
            {error && <span className="text-xs font-semibold text-danger">{error}</span>}
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-primary">Requested audience</span>
            <select value={requestedAudience} onChange={(event) => setRequestedAudience(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
              {['Associate', 'Lead', 'Workspace Admin', 'Executives'].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>

          <AccessApprovalPanel asset={asset} requestedAudience={requestedAudience} />

          <div className="mt-6 flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button onClick={onClose} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Cancel</button>
            <button onClick={submit} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Submit Access Request</button>
          </div>
        </>
      )}
    </PrototypeModal>
  );
}

function AccessRequestContextBanner({ asset }: { asset: AnalyticsAsset }) {
  return (
    <section className="rounded-card border border-border-default bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <MonoId value={asset.id} />
          <h3 className="mt-2 text-lg font-bold text-primary">{asset.title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{asset.type}</p>
        </div>
        <PermissionBadge permission={asset.permission} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailFact label="Audience" value={asset.audience} />
        <DetailFact label="Data scope" value={asset.dataScope} />
        <DetailFact label="Owner" value={asset.owner} />
      </div>
    </section>
  );
}

function AccessApprovalPanel({ asset, requestedAudience }: { asset: AnalyticsAsset; requestedAudience: string }) {
  return (
    <section className="mt-4 rounded-card border border-border-default bg-white p-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-muted">Approval path</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailFact label="Approval owner" value="Lead" />
        <DetailFact label="Access SLA" value={asset.dataScope === 'Enterprise' ? '2 business days' : '1 business day'} />
        <DetailFact label="Reason requirement" value="Required" />
        <DetailFact label="Expected next state" value="Pending Lead review" />
        <DetailFact label="Requested audience" value={requestedAudience} />
        <DetailFact label="Sensitivity" value={asset.dataScope === 'Enterprise' ? 'Enterprise aggregate' : `${asset.dataScope} analytics`} />
      </div>
      <p className="mt-3 rounded-lg bg-warning-surface px-3 py-2 text-xs font-semibold text-warning-text">
        Access may expose governed operational signals. Use only for the stated review or decision context.
      </p>
    </section>
  );
}

function AccessRequestConfirmation({
  request,
  asset,
  onClose,
  onRequestAgain,
  onApprove,
  onReject
}: {
  request: AnalyticsAccessRequestRecord;
  asset: AnalyticsAsset;
  onClose: () => void;
  onRequestAgain: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const approved = request.status === 'Approved';
  const rejected = request.status === 'Rejected';
  return (
    <section className={`mt-5 rounded-card border p-5 ${approved ? 'border-success/20 bg-success-surface' : rejected ? 'border-danger/20 bg-danger-surface' : 'border-info/20 bg-info-surface'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-primary">{approved ? 'Access approved' : rejected ? 'Access request rejected' : 'Access request submitted'}</h3>
          <p className="mt-1 text-sm text-text-secondary">{approved ? 'This asset can now be opened in prototype state.' : rejected ? request.rejectionReason : 'Lead review is pending.'}</p>
        </div>
        <StatusPill status={request.status} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailFact label="Request ID" value={request.id} />
        <DetailFact label="Status" value={request.status} />
        <DetailFact label="Approval owner" value={request.approvalOwner} />
        <DetailFact label="SLA" value={request.sla} />
        <DetailFact label="Requested audience" value={request.requestedAudience} />
        <DetailFact label="Next action" value={approved ? 'Open Dashboard' : rejected ? 'Request Again' : 'Wait for Lead review'} />
      </div>
      <p className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-sm text-text-secondary">{request.reason}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        {approved && <button onClick={() => { onApprove(); onClose(); }} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Open Dashboard</button>}
        {rejected && <button onClick={onRequestAgain} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Request Again</button>}
        {!approved && !rejected && (
          <>
            <button onClick={onApprove} className="rounded-button border border-success/30 bg-white px-4 py-2 text-sm font-bold text-success hover:bg-success/10">Approve in Prototype</button>
            <button onClick={onReject} className="rounded-button border border-danger/30 bg-white px-4 py-2 text-sm font-bold text-danger hover:bg-danger/10">Reject in Prototype</button>
          </>
        )}
        <button onClick={onClose} className="rounded-button border border-border-default bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Close</button>
      </div>
    </section>
  );
}

function InsightLinkFlow({ targetType, asset, onClose }: { targetType: string; asset: AnalyticsAsset; onClose: () => void }) {
  const [activeType, setActiveType] = useState(targetType as keyof typeof linkTargets);
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [note, setNote] = useState(defaultInsightNote(asset));
  const [error, setError] = useState('');
  const [linkedRecord, setLinkedRecord] = useState<{ id: string; target: string; status: string } | null>(null);
  const isLoading = false;
  const targets = linkTargets[activeType] || [];

  const submit = () => {
    const selectedTarget = targets.find((target) => target.id === selectedTargetId);
    if (!selectedTarget) {
      setError('Select a target before linking this insight.');
      return;
    }
    const id = `LIN-${Date.now().toString().slice(-4)}`;
    setLinkedRecord({ id, target: `${selectedTarget.id} - ${selectedTarget.title}`, status: 'Linked' });
    setError('');
    writeStoredLinkedInsight({
      id,
      assetId: asset.id,
      linkedItem: `${selectedTarget.id} - ${selectedTarget.title}`,
      type: activeType,
      insightNote: note,
      status: 'Linked'
    });
    toast.success('Insight linked in prototype state.');
  };

  return (
    <PrototypeModal title="Link Insight to Work" onClose={onClose} widthClass="max-w-[760px]">
      <AnalyticsInsightContextBanner asset={asset} />
      {linkedRecord ? (
        <LinkConfirmationCard record={linkedRecord} onClose={onClose} />
      ) : (
        <>
          <TargetTypeTabs activeType={activeType} onChange={(type) => { setActiveType(type); setSelectedTargetId(''); setError(''); }} />
          {isLoading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-card bg-surface" />)}
            </div>
          ) : targets.length > 0 ? (
            <LinkTargetList targets={targets} selectedId={selectedTargetId} onSelect={setSelectedTargetId} />
          ) : (
            <div className="mt-4 rounded-card border border-dashed border-border-default bg-white p-8 text-center">
              <p className="font-bold text-primary">No link targets available</p>
              <p className="mt-1 text-sm text-text-secondary">Create a follow-up task instead.</p>
              <button className="mt-4 rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white">Create Follow-up Task</button>
            </div>
          )}
          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-primary">Insight note</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-[96px] w-full rounded-button border border-border-default px-3 py-2 text-sm" placeholder="Attach an optional insight note" />
          </label>
          {error && <p className="mt-3 rounded-lg bg-danger-surface px-3 py-2 text-sm font-semibold text-danger-text">{error}</p>}
          <div className="mt-6 flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button onClick={onClose} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Cancel</button>
            <button onClick={submit} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Link Insight</button>
          </div>
        </>
      )}
    </PrototypeModal>
  );
}

function FollowUpTaskFlow({ asset, onClose }: { asset: AnalyticsAsset; onClose: () => void }) {
  const seed = followUpTaskRecords.find((record) => record.assetId === asset.id);
  const [title, setTitle] = useState(seed?.taskTitle || `Follow up on ${asset.title}`);
  const [recommendedAction, setRecommendedAction] = useState(defaultRecommendedAction(asset));
  const [owner, setOwner] = useState(seed?.owner || (asset.audience === 'Associate' ? 'Associate' : 'Lead'));
  const [dueDate, setDueDate] = useState(seed?.due || 'Due in 2 days');
  const [priority, setPriority] = useState('Medium');
  const [createdTask, setCreatedTask] = useState<{ id: string; status: string; linksTo: string } | null>(null);

  const createTask = () => {
    const linkedInsightId = linkedInsightRecords.find((record) => record.assetId === asset.id)?.id || `LIN-${Date.now().toString().slice(-4)}`;
    const task = {
      id: `TSK-ANL-${Date.now().toString().slice(-3)}`,
      status: 'Created',
      linksTo: linkedInsightId
    };
    setCreatedTask(task);
    writeStoredFollowUpTask({
      id: task.id,
      assetId: asset.id,
      taskTitle: title,
      owner,
      due: dueDate,
      status: task.status,
      linksTo: linkedInsightId
    });
    toast.success('Follow-up task created in prototype state.');
  };

  return (
    <PrototypeModal title="Create Follow-up Task" onClose={onClose} widthClass="max-w-[760px]">
      <AnalyticsInsightContextBanner asset={asset} />
      {createdTask ? (
        <FollowUpTaskConfirmation task={createdTask} owner={owner} dueDate={dueDate} onClose={onClose} />
      ) : (
        <>
          <section className="mt-5 rounded-card border border-border-default bg-white p-4">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-primary">Suggested task title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm" />
            </label>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-primary">Recommended action</span>
              <textarea value={recommendedAction} onChange={(event) => setRecommendedAction(event.target.value)} className="min-h-[96px] w-full rounded-button border border-border-default px-3 py-2 text-sm" />
            </label>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-bold text-primary">Owner</span>
                <select value={owner} onChange={(event) => setOwner(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
                  {['Associate', 'Lead', 'Unit Lead'].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-primary">Due date</span>
                <select value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
                  {['Due tomorrow', 'Due in 1 day', 'Due in 2 days', 'Due this week'].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-primary">Priority</span>
                <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
                  {['Low', 'Medium', 'High', 'Critical'].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>
            <DetailFact label="Linked analytics asset" value={`${asset.id} - ${asset.title}`} />
          </section>
          <div className="mt-6 flex justify-end gap-3 border-t border-border-subtle pt-4">
            <button onClick={onClose} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Cancel</button>
            <button onClick={createTask} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Create Task</button>
          </div>
        </>
      )}
    </PrototypeModal>
  );
}

function AnalyticsInsightContextBanner({ asset }: { asset: AnalyticsAsset }) {
  const primaryMetric = asset.metrics[0] || 'Insight signal';
  const sourceObject = sourceObjectsForAsset(asset)[0] || 'Tasks';
  return (
    <section className="rounded-card border border-border-default bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <MonoId value={asset.id} />
          <h3 className="mt-2 text-lg font-bold text-primary">{asset.title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{primaryMetric}: {defaultInsightNote(asset)}</p>
        </div>
        <PermissionBadge permission={asset.permission} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailFact label="Metric / insight" value={primaryMetric} />
        <DetailFact label="Source object" value={sourceObject} />
        <DetailFact label="Data scope" value={asset.dataScope} />
      </div>
    </section>
  );
}

function TargetTypeTabs({ activeType, onChange }: { activeType: keyof typeof linkTargets; onChange: (type: keyof typeof linkTargets) => void }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2 border-b border-border-default pb-3">
      {(Object.keys(linkTargets) as Array<keyof typeof linkTargets>).map((type) => (
        <button key={type} onClick={() => onChange(type)} className={`rounded-button px-4 py-2 text-sm font-bold ${activeType === type ? 'bg-primary text-white' : 'bg-white text-primary ring-1 ring-border-default hover:bg-surface'}`}>
          {type}
        </button>
      ))}
    </div>
  );
}

function LinkTargetList({
  targets,
  selectedId,
  onSelect
}: {
  targets: Array<{ id: string; title: string; type: string; status: string; owner: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4 space-y-3">
      {targets.map((target) => (
        <button key={target.id} onClick={() => onSelect(target.id)} className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-card border px-4 py-3 text-left ${selectedId === target.id ? 'border-secondary bg-orange-50' : 'border-border-default bg-white hover:border-secondary'}`}>
          <div>
            <span className="font-mono text-xs font-bold text-primary">{target.id}</span>
            <p className="mt-1 font-bold text-primary">{target.title}</p>
            <p className="text-xs text-text-muted">{target.type} / Owner: {target.owner}</p>
          </div>
          <StatusPill status={target.status} />
        </button>
      ))}
    </div>
  );
}

function LinkConfirmationCard({ record, onClose }: { record: { id: string; target: string; status: string }; onClose: () => void }) {
  return (
    <section className="mt-5 rounded-card border border-success/20 bg-success-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-primary">Insight linked</h3>
          <p className="mt-1 text-sm text-text-secondary">The insight was linked to the selected work item in prototype state.</p>
        </div>
        <StatusPill status={record.status} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailFact label="Linked insight ID" value={record.id} />
        <DetailFact label="Target item" value={record.target} />
        <DetailFact label="Status" value={record.status} />
      </div>
      <button onClick={onClose} className="mt-5 w-full rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Done</button>
    </section>
  );
}

function FollowUpTaskConfirmation({ task, owner, dueDate, onClose }: { task: { id: string; status: string; linksTo: string }; owner: string; dueDate: string; onClose: () => void }) {
  return (
    <section className="mt-5 rounded-card border border-success/20 bg-success-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-primary">Follow-up task created</h3>
          <p className="mt-1 text-sm text-text-secondary">The generated task is linked to the analytics insight in prototype state.</p>
        </div>
        <StatusPill status={task.status} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DetailFact label="Generated task ID" value={task.id} />
        <DetailFact label="Status" value={task.status} />
        <DetailFact label="Owner" value={owner} />
        <DetailFact label="Due date" value={dueDate} />
        <DetailFact label="Linked insight ID" value={task.linksTo} />
      </div>
      <button onClick={onClose} className="mt-5 w-full rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Done</button>
    </section>
  );
}

function PrototypeModal({ title, children, onClose, widthClass = 'max-w-xl' }: { title: string; children: React.ReactNode; onClose: () => void; widthClass?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-modal bg-white p-6 shadow-xl ${widthClass}`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <button onClick={onClose} className="rounded-button border border-border-default px-3 py-1.5 text-xs font-bold text-primary hover:bg-surface">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AnalyticsTypeBadge({ type }: { type: string }) {
  return <span className="rounded-pill bg-navy-100 px-2.5 py-1 text-xs font-bold text-primary">{type}</span>;
}

function PermissionBadge({ permission }: { permission: AnalyticsPermission }) {
  const classes = {
    Available: 'bg-success-surface text-success-text',
    Restricted: 'bg-danger-surface text-danger-text',
    'Requires Approval': 'bg-warning-surface text-warning-text'
  }[permission];
  return <span className={`rounded-pill px-2.5 py-1 text-xs font-bold ${classes}`}>{permission}</span>;
}

function MetricChip({ value }: { value: string }) {
  return <span className="rounded-pill border border-border-subtle bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">{value}</span>;
}

function CardFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-2">
      <p className="mb-1 flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-muted">{icon}{label}</p>
      <p className="truncate font-bold text-text-primary">{value}</p>
    </div>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-bold text-text-primary">{value}</p>
    </div>
  );
}

function AnalyticsInfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyAnalyticsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-card border border-dashed border-border-default bg-white py-16 text-center">
      <FilterX size={44} className="mb-4 text-text-muted opacity-50" />
      <h3 className="mb-2 text-lg font-bold text-text-primary">No analytics assets found</h3>
      <p className="mb-6 max-w-md text-sm text-text-secondary">No dashboards, reports, views, or signals match the current search and filters.</p>
      <button onClick={onClear} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-navy-700">
        Clear filters
      </button>
    </div>
  );
}

function AnalyticsLoadingState() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-24 animate-pulse rounded-card bg-white" />
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-card bg-white" />)}
      </div>
      <div className="mb-6 h-16 animate-pulse rounded-card bg-white" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-card bg-white" />)}
      </div>
    </div>
  );
}

function isRecommendedForPersona(asset: AnalyticsAsset, personaId: string) {
  if (personaId === 'associate') return asset.audience === 'Associate' || asset.dataScope === 'Personal';
  if (personaId === 'ceo') return asset.audience === 'Executives' || asset.dataScope === 'Enterprise';
  return asset.audience === 'Lead' || ['Team', 'Unit'].includes(asset.dataScope);
}

function toDashboardPreview(asset: AnalyticsAsset) {
  return {
    id: asset.id,
    title: asset.title,
    audience: asset.audience,
    metrics: asset.metrics,
    questions: [
      'Where is work performance changing?',
      'Which signals need review or intervention?',
      'What should be opened next?'
    ],
    sourceObjects: ['Tasks', 'Requests', 'SLAs', 'Reviews', 'Governance Records'],
    dataScope: asset.dataScope,
    updateFrequency: asset.updateFrequency,
    route: asset.destination
  };
}

function getAnalyticsDetail(asset: AnalyticsAsset): AnalyticsDetailRecord {
  return analyticsDetails.find((detail) => detail.assetId === asset.id) || {
    id: `DET-${asset.id}`,
    assetId: asset.id,
    purpose: asset.description,
    questions: [
      'Which signal needs attention?',
      'What work should be linked to this insight?',
      'Where should the user go next?'
    ],
    metrics: asset.metrics,
    sourceObjects: sourceObjectsForAsset(asset),
    permission: asset.permission,
    destination: asset.destination,
    linkedWorkCount: asset.permission === 'Available' ? 2 : 1,
    dataQuality: asset.permission === 'Restricted' ? 'Warning' : 'Healthy',
    lastReviewed: '2026-05-26',
    reviewDue: '2026-06-26',
    version: 'v1.0'
  };
}

function sourceObjectsForAsset(asset: AnalyticsAsset) {
  if (asset.category === 'SLA') return ['SLAs', 'Escalations', 'Requests', 'Tasks'];
  if (asset.category === 'Governance') return ['Governance Records', 'Evidence Records', 'Approvals'];
  if (asset.category === 'Outcome') return ['Outcome Records', 'Tasks', 'Reviews'];
  if (asset.category === 'Executive') return ['Outcome Records', 'Governance Records', 'SLAs'];
  return ['Tasks', 'Requests', 'SLAs'];
}

function metricDefinition(metric: string) {
  const lower = metric.toLowerCase();
  if (lower.includes('sla') || lower.includes('breach') || lower.includes('ageing')) return 'Measures timeliness, risk exposure, or breach proximity for active work.';
  if (lower.includes('blocker')) return 'Counts unresolved blockers and intervention points affecting delivery flow.';
  if (lower.includes('quality') || lower.includes('evidence')) return 'Tracks closure readiness, evidence completeness, and review confidence.';
  if (lower.includes('governance') || lower.includes('approval')) return 'Highlights exceptions, approvals, and governance records requiring review.';
  if (lower.includes('outcome')) return 'Shows progress against expected delivery outcomes and intervention needs.';
  return 'Prototype metric used to support analytics interpretation and follow-up action.';
}

function metricInterpretation(metric: string) {
  const lower = metric.toLowerCase();
  if (lower.includes('risk') || lower.includes('breach')) return 'Treat rising values as an intervention signal and link the insight to owner follow-up.';
  if (lower.includes('score') || lower.includes('quality')) return 'Low values indicate missing evidence, weak closure notes, or incomplete review state.';
  if (lower.includes('workload')) return 'Use high workload with blocker count to identify owners or teams needing support.';
  return 'Compare trend, scope, and source objects before creating follow-up work.';
}

function scopeBoundary(scope: string) {
  if (scope === 'Personal') return 'Owned or assigned work only.';
  if (scope === 'Team') return 'Team-scoped work, requests, blockers, and reviews.';
  if (scope === 'Unit') return 'Unit aggregate records without personal inbox detail.';
  return 'Enterprise aggregate visibility only.';
}

function applyPermissionOverride(asset: AnalyticsAsset, overrides: Record<string, AnalyticsPermission>) {
  return overrides[asset.id] ? { ...asset, permission: overrides[asset.id] } : asset;
}

function readAnalyticsPermissionOverrides(): Record<string, AnalyticsPermission> {
  try {
    return JSON.parse(localStorage.getItem('analytics_permission_overrides') || '{}');
  } catch {
    return {};
  }
}

function writeAnalyticsPermissionOverrides(overrides: Record<string, AnalyticsPermission>) {
  try {
    localStorage.setItem('analytics_permission_overrides', JSON.stringify(overrides));
  } catch {
    // Prototype state can safely fall back to in-memory state if localStorage is unavailable.
  }
}

function getStoredAnalyticsAccessRequest(assetId: string) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_access_requests') || '[]') as AnalyticsAccessRequestRecord[];
    return records.find((record) => record.assetId === assetId);
  } catch {
    return undefined;
  }
}

function writeStoredAnalyticsAccessRequest(record: AnalyticsAccessRequestRecord) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_access_requests') || '[]') as AnalyticsAccessRequestRecord[];
    const next = [record, ...records.filter((item) => item.assetId !== record.assetId)];
    localStorage.setItem('analytics_access_requests', JSON.stringify(next));
  } catch {
    // Prototype state can safely fall back to component state if localStorage is unavailable.
  }
}

function audienceForPersona(personaId?: string) {
  if (personaId === 'ceo') return 'Executives';
  if (personaId === 'admin') return 'Workspace Admin';
  if (personaId && personaId !== 'associate') return 'Lead';
  return 'Associate';
}

function defaultInsightNote(asset: AnalyticsAsset) {
  const existing = linkedInsightRecords.find((record) => record.assetId === asset.id);
  if (existing) return existing.insightNote;
  if (asset.category === 'SLA') return 'SLA risk needs owner intervention.';
  if (asset.category === 'Governance') return 'Governance signal requires review and evidence follow-up.';
  if (asset.category === 'Outcome') return 'Outcome progress needs an intervention note.';
  return 'Analytics signal should be linked to work for follow-up.';
}

function defaultRecommendedAction(asset: AnalyticsAsset) {
  const existing = followUpTaskRecords.find((record) => record.assetId === asset.id);
  if (existing) return existing.taskTitle;
  if (asset.category === 'SLA') return 'Review SLA exposure, confirm owner, and update the intervention plan.';
  if (asset.category === 'Governance') return 'Review exception details, confirm evidence gaps, and assign closure owner.';
  if (asset.category === 'Outcome') return 'Prepare an outcome recovery action note and link it to the active review.';
  return 'Review the signal, identify the owner, and add an intervention note.';
}

function writeStoredLinkedInsight(record: { id: string; assetId: string; linkedItem: string; type: string; insightNote: string; status: string }) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_linked_insights') || '[]');
    localStorage.setItem('analytics_linked_insights', JSON.stringify([record, ...records]));
  } catch {
    // Prototype state can safely fall back to component state.
  }
}

function writeStoredFollowUpTask(record: { id: string; assetId: string; taskTitle: string; owner: string; due: string; status: string; linksTo: string }) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_followup_tasks') || '[]');
    localStorage.setItem('analytics_followup_tasks', JSON.stringify([record, ...records]));
  } catch {
    // Prototype state can safely fall back to component state.
  }
}

function feedbackStatus(type: string) {
  if (type === 'Useful') return 'Logged';
  if (type === 'Data looks wrong') return 'Pending Review';
  if (type === 'Missing metric') return 'Metric Change Requested';
  if (type === 'Hard to interpret') return 'Update Requested';
  return 'Pending Access Review';
}

function feedbackToQueueItem(record: AnalyticsFeedbackRecord): LeadReviewQueueRecord {
  const sourceType: LeadReviewQueueRecord['sourceType'] =
    record.feedbackType === 'Data looks wrong' ? 'Data Issues' :
    record.feedbackType === 'Missing metric' ? 'Metric Change Requests' :
    record.feedbackType === 'Access issue' ? 'Access Requests' :
    'Usage Feedback';
  const queueReason =
    record.feedbackType === 'Data looks wrong' ? 'Data issue' :
    record.feedbackType === 'Missing metric' ? 'Metric change request' :
    record.feedbackType === 'Access issue' ? 'Access issue' :
    record.feedbackType === 'Hard to interpret' ? 'Interpretation issue' :
    'Usage feedback';
  return {
    id: `LRQ-${Date.now().toString().slice(-4)}`,
    assetId: record.assetId,
    queueReason,
    owner: 'Lead',
    reviewDue: record.severity === 'High' ? 'Due today' : 'Due in 3 days',
    status: record.status,
    sourceType,
    note: record.comment || record.missingMetric
  };
}

function writeStoredAnalyticsFeedback(record: AnalyticsFeedbackRecord) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_feedback_records') || '[]');
    localStorage.setItem('analytics_feedback_records', JSON.stringify([record, ...records]));
  } catch {
    // Prototype state can safely fall back to component state.
  }
}

function readStoredLeadReviewQueue(): LeadReviewQueueRecord[] {
  try {
    return JSON.parse(localStorage.getItem('analytics_lead_review_queue') || '[]');
  } catch {
    return [];
  }
}

function writeStoredLeadReviewQueue(record: LeadReviewQueueRecord) {
  try {
    const records = readStoredLeadReviewQueue();
    localStorage.setItem('analytics_lead_review_queue', JSON.stringify([record, ...records.filter((item) => item.id !== record.id)]));
  } catch {
    // Prototype state can safely fall back to component state.
  }
}

function updateStoredAccessRequestStatus(assetId: string, status: AccessRequestStatus, rejectionReason?: string) {
  try {
    const records = JSON.parse(localStorage.getItem('analytics_access_requests') || '[]') as AnalyticsAccessRequestRecord[];
    const existing = records.find((record) => record.assetId === assetId) || analyticsAccessRequests.find((record) => record.assetId === assetId);
    if (!existing) return;
    const updated = { ...existing, status, rejectionReason };
    const next = [updated, ...records.filter((record) => record.assetId !== assetId)];
    localStorage.setItem('analytics_access_requests', JSON.stringify(next));
  } catch {
    // Prototype state can safely fall back to queue state.
  }
}

function AnalyticsDetailLoadingState() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-56 animate-pulse rounded-card bg-white" />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-card bg-white" />)}
        </div>
        <div className="h-96 animate-pulse rounded-card bg-white xl:col-span-4" />
      </div>
    </div>
  );
}
