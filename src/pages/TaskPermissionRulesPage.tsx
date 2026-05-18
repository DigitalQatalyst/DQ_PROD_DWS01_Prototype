import React, { useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { toast } from 'sonner';
const ROLES = [
'Associate',
'Scrum Master',
'Team / Squad Lead',
'Unit Lead',
'HRA',
'Admins',
'Support',
'CEO'];

const ACTIONS = [
'Edit core details',
'Edit strategic context',
'Add objectives',
'Add custom sections',
'Update assigned fields',
'Configure task type',
'Approve closure',
'Archive task',
'View audit trail'];

const INITIAL_MATRIX: Record<string, Record<string, string>> = {
  Associate: {
    'Edit core details': 'Assigned tasks only',
    'Edit strategic context': 'No',
    'Add objectives': 'No',
    'Add custom sections': 'No',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'No',
    'Archive task': 'No',
    'View audit trail': 'Limited'
  },
  'Scrum Master': {
    'Edit core details': 'Review notes only',
    'Edit strategic context': 'No',
    'Add objectives': 'No',
    'Add custom sections': 'No',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'No',
    'Archive task': 'No',
    'View audit trail': 'Team scope'
  },
  'Team / Squad Lead': {
    'Edit core details': 'Team tasks',
    'Edit strategic context': 'Team tasks',
    'Add objectives': 'Yes',
    'Add custom sections': 'Limited',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'Yes',
    'Archive task': 'Limited',
    'View audit trail': 'Team scope'
  },
  'Unit Lead': {
    'Edit core details': 'Unit tasks',
    'Edit strategic context': 'Unit tasks',
    'Add objectives': 'Yes',
    'Add custom sections': 'Limited',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'Yes',
    'Archive task': 'Limited',
    'View audit trail': 'Unit scope'
  },
  HRA: {
    'Edit core details': 'HRA tasks',
    'Edit strategic context': 'HRA scope',
    'Add objectives': 'HRA scope',
    'Add custom sections': 'HRA task sections',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'HRA tasks',
    'Archive task': 'No',
    'View audit trail': 'HRA scope'
  },
  Admins: {
    'Edit core details': 'Yes',
    'Edit strategic context': 'Yes',
    'Add objectives': 'Yes',
    'Add custom sections': 'Yes',
    'Update assigned fields': 'Yes',
    'Configure task type': 'Yes',
    'Approve closure': 'Yes',
    'Archive task': 'Yes',
    'View audit trail': 'Full'
  },
  Support: {
    'Edit core details': 'Support tasks',
    'Edit strategic context': 'Support scope',
    'Add objectives': 'No',
    'Add custom sections': 'Support fulfilment fields',
    'Update assigned fields': 'Yes',
    'Configure task type': 'No',
    'Approve closure': 'Support tasks',
    'Archive task': 'No',
    'View audit trail': 'Support scope'
  },
  CEO: {
    'Edit core details': 'No',
    'Edit strategic context': 'No',
    'Add objectives': 'No',
    'Add custom sections': 'No',
    'Update assigned fields': 'Executive notes only',
    'Configure task type': 'No',
    'Approve closure': 'Executive review only',
    'Archive task': 'No',
    'View audit trail': 'Enterprise summary'
  }
};
export function TaskPermissionRulesPage() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const handleSave = () => {
    toast.success('Task permission rules updated locally.');
  };
  const handleReset = () => {
    setMatrix(INITIAL_MATRIX);
    toast.success('Permission rules reset to defaults.');
  };
  const handleChange = (role: string, action: string, value: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [action]: value
      }
    }));
  };
  return (
    <RolePageScaffold
      eyebrow="Administration"
      title="Task Permission Rules"
      purpose="Control who can edit task structures, update dynamic fields, approve closure, and configure task types.">
      
      <div className="flex items-center justify-end gap-3 mb-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-text-primary bg-white border border-border-strong rounded-button hover:bg-surface transition-colors">
          
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-[#FB5535] rounded-button hover:bg-[#E04A2E] transition-colors">
          
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-[12px] border border-[#D8D9E6] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-surface border-b border-border-subtle">
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider sticky left-0 bg-surface z-10 border-r border-border-subtle">
                Role
              </th>
              {ACTIONS.map((action) =>
              <th
                key={action}
                className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider min-w-[140px]">
                
                  {action}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {ROLES.map((role) =>
            <tr key={role} className="hover:bg-surface/30 transition-colors">
                <td className="p-4 text-sm font-bold text-text-primary sticky left-0 bg-white group-hover:bg-surface/30 z-10 border-r border-border-subtle">
                  {role}
                </td>
                {ACTIONS.map((action) => {
                const val = matrix[role][action];
                const isYes = val === 'Yes';
                const isNo = val === 'No';
                return (
                  <td key={action} className="p-3">
                      <select
                      value={val}
                      onChange={(e) =>
                      handleChange(role, action, e.target.value)
                      }
                      className={`w-full text-xs font-medium px-2 py-1.5 rounded border outline-none transition-colors ${isYes ? 'bg-success/10 text-success border-success/20' : isNo ? 'bg-surface text-text-muted border-border-subtle' : 'bg-primary/5 text-primary border-primary/20'}`}>
                      
                        <option value={val}>{val}</option>
                        {!isYes && <option value="Yes">Yes</option>}
                        {!isNo && <option value="No">No</option>}
                        {val !== 'Limited' &&
                      <option value="Limited">Limited</option>
                      }
                      </select>
                    </td>);

              })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </RolePageScaffold>);

}