import React from 'react';
import { UploadCloud } from 'lucide-react';

export function EvidenceUploadStub() {
  return (
    <div>
      <label className="block text-sm font-semibold text-primary mb-1">
        Supporting Evidence (Optional)
      </label>
      <div className="w-full border-2 border-dashed border-border-strong rounded-button p-6 flex flex-col items-center justify-center bg-surface/50 hover:bg-surface transition-colors cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-muted mb-3 group-hover:text-primary shadow-sm border border-border-subtle transition-colors">
          <UploadCloud size={20} />
        </div>
        <p className="text-sm font-medium text-primary mb-1">Click to upload or drag and drop</p>
        <p className="text-xs text-text-muted">SVG, PNG, JPG, PDF or DOCX (max. 10MB)</p>
      </div>
    </div>
  );
}
