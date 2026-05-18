import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { CheckSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { KpiTile } from '../components/KpiTile';
import { FilterBar } from '../components/FilterBar';
const TASK_MODELS = [
{
  id: 'MOD-001',
  name: 'Standard Delivery Task',
  purpose: 'For general execution and delivery work.',
  requiredSections: ['Core Details', 'Checklist'],
  requiredFields: ['Purpose', 'Expected Output', 'Due Date'],
  evidenceRule: 'Required for closure',
  approvalRule: 'None',
  closureCriteria: 'All checklist items complete, evidence attached.',
  editableBy: 'Team Lead, Unit Lead, Admin'
},
{
  id: 'MOD-002',
  name: 'Review Task',
  purpose: 'For peer reviews, quality checks, and sign-offs.',
  requiredSections: ['Core Details', 'Review Notes'],
  requiredFields: ['Purpose', 'Expected Output', 'Reviewer'],
  evidenceRule: 'Required for closure',
  approvalRule: 'Required',
  closureCriteria: 'Review notes added, approval granted.',
  editableBy: 'Team Lead, Unit Lead, Admin'
},
{
  id: 'MOD-003',
  name: 'Governance Action Task',
  purpose: 'For resolving governance risks and audit findings.',
  requiredSections: ['Core Details', 'Strategic Context', 'Governance Notes'],
  requiredFields: ['Linked Register Item', 'Purpose', 'Expected Output'],
  evidenceRule: 'Required for closure',
  approvalRule: 'Required',
  closureCriteria:
  'Governance notes added, evidence attached, approval granted.',
  editableBy: 'Admin'
},
{
  id: 'MOD-004',
  name: 'HRA Readiness Task',
  purpose: 'For onboarding, offboarding, and role transitions.',
  requiredSections: ['Core Details', 'HRA Readiness'],
  requiredFields: ['Purpose', 'Expected Output'],
  evidenceRule: 'Optional',
  approvalRule: 'Required',
  closureCriteria: 'HRA readiness fields complete, approval granted.',
  editableBy: 'HRA, Admin'
},
{
  id: 'MOD-005',
  name: 'Support Fulfilment Task',
  purpose: 'For resolving support tickets and requests.',
  requiredSections: ['Core Details', 'Support Fulfilment'],
  requiredFields: ['Linked Request', 'Expected Output'],
  evidenceRule: 'Optional',
  approvalRule: 'None',
  closureCriteria: 'Support fulfilment fields complete.',
  editableBy: 'Support, Admin'
},
{
  id: 'MOD-006',
  name: 'Strategic Contribution Task',
  purpose: 'For high-impact work directly tied to enterprise outcomes.',
  requiredSections: [
  'Core Details',
  'Strategic Context',
  'Objectives',
  'Strategic Contribution'],

  requiredFields: [
  'Strategic Aspiration',
  'Objective',
  'Purpose',
  'Expected Output'],

  evidenceRule: 'Required for closure',
  approvalRule: 'Required',
  closureCriteria:
  'Strategic contribution note added, evidence attached, approval granted.',
  editableBy: 'Unit Lead, Admin'
}];

export function TaskModelConfigPage() {
  const [activeTab, setActiveTab] = useState('Task Types');
  const tabs = [
  'Task Types',
  'Required Fields',
  'Status Model',
  'Evidence Rules',
  'Closure Rules',
  'Permissions'];

  const handleEdit = (name: string) => {
    toast.success('Task model updated locally.');
  };
  return (
    <RolePageScaffold
      eyebrow="Administration"
      title="Task Model Configuration"
      purpose="Configure task types, required fields, status model, evidence rules, checklist rules, closure criteria, and extensibility rules.">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiTile label="Task Types" value="6" status="info" />
        <KpiTile label="Required Fields" value="14" status="info" />
        <KpiTile label="Active Section Templates" value="9" status="info" />
        <KpiTile label="Permission Rules" value="72" status="info" />
      </div>

      <FilterBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search=""
        onSearchChange={() => {}} />
      

      {activeTab === 'Task Types' &&
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TASK_MODELS.map((model) =>
        <div
          key={model.id}
          className="bg-white rounded-card border border-border-default shadow-sm p-5 flex flex-col">
          
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare size={18} className="text-primary" />
                  <span className="font-bold text-primary">{model.name}</span>
                </div>
                <span className="text-xs font-mono text-text-muted">
                  {model.id}
                </span>
              </div>

              <p className="text-sm text-text-secondary mb-4">
                {model.purpose}
              </p>

              <div className="space-y-4 mb-6 flex-1">
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Required Sections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {model.requiredSections.map((s) =>
                <span
                  key={s}
                  className="px-2 py-0.5 bg-surface rounded text-xs text-text-secondary border border-border-subtle">
                  
                        {s}
                      </span>
                )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Required Fields
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {model.requiredFields.map((f) =>
                <span
                  key={f}
                  className="px-2 py-0.5 bg-surface rounded text-xs text-text-secondary border border-border-subtle">
                  
                        {f}
                      </span>
                )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-text-muted block mb-1">
                      Evidence
                    </span>
                    <span className="text-sm text-text-primary">
                      {model.evidenceRule}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block mb-1">
                      Approval
                    </span>
                    <span className="text-sm text-text-primary">
                      {model.approvalRule}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Closure Criteria
                  </span>
                  <span className="text-sm text-text-primary">
                    {model.closureCriteria}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">
                    Editable By
                  </span>
                  <span className="text-sm text-text-primary">
                    {model.editableBy}
                  </span>
                </div>
              </div>

              <button
            onClick={() => handleEdit(model.name)}
            className="w-full py-2 bg-surface border border-border-strong text-text-primary text-sm font-medium rounded hover:bg-border-subtle transition-colors flex items-center justify-center gap-2 mt-auto">
            
                <Settings size={14} />
                Configure Model
              </button>
            </div>
        )}
        </div>
      }

      {activeTab !== 'Task Types' &&
      <div className="p-8 text-center border border-dashed border-border-strong rounded-lg bg-surface">
          <p className="text-sm text-text-muted">
            This configuration tab is not fully implemented in the prototype.
          </p>
        </div>
      }
    </RolePageScaffold>);

}