import { ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ApprovalStep } from '../../../utils/knowledgeDetailContent';
import { formatReviewDate } from '../../../utils/knowledgeDetailContent';
import { MarketplaceDetailSectionCard } from '../shared/MarketplaceDetailSectionCard';
import { MarketplaceDetailTabContent } from '../shared/MarketplaceDetailTabContent';

interface VersionRow {
  version: string;
  date: string;
  summary: string;
}

interface PolicyLink {
  id: string;
  title: string;
}

interface KnowledgeGovernanceTabProps {
  approvalSteps: ApprovalStep[];
  versionHistory: VersionRow[];
  policyLinks: PolicyLink[];
  detailHref?: (id: string) => string;
  flowTitle?: string;
}

function PolicyLinkRow({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2.5">
        <FileText size={14} className="shrink-0 text-gray-400" strokeWidth={2} />
        <span className="truncate text-xs font-medium text-dq-navy group-hover:text-dq-orange">
          {title}
        </span>
      </span>
      <ExternalLink
        size={13}
        className="shrink-0 text-gray-400 transition group-hover:text-dq-orange"
      />
    </>
  );

  const className =
    'group flex w-full items-center justify-between gap-3 px-5 py-3 transition hover:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2';

  if (!href || href === '#') {
    return (
      <button type="button" className={className}>
        {content}
      </button>
    );
  }

  if (href.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
}

export function KnowledgeGovernanceTab({
  approvalSteps,
  versionHistory,
  policyLinks,
  detailHref,
  flowTitle = 'Review & Approval Flow',
}: KnowledgeGovernanceTabProps) {
  return (
    <MarketplaceDetailTabContent>
      <MarketplaceDetailSectionCard title={flowTitle}>
        <div className="flex items-start">
          {approvalSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === approvalSteps.length - 1;

            return (
              <div key={`${step.step}-${step.title}`} className="flex min-w-0 flex-1 items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-[10px] font-semibold text-dq-navy">
                    {step.step}
                  </div>
                  <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-dq-orange">
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-dq-navy">{step.title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{step.description}</p>
                </div>
                {!isLast && (
                  <div className="flex w-6 shrink-0 items-center justify-center pt-3 sm:w-8">
                    <ChevronRight size={14} className="text-gray-300" aria-hidden />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </MarketplaceDetailSectionCard>

      <MarketplaceDetailSectionCard title="Change History">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 pr-4 text-[11px] font-medium text-gray-400">Version</th>
                <th className="pb-2 pr-4 text-[11px] font-medium text-gray-400">Date</th>
                <th className="pb-2 text-[11px] font-medium text-gray-400">Summary</th>
              </tr>
            </thead>
            <tbody>
              {versionHistory.map((row) => (
                <tr
                  key={`${row.version}-${row.date}`}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-2 pr-4 text-xs font-semibold text-dq-navy">{row.version}</td>
                  <td className="py-2 pr-4 text-xs text-gray-500">
                    {formatReviewDate(row.date)}
                  </td>
                  <td className="py-2 text-xs text-gray-700">{row.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MarketplaceDetailSectionCard>

      {policyLinks.length > 0 && (
        <MarketplaceDetailSectionCard title="Policy Alignment" flush>
          <ul className="-mx-5 divide-y divide-gray-100 border-t border-gray-100">
            {policyLinks.map((policy) => (
              <li key={policy.id}>
                <PolicyLinkRow title={policy.title} href={detailHref?.(policy.id)} />
              </li>
            ))}
          </ul>
        </MarketplaceDetailSectionCard>
      )}
    </MarketplaceDetailTabContent>
  );
}
