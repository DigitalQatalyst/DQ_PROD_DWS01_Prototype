export type WorkspaceRole =
  | 'Associate'
  | 'Scrum Master'
  | 'Team / Squad Lead'
  | 'Unit Lead'
  | 'HRA'
  | 'Admin'
  | 'Support'
  | 'CEO';

export type SegmentId =
  | 'S01_ASSOCIATE'
  | 'S02_SCRUM_MASTER'
  | 'S03_TEAM_SQUAD_LEAD'
  | 'S04_UNIT_LEAD'
  | 'S05_HRA'
  | 'S06_ADMIN'
  | 'S07_SUPPORT'
  | 'S08_CEO';

export type RoleFamily = 'Associate' | 'Manager / Lead' | 'Governance Lead' | 'Product / Admin';

export interface SegmentDefinition {
  id: SegmentId;
  label: WorkspaceRole;
  profileName: string;
  initials: string;
  subtitle: string;
}

export const segments: SegmentDefinition[] = [
  { id: 'S01_ASSOCIATE', label: 'Associate', profileName: 'Amina Hassan', initials: 'AH', subtitle: 'DQ Associate' },
  { id: 'S02_SCRUM_MASTER', label: 'Scrum Master', profileName: 'Bilal Waqar', initials: 'BW', subtitle: 'Scrum Master' },
  { id: 'S03_TEAM_SQUAD_LEAD', label: 'Team / Squad Lead', profileName: 'Sreya Lakshmi', initials: 'SL', subtitle: 'Team / Squad Lead' },
  { id: 'S04_UNIT_LEAD', label: 'Unit Lead', profileName: 'Ian Kipkorir', initials: 'IK', subtitle: 'Unit Lead' },
  { id: 'S05_HRA', label: 'HRA', profileName: 'Naomi Kimani', initials: 'NK', subtitle: 'Human Resources Associate' },
  { id: 'S06_ADMIN', label: 'Admin', profileName: 'Bilal Waqar', initials: 'BW', subtitle: 'Platform Administrator' },
  { id: 'S07_SUPPORT', label: 'Support', profileName: 'Omar Ali', initials: 'OA', subtitle: 'Support Operations' },
  { id: 'S08_CEO', label: 'CEO', profileName: 'Mariam Said', initials: 'MS', subtitle: 'Executive' }
];

export function getSegmentForRole(role: WorkspaceRole): SegmentDefinition {
  return segments.find((segment) => segment.label === role) || segments[0];
}

export function getRoleFamily(role: WorkspaceRole): RoleFamily {
  if (role === 'Scrum Master' || role === 'Team / Squad Lead' || role === 'Unit Lead' || role === 'CEO') return 'Manager / Lead';
  if (role === 'HRA' || role === 'Support') return 'Governance Lead';
  if (role === 'Admin') return 'Product / Admin';
  return 'Associate';
}
