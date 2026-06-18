import { ExternalLink, FileText, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SupportingMaterial } from '../../../utils/knowledgeDetailContent';
import { MarketplaceDetailSectionCard } from '../shared/MarketplaceDetailSectionCard';
import { MarketplaceDetailTabContent } from '../shared/MarketplaceDetailTabContent';

interface ResourceLink {
  id: string;
  title: string;
}

interface KnowledgeResourcesTabProps {
  relatedResources: ResourceLink[];
  supportingMaterials: SupportingMaterial[];
  detailHref?: (id: string) => string;
}

function ResourceRow({
  title,
  href,
}: {
  title: string;
  href?: string;
}) {
  const className =
    'group flex w-full items-center justify-between gap-3 px-5 py-3 transition hover:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2';

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

export function KnowledgeResourcesTab({
  relatedResources,
  supportingMaterials,
  detailHref,
}: KnowledgeResourcesTabProps) {
  return (
    <MarketplaceDetailTabContent>
      <MarketplaceDetailSectionCard title="Related Resources" flush>
        <ul className="-mx-5 divide-y divide-gray-100 border-t border-gray-100">
          {relatedResources.map((resource) => (
            <li key={resource.id}>
              <ResourceRow title={resource.title} href={detailHref?.(resource.id)} />
            </li>
          ))}
        </ul>
      </MarketplaceDetailSectionCard>

      <MarketplaceDetailSectionCard title="Supporting Materials">
        <div className="grid gap-3 sm:grid-cols-3">
          {supportingMaterials.map((material) => {
            const Icon = material.icon;

            return (
              <button
                key={material.label}
                type="button"
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-left transition hover:border-gray-300 hover:bg-gray-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-dq-orange">
                  <Icon size={14} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-dq-navy">
                  {material.label}
                </span>
                <ExternalLink size={12} className="shrink-0 text-gray-400" />
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-md border border-info/15 bg-info/5 px-3 py-2">
          <Info size={14} className="shrink-0 text-info" />
          <p className="text-[11px] text-gray-600">Most resources open in a new window.</p>
        </div>
      </MarketplaceDetailSectionCard>
    </MarketplaceDetailTabContent>
  );
}
