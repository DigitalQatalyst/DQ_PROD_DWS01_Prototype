import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  Globe,
  Shield,
  ShieldCheck,
  Users,
  Wrench,
  Play,
  Table2,
  BookOpen,
} from 'lucide-react';
import type {
  ApplicabilityRecord,
  KnowledgeAssetFull,
  KnowledgeDetailRecord,
  RelatedKnowledgeRecord,
} from '../types/knowledgeDiscovery';

export type { MarketplaceDetailTab as KnowledgeDetailTab } from '../types/marketplaceDetail';

export interface OverviewRow {
  icon: LucideIcon;
  label: string;
  description: string;
}

export interface KeyReminder {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GovernanceMetric {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export interface ApprovalStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface SupportingMaterial {
  icon: LucideIcon;
  label: string;
}

const REVIEW_CYCLE_LABEL = 'Quarterly';

export function isControlledAsset(asset: KnowledgeAssetFull): boolean {
  return asset.acknowledgementRequired || asset.status === 'Effective';
}

export function getComplianceLabel(asset: KnowledgeAssetFull): string {
  if (asset.acknowledgementRequired) return 'Controlled';
  if (asset.status === 'Effective') return 'Governed';
  return asset.status;
}

export function buildOverviewRows(asset: KnowledgeAssetFull): OverviewRow[] {
  const principles = asset.coreGuidance?.principles ?? [];
  const steps = asset.coreGuidance?.steps ?? [];

  return [
    {
      icon: FileText,
      label: 'What this is',
      description:
        asset.purpose ||
        asset.summary ||
        'Guidance asset for governed work within DWS.01.',
    },
    {
      icon: Shield,
      label: 'Why it matters',
      description:
        principles[0] ||
        asset.whenToUse[0] ||
        'Ensures consistent execution quality across teams and audit-ready closure.',
    },
    {
      icon: Wrench,
      label: 'How it is used',
      description:
        steps.slice(0, 2).join(' ') ||
        'Apply during task creation, progress updates, and closure within the workspace.',
    },
  ];
}

export function buildAppliesToItems(
  asset: KnowledgeAssetFull,
  applicability?: ApplicabilityRecord,
): string[] {
  const items = [
    ...asset.applicability,
    ...(applicability?.contexts ?? []),
    ...(applicability?.workTypes ?? []),
  ];

  return [...new Set(items)].slice(0, 4);
}

export function buildKeyReminders(asset: KnowledgeAssetFull): KeyReminder[] {
  const principles = asset.coreGuidance?.principles ?? [];
  const mistakes = asset.coreGuidance?.commonMistakes ?? [];

  const reminders: KeyReminder[] = [];

  if (principles[0]) {
    reminders.push({
      icon: Shield,
      title: principles[0].split('.')[0],
      description: principles[0],
    });
  }

  if (principles[1]) {
    reminders.push({
      icon: FileText,
      title: principles[1].split('.')[0],
      description: principles[1],
    });
  } else if (asset.evidenceExpectation) {
    reminders.push({
      icon: FileText,
      title: 'Evidence must be attached',
      description: asset.evidenceExpectation,
    });
  }

  if (mistakes[0]) {
    reminders.push({
      icon: Wrench,
      title: 'Avoid common mistakes',
      description: mistakes[0],
    });
  } else if (asset.whenNotToUse[0]) {
    reminders.push({
      icon: Wrench,
      title: 'Use with care',
      description: asset.whenNotToUse[0],
    });
  }

  return reminders.slice(0, 3);
}

export function buildGovernanceMetrics(
  asset: KnowledgeAssetFull,
  relatedPolicyTitle?: string,
): GovernanceMetric[] {
  return [
    {
      icon: Shield,
      label: 'Control status',
      value: asset.status,
    },
    {
      icon: FileText,
      label: 'Access status',
      value: asset.permissionScope || 'Available to your role',
    },
    {
      icon: BookOpen,
      label: 'Review cycle',
      value: REVIEW_CYCLE_LABEL,
    },
    {
      icon: Shield,
      label: 'Compliance level',
      value: getComplianceLabel(asset),
    },
    {
      icon: FileText,
      label: 'Related policy',
      value: relatedPolicyTitle || 'Knowledge Governance Policy',
      href: '#',
    },
  ];
}

export const APPROVAL_FLOW_STEPS: ApprovalStep[] = [
  {
    step: 1,
    title: 'Draft',
    description: 'Content is created and saved as draft.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Review',
    description: 'Subject matter experts review the content.',
    icon: Users,
  },
  {
    step: 3,
    title: 'QA Approval',
    description: 'QA validates accuracy and compliance.',
    icon: ShieldCheck,
  },
  {
    step: 4,
    title: 'Published',
    description: 'Approved content is published and controlled.',
    icon: Globe,
  },
];

export function buildPolicyAlignment(
  related: RelatedKnowledgeRecord[],
  assetsById: Map<string, KnowledgeAssetFull>,
): { id: string; title: string }[] {
  return related
    .map((record) => {
      const linked = assetsById.get(record.toAssetId);
      return linked ? { id: linked.id, title: linked.title } : null;
    })
    .filter((item): item is { id: string; title: string } => item !== null)
    .slice(0, 3);
}

export function buildSupportingMaterials(asset: KnowledgeAssetFull): SupportingMaterial[] {
  const byType: Partial<Record<KnowledgeAssetFull['type'], SupportingMaterial[]>> = {
    Guideline: [
      { icon: Play, label: 'Onboarding walkthrough' },
      { icon: Wrench, label: 'Task discipline checklist' },
      { icon: Table2, label: 'Closure criteria matrix' },
    ],
    'Operating Standard': [
      { icon: Play, label: 'Evidence standards briefing' },
      { icon: Wrench, label: 'Attachment guide' },
      { icon: Table2, label: 'Evidence type matrix' },
    ],
    Playbook: [
      { icon: Play, label: 'Resolution walkthrough' },
      { icon: Wrench, label: 'Escalation guide' },
      { icon: Table2, label: 'Blocker status matrix' },
    ],
    Template: [
      { icon: Play, label: 'Template usage demo' },
      { icon: Wrench, label: 'Field completion guide' },
      { icon: Table2, label: 'Template variant matrix' },
    ],
  };

  return (
    byType[asset.type] ?? [
      { icon: Play, label: 'Training video' },
      { icon: Wrench, label: 'Reference guide' },
      { icon: Table2, label: 'Applicability matrix' },
    ]
  );
}

export function formatReviewDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getDetailVersionHistory(detail?: KnowledgeDetailRecord) {
  return detail?.versionHistory ?? [];
}
