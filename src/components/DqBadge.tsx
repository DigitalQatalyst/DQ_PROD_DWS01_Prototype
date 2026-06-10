type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'orange' | 'navy';
type Priority = 'Low' | 'Medium' | 'High' | 'Critical' | string;
type Risk = 'Low' | 'Medium' | 'High' | 'Critical' | string;

const toneClass: Record<BadgeTone, string> = {
  success: 'dq-badge-success',
  warning: 'dq-badge-warning',
  danger: 'dq-badge-danger',
  info: 'dq-badge-info',
  gray: 'dq-badge-gray',
  orange: 'dq-badge-orange',
  navy: 'dq-badge-navy',
};

function statusTone(status: string): BadgeTone {
  const normalized = status.toLowerCase();
  if (['completed', 'closed', 'active', 'on track', 'met', 'approved', 'ready', 'reviewed'].includes(normalized)) return 'success';
  if (normalized === 'in progress' || normalized === 'in review' || normalized === 'under review') return 'info';
  if (['needs evidence', 'pending review', 'pending', 'needs attention', 'awaiting input', 'due today', 'due soon', 'review needed'].includes(normalized)) return 'warning';
  if (['overdue', 'blocked', 'breached', 'at risk', 'critical', 'returned', 'action required'].includes(normalized)) return 'danger';
  if (['draft', 'not started', 'new', 'routed'].includes(normalized)) return 'gray';
  return 'gray';
}

function priorityTone(priority: Priority): BadgeTone {
  const normalized = String(priority).toLowerCase();
  if (normalized.includes('critical')) return 'danger';
  if (normalized.includes('high')) return 'danger';
  if (normalized.includes('medium')) return 'warning';
  if (normalized.includes('low')) return 'success';
  return 'gray';
}

function riskTone(risk: Risk): BadgeTone {
  if (risk === 'Critical') return 'danger';
  if (risk === 'High') return 'danger';
  if (risk === 'Medium') return 'warning';
  if (risk === 'Low') return 'success';
  return statusTone(String(risk));
}

export function DqBadge({ label, tone = 'gray', dot = true }: { label: string; tone?: BadgeTone; dot?: boolean }) {
  return (
    <span className={`dq-badge ${toneClass[tone]}`}>
      {dot && <span className="dq-badge-dot" />}
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <DqBadge label={status} tone={statusTone(status)} />;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <DqBadge label={String(priority)} tone={priorityTone(priority)} dot={false} />;
}

export function RiskBadge({ risk }: { risk: Risk }) {
  return <DqBadge label={String(risk)} tone={riskTone(risk)} dot={false} />;
}

export function EvidenceBadge({ uploaded, required }: { uploaded: number; required: number }) {
  const missing = Math.max(required - uploaded, 0);
  return <DqBadge label={missing > 0 ? `${missing} missing` : 'Complete'} tone={missing > 0 ? 'warning' : 'success'} />;
}

export function DueDateBadge({ label }: { label: string }) {
  return <DqBadge label={label} tone={label.toLowerCase().includes('overdue') ? 'danger' : label.toLowerCase().includes('today') ? 'warning' : 'navy'} dot={false} />;
}

export function TaskTypeBadge({ taskType }: { taskType: string }) {
  return <DqBadge label={taskType} tone="navy" dot={false} />;
}
