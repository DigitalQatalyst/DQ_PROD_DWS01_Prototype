import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
interface AddCustomSectionModalProps {
  onClose: () => void;
}
export function AddCustomSectionModal({ onClose }: AddCustomSectionModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Objectives');
  const handleSave = () => {
    toast.success('Custom section added locally.');
    onClose();
  };
  return (
    <>
      <div
        className="fixed inset-0 z-[250] bg-[#030F35]/40 backdrop-blur-sm"
        onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-white rounded-[12px] shadow-xl z-[300] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <h2 className="text-lg font-bold text-text-primary">
            Add Custom Section
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-button transition-colors">
            
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Section Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. Risks & Dependencies" />
            
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Section Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
              
              <option value="Objectives">Objectives</option>
              <option value="Risks">Risks</option>
              <option value="Dependencies">Dependencies</option>
              <option value="Milestones">Milestones</option>
              <option value="Review Notes">Review Notes</option>
              <option value="Strategic Contribution">
                Strategic Contribution
              </option>
              <option value="KPI Tracking">KPI Tracking</option>
              <option value="HRA Readiness">HRA Readiness</option>
              <option value="Support Fulfilment">Support Fulfilment</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Required
              </label>
              <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Visible To
              </label>
              <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                <option value="all">All Roles</option>
                <option value="team">Team Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Editable By
            </label>
            <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
              <option value="owner">Owner & Leads</option>
              <option value="leads">Leads Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>

        <div className="p-5 border-t border-border-subtle bg-surface flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-primary bg-white border border-border-strong rounded-button hover:bg-surface transition-colors">
            
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FB5535] rounded-button hover:bg-[#E04A2E] transition-colors">
            
            Add section
          </button>
        </div>
      </div>
    </>);

}