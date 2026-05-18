import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import {
  customSectionTemplates,
  dynamicFieldLibrary } from
'../mocks/governedTasks.mock';
import { AddCustomSectionModal } from '../components/AddCustomSectionModal';
import { AddDynamicFieldModal } from '../components/AddDynamicFieldModal';
import { GripVertical, Plus } from 'lucide-react';
import { toast } from 'sonner';
export function TaskSectionBuilderPage() {
  const [selectedSection, setSelectedSection] = useState(
    customSectionTemplates[0]
  );
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const handleSave = () => {
    toast.success('Task section template saved locally.');
  };
  return (
    <RolePageScaffold
      eyebrow="Administration"
      title="Task Section Builder"
      purpose="Configure reusable task sections that can be added to task structures."
      primaryAction={{
        label: 'Save Template',
        onClick: handleSave
      }}>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)] min-h-[500px]">
        {/* Left: Section Library */}
        <div className="lg:col-span-3 bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface/50">
            <h3 className="font-bold text-text-primary text-sm">
              Section Library
            </h3>
            <button
              onClick={() => setIsAddSectionModalOpen(true)}
              className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
              
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {customSectionTemplates.map((section) =>
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSection === section ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface'}`}>
              
                {section}
              </button>
            )}
          </div>
        </div>

        {/* Center: Fields in Selected Section */}
        <div className="lg:col-span-6 bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface/50">
            <h3 className="font-bold text-text-primary text-sm">
              Fields in {selectedSection}
            </h3>
            <button
              onClick={() => setIsAddFieldModalOpen(true)}
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              
              <Plus size={14} /> Add field
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {dynamicFieldLibrary.slice(0, 4).map((field, i) =>
            <div
              key={field.id}
              className="flex items-center gap-3 p-3 bg-surface border border-border-subtle rounded-lg group cursor-move hover:border-primary/30 transition-colors">
              
                <GripVertical
                size={16}
                className="text-text-muted group-hover:text-text-primary" />
              
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-text-primary">
                      {field.label}
                    </span>
                    <span className="text-xs font-mono text-text-muted">
                      {field.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="px-1.5 py-0.5 bg-white border border-border-subtle rounded">
                      {field.type}
                    </span>
                    <span>•</span>
                    <span className={field.required ? 'text-danger' : ''}>
                      {field.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div className="lg:col-span-3 bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-surface/50">
            <h3 className="font-bold text-text-primary text-sm">
              Section Properties
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Section Name
              </label>
              <input
                type="text"
                value={selectedSection}
                readOnly
                className="w-full px-3 py-2 bg-surface border border-border-strong rounded-button text-sm focus:outline-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Purpose
              </label>
              <textarea
                rows={3}
                defaultValue={`Capture information related to ${selectedSection.toLowerCase()}.`}
                className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Required
              </label>
              <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Visible To
              </label>
              <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                <option>All Roles</option>
                <option>Team Only</option>
                <option>Admins Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Editable By
              </label>
              <select className="w-full px-3 py-2 bg-white border border-border-strong rounded-button text-sm focus:outline-none focus:border-primary">
                <option>Owner & Leads</option>
                <option>Leads Only</option>
                <option>Admins Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isAddSectionModalOpen &&
      <AddCustomSectionModal
        onClose={() => setIsAddSectionModalOpen(false)} />

      }
      {isAddFieldModalOpen &&
      <AddDynamicFieldModal onClose={() => setIsAddFieldModalOpen(false)} />
      }
    </RolePageScaffold>);

}