import { Clock } from 'lucide-react';
import { RiskBadge } from './DqBadge';
interface SlaBadgeProps {
  state: 'On Track' | 'At Risk' | 'Breached' | 'Met';
}
export function SlaBadge({
  state
}: SlaBadgeProps) {
  return <span className="inline-flex items-center gap-1">
      <Clock size={12} strokeWidth={1.5} className="text-current" />
      <RiskBadge risk={state} />
    </span>;
}
