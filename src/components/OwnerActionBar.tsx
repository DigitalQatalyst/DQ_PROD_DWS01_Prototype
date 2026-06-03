import React, { useState } from 'react';
import { Check, MessageSquare, Edit2, XCircle } from 'lucide-react';

interface OwnerActionBarProps {
  onAccept: () => void;
  onReturnForInfo: () => void;
  onUpdateStatus: (status: string) => void;
  onClose: () => void;
  currentStatus: string;
  actionNeeded?: string;
}

export function OwnerActionBar({ onAccept, onReturnForInfo, onUpdateStatus, onClose, currentStatus, actionNeeded }: OwnerActionBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {currentStatus === 'New' && (
        <button 
          onClick={onAccept}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          <Check size={14} />
          {actionNeeded || 'Accept'}
        </button>
      )}

      {currentStatus !== 'New' && currentStatus !== 'Closed' && (
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border-strong text-primary text-xs font-semibold rounded hover:bg-surface transition-colors whitespace-nowrap"
          >
            <Edit2 size={14} />
            {actionNeeded || 'Update Status'}
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-border-default rounded-md shadow-lg z-10 py-1">
              <button 
                onClick={() => { onUpdateStatus('In Review'); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-surface font-medium"
              >
                In Review
              </button>
              <button 
                onClick={() => { onUpdateStatus('In Fulfilment'); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-surface font-medium"
              >
                In Fulfilment
              </button>
              <button 
                onClick={() => { onUpdateStatus('Waiting on Requester'); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-surface font-medium"
              >
                Waiting on Requester
              </button>
              <div className="h-px bg-border-subtle my-1" />
              <button 
                onClick={() => { onReturnForInfo(); setMenuOpen(false); }}
                className="w-full flex items-center gap-1.5 text-left px-3 py-2 text-xs text-warning-text hover:bg-warning-surface/50 font-medium"
              >
                <MessageSquare size={12} />
                Return for Info
              </button>
              <div className="h-px bg-border-subtle my-1" />
              <button 
                onClick={() => { onClose(); setMenuOpen(false); }}
                className="w-full flex items-center gap-1.5 text-left px-3 py-2 text-xs text-success-text hover:bg-success-surface/50 font-medium"
              >
                <Check size={12} />
                Close Request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
