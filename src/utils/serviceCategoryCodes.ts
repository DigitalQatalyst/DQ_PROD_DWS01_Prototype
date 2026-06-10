const categoryCodes: Record<string, string> = {
  'HRA Requests': 'HRA',
  'IT & Access': 'IT',
  'Platform Support': 'PLAT',
  'Knowledge / Content': 'KNOW',
  'Task / Workflow': 'TASK',
  'Admin Requests': 'ADMIN',
  'Approvals': 'APPROVAL',
  'Escalations': 'ESC',
};

export function getServiceCategoryCode(category: string): string {
  return categoryCodes[category] ?? category.slice(0, 4).toUpperCase();
}
