import type { LucideIcon } from 'lucide-react';
import {
  ClipboardList,
  FileText,
  Globe,
  ListChecks,
  Play,
  Shield,
  ShieldCheck,
  Table2,
  Users,
  Wrench,
} from 'lucide-react';
import type { Service, ServiceDetail } from '../types/serviceLifecycle';
import type {
  ApprovalStep,
  GovernanceMetric,
  KeyReminder,
  OverviewRow,
  SupportingMaterial,
} from './knowledgeDetailContent';

export type { MarketplaceDetailTab as ServiceDetailTab } from '../types/marketplaceDetail';

const SERVICE_CHANGE_HISTORY: Record<
  string,
  { version: string; date: string; summary: string }[]
> = {
  'SVC-HRA-001': [
    {
      version: '2.1',
      date: '2026-03-01',
      summary: 'Updated conditional approval criteria for cross-unit joiners.',
    },
    {
      version: '2.0',
      date: '2025-11-15',
      summary: 'Expanded required inputs for access and orientation scheduling.',
    },
    {
      version: '1.0',
      date: '2025-06-01',
      summary: 'Initial onboarding support service definition published.',
    },
  ],
};

export function buildServiceOverviewRows(
  service: Service,
  detail: ServiceDetail,
): OverviewRow[] {
  return [
    {
      icon: FileText,
      label: 'What this is',
      description: detail.purpose || service.description,
    },
    {
      icon: Shield,
      label: 'Why it matters',
      description:
        detail.whenToUse[0] ||
        'Ensures new joiners receive coordinated access, orientation, and workspace readiness.',
    },
    {
      icon: Wrench,
      label: 'How it is used',
      description:
        detail.fulfilmentPath ||
        'Submit a governed request, complete required inputs, and track fulfilment through closure.',
    },
  ];
}

export function buildServiceAppliesTo(detail: ServiceDetail, service: Service): string[] {
  const items = [
    service.category,
    ...detail.whenToUse.slice(0, 3),
  ];

  return [...new Set(items)].slice(0, 4);
}

export function buildServiceKeyReminders(detail: ServiceDetail): KeyReminder[] {
  const reminders: KeyReminder[] = [];

  if (detail.requiredInputs[0]) {
    reminders.push({
      icon: ClipboardList,
      title: 'Required inputs must be complete',
      description: `Include ${detail.requiredInputs.slice(0, 3).join(', ')} before submission.`,
    });
  }

  if (detail.approval !== 'Not Required') {
    reminders.push({
      icon: Shield,
      title: `${detail.approval} approval applies`,
      description:
        detail.approvalDetail ||
        'Approval may be required depending on role, access scope, or unit policy.',
    });
  }

  reminders.push({
    icon: ListChecks,
    title: 'SLA clock starts on submit',
    description: `Target fulfilment within ${detail.sla}. Escalation: ${detail.escalationTrigger}`,
  });

  return reminders.slice(0, 3);
}

export function buildServiceGovernanceMetrics(
  service: Service,
  detail: ServiceDetail,
): GovernanceMetric[] {
  return [
    {
      icon: Shield,
      label: 'Control status',
      value: service.risk,
    },
    {
      icon: FileText,
      label: 'Access status',
      value: 'Available to Associates',
    },
    {
      icon: ClipboardList,
      label: 'Response SLA',
      value: detail.sla,
    },
    {
      icon: Shield,
      label: 'Approval level',
      value: detail.approval,
    },
    {
      icon: FileText,
      label: 'Related policy',
      value: detail.relatedKnowledge[0] || 'Request Fulfilment Policy',
      href: '#',
    },
  ];
}

export function buildFulfilmentFlowSteps(detail: ServiceDetail): ApprovalStep[] {
  const stepLabels = detail.fulfilmentPath
    .split('→')
    .map((step) => step.trim())
    .filter(Boolean);

  const icons: LucideIcon[] = [FileText, Users, ShieldCheck, Globe];

  if (stepLabels.length === 0) {
    return [
      {
        step: 1,
        title: 'Submit',
        description: 'Request is logged with required inputs and audit trail.',
        icon: FileText,
      },
      {
        step: 2,
        title: 'Review',
        description: 'Service owner validates completeness and routing.',
        icon: ClipboardList,
      },
      {
        step: 3,
        title: 'Fulfilment',
        description: 'Owner completes provisioning and evidence capture.',
        icon: Wrench,
      },
      {
        step: 4,
        title: 'Closed',
        description: 'Request is closed with outcome and audit record.',
        icon: Shield,
      },
    ];
  }

  return stepLabels.map((title, index) => ({
    step: index + 1,
    title,
    description:
      index === 0
        ? 'Request is logged with required inputs and audit trail.'
        : index === stepLabels.length - 1
          ? 'Request is closed with outcome and audit record.'
          : 'Owner action and evidence capture at this stage.',
    icon: icons[index] ?? FileText,
  }));
}

export function getServiceChangeHistory(serviceId: string, detail: ServiceDetail) {
  return (
    SERVICE_CHANGE_HISTORY[serviceId] ?? [
      {
        version: '1.0',
        date: '2026-01-01',
        summary: `${detail.service} service definition published.`,
      },
    ]
  );
}

export function buildServicePolicyLinks(detail: ServiceDetail): { id: string; title: string }[] {
  return detail.relatedKnowledge.slice(0, 3).map((title, index) => ({
    id: `policy-${index}`,
    title,
  }));
}

export function buildServiceRelatedResources(detail: ServiceDetail): { id: string; title: string }[] {
  const knowledge = detail.relatedKnowledge.map((title, index) => ({
    id: `knowledge-${index}`,
    title,
  }));
  const services = detail.relatedServices.map((title, index) => ({
    id: `service-${index}`,
    title,
  }));

  return [...knowledge, ...services].slice(0, 5);
}

export function buildServiceSupportingMaterials(service: Service): SupportingMaterial[] {
  const byCategory: Partial<Record<Service['category'], SupportingMaterial[]>> = {
    'HRA Requests': [
      { icon: Play, label: 'Onboarding walkthrough' },
      { icon: Wrench, label: 'Joiner checklist guide' },
      { icon: Table2, label: 'Role taxonomy matrix' },
    ],
    'IT & Access': [
      { icon: Play, label: 'Access request briefing' },
      { icon: Wrench, label: 'Permission setup guide' },
      { icon: Table2, label: 'Access type matrix' },
    ],
  };

  return (
    byCategory[service.category] ?? [
      { icon: Play, label: 'Service overview video' },
      { icon: Wrench, label: 'Fulfilment guide' },
      { icon: Table2, label: 'Input requirements matrix' },
    ]
  );
}

export function getServiceComplianceLabel(service: Service): string {
  if (service.approval === 'Required') return 'Approval required';
  if (service.approval === 'Conditional') return 'Conditional';
  return 'Open request';
}
