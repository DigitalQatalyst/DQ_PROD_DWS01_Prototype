export type DbApproval = 'not_required' | 'conditional' | 'required';
export type DbRisk = 'standard' | 'governance_sensitive' | 'review_sensitive' | 'at_risk';

export type ApprovalRequirement = 'Required' | 'Conditional' | 'Not Required';
export type ServiceRisk = 'Standard' | 'Governance-sensitive' | 'Review-sensitive' | 'At Risk';

export function mapApproval(value: DbApproval | null | undefined): ApprovalRequirement {
  switch (value) {
    case 'required':
      return 'Required';
    case 'conditional':
      return 'Conditional';
    default:
      return 'Not Required';
  }
}

export function mapRisk(value: DbRisk | null | undefined): ServiceRisk {
  switch (value) {
    case 'governance_sensitive':
      return 'Governance-sensitive';
    case 'review_sensitive':
      return 'Review-sensitive';
    case 'at_risk':
      return 'At Risk';
    default:
      return 'Standard';
  }
}

export function mapSla(value: string | null | undefined): string {
  if (!value) return 'TBD';
  const normalized = value.replace(/_/g, ' ');
  const match =
    normalized.match(/(\d+)\s*business\s*days?/i) ||
    normalized.match(/(\d+)\s*days?/i) ||
    normalized.match(/(\d+)/);
  if (!match) return normalized;
  const days = Math.min(parseInt(match[1], 10), 5);
  return days === 1 ? '1 day' : `${days} days`;
}

export function approvalDetailLabel(approval: ApprovalRequirement): string {
  switch (approval) {
    case 'Required':
      return 'Approval required before fulfilment';
    case 'Conditional':
      return 'Approval may be required depending on scope';
    default:
      return 'Not required';
  }
}

export function categoryIdFromSlug(slug: string): string {
  return `CAT-${slug.replace(/_/g, '-').toUpperCase()}`;
}
