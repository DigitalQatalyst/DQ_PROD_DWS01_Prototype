import { CheckCircle2, XCircle } from 'lucide-react';
import { MarketplaceDetailSectionCard } from '../shared/MarketplaceDetailSectionCard';
import { MarketplaceDetailTabContent } from '../shared/MarketplaceDetailTabContent';

interface ServiceWhenToUseSectionProps {
  whenToUse: string[];
  whenNotToUse: string[];
}

function ServiceWhenToUseSection({
  whenToUse,
  whenNotToUse,
}: ServiceWhenToUseSectionProps) {
  if (whenToUse.length === 0 && whenNotToUse.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {whenToUse.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success-text">
            <CheckCircle2 size={14} />
            Use when
          </h3>
          <ul className="space-y-2.5">
            {whenToUse.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success-text" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {whenNotToUse.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-warning-text">
            <XCircle size={14} />
            Do not use when
          </h3>
          <ul className="space-y-2.5">
            {whenNotToUse.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed text-text-secondary">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-text" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface ServiceOverviewTabProps {
  whenToUse: string[];
  whenNotToUse: string[];
  requiredInputs: string[];
  keyReminders: { title: string; description: string }[];
}

export function ServiceOverviewTab({
  whenToUse,
  whenNotToUse,
  requiredInputs,
  keyReminders,
}: ServiceOverviewTabProps) {
  const hasDefinitions = whenToUse.length > 0 || whenNotToUse.length > 0;

  return (
    <MarketplaceDetailTabContent>
      {hasDefinitions && (
        <MarketplaceDetailSectionCard title="Definitions">
          <ServiceWhenToUseSection whenToUse={whenToUse} whenNotToUse={whenNotToUse} />
        </MarketplaceDetailSectionCard>
      )}

      {requiredInputs.length > 0 && (
        <MarketplaceDetailSectionCard title="Required inputs">
          <ul className="space-y-2">
            {requiredInputs.map((input) => (
              <li
                key={input}
                className="flex items-center gap-2.5 rounded-md border border-border-subtle bg-[#f7f7fd] px-3 py-2 text-[13px] text-text-secondary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                {input}
              </li>
            ))}
          </ul>
        </MarketplaceDetailSectionCard>
      )}

      {keyReminders.length > 0 && (
        <MarketplaceDetailSectionCard title="Before you submit">
          <div className="grid gap-3 sm:grid-cols-2">
            {keyReminders.map((reminder) => (
              <div
                key={reminder.title}
                className="rounded-md border border-border-subtle bg-[#f7f7fd] px-3.5 py-3"
              >
                <p className="text-xs font-semibold text-primary">{reminder.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
                  {reminder.description}
                </p>
              </div>
            ))}
          </div>
        </MarketplaceDetailSectionCard>
      )}
    </MarketplaceDetailTabContent>
  );
}
