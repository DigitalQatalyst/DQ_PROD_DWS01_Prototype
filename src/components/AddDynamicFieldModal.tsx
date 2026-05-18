import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
interface AddDynamicFieldModalProps {
  onClose: () => void;
}
export function AddDynamicFieldModal({ onClose }: AddDynamicFieldModalProps) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('Text');
  const handleSave = () => {
    toast.success('Dynamic field added locally.');
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
            Add Dynamic Field
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
              Field Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. Target Launch Date" />
            
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Field Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
              
              <option value="Text">Text</option>
              <option value="Long text">Long text</option>
              <option value="Select">Select</option>
              <option value="Multi-select">Multi-select</option>
              <option value="Date">Date</option>
              <option value="User">User</option>
              <option value="Number">Number</option>
              <option value="Status">Status</option>
              <option value="Linked objective">Linked objective</option>
              <option value="Linked register item">Linked register item</option>
              <option value="Evidence">Evidence</option>
              <option value="KPI">KPI</option>
              <option value="Risk">Risk</option>
              <option value="Milestone">Milestone</option>
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
            
            Add field
          </button>
        </div>
      </div>
    </>);

}