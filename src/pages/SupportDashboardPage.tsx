import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { toast } from 'sonner';
export function SupportDashboardPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  return <RolePageScaffold eyebrow="Support Operations" title="Support Dashboard" purpose="Analyse support volume, SLA performance, and closure quality." kpis={[{
    label: 'Total Volume (30d)',
    value: '342',
    status: 'info'
  }, {
    label: 'SLA Met Rate',
    value: '94%',
    status: 'success'
  }, {
    label: 'Avg Resolution Time',
    value: '1.2 days',
    status: 'success'
  }, {
    label: 'Reopen Rate',
    value: '4.5%',
    status: 'warning'
  }]} loading={loading}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card border border-border-default shadow-sm p-6">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">
            Volume by Category
          </h3>
          <div className="space-y-4">
            {[{
            label: 'IT & Access',
            value: 45,
            color: 'bg-primary'
          }, {
            label: 'Platform Support',
            value: 30,
            color: 'bg-info'
          }, {
            label: 'HRA Requests',
            value: 15,
            color: 'bg-warning'
          }, {
            label: 'Knowledge / Content',
            value: 10,
            color: 'bg-success'
          }].map((item) => <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{
                width: `${item.value}%`
              }} />
                </div>
              </div>)}
          </div>
        </div>

        <div className="bg-white rounded-card border border-border-default shadow-sm p-6">
          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">
            SLA Performance Trend
          </h3>
          <div className="h-48 flex items-end justify-between gap-2 pt-4">
            {[92, 94, 91, 89, 95, 96, 94].map((val, i) => <div key={i} className="w-full flex flex-col items-center gap-2">
                <div className={`w-full rounded-t ${val >= 90 ? 'bg-success/80' : 'bg-warning/80'}`} style={{
              height: `${val}%`
            }} />
                <span className="text-xs text-text-muted">D{i + 1}</span>
              </div>)}
          </div>
        </div>
      </div>
    </RolePageScaffold>;
}