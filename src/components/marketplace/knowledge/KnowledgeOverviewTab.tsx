import type { LucideIcon } from 'lucide-react';
import { Layers } from 'lucide-react';
import type { KeyReminder, OverviewRow } from '../../../utils/knowledgeDetailContent';
import { MarketplaceDetailSectionCard } from '../shared/MarketplaceDetailSectionCard';
import { MarketplaceDetailTabContent } from '../shared/MarketplaceDetailTabContent';

interface KnowledgeOverviewTabProps {
  overviewRows: OverviewRow[];
  appliesTo: string[];
  keyReminders: KeyReminder[];
}

function IconCircle({ icon: Icon, size = 'md' }: { icon: LucideIcon; size?: 'md' | 'sm' }) {
  const dim = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full bg-orange-50 text-dq-orange`}
    >
      <Icon size={iconSize} strokeWidth={2} />
    </span>
  );
}

export function KnowledgeOverviewTab({
  overviewRows,
  appliesTo,
  keyReminders,
}: KnowledgeOverviewTabProps) {
  return (
    <MarketplaceDetailTabContent>
      <MarketplaceDetailSectionCard title="What, why, and how">
        <div className="space-y-4">
          {overviewRows.map((row) => (
            <div key={row.label} className="flex gap-3">
              <IconCircle icon={row.icon} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dq-navy">{row.label}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{row.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MarketplaceDetailSectionCard>

      <MarketplaceDetailSectionCard title="Applies to">
        <div className="flex flex-wrap gap-2">
          {appliesTo.map((item) => (
            <div
              key={item}
              className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5"
            >
              <Layers size={12} className="shrink-0 text-gray-400" strokeWidth={2} />
              <span className="truncate text-xs font-medium text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </MarketplaceDetailSectionCard>

      <MarketplaceDetailSectionCard title="Key reminders">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {keyReminders.map((reminder) => (
            <div
              key={reminder.title}
              className="flex items-start gap-2.5 rounded-md border border-gray-200 bg-gray-50/80 px-3 py-2.5"
            >
              <IconCircle icon={reminder.icon} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-snug text-dq-navy">{reminder.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-gray-500 line-clamp-2">
                  {reminder.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MarketplaceDetailSectionCard>
    </MarketplaceDetailTabContent>
  );
}
