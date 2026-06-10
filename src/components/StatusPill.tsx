import { StatusBadge } from './DqBadge';
interface StatusPillProps {
  status: string;
}
export function StatusPill({
  status
}: StatusPillProps) {
  return <StatusBadge status={status} />;
}
