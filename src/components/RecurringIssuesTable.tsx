import React from 'react';

export function RecurringIssuesTable() {
  const issues = [
    { issue: 'Privileged access rationale missing', category: 'IT & Access', count: 12, action: 'Update required inputs in service configuration' },
    { issue: 'Onboarding date not provided', category: 'HRA Requests', count: 8, action: 'Make start date a required field for Associate' },
    { issue: 'Dashboard rendering bug reported', category: 'Platform Support', count: 5, action: 'Escalate to engineering team' },
  ];

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-border-default bg-surface/30">
        <h2 className="text-lg font-bold text-primary">Recurring Return Reasons</h2>
        <p className="text-sm text-text-secondary mt-1">Frequent issues causing requests to be returned or blocked.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle text-xs font-bold text-text-muted uppercase tracking-wider bg-surface/50">
              <th className="px-5 py-3">Reported Issue</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-center">Incidents</th>
              <th className="px-5 py-3">Suggested Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {issues.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface/50 transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-primary">{item.issue}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{item.category}</td>
                <td className="px-5 py-3 text-sm font-mono font-medium text-text-secondary text-center">{item.count}</td>
                <td className="px-5 py-3 text-sm text-primary">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
