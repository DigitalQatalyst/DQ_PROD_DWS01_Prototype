import type { MouseEvent } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
interface MonoIdProps {
  value: string;
}
export function MonoId({
  value
}: MonoIdProps) {
  const handleCopy = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success(`${value} copied`);
  };
  return <button onClick={handleCopy} aria-label={`Copy ${value}`} className="inline-flex items-center gap-1.5 rounded-button bg-surface px-2 py-1 text-text-secondary transition-colors hover:bg-navy-50 focus:outline-none focus:ring-4 focus:ring-primary/10 group" title="Copy ID">
      <span className="font-mono text-xs font-medium">{value}</span>
      <Copy size={12} strokeWidth={1.5} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted" />
    </button>;
}
