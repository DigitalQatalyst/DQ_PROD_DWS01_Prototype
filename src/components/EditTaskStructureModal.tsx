import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
interface EditTaskStructureModalProps {
  initialTab?: string;
  onClose: () => void;
}
const TABS = [
'Core Details',
'Strategic Context',
'Checklist',
'Evidence Rules',
'Custom Sections',
'Permissions',
'Review & Save'];

export function EditTaskStructureModal({
  initialTab = 'Core Details',
  onClose
}: EditTaskStructureModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const handleSave = () => {
    toast.success('Task structure updated locally.');
    onClose();
  };
  return (
    <>
      <div
        className="fixed inset-0 z-[250] bg-[#030F35]/40 backdrop-blur-sm"
        onClick={onClose} />
      
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[920px] h-[80vh] min-h-[600px] bg-white rounded-[12px] shadow-xl z-[300] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <h2 className="text-lg font-bold text-text-primary">
            Edit Task Structure
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-button transition-colors">
            
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-border-subtle bg-surface/30 p-4 overflow-y-auto">
            <div className="space-y-1">
              {TABS.map((tab) =>
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-border-subtle' : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}>
                
                  {tab}
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === 'Core Details' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Core Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Title
                    </label>
                    <input
                    type="text"
                    defaultValue="Build Stage 0 orientation shell"
                    className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Purpose
                    </label>
                    <textarea
                    rows={3}
                    defaultValue="Validate the Stage 0 entry experience..."
                    className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Expected Output
                    </label>
                    <textarea
                    rows={2}
                    defaultValue="Clickable Stage 0 shell..."
                    className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary" />
                  
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Owner
                      </label>
                      <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                        <option>Amina Hassan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Priority
                      </label>
                      <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'Strategic Context' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Strategic Context
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Strategic Aspiration
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>ASP-001 Improve DQ execution discipline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Objective
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>
                        OBJ-001 Increase governed task completeness
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Linked Execution Register
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>
                        REG-001 DWS.01 Prototype Readiness Register
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Register Item
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>RI-001 Stage 0 activation readiness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Contribution Type
                    </label>
                    <input
                    type="text"
                    defaultValue="Prototype validation"
                    className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary" />
                  
                  </div>
                </div>
              </div>
            }

            {activeTab === 'Checklist' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Checklist Configuration
                </h3>
                <div className="p-4 border border-border-subtle rounded-lg bg-surface space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded border border-border-strong">
                    <Check size={16} className="text-text-muted" />
                    <input
                    type="text"
                    defaultValue="Confirm task purpose"
                    className="flex-1 text-sm outline-none" />
                  
                    <select className="text-xs border border-border-subtle rounded p-1">
                      <option>Setup</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded border border-border-strong">
                    <Check size={16} className="text-text-muted" />
                    <input
                    type="text"
                    defaultValue="Attach evidence"
                    className="flex-1 text-sm outline-none" />
                  
                    <select className="text-xs border border-border-subtle rounded p-1">
                      <option>Evidence</option>
                    </select>
                  </div>
                  <button className="text-sm font-medium text-primary hover:underline">
                    + Add checklist item
                  </button>
                </div>
              </div>
            }

            {activeTab === 'Evidence Rules' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Evidence Rules
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary rounded border-border-strong" />
                  
                    <span className="text-sm font-medium text-text-primary">
                      Evidence required for closure
                    </span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Evidence Type
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>Document (PDF/Word)</option>
                      <option>Link / URL</option>
                      <option>Image</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'Custom Sections' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Custom Sections
                </h3>
                <div className="p-4 border border-border-subtle rounded-lg bg-surface">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      Objectives
                    </span>
                    <span className="text-xs text-text-muted">Required</span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    Visible to: All • Editable by: Lead/Admin
                  </div>
                </div>
                <button className="text-sm font-medium text-primary hover:underline">
                  + Add custom section
                </button>
              </div>
            }

            {activeTab === 'Permissions' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Permissions
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Who can edit core details
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>Owner & Leads</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Who can request closure
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>Owner Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Who can approve closure
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                      <option>Team Lead / Unit Lead</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            {activeTab === 'Review & Save' &&
            <div className="space-y-6 max-w-2xl">
                <h3 className="text-base font-bold text-text-primary mb-4">
                  Review Changes
                </h3>
                <div className="p-4 border border-border-subtle rounded-lg bg-surface">
                  <p className="text-sm text-text-secondary mb-2">
                    You are about to save changes to this task structure.
                  </p>
                  <ul className="list-disc list-inside text-sm text-text-primary space-y-1">
                    <li>Core details updated</li>
                    <li>Strategic context linked</li>
                  </ul>
                </div>
              </div>
            }
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
            
            Save changes
          </button>
        </div>
      </div>
    </>);

}