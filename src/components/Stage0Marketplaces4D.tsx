import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart3,
  BookOpen,
  Boxes,
  ClipboardCheck,
  Compass,
  FileCheck2,
  FilePlus2,
  FileText,
  GraduationCap,
  LayoutTemplate,
  LineChart,
  ListChecks,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow
} from 'lucide-react';

type StageKey = 'discern' | 'design' | 'deploy' | 'drive';

interface MarketplaceEntry {
  label: string;
  route?: string;
  icon: typeof Search;
}

interface StageGroup {
  key: StageKey;
  title: string;
  subtitle: string;
  icon: typeof Search;
  entries: MarketplaceEntry[];
}

const groups: StageGroup[] = [
  {
    key: 'discern',
    title: 'Discern',
    subtitle: 'Find and understand',
    icon: Compass,
    entries: [
      { label: 'Services Marketplace', route: '/marketplaces/services', icon: Boxes },
      { label: 'Knowledge Center', route: '/marketplaces/knowledge', icon: BookOpen },
      { label: 'Learning Center', icon: GraduationCap },
      { label: 'People Directory', route: '/marketplaces/work-directory', icon: Users },
      { label: 'Reports Directory', icon: BarChart3 }
    ]
  },
  {
    key: 'design',
    title: 'Design',
    subtitle: 'Plan and structure',
    icon: LayoutTemplate,
    entries: [
      { label: 'Task Templates', route: '/marketplaces/task-templates', icon: FileText },
      { label: 'Workflow Templates', icon: Workflow },
      { label: 'Tracker Templates', icon: ListChecks },
      { label: 'Initiative Planning', icon: Target },
      { label: 'Governance Templates', icon: ShieldCheck }
    ]
  },
  {
    key: 'deploy',
    title: 'Deploy',
    subtitle: 'Start and execute',
    icon: Rocket,
    entries: [
      { label: 'Start Request', route: '/marketplaces/services', icon: FilePlus2 },
      { label: 'Create Task', route: '/workspace/my-tasks', icon: ClipboardCheck },
      { label: 'Start Workflow', icon: Workflow },
      { label: 'Create Tracker Item', route: '/workspace/my-work', icon: FileCheck2 },
      { label: 'Submit Feature Request', route: '/marketplaces/feedback', icon: Sparkles }
    ]
  },
  {
    key: 'drive',
    title: 'Drive',
    subtitle: 'Monitor and improve',
    icon: LineChart,
    entries: [
      { label: 'Performance Dashboards', route: '/marketplaces/analytics', icon: BarChart3 },
      { label: 'Governance Reviews', icon: ShieldCheck },
      { label: 'Strategic Initiatives Tracker', route: '/executive/strategic-initiatives', icon: Target },
      { label: 'Project Health Tracker', icon: LineChart },
      { label: 'AI Status Report Generator', icon: Sparkles }
    ]
  }
];

export function Stage0Marketplaces4D() {
  const navigate = useNavigate();
  const openEntry = (entry: MarketplaceEntry) => {
    if (entry.route) {
      navigate(entry.route);
      return;
    }
    toast.info(`${entry.label} placeholder`);
  };

  return (
    <section id="explore-marketplaces" className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Explore DWS Marketplaces — The 4D Model</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
          Discover, structure, execute, and improve work through DWS marketplace entry points.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        {groups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <article key={group.key} className="flex min-h-full flex-col rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-primary">
                  <GroupIcon size={21} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{group.title}</h3>
                  <p className="text-sm text-text-muted">{group.subtitle}</p>
                </div>
              </div>

              <div className="space-y-2">
                {group.entries.map((entry) => {
                  const EntryIcon = entry.icon;
                  return (
                    <button
                      key={entry.label}
                      onClick={() => openEntry(entry)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border-subtle bg-white px-3 py-2.5 text-left text-sm font-semibold text-text-secondary transition-colors hover:border-border-default hover:bg-surface hover:text-primary"
                      title={`Open ${entry.label}`}>
                      <EntryIcon size={16} className="text-text-muted" />
                      <span>{entry.label}</span>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
