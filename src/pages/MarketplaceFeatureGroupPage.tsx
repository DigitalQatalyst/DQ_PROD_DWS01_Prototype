import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Boxes,
  CalendarDays,
  FileText,
  Handshake,
  LayoutTemplate,
  MessageSquare,
  SearchCheck,
  Send,
  TrendingUp,
  Users,
} from 'lucide-react';
import { MARKETPLACE_4D_DESTINATIONS } from '../config/marketplace4dRoutes';
import { MarketplaceEyebrowTrail } from '../components/marketplace/MarketplaceEyebrowTrail';
import { buildMarketplaceHubTrail } from '../utils/marketplaceBreadcrumbs';

interface MarketplaceFeature {
  name: string;
  route: string;
  description: string;
  icon: LucideIcon;
}

interface MarketplaceGroupConfig {
  title: string;
  description: string;
  features: MarketplaceFeature[];
}

const marketplaceGroups: Record<string, MarketplaceGroupConfig> = {
  catalogue: {
    title: 'Catalogue',
    description:
      'Browse the 4D marketplace catalogue — Discern, Design, Deploy, and Drive pathways.',
    features: [
      {
        name: 'Discern',
        route: MARKETPLACE_4D_DESTINATIONS.discern,
        description: 'Find knowledge, analytics, and work ownership before you act.',
        icon: SearchCheck,
      },
      {
        name: 'Design',
        route: MARKETPLACE_4D_DESTINATIONS.design,
        description: 'Discover reusable task patterns, templates, and playbooks.',
        icon: LayoutTemplate,
      },
      {
        name: 'Deploy',
        route: MARKETPLACE_4D_DESTINATIONS.deploy,
        description: 'Access executable services and work-routing marketplaces.',
        icon: Boxes,
      },
      {
        name: 'Drive',
        route: MARKETPLACE_4D_DESTINATIONS.drive,
        description: 'Monitor outcomes, feedback, and improvement opportunities.',
        icon: TrendingUp,
      },
    ],
  },
  transaction: {
    title: 'Transaction',
    description:
      'Track and manage request CRM flows initiated from DWS marketplaces — from draft through closure.',
    features: [
      {
        name: 'My Requests',
        route: '/workspace/my-requests',
        description: 'View all requests you have raised across marketplace channels.',
        icon: Send,
      },
      {
        name: 'Submitted Requests',
        route: '/tracker/request-status-tracker/submitted-requests',
        description: 'Monitor requests submitted for fulfilment from Services and Task marketplaces.',
        icon: FileText,
      },
      {
        name: 'Request Drafts',
        route: '/tracker/request-status-tracker/request-drafts',
        description: 'Resume marketplace service or task requests saved as drafts.',
        icon: FileText,
      },
      {
        name: 'Request Status',
        route: '/tracker/request-status-tracker/request-status',
        description: 'Check live status across service, access, and task requests.',
        icon: SearchCheck,
      },
      {
        name: 'Pending Information',
        route: '/tracker/request-status-tracker/pending-information',
        description: 'Respond when fulfilment teams need additional input on your request.',
        icon: MessageSquare,
      },
      {
        name: 'Request Closure Status',
        route: '/tracker/request-status-tracker/request-closure-status',
        description: 'Review closure outcomes and evidence for completed marketplace requests.',
        icon: Boxes,
      },
      {
        name: 'Service Requests',
        route: '/marketplace/services?from=transaction',
        description: 'Submit and track HRA, IT access, platform support, and admin requests.',
        icon: Send,
      },
      {
        name: 'Task Requests',
        route: '/marketplace/task-library?from=transaction',
        description: 'Initiate governed task patterns from the Task Library marketplace.',
        icon: BarChart3,
      },
    ],
  },
  collaboration: {
    title: 'Collaboration',
    description:
      'Connect with owners, teams, sessions, and feedback loops across marketplace-driven work.',
    features: [
      {
        name: 'Work Directory',
        route: '/marketplace/work-directory',
        description: 'Find owners, experts, teams, and routing context for shared work.',
        icon: Users,
      },
      {
        name: 'Working Sessions',
        route: '/workspace/working-sessions',
        description: 'Join structured collaboration sessions with actions, notes, and linked work.',
        icon: CalendarDays,
      },
      {
        name: 'Marketplace Feedback',
        route: '/marketplace/feedback',
        description: 'Raise feedback on services, templates, knowledge, and marketplace paths.',
        icon: MessageSquare,
      },
      {
        name: 'Knowledge Sharing',
        route: '/marketplace/knowledge-discovery?from=collaboration',
        description: 'Discover and share approved knowledge assets with your team.',
        icon: BookOpen,
      },
      {
        name: 'Team & Ownership',
        route: '/marketplace/work-directory?from=collaboration',
        description: 'Identify accountable owners and collaboration contacts for marketplace work.',
        icon: Handshake,
      },
    ],
  },
};

export function MarketplaceFeatureGroupPage() {
  const location = useLocation();
  const groupId = location.pathname.split('/').filter(Boolean).pop();
  const group = groupId ? marketplaceGroups[groupId] : undefined;

  if (!group) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <p className="text-sm text-text-secondary">Marketplace group not found.</p>
        <Link
          to="/marketplace/catalogue"
          className="mt-4 inline-block text-sm font-semibold text-info-text">
          Go to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <header className="mb-8">
        <MarketplaceEyebrowTrail items={buildMarketplaceHubTrail(group.title)} />
        <h1 className="dq-page-title">{group.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{group.description}</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {group.features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.name}
              to={feature.route}
              className="rounded-card border border-border-subtle bg-white p-5 shadow-sm transition hover:bg-surface">
              <div className="flex items-start justify-between gap-3">
                <Icon size={22} className="text-primary" />
                <ArrowRight size={16} className="text-info-text" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-primary">{feature.name}</h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
