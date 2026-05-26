import React from 'react';
import { Shield } from 'lucide-react';

export function AuditTrailCue() {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-text-muted mt-6 mb-2">
      <Shield size={12} />
      <span>Tracked in DWS.01 request history</span>
    </div>
  );
}
