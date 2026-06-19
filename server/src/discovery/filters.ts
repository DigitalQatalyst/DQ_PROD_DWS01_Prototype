import type pg from 'pg';

export interface DiscoveryFilterDefinitionDto {
  key: string;
  label: string;
  filterType: 'single' | 'multi';
  isShared: boolean;
  submarketplaceSlug: string | null;
  sortOrder: number;
  options: { value: string; label: string }[];
}

const FACET_KEYS = [
  'location',
  'approval',
  'service_domain',
  'engagement_type',
  'discipline',
  'category',
  'frequency',
  'funnel_stage',
  'output_type',
  'engagement_model',
] as const;

export async function fetchFilterDefinitions(
  client: pg.PoolClient,
): Promise<DiscoveryFilterDefinitionDto[]> {
  const result = await client.query<{
    id: string;
    key: string;
    label: string;
    filter_type: string;
    is_shared: boolean;
    submarketplace_slug: string | null;
    sort_order: number;
    value: string;
    value_label: string;
    value_sort: number;
  }>(
    `SELECT
       fd.id,
       fd.key,
       fd.label,
       fd.filter_type,
       fd.is_shared,
       sm.slug AS submarketplace_slug,
       fd.sort_order,
       fv.value,
       fv.label AS value_label,
       fv.sort_order AS value_sort
     FROM discovery.filter_definitions fd
     JOIN discovery.filter_values fv ON fv.filter_definition_id = fd.id
     LEFT JOIN discovery.submarketplaces sm ON sm.id = fd.submarketplace_id
     WHERE fd.tenant_id = current_setting('app.tenant_id')::uuid
     ORDER BY fd.sort_order, fv.sort_order`,
  );

  const byId = new Map<string, DiscoveryFilterDefinitionDto>();

  for (const row of result.rows) {
    let def = byId.get(row.id);
    if (!def) {
      def = {
        key: row.key,
        label: row.label,
        filterType: row.filter_type === 'multi' ? 'multi' : 'single',
        isShared: row.is_shared,
        submarketplaceSlug: row.submarketplace_slug,
        sortOrder: row.sort_order,
        options: [],
      };
      byId.set(row.id, def);
    }
    def.options.push({ value: row.value, label: row.value_label });
  }

  return Array.from(byId.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function fetchListingFacets(
  client: pg.PoolClient,
  marketplaceId: string,
): Promise<Map<string, Record<string, string>>> {
  const result = await client.query<{ listing_id: string; key: string; value: string }>(
    `SELECT la.listing_id, la.key, la.value
     FROM discovery.listing_attributes la
     JOIN discovery.listings l ON l.id = la.listing_id
     WHERE l.marketplace_id = $1
       AND la.key = ANY($2::text[])`,
    [marketplaceId, FACET_KEYS],
  );

  const map = new Map<string, Record<string, string>>();
  for (const row of result.rows) {
    const facets = map.get(row.listing_id) ?? {};
    facets[row.key] = row.value;
    map.set(row.listing_id, facets);
  }
  return map;
}

export function approvalLabelForDbValue(
  definitions: DiscoveryFilterDefinitionDto[],
  dbValue: string,
): string {
  const approvalDef = definitions.find((d) => d.key === 'approval' && d.isShared);
  const option = approvalDef?.options.find((o) => o.value === dbValue);
  return option?.label ?? dbValue.replace(/_/g, ' ');
}
