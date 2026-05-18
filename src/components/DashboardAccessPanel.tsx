import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  X,
  BarChart3,
  Lock,
  ArrowRight,
  Users,
  Database,
  RefreshCw,
  HelpCircle,
  Target,
  ShieldAlert } from
'lucide-react';
import { RequestIntakeWizard } from './RequestIntakeWizard';
interface DashboardAccessPanelProps {
  dashboard: any;
  activePersona: any;
  isPermitted?: boolean;
  onClose: () => void;
  onRequestAccess?: (dashboard: any) => void;
}
type PersonaId =
'associate' |
'scrum-master' |
'team-lead' |
'unit-lead' |
'hra' |
'admin' |
'support' |
'ceo';
// Dashboard access map — which personas can view, and where it routes
const dashboardAccessMap: Record<
  string,
  {
    allowed: PersonaId[];
    route: string;
  }> =
{
  'DSH-001': {
    allowed: [
    'associate',
    'scrum-master',
    'team-lead',
    'unit-lead',
    'hra',
    'admin',
    'support',
    'ceo'],

    route: '/intelligence/associate-performance'
  },
  'DSH-002': {
    allowed: ['scrum-master', 'team-lead', 'unit-lead', 'admin'],
    route: '/intelligence/team-unit-performance'
  },
  'DSH-003': {
    allowed: ['unit-lead', 'admin', 'ceo'],
    route: '/operations/unit-visibility'
  },
  'DSH-004': {
    allowed: [
    'scrum-master',
    'team-lead',
    'unit-lead',
    'admin',
    'support',
    'ceo'],

    route: '/intelligence/sla'
  },
  'DSH-005': {
    allowed: ['unit-lead', 'admin', 'ceo'],
    route: '/intelligence/governance'
  },
  'DSH-006': {
    allowed: ['team-lead', 'unit-lead', 'admin', 'ceo'],
    route: '/intelligence/outcome'
  },
  'DSH-007': {
    allowed: ['ceo'],
    route: '/executive/enterprise-execution'
  }
};
export function DashboardAccessPanel({
  dashboard,
  activePersona,
  isPermitted,
  onClose,
  onRequestAccess
}: DashboardAccessPanelProps) {
  const navigate = useNavigate();
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  if (!dashboard) return null;
  // Resolve permission either from prop or from access map
  const dashboardId = dashboard.id || dashboard.dashboardId;
  const mapEntry = dashboardAccessMap[dashboardId];
  const personaId = activePersona?.id as PersonaId | undefined;
  const computedPermitted =
  typeof isPermitted === 'boolean' ?
  isPermitted :
  !!(mapEntry && personaId && mapEntry.allowed.includes(personaId));
  const targetRoute = mapEntry?.route || dashboard.route;
  const handleOpenDashboard = () => {
    if (targetRoute) {
      try {
        navigate(targetRoute);
        onClose();
      } catch {
        toast.message(
          `Opening ${dashboard.title || 'dashboard'} in prototype context.`
        );
      }
    } else {
      toast.message(
        `Opening ${dashboard.title || 'dashboard'} in prototype context.`
      );
    }
  };
  const handleRequestAccessClick = () => {
    if (onRequestAccess) onRequestAccess(dashboard);
    setShowAccessRequest(true);
  };
  // Access request wizard — pre-filled IT & Access service
  if (showAccessRequest) {
    const accessService = {
      id: 'SVC-002',
      title: `Access request: ${dashboard.title || dashboardId}`,
      category: 'IT & Access',
      owner: 'Central Support Queue',
      sla: '1 business day',
      approvalRequired: true
    };
    return (
      <RequestIntakeWizard
        service={accessService}
        activePersona={activePersona}
        onClose={() => {
          setShowAccessRequest(false);
          onClose();
        }} />);


  }
  const metrics: string[] = dashboard.metrics || [
  'Active items by status',
  'SLA adherence rate',
  'Closure quality score',
  'Trend over time'];

  const questions: string[] = dashboard.questions || [
  'Where is work stuck?',
  'Who needs intervention?',
  'Are outcomes on track?'];

  const sourceObjects: string[] = dashboard.sourceObjects || [
  'Tasks',
  'Requests',
  'Registers',
  'Approvals',
  'SLAs'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030F35]/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard access"
      onClick={onClose}>
      
      <div
        className="bg-white rounded-[12px] shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#EEEFF6]">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-[10px] flex items-center justify-center ${computedPermitted ? 'bg-[#FB5535]/10 text-[#FB5535]' : 'bg-[#F6F6FB] text-[#5F607F]'}`}>
              
              {computedPermitted ?
              <BarChart3 size={20} strokeWidth={1.5} /> :

              <Lock size={20} strokeWidth={1.5} />
              }
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#5F607F] mb-1">
                {computedPermitted ?
                'Dashboard preview' :
                'Restricted dashboard'}
              </div>
              <h2 className="text-[18px] font-bold text-[#111118] leading-tight truncate">
                {dashboard.title || dashboardId || 'Dashboard'}
              </h2>
              {dashboard.audience &&
              <div className="text-xs text-[#5F607F] mt-1">
                  For: {dashboard.audience}
                </div>
              }
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-[#F6F6FB] flex items-center justify-center text-[#5F607F]"
            aria-label="Close">
            
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {computedPermitted ?
          <div className="space-y-5">
              {/* Metrics */}
              <section>
                <div className="flex items-center gap-2 mb-2 text-[#111118]">
                  <Target
                  size={14}
                  strokeWidth={1.5}
                  className="text-[#FB5535]" />
                
                  <h3 className="text-sm font-semibold">Metrics included</h3>
                </div>
                <ul className="space-y-1.5">
                  {metrics.map((m, i) =>
                <li
                  key={i}
                  className="text-sm text-[#2E2E42] flex items-start gap-2">
                  
                      <span className="text-[#FB5535] mt-1.5 w-1 h-1 rounded-full bg-[#FB5535] flex-shrink-0" />
                      <span>{m}</span>
                    </li>
                )}
                </ul>
              </section>

              {/* Data scope + Frequency */}
              <section className="grid grid-cols-2 gap-3">
                <div className="rounded-[10px] border border-[#EEEFF6] bg-[#F6F6FB] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5F607F] mb-1">
                    <Database size={12} strokeWidth={1.5} />
                    Data scope
                  </div>
                  <div className="text-sm font-medium text-[#111118]">
                    {dashboard.dataScope || 'Role-scoped operational data'}
                  </div>
                </div>
                <div className="rounded-[10px] border border-[#EEEFF6] bg-[#F6F6FB] p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#5F607F] mb-1">
                    <RefreshCw size={12} strokeWidth={1.5} />
                    Update frequency
                  </div>
                  <div className="text-sm font-medium text-[#111118]">
                    {dashboard.updateFrequency || 'Near real-time'}
                  </div>
                </div>
              </section>

              {/* Questions answered */}
              <section>
                <div className="flex items-center gap-2 mb-2 text-[#111118]">
                  <HelpCircle
                  size={14}
                  strokeWidth={1.5}
                  className="text-[#FB5535]" />
                
                  <h3 className="text-sm font-semibold">Questions answered</h3>
                </div>
                <ul className="space-y-1.5">
                  {questions.map((q, i) =>
                <li
                  key={i}
                  className="text-sm text-[#2E2E42] flex items-start gap-2">
                  
                      <span className="text-[#5F607F] flex-shrink-0">→</span>
                      <span>{q}</span>
                    </li>
                )}
                </ul>
              </section>

              {/* Source objects */}
              <section>
                <div className="flex items-center gap-2 mb-2 text-[#111118]">
                  <Users
                  size={14}
                  strokeWidth={1.5}
                  className="text-[#FB5535]" />
                
                  <h3 className="text-sm font-semibold">Source objects</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sourceObjects.map((s) =>
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full bg-[#F3F5FD] border border-[#D8D9E6] text-xs font-medium text-[#2E2E42]">
                  
                      {s}
                    </span>
                )}
                </div>
              </section>

              {/* Destination */}
              {targetRoute &&
            <section className="rounded-[10px] border border-[#FB5535]/20 bg-[#FB5535]/5 p-3">
                  <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#FB5535] mb-1">
                    Recommended destination
                  </div>
                  <div className="text-sm font-mono text-[#111118]">
                    {targetRoute}
                  </div>
                </section>
            }
            </div> :

          <div className="space-y-4">
              <div className="rounded-[10px] border border-[#D8D9E6] bg-[#F6F6FB] p-4 flex items-start gap-3">
                <ShieldAlert
                size={20}
                strokeWidth={1.5}
                className="text-[#D97706] flex-shrink-0 mt-0.5" />
              
                <div>
                  <div className="text-sm font-semibold text-[#111118] mb-1">
                    This dashboard requires a different role or approval.
                  </div>
                  <div className="text-sm text-[#5F607F]">
                    Your active persona (
                    {activePersona?.role ||
                  activePersona?.name ||
                  'current role'}
                    ) does not have access to this dashboard. You can request
                    access through IT & Access, and an approver will route your
                    request.
                  </div>
                </div>
              </div>

              {mapEntry &&
            <div className="text-xs text-[#5F607F]">
                  Access is granted to:{' '}
                  <span className="font-medium text-[#2E2E42]">
                    {mapEntry.allowed.join(', ')}
                  </span>
                </div>
            }
            </div>
          }
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#EEEFF6] bg-[#F6F6FB]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[8px] text-sm font-semibold text-[#2E2E42] hover:bg-white">
            
            {computedPermitted ?
            'Return to marketplace' :
            'Return to analytics'}
          </button>
          {computedPermitted ?
          <button
            onClick={handleOpenDashboard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#FB5535] hover:bg-[#e34a2c] text-white text-sm font-semibold transition-colors">
            
              Open dashboard
              <ArrowRight size={16} strokeWidth={1.5} />
            </button> :

          <button
            onClick={handleRequestAccessClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#FB5535] hover:bg-[#e34a2c] text-white text-sm font-semibold transition-colors">
            
              Request access
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          }
        </div>
      </div>
    </div>);

}