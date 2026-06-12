import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Bot, ClipboardCheck, Home, LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface OrientationFeature {
  name: string;
  route: string;
  description: string;
  icon: LucideIcon;
}

interface OrientationGroupConfig {
  title: string;
  description: string;
  features: OrientationFeature[];
}

const orientationGroups: Record<string, OrientationGroupConfig> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Start here to orient yourself in the DWS workspace.',
    features: [
      {
        name: 'Home',
        route: '/home',
        description: 'Your workspace entry point with orientation context and next steps.',
        icon: Home,
      },
    ],
  },
  'quick-links': {
    title: 'Quick Links',
    description: 'Jump directly to your most-used execution surfaces and AI assistance.',
    features: [
      {
        name: 'My Dashboard',
        route: '/dashboard',
        description: 'Your personalised work dashboard with KPIs, priorities, and recent activity.',
        icon: LayoutDashboard,
      },
      {
        name: 'My Work',
        route: '/tasks/my-work',
        description: 'Act on assigned tasks, requests, approvals, blockers, and due items.',
        icon: ClipboardCheck,
      },
      {
        name: 'AI Cockpit',
        route: '/ai-cockpit',
        description: 'Ask, automate, and analyse with AI assistance across your workspace.',
        icon: Bot,
      },
    ],
  },
};

export function OrientationFeatureGroupPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const group = groupId ? orientationGroups[groupId] : undefined;

  if (!group) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <p className="text-sm text-text-secondary">Feature group not found.</p>
        <Link to="/home" className="mt-4 inline-block text-sm font-semibold text-info-text">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-text-muted">Orientation</div>
        <h1 className="mt-1 text-3xl font-bold text-primary">{group.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{group.description}</p>
      </div>

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
