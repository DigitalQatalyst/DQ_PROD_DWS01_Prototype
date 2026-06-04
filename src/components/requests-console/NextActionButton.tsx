import React from 'react';
import type { NextActionType } from '../../types/requestsConsole';

interface NextActionButtonProps {
  action: NextActionType;
  onClick: (e: React.MouseEvent) => void;
}

export function NextActionButton({ action, onClick }: NextActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold text-secondary hover:text-primary hover:underline whitespace-nowrap"
    >
      {action}
    </button>
  );
}
