import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { MonoId } from '../MonoId';
import { CategoryBadge } from '../CategoryBadge';
import { OwnerBadge } from '../OwnerBadge';
import { QueueBadge } from './QueueBadge';
import { PriorityPill } from './PriorityPill';
import { SlaStatusPill } from './SlaStatusPill';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import { RequestStatusPill } from './RequestStatusPill';
import { NextActionButton } from './NextActionButton';
import type { FulfilmentRequestRow } from '../../types/requestsConsole';

interface RequestsRowProps {
  row: FulfilmentRequestRow;
  onRowClick: () => void;
  onUpdateProgress: (e: React.MouseEvent) => void;
  onAddEvidence: (e: React.MouseEvent) => void;
  onHandoff: (e: React.MouseEvent) => void;
  onEscalate: (e: React.MouseEvent) => void;
  onNextAction: (e: React.MouseEvent) => void;
}

function PersonCell({ name, userId }: { name: string; userId?: string }) {
  if (userId) {
    return <OwnerBadge userId={userId} />;
  }
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-navy-100 text-primary flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold">{name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
      </div>
      <span className="text-xs font-medium text-text-primary">{name}</span>
    </div>
  );
}

export function RequestsRow({
  row,
  onRowClick,
  onUpdateProgress,
  onAddEvidence,
  onHandoff,
  onEscalate,
  onNextAction,
}: RequestsRowProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <tr
      onClick={onRowClick}
      className="border-b border-border-subtle hover:bg-surface/80 cursor-pointer transition-colors group"
    >
      <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <MonoId value={row.id} />
      </td>
      <td className="px-4 py-3 max-w-[200px]">
        <span className="text-sm font-semibold text-primary line-clamp-2">{row.title}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <CategoryBadge category={row.category} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <QueueBadge queue={row.queue} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PersonCell name={row.owner} userId={row.ownerUserId} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PersonCell name={row.requester} userId={row.requesterUserId} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PriorityPill priority={row.priority} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <SlaStatusPill state={row.slaState} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <RequestStatusPill status={row.fulfilmentStatus} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <EvidenceStateBadge state={row.evidenceState} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">{row.age}</td>
      <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <NextActionButton action={row.nextAction} onClick={onNextAction} />
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded hover:bg-surface text-text-muted"
              aria-label="Row actions"
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-white border border-border-default rounded-lg shadow-lg z-20 py-1">
                  <button type="button" onClick={onUpdateProgress} className="w-full text-left px-3 py-2 text-xs font-medium text-primary hover:bg-surface">
                    Update Progress
                  </button>
                  <button type="button" onClick={onAddEvidence} className="w-full text-left px-3 py-2 text-xs font-medium text-primary hover:bg-surface">
                    Add Evidence
                  </button>
                  <button type="button" onClick={onHandoff} className="w-full text-left px-3 py-2 text-xs font-medium text-primary hover:bg-surface">
                    Handoff
                  </button>
                  <button type="button" onClick={onEscalate} className="w-full text-left px-3 py-2 text-xs font-medium text-primary hover:bg-surface">
                    Escalate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
