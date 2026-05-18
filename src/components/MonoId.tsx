import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
interface MonoIdProps {
  value: string;
}
export function MonoId({
  value
}: MonoIdProps) {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    toast.success(`${value} copied`);
  };
  return <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface hover:bg-border-subtle transition-colors text-text-secondary group" title="Copy ID">
      <span className="font-mono text-xs font-medium">{value}</span>
      <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted" />
    </button>;
}