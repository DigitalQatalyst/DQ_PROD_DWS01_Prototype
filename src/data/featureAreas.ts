export type HealthStatus = 'Healthy' | 'Needs Attention' | 'At Risk' | 'Recently Updated';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type KpiStatus = 'success' | 'warning' | 'danger' | 'info';

export interface FeatureKpi {
  label: string;
  value: string;
  trend?: string;
  status: KpiStatus;
}

export interface FeatureRecord {
  id: string;
  title: string;
  featureArea: string;
  featureGroup: string;
  feature: string;
  insightCategory?: string;
  owner: string;
  ownerRole: string;
  unit: string;
  status: string;
  priority?: string;
  severity?: string;
  dueDate?: string;
  reviewDate?: string;
  lastUpdated: string;
  evidenceStatus?: string;
  sourceStatus?: string;
  riskLevel: RiskLevel;
  configurationImpact?: string;
  nextAction: string;
  timeline: string[];
  decisionHistory?: string[];
  relatedEvidence: string[];
}

export interface Feature {
  id: string;
  label: string;
  description: string;
  route: string;
  ownerRole: string;
  status: string;
  primaryMetric: string;
  riskLevel: RiskLevel;
  kpis: FeatureKpi[];
  insights: string[];
  actions: FeatureAction[];
  evidence: string[];
  sampleRecords: FeatureRecord[];
}

export interface FeatureAction {
  label: string;
  owner: string;
  dueDate: string;
  status: string;
}

export interface FeatureGroup {
  id: string;
  label: string;
  description: string;
  route: string;
  healthStatus: HealthStatus;
  kpis: FeatureKpi[];
  features: Feature[];
}

export interface FeatureArea {
  id: string;
  label: string;
  route: string;
  description: string;
  kpis: FeatureKpi[];
  prioritySignals: FeatureRecord[];
  featureGroups: FeatureGroup[];
}

interface AreaSpec {
  label: string;
  description: string;
  landingKpis: FeatureKpi[];
  groups: GroupSpec[];
  recordTemplates: RecordTemplate[];
}

interface GroupSpec {
  label: string;
  description: string;
  healthStatus: HealthStatus;
  features: string[];
}

type RecordTemplate = Omit<FeatureRecord, 'featureArea' | 'featureGroup' | 'feature'>;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\//g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const statusCycle = ['Healthy', 'Needs Attention', 'At Risk', 'Recently Updated', 'Healthy'];
const riskCycle: RiskLevel[] = ['Low', 'Medium', 'High', 'Medium', 'Low'];
const ownerRoleCycle = ['Associate Owner', 'Team Lead', 'Unit Lead', 'Governance Lead', 'Platform Admin'];

const featureDescription = (area: string, group: string, feature: string) =>
  `${feature} provides an operational workspace for ${group.toLowerCase()} within ${area.toLowerCase()}, connecting records, signals, actions, and evidence in one governed view.`;

const groupKpis = (group: string, index: number): FeatureKpi[] => [
  { label: `${group} Health`, value: index % 3 === 0 ? '82%' : index % 3 === 1 ? '74%' : '91%', trend: index % 2 === 0 ? '+4%' : '-3%', status: index % 3 === 2 ? 'success' : 'info' },
  { label: 'Open Signals', value: String(12 + index * 3), trend: '-2', status: index % 2 === 0 ? 'warning' : 'info' },
  { label: 'At Risk Items', value: String(2 + index), trend: index % 2 === 0 ? '+1' : '-1', status: index % 2 === 0 ? 'danger' : 'warning' },
  { label: 'Updated This Week', value: String(18 + index * 4), trend: '+6', status: 'success' },
];

const featureKpis = (feature: string, index: number): FeatureKpi[] => [
  { label: feature.length > 20 ? 'Feature Health' : `${feature} Health`, value: index % 4 === 0 ? '88%' : index % 4 === 1 ? '73%' : index % 4 === 2 ? '64%' : '92%', trend: index % 3 === 0 ? '+5%' : '-2%', status: index % 4 === 2 ? 'danger' : index % 4 === 1 ? 'warning' : 'success' },
  { label: 'Active Records', value: String(8 + index), trend: '+2', status: 'info' },
  { label: 'Needs Review', value: String(1 + (index % 4)), trend: index % 2 ? '+1' : '-1', status: index % 2 ? 'warning' : 'success' },
  { label: 'Evidence Ready', value: `${76 + index}%`, trend: '+3%', status: 'success' },
];

const insightsFor = (area: string, group: string, feature: string): string[] => [
  `${feature} has the strongest signal quality where ownership and evidence are updated inside the same review cycle.`,
  `${group} shows recurring risk when overdue records are not linked to the current operating cadence.`,
  `${area} reviewers should prioritise high-risk records with stale evidence before the next governance checkpoint.`,
  `Recent updates indicate ${feature.toLowerCase()} can improve by clearing blocked records with named next actions.`,
];

const actionsFor = (area: string, feature: string): FeatureAction[] => {
  const approvalActions = feature.toLowerCase().includes('approval') || feature.toLowerCase().includes('approve')
    ? ['Approve selected record', 'Return for evidence update', 'Delegate approval review', 'Record decision note']
    : [`Review ${feature.toLowerCase()} signal`, 'Update owner next action', 'Validate evidence state', 'Escalate at-risk record'];

  return approvalActions.map((label, index) => ({
    label,
    owner: ['Amina Shah', 'Daniel Okafor', 'Priya Menon', 'Michael Chen'][index],
    dueDate: ['2026-06-07', '2026-06-10', '2026-06-12', '2026-06-14'][index],
    status: index === 0 ? 'Pending Review' : index === 1 ? 'Needs Attention' : 'On Track',
  }));
};

const evidenceFor = (area: string, group: string, feature: string): string[] => [
  `${area} control extract for ${feature}`,
  `${group} weekly review note`,
  `${feature} evidence register placeholder`,
  'Audit reference and completion proof link',
];

const recordsFor = (area: string, group: string, feature: string, templates: RecordTemplate[]): FeatureRecord[] =>
  templates.map((record) => ({
    ...record,
    featureArea: area,
    featureGroup: group,
    feature,
  }));

const buildArea = (spec: AreaSpec): FeatureArea => {
  const areaId = slugify(spec.label);
  const areaRoute = `/${areaId}`;
  const groups = spec.groups.map((group, groupIndex) => {
    const groupId = slugify(group.label);
    const groupRoute = `${areaRoute}/${groupId}`;
    const features = group.features.map((featureLabel, featureIndex) => {
      const featureId = slugify(featureLabel);
      const sampleRecords = recordsFor(spec.label, group.label, featureLabel, spec.recordTemplates);
      const status = statusCycle[(groupIndex + featureIndex) % statusCycle.length];
      return {
        id: featureId,
        label: featureLabel,
        description: featureDescription(spec.label, group.label, featureLabel),
        route: `${groupRoute}/${featureId}`,
        ownerRole: ownerRoleCycle[(groupIndex + featureIndex) % ownerRoleCycle.length],
        status,
        primaryMetric: featureKpis(featureLabel, featureIndex)[0].value,
        riskLevel: riskCycle[(groupIndex + featureIndex) % riskCycle.length],
        kpis: featureKpis(featureLabel, featureIndex),
        insights: insightsFor(spec.label, group.label, featureLabel),
        actions: actionsFor(spec.label, featureLabel),
        evidence: evidenceFor(spec.label, group.label, featureLabel),
        sampleRecords,
      };
    });

    return {
      id: groupId,
      label: group.label,
      description: group.description,
      route: groupRoute,
      healthStatus: group.healthStatus,
      kpis: groupKpis(group.label, groupIndex),
      features,
    };
  });

  return {
    id: areaId,
    label: spec.label,
    route: areaRoute,
    description: spec.description,
    kpis: spec.landingKpis,
    prioritySignals: spec.recordTemplates.map((record) => ({
      ...record,
      featureArea: spec.label,
      featureGroup: spec.groups[0].label,
      feature: spec.groups[0].features[0],
    })),
    featureGroups: groups,
  };
};

const performanceRecords: RecordTemplate[] = [
  {
    id: 'TSK-1042',
    title: 'Monthly workforce report validation',
    owner: 'Amina Shah',
    ownerRole: 'Associate Owner',
    unit: 'People Operations',
    status: 'On Track',
    priority: 'High',
    dueDate: '2026-06-12',
    lastUpdated: 'Today',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    nextAction: 'Confirm final data reconciliation and attach validation evidence.',
    timeline: ['Task accepted by owner', 'Validation checkpoint updated', 'Evidence attachment added'],
    relatedEvidence: ['workforce-report-validation.xlsx', 'monthly-review-note.pdf'],
  },
  {
    id: 'SLA-082',
    title: 'Closure overdue by 2 days',
    owner: 'Daniel Okafor',
    ownerRole: 'Team Lead',
    unit: 'Operations Support',
    status: 'Overdue',
    priority: 'Critical',
    dueDate: '2026-06-03',
    lastUpdated: '2026-06-05',
    evidenceStatus: 'Partial Evidence',
    riskLevel: 'High',
    nextAction: 'Escalate closure owner and agree recovery date before end of day.',
    timeline: ['SLA warning issued', 'Closure date missed', 'Escalation recommended'],
    relatedEvidence: ['sla-breach-note.msg', 'closure-queue-export.csv'],
  },
  {
    id: 'GOV-331',
    title: 'Evidence quality review required',
    owner: 'Priya Menon',
    ownerRole: 'Governance Lead',
    unit: 'Risk and Control',
    status: 'Pending Review',
    priority: 'Medium',
    dueDate: '2026-06-14',
    lastUpdated: 'Yesterday',
    evidenceStatus: 'Review Required',
    riskLevel: 'Medium',
    nextAction: 'Review proof quality and return incomplete attachments to owners.',
    timeline: ['Evidence submitted', 'Quality issue detected', 'Reviewer assigned'],
    relatedEvidence: ['evidence-quality-checklist.docx', 'audit-sample-link'],
  },
  {
    id: 'OUT-217',
    title: 'Outcome evidence pending review',
    owner: 'Michael Chen',
    ownerRole: 'Unit Lead',
    unit: 'Digital Services',
    status: 'Needs Attention',
    priority: 'High',
    dueDate: '2026-06-16',
    lastUpdated: '2h ago',
    evidenceStatus: 'Pending Review',
    riskLevel: 'Medium',
    nextAction: 'Map completed output evidence to the active outcome checkpoint.',
    timeline: ['Output completed', 'Outcome mapping opened', 'Evidence review pending'],
    relatedEvidence: ['outcome-map.xlsx', 'delivery-impact-note.pdf'],
  },
  {
    id: 'BLK-119',
    title: 'Blocker unresolved beyond SLA',
    owner: 'Grace Wanjiku',
    ownerRole: 'Scrum Master',
    unit: 'Enterprise Delivery',
    status: 'Blocked',
    priority: 'Critical',
    dueDate: '2026-06-06',
    lastUpdated: 'Today',
    evidenceStatus: 'Evidence Missing',
    riskLevel: 'Critical',
    nextAction: 'Assign blocker resolution owner and publish recovery action.',
    timeline: ['Blocker raised', 'SLA threshold passed', 'Resolution owner missing'],
    relatedEvidence: ['blocker-thread-link', 'daily-standup-note'],
  },
];

const analyticsRecords: RecordTemplate[] = [
  {
    id: 'ANA-204',
    title: 'Execution bottleneck detected in approval handoff',
    insightCategory: 'Execution bottleneck',
    owner: 'Ravi Patel',
    ownerRole: 'Analytics Lead',
    unit: 'Enterprise Delivery',
    status: 'Action Required',
    priority: 'High',
    reviewDate: '2026-06-07',
    lastUpdated: 'Today',
    sourceStatus: 'Source Validated',
    riskLevel: 'High',
    nextAction: 'Review approval handoff owners and remove duplicate queue step.',
    timeline: ['Trend anomaly detected', 'Source data validated', 'Follow-up assigned'],
    relatedEvidence: ['approval-handoff-analysis.pbix', 'execution-flow-export.csv'],
  },
  {
    id: 'SLA-144',
    title: 'Breach pattern increasing in access requests',
    insightCategory: 'SLA pattern',
    owner: 'Nadia Ali',
    ownerRole: 'SLA Analyst',
    unit: 'Shared Services',
    status: 'Needs Attention',
    priority: 'High',
    reviewDate: '2026-06-10',
    lastUpdated: 'Yesterday',
    sourceStatus: 'Source Review Required',
    riskLevel: 'Medium',
    nextAction: 'Segment access request breaches by owner and first response delay.',
    timeline: ['Breach rate increased', 'Access request segment isolated', 'Analyst review opened'],
    relatedEvidence: ['sla-trend-extract.csv', 'access-request-breach-log'],
  },
  {
    id: 'CAP-088',
    title: 'Capacity pressure in Operations Support',
    insightCategory: 'Capacity pressure',
    owner: 'Daniel Okafor',
    ownerRole: 'Team Lead',
    unit: 'Operations Support',
    status: 'At Risk',
    priority: 'Critical',
    reviewDate: '2026-06-08',
    lastUpdated: '1h ago',
    sourceStatus: 'Current',
    riskLevel: 'Critical',
    nextAction: 'Rebalance queue load and defer low-value requests for this cycle.',
    timeline: ['Queue volume crossed threshold', 'Owner load imbalance detected', 'Capacity action recommended'],
    relatedEvidence: ['capacity-pressure-view', 'queue-volume-trend.csv'],
  },
  {
    id: 'GOV-421',
    title: 'Escalation cycle time above threshold',
    insightCategory: 'Governance cycle time',
    owner: 'Priya Menon',
    ownerRole: 'Governance Lead',
    unit: 'Risk and Control',
    status: 'Under Review',
    priority: 'Medium',
    reviewDate: '2026-06-13',
    lastUpdated: 'Today',
    sourceStatus: 'Current',
    riskLevel: 'Medium',
    nextAction: 'Compare severity assignment lag against closure outcomes.',
    timeline: ['Cycle time threshold exceeded', 'Governance sample selected', 'Review scheduled'],
    relatedEvidence: ['escalation-cycle-analysis.xlsx', 'governance-review-note'],
  },
  {
    id: 'OUT-305',
    title: 'Outcome contribution requires evidence mapping',
    insightCategory: 'Outcome attribution',
    owner: 'Michael Chen',
    ownerRole: 'Unit Lead',
    unit: 'Digital Services',
    status: 'Monitoring',
    priority: 'Medium',
    reviewDate: '2026-06-17',
    lastUpdated: '2026-06-05',
    sourceStatus: 'Mapping Pending',
    riskLevel: 'Medium',
    nextAction: 'Link initiative outputs to outcome evidence before value review.',
    timeline: ['Contribution signal found', 'Evidence mapping missing', 'Outcome review queued'],
    relatedEvidence: ['initiative-output-map.xlsx', 'value-realisation-note'],
  },
];

const governanceRecords: RecordTemplate[] = [
  {
    id: 'APR-118',
    title: 'Access request pending manager approval',
    owner: 'Amina Shah',
    ownerRole: 'Manager Approver',
    unit: 'People Operations',
    status: 'Pending Approval',
    severity: 'Medium',
    reviewDate: '2026-06-07',
    lastUpdated: 'Today',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    nextAction: 'Approve, reject, return, or delegate the pending access decision.',
    timeline: ['Request submitted', 'Manager approval assigned', 'Reminder issued'],
    decisionHistory: ['2026-06-04 Submitted by requester', '2026-06-05 Awaiting manager decision'],
    relatedEvidence: ['access-request-form.pdf', 'manager-approval-thread'],
  },
  {
    id: 'ESC-074',
    title: 'Escalation unresolved after severity upgrade',
    owner: 'Grace Wanjiku',
    ownerRole: 'Escalation Owner',
    unit: 'Enterprise Delivery',
    status: 'Escalated',
    severity: 'High',
    reviewDate: '2026-06-06',
    lastUpdated: '1h ago',
    evidenceStatus: 'Partial Evidence',
    riskLevel: 'High',
    nextAction: 'Confirm severity owner and publish resolution path.',
    timeline: ['Escalation raised', 'Severity upgraded', 'Resolution path overdue'],
    decisionHistory: ['Severity moved from Medium to High', 'Unit lead requested recovery plan'],
    relatedEvidence: ['escalation-record-link', 'severity-upgrade-note'],
  },
  {
    id: 'AUD-221',
    title: 'Evidence trail missing closure attachment',
    owner: 'Priya Menon',
    ownerRole: 'Audit Reviewer',
    unit: 'Risk and Control',
    status: 'Evidence Missing',
    severity: 'High',
    reviewDate: '2026-06-11',
    lastUpdated: 'Yesterday',
    evidenceStatus: 'Missing',
    riskLevel: 'High',
    nextAction: 'Return record to owner for closure attachment and audit note.',
    timeline: ['Audit sample selected', 'Closure attachment missing', 'Return action recommended'],
    decisionHistory: ['Audit reviewer marked evidence incomplete'],
    relatedEvidence: ['audit-sample-221', 'closure-proof-placeholder'],
  },
  {
    id: 'GOV-331',
    title: 'Evidence quality review required',
    owner: 'Daniel Okafor',
    ownerRole: 'Control Owner',
    unit: 'Operations Support',
    status: 'Under Review',
    severity: 'Medium',
    reviewDate: '2026-06-14',
    lastUpdated: 'Today',
    evidenceStatus: 'Review Required',
    riskLevel: 'Medium',
    nextAction: 'Complete checklist review and record finding outcome.',
    timeline: ['Control review opened', 'Evidence issue detected', 'Finding owner assigned'],
    decisionHistory: ['Reviewer requested stronger completion proof'],
    relatedEvidence: ['governance-checklist.docx', 'evidence-quality-sample'],
  },
  {
    id: 'ODR-056',
    title: 'Repeated missed update pattern detected',
    owner: 'Michael Chen',
    ownerRole: 'Unit Lead',
    unit: 'Digital Services',
    status: 'Exception Raised',
    severity: 'Medium',
    reviewDate: '2026-06-12',
    lastUpdated: '2026-06-05',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    nextAction: 'Add operating discipline action plan for repeated missed updates.',
    timeline: ['Missed update pattern detected', 'Exception raised', 'Action plan requested'],
    decisionHistory: ['Operating discipline review opened'],
    relatedEvidence: ['missed-update-pattern.csv', 'operating-discipline-note'],
  },
];

const administrationRecords: RecordTemplate[] = [
  {
    id: 'ADM-144',
    title: 'Role assignment exception',
    owner: 'Ibrahim Njoroge',
    ownerRole: 'Platform Admin',
    unit: 'Platform Operations',
    status: 'Exception Raised',
    priority: 'High',
    reviewDate: '2026-06-07',
    lastUpdated: 'Today',
    evidenceStatus: 'Review Required',
    riskLevel: 'High',
    configurationImpact: 'Role access may expose restricted governance actions until reviewed.',
    nextAction: 'Review access exception and confirm role assignment decision.',
    timeline: ['Role change requested', 'Exception detected', 'Admin review assigned'],
    relatedEvidence: ['role-assignment-export.csv', 'access-exception-note'],
  },
  {
    id: 'USR-203',
    title: 'User status pending review',
    owner: 'Nadia Ali',
    ownerRole: 'User Administrator',
    unit: 'Shared Services',
    status: 'Pending Review',
    priority: 'Medium',
    reviewDate: '2026-06-09',
    lastUpdated: 'Yesterday',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    configurationImpact: 'Inactive status may leave open work without a reassigned owner.',
    nextAction: 'Confirm user status and reassign owned work where needed.',
    timeline: ['Status change flagged', 'Owned work identified', 'Review reminder issued'],
    relatedEvidence: ['user-status-report.xlsx', 'owned-work-list.csv'],
  },
  {
    id: 'ORG-091',
    title: 'Reporting line mismatch detected',
    owner: 'Michael Chen',
    ownerRole: 'Unit Lead',
    unit: 'Digital Services',
    status: 'Needs Attention',
    priority: 'High',
    reviewDate: '2026-06-10',
    lastUpdated: '2h ago',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    configurationImpact: 'Approval routing and ownership dashboards may show the wrong accountable lead.',
    nextAction: 'Update ownership mapping and validate reporting line hierarchy.',
    timeline: ['Organisation extract refreshed', 'Mismatch detected', 'Unit owner notified'],
    relatedEvidence: ['org-structure-export.csv', 'reporting-line-change-note'],
  },
  {
    id: 'CFG-118',
    title: 'Required input missing for request category',
    owner: 'Priya Menon',
    ownerRole: 'Configuration Owner',
    unit: 'Risk and Control',
    status: 'Change Required',
    priority: 'Medium',
    reviewDate: '2026-06-13',
    lastUpdated: 'Today',
    evidenceStatus: 'Partial Evidence',
    riskLevel: 'Medium',
    configurationImpact: 'Request routing may start with incomplete information for the category.',
    nextAction: 'Validate required inputs and submit change for governance review.',
    timeline: ['Request category reviewed', 'Required input gap found', 'Change record drafted'],
    relatedEvidence: ['request-category-config.json', 'required-input-checklist.docx'],
  },
  {
    id: 'WRK-072',
    title: 'Approval path rule pending validation',
    owner: 'Grace Wanjiku',
    ownerRole: 'Workflow Administrator',
    unit: 'Enterprise Delivery',
    status: 'Draft',
    priority: 'High',
    reviewDate: '2026-06-11',
    lastUpdated: 'Today',
    evidenceStatus: 'Review Required',
    riskLevel: 'High',
    configurationImpact: 'Draft approval rule could delay escalations if published without validation.',
    nextAction: 'Review SLA rule, approval path, and escalation rule before activation.',
    timeline: ['Workflow rule drafted', 'Validation checklist opened', 'Governance review pending'],
    relatedEvidence: ['approval-path-rule.json', 'workflow-validation-checklist'],
  },
  {
    id: 'INT-041',
    title: 'Microsoft integration setting requires review',
    owner: 'Ibrahim Njoroge',
    ownerRole: 'Integration Admin',
    unit: 'Platform Operations',
    status: 'Needs Attention',
    priority: 'Medium',
    reviewDate: '2026-06-15',
    lastUpdated: '2026-06-05',
    evidenceStatus: 'Evidence Attached',
    riskLevel: 'Medium',
    configurationImpact: 'Notification sync and Teams handoff may be unreliable for new workflow events.',
    nextAction: 'Check integration setting and record audit setting evidence.',
    timeline: ['Integration sync warning raised', 'Admin review assigned', 'Audit note requested'],
    relatedEvidence: ['integration-health-check.log', 'microsoft-setting-screenshot'],
  },
  {
    id: 'AIA-009',
    title: 'AI assistance rule awaiting governance check',
    owner: 'Priya Menon',
    ownerRole: 'Change Governance Owner',
    unit: 'Risk and Control',
    status: 'Pending Review',
    priority: 'Medium',
    reviewDate: '2026-06-18',
    lastUpdated: 'Today',
    evidenceStatus: 'Review Required',
    riskLevel: 'Medium',
    configurationImpact: 'AI assistance behaviour should not be enabled until governance conditions are confirmed.',
    nextAction: 'Submit AI assistance rule for governance review.',
    timeline: ['AI rule drafted', 'Governance condition added', 'Review queued'],
    relatedEvidence: ['ai-assistance-rule.json', 'change-governance-note'],
  },
];

export const featureAreas: FeatureArea[] = [
  buildArea({
    label: 'Performance',
    description: 'Track personal, team, unit, SLA, closure quality, and outcome performance with operational records, ownership, evidence, and recovery actions.',
    landingKpis: [
      { label: 'Tasks Completed', value: '148', trend: '+12', status: 'success' },
      { label: 'SLA Health', value: '86%', trend: '-3%', status: 'warning' },
      { label: 'Closure Quality', value: '91%', trend: '+5%', status: 'success' },
      { label: 'Outcomes Progress', value: '74%', trend: '+6%', status: 'info' },
    ],
    recordTemplates: performanceRecords,
    groups: [
      { label: 'My Performance Snapshot', description: 'Personal delivery, update discipline, closure quality, and blocker resolution signals for the active work cycle.', healthStatus: 'Needs Attention', features: ['Task Completion', 'SLA Adherence', 'Update Discipline', 'Closure Quality', 'Blocker Resolution'] },
      { label: 'Team Performance', description: 'Team workload, SLA health, closure quality, blockers, and output trend for team leads and delivery owners.', healthStatus: 'Healthy', features: ['Team Workload', 'Team SLA Health', 'Team Closure Quality', 'Team Blockers', 'Team Output Trend'] },
      { label: 'Unit Performance', description: 'Unit workload, delivery health, SLA trend, governance health, and outcome progress for unit leadership.', healthStatus: 'Needs Attention', features: ['Unit Workload', 'Unit Delivery Health', 'Unit SLA Trend', 'Unit Governance Health', 'Unit Outcome Progress'] },
      { label: 'SLA & Closure Quality Performance', description: 'SLA dashboards, breach reporting, closure quality scoring, evidence completeness, and rework signals.', healthStatus: 'At Risk', features: ['SLA Dashboard', 'SLA Breach Report', 'Closure Quality Score', 'Evidence Completeness', 'Rework Rate'] },
      { label: 'Outcome Performance', description: 'Outcome progress, completed outputs, value contribution, outcome evidence, and delivery impact tracking.', healthStatus: 'Healthy', features: ['Outcome Progress', 'Completed Outputs', 'Value Contribution', 'Outcome Evidence', 'Delivery Impact'] },
    ],
  }),
  buildArea({
    label: 'Analytics',
    description: 'Surface execution insight, SLA trends, workload capacity, governance analytics, and outcome/value visibility from operational source signals.',
    landingKpis: [
      { label: 'Execution Health', value: '79%', trend: '+4%', status: 'info' },
      { label: 'SLA Risk', value: '18', trend: '+3', status: 'warning' },
      { label: 'Capacity Pressure', value: 'High', trend: '+2 teams', status: 'danger' },
      { label: 'Outcome Visibility', value: '68%', trend: '+7%', status: 'success' },
    ],
    recordTemplates: analyticsRecords,
    groups: [
      { label: 'Execution Analytics', description: 'Execution overview, task flow, work movement, bottleneck, and delivery health analytics.', healthStatus: 'Needs Attention', features: ['Execution Overview', 'Task Flow Analysis', 'Work Movement Trends', 'Execution Bottleneck Analysis', 'Delivery Health Insights'] },
      { label: 'SLA Analytics', description: 'SLA trend, breach pattern, risk forecast, team/unit, and resolution analytics.', healthStatus: 'At Risk', features: ['SLA Trend Analysis', 'Breach Pattern Analysis', 'SLA Risk Forecast', 'SLA by Team / Unit', 'SLA Resolution Analytics'] },
      { label: 'Workload & Capacity Analytics', description: 'Workload distribution, capacity pressure, owner load, queue volume, and resource utilisation insights.', healthStatus: 'At Risk', features: ['Workload Distribution', 'Capacity Pressure Signals', 'Owner Load Analysis', 'Queue Volume Trends', 'Resource Utilisation Insights'] },
      { label: 'Governance Analytics', description: 'Approval cycle, escalation pattern, exception trend, audit event, and compliance readiness insight.', healthStatus: 'Needs Attention', features: ['Approval Cycle Analytics', 'Escalation Pattern Analytics', 'Governance Exception Trends', 'Audit Event Trends', 'Compliance Readiness Insights'] },
      { label: 'Outcome & Value Analytics', description: 'Outcome trend, value realisation, initiative-to-output mapping, impact, and attribution insight.', healthStatus: 'Healthy', features: ['Outcome Trend Analysis', 'Value Realisation View', 'Initiative-to-Output Mapping', 'Impact Analytics', 'Outcome Attribution Insights'] },
    ],
  }),
  buildArea({
    label: 'Governance',
    description: 'Manage approvals, escalations, audit control, compliance evidence, governance reviews, and operating discipline from one controlled workspace.',
    landingKpis: [
      { label: 'Pending Approvals', value: '23', trend: '+4', status: 'warning' },
      { label: 'Open Escalations', value: '9', trend: '-2', status: 'danger' },
      { label: 'Evidence Gaps', value: '14', trend: '+3', status: 'warning' },
      { label: 'Governance Exceptions', value: '6', trend: '-1', status: 'info' },
    ],
    recordTemplates: governanceRecords,
    groups: [
      { label: 'Approvals Management', description: 'Pending approvals, approval detail, decision actions, delegation, and approval history.', healthStatus: 'Needs Attention', features: ['Pending Approvals', 'Approval Detail', 'Approve / Reject / Return', 'Approval Delegation', 'Approval History'] },
      { label: 'Escalation Management', description: 'Escalation queue, detail, severity assignment, owner assignment, and resolution tracking.', healthStatus: 'At Risk', features: ['Escalation Queue', 'Escalation Detail', 'Severity Assignment', 'Escalation Owner', 'Escalation Resolution'] },
      { label: 'Audit & Compliance Control', description: 'Audit log, activity history, access history, evidence trail, and compliance view controls.', healthStatus: 'Needs Attention', features: ['Audit Log', 'Activity History', 'Access History', 'Evidence Trail', 'Compliance View'] },
      { label: 'Governance Review', description: 'Governance review workspace, checklist, exceptions, findings, and action plan management.', healthStatus: 'Healthy', features: ['Governance Review Workspace', 'Review Checklist', 'Governance Exceptions', 'Review Findings', 'Governance Action Plan'] },
      { label: 'Operating Discipline Review', description: 'Task hygiene, missing updates, evidence quality, closure discipline, and repeated exception review.', healthStatus: 'Needs Attention', features: ['Task Hygiene Review', 'Missing Update Review', 'Evidence Quality Review', 'Closure Discipline Review', 'Repeated Exception Review'] },
    ],
  }),
  buildArea({
    label: 'Administration',
    description: 'Configure platform setup, users, roles, units, teams, task and request rules, workflow rules, SLA rules, integrations, audit settings, automation, AI assistance, and change governance.',
    landingKpis: [
      { label: 'Active Users', value: '412', trend: '+8', status: 'success' },
      { label: 'Open Access Exceptions', value: '11', trend: '+2', status: 'warning' },
      { label: 'Active Workflow Rules', value: '64', trend: '+5', status: 'info' },
      { label: 'Configuration Changes Pending Review', value: '17', trend: '-3', status: 'warning' },
    ],
    recordTemplates: administrationRecords,
    groups: [
      { label: 'User & Role Management', description: 'User directory, role assignment, permission management, access exceptions, and user status controls.', healthStatus: 'Needs Attention', features: ['User Directory', 'Role Assignment', 'Permission Management', 'Access Exceptions', 'User Status Management'] },
      { label: 'Organisation / Unit / Team Setup', description: 'Organisation structure, unit setup, team setup, reporting lines, and ownership mapping.', healthStatus: 'Needs Attention', features: ['Organisation Structure', 'Unit Setup', 'Team Setup', 'Reporting Lines', 'Ownership Mapping'] },
      { label: 'Task & Request Configuration', description: 'Task type setup, task fields, request categories, required inputs, and closure criteria setup.', healthStatus: 'At Risk', features: ['Task Type Setup', 'Task Field Configuration', 'Request Category Setup', 'Required Inputs', 'Closure Criteria Setup'] },
      { label: 'Workflow, Approval & SLA Rules', description: 'Workflow rules, approval path configuration, escalation rules, SLA rules, and notification rules.', healthStatus: 'Needs Attention', features: ['Workflow Rule Setup', 'Approval Path Configuration', 'Escalation Rule Setup', 'SLA Rule Setup', 'Notification Rule Setup'] },
      { label: 'Integration, Audit & Automation Settings', description: 'Microsoft integration settings, audit settings, automation rules, AI assistance, and change governance settings.', healthStatus: 'Healthy', features: ['Microsoft Integration Settings', 'Audit Settings', 'Automation Rules', 'AI Assistance Settings', 'Change Governance Settings'] },
    ],
  }),
];

export const featureAreaIds = featureAreas.map((area) => area.id);

export function getFeatureArea(areaId?: string) {
  return featureAreas.find((area) => area.id === areaId);
}

export function getFeatureGroup(areaId?: string, groupId?: string) {
  return getFeatureArea(areaId)?.featureGroups.find((group) => group.id === groupId);
}

export function getFeature(areaId?: string, groupId?: string, featureId?: string) {
  return getFeatureGroup(areaId, groupId)?.features.find((feature) => feature.id === featureId);
}
