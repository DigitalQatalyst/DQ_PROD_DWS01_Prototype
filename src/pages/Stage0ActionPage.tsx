import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, FileText, LifeBuoy, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';
import { stage0WorkspaceRouteForPersona } from '../config/stage0HomeRoutes';

type ActionTone = 'primary' | 'secondary' | 'ghost';

interface ActionLink {
  label: string;
  route: string;
  tone?: ActionTone;
}

interface ActionPageConfig {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  highlights: string[];
  actions: ActionLink[];
}

const requestStatusAllowed = new Set(['associate', 'hra', 'admin', 'support']);
const servicesAllowed = new Set(['associate', 'hra', 'admin', 'support']);

function buttonClass(tone: ActionTone = 'ghost') {
  if (tone === 'primary') {
    return 'bg-primary text-white hover:bg-primary/90';
  }
  if (tone === 'secondary') {
    return 'border border-border-default bg-white text-primary hover:bg-surface';
  }
  return 'border border-transparent bg-surface text-primary hover:bg-navy-50';
}

export function Stage0ActionPage() {
  const navigate = useNavigate();
  const { actionId } = useParams();
  const { activePersona } = usePersona();
  const workspaceRoute = stage0WorkspaceRouteForPersona(activePersona.id);

  const configs: Record<string, ActionPageConfig> = {
    'workspace-setup': {
      eyebrow: 'Stage 0 Setup',
      title: 'Workspace Setup',
      description:
        'Use this setup surface to confirm the essentials that shape how DWS01 works for you before daily execution starts.',
      icon: ShieldCheck,
      highlights: [
        'Confirm your starting workspace and role context',
        'Check readiness cues before moving into execution',
        'Use built surfaces instead of placeholder setup prompts'
      ],
      actions: [
        { label: 'Open my workspace', route: workspaceRoute, tone: 'primary' },
        { label: 'Review onboarding', route: '/onboarding', tone: 'secondary' },
        { label: 'Check notifications', route: '/workspace/notifications' }
      ]
    },
    'access-tools': {
      eyebrow: 'Stage 0 Access',
      title: 'Access & Tools',
      description:
        'Review the most direct paths for requesting systems, tools, and follow-up support without falling back to a toast-only stub.',
      icon: ClipboardList,
      highlights: [
        'Use the service catalogue for new requests',
        'Track submitted items from My Requests',
        'Return to onboarding when access is part of initial setup'
      ],
      actions: [
        {
          label: servicesAllowed.has(activePersona.id) ? 'Browse service catalogue' : 'Open support route',
          route: servicesAllowed.has(activePersona.id) ? '/marketplaces/services' : '/stage-0/action/start-service-request',
          tone: 'primary'
        },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'Review onboarding steps', route: '/onboarding' }
      ]
    },
    'first-action-checklist': {
      eyebrow: 'Stage 0 Checklist',
      title: 'First Action Checklist',
      description:
        'This checklist page gives the user a real orientation surface for the first actions that move them from setup into execution.',
      icon: CheckCircle2,
      highlights: [
        'Confirm your workspace route and current tasks',
        'Review any requests already in progress',
        'Check platform notices before starting work'
      ],
      actions: [
        { label: 'Open my workspace', route: workspaceRoute, tone: 'primary' },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'View platform updates', route: '/stage-0/platform-updates' }
      ]
    },
    'start-service-request': {
      eyebrow: 'Support & Requests',
      title: 'Start Service Request',
      description:
        'This launch page keeps request initiation inside the product by routing to built request-adjacent surfaces or related support views.',
      icon: LifeBuoy,
      highlights: [
        'Use the service marketplace when your persona can create requests there',
        'Check current request status before raising a duplicate',
        'Use access guidance when the need is tooling or permissions'
      ],
      actions: [
        {
          label: servicesAllowed.has(activePersona.id) ? 'Open services marketplace' : 'Open access guidance',
          route: servicesAllowed.has(activePersona.id) ? '/marketplaces/services' : '/stage-0/action/access-tools',
          tone: 'primary'
        },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'Open access & tools', route: '/stage-0/action/access-tools' }
      ]
    },
    'platform-support': {
      eyebrow: 'Support & Requests',
      title: 'Platform Support',
      description:
        'This support page gives the user a clear entrypoint to knowledge, requests, and current workspace signals without dropping them into a missing route.',
      icon: LifeBuoy,
      highlights: [
        'Search existing guidance before raising a new request',
        'Use My Requests to inspect open support items',
        'Return to updates and notifications when the issue is informational'
      ],
      actions: [
        { label: 'Open my workspace', route: workspaceRoute, tone: 'primary' },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'Check notifications', route: '/workspace/notifications' }
      ]
    },
    'hra-onboarding': {
      eyebrow: 'Support & Requests',
      title: 'HRA & Onboarding',
      description:
        'This page keeps HRA and onboarding support discoverable from Home even when the full downstream HRA routes are persona-scoped elsewhere.',
      icon: FileText,
      highlights: [
        'Use onboarding for readiness and platform basics',
        'Track existing requests from the workspace',
        'Use access guidance when HRA tasks depend on permissions or tooling'
      ],
      actions: [
        { label: 'Open onboarding', route: '/onboarding', tone: 'primary' },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'Open access & tools', route: '/stage-0/action/access-tools' }
      ]
    },
    'resume-request': {
      eyebrow: 'Today\'s Priorities',
      title: 'Resume Last Work Item',
      description:
        'REQ-2401 is presented here as a real re-entry surface so the user can continue the item from Home without a non-existent deep-link.',
      icon: ClipboardList,
      highlights: [
        'Request: REQ-2401 Access & Permission Request',
        'Current state: Pending evidence update',
        'Next step: confirm the missing evidence and continue fulfilment'
      ],
      actions: [
        {
          label: requestStatusAllowed.has(activePersona.id) ? 'Open request status' : 'Open action queue',
          route: requestStatusAllowed.has(activePersona.id) ? '/requests/REQ-2401/status' : workspaceRoute,
          tone: 'primary'
        },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'View today\'s brief', route: '/stage-0/action/todays-brief' }
      ]
    },
    'pending-reviews': {
      eyebrow: 'Today\'s Priorities',
      title: 'Pending Reviews',
      description:
        'Use this review surface to orient the reviewer before they move into their deeper workspace or governance view.',
      icon: CheckCircle2,
      highlights: [
        '3 reviews awaiting input',
        '1 closure review is still pending owner confirmation',
        '2 handoffs need a routing or approval decision'
      ],
      actions: [
        { label: 'Open my workspace', route: workspaceRoute, tone: 'primary' },
        { label: 'View notifications', route: '/workspace/notifications', tone: 'secondary' },
        { label: 'View my requests', route: '/workspace/my-requests' }
      ]
    },
    'todays-brief': {
      eyebrow: 'Today\'s Brief',
      title: 'Full Brief',
      description:
        'This brief interface consolidates the recommendation, request pressure, and review cues into a dedicated Stage 0 screen.',
      icon: Sparkles,
      highlights: [
        '4 priority actions are active today',
        '1 request is approaching SLA risk',
        'Your last active work item is ready to resume'
      ],
      actions: [
        { label: 'Resume last work item', route: '/stage-0/action/resume-request', tone: 'primary' },
        { label: 'Open action queue', route: workspaceRoute, tone: 'secondary' },
        { label: 'View pending reviews', route: '/stage-0/action/pending-reviews' }
      ]
    },
    'risk-watch': {
      eyebrow: 'Work Overview',
      title: 'Risk Watch',
      description:
        'This risk interface keeps the high-signal items visible from Home while directing the user back into the right execution surfaces.',
      icon: ShieldCheck,
      highlights: [
        'SLA risk: Access request due in 8h',
        'Blocker: Missing approval owner',
        'Overdue update: Task evidence pending'
      ],
      actions: [
        { label: 'Open my workspace', route: workspaceRoute, tone: 'primary' },
        { label: 'View my requests', route: '/workspace/my-requests', tone: 'secondary' },
        { label: 'View notifications', route: '/workspace/notifications' }
      ]
    }
  };

  const config = actionId ? configs[actionId] : undefined;

  if (!config) {
    return (
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Stage 0 action not found</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
            This Stage 0 helper route does not have a configured interface yet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/stage-0/orientation')}
              className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:px-12">
      <section className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">{config.eyebrow}</p>
            <div className="mt-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-secondary">
                <Icon size={22} strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-[28px] font-bold leading-tight text-primary">{config.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">{config.description}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface px-4 py-3 text-sm text-text-secondary">
            <div className="font-semibold text-primary">Active workspace</div>
            <div className="mt-1">{activePersona.role}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {config.highlights.map((highlight) => (
            <div key={highlight} className="rounded-xl border border-border-subtle bg-surface p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-secondary" strokeWidth={1.7} />
                <p className="text-sm leading-6 text-text-secondary">{highlight}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {config.actions.map((action) => (
            <button
              key={`${config.title}-${action.label}`}
              type="button"
              onClick={() => navigate(action.route)}
              className={`inline-flex items-center gap-2 rounded-button px-4 py-2.5 text-sm font-semibold transition ${buttonClass(action.tone)}`}
            >
              {action.label}
              <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
