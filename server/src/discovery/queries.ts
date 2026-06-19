import type pg from 'pg';
import { DRIVE_MARKETPLACE_ID } from './constants.js';
import {
  approvalLabelForDbValue,
  fetchFilterDefinitions,
  fetchListingFacets,
  type DiscoveryFilterDefinitionDto,
} from './filters.js';
import {
  approvalDetailLabel,
  categoryIdFromSlug,
  mapApproval,
  mapRisk,
  mapSla,
  type DbApproval,
  type DbRisk,
} from './mappers.js';

export interface DiscoveryCategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  ownerType: string;
}

export interface DiscoveryServiceDto {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  submarketplaceSlug: string;
  domain: string;
  submarketplace: string;
  description: string;
  owner: string;
  sla: string;
  approval: ReturnType<typeof mapApproval>;
  approvalLabel: string;
  approvalDetail: string;
  risk: ReturnType<typeof mapRisk>;
  requiredInputs: string[];
  purpose: string;
  primaryActionLabel: string;
  facets: Record<string, string>;
}

export type { DiscoveryFilterDefinitionDto };

export interface DiscoveryServiceDetailDto {
  id: string;
  serviceId: string;
  service: string;
  purpose: string;
  whenToUse: string[];
  whenNotToUse: string[];
  requiredInputs: string[];
  owner: string;
  queue: string;
  sla: string;
  approval: ReturnType<typeof mapApproval>;
  approvalDetail: string;
  escalationTrigger: string;
  fulfilmentPath: string;
  relatedKnowledge: string[];
  relatedServices: string[];
  auditNote: string;
}

interface ServiceRow {
  listing_id: string;
  slug: string;
  title: string;
  summary: string | null;
  submarketplace_name: string;
  submarketplace_slug: string;
  domain_name: string;
  domain_slug: string;
  department_name: string | null;
  approval: DbApproval;
  approval_detail: string | null;
  risk: DbRisk | null;
  default_sla: string | null;
  purpose: string | null;
  when_to_use: string[] | null;
  when_not_to_use: string[] | null;
  required_inputs: string[] | null;
  fulfilment_path: string | null;
  primary_action_label: string | null;
  service_name: string | null;
}

const SERVICE_SELECT = `
  SELECT
    l.id AS listing_id,
    l.slug,
    l.title,
    l.summary,
    sm.name AS submarketplace_name,
    sm.slug AS submarketplace_slug,
    COALESCE(parent_lc.name, lc.name) AS domain_name,
    COALESCE(parent_lc.slug, lc.slug) AS domain_slug,
    d.name AS department_name,
    sd.approval,
    sd.approval_detail,
    sd.risk,
    sd.default_sla,
    sd.purpose,
    sd.when_to_use,
    sd.when_not_to_use,
    sd.required_inputs,
    sd.fulfilment_path,
    pal.value AS primary_action_label,
    sn.value AS service_name
  FROM discovery.listings l
  JOIN discovery.submarketplaces sm ON sm.id = l.submarketplace_id
  LEFT JOIN discovery.listing_categories lc ON lc.id = l.category_id
  LEFT JOIN discovery.listing_categories parent_lc ON parent_lc.id = lc.parent_id
  JOIN discovery.service_details sd ON sd.listing_id = l.id
  LEFT JOIN platform.departments d ON d.id = sd.provider_department_id
  LEFT JOIN discovery.listing_attributes pal
    ON pal.listing_id = l.id AND pal.key = 'primary_action_label'
  LEFT JOIN discovery.listing_attributes sn
    ON sn.listing_id = l.id AND sn.key = 'service_name'
  WHERE l.marketplace_id = $1
    AND l.status = 'published'
    AND l.deleted_at IS NULL
    AND sd.deleted_at IS NULL
`;

function mapServiceRow(
  row: ServiceRow,
  facets: Record<string, string>,
  filterDefinitions: DiscoveryFilterDefinitionDto[],
): DiscoveryServiceDto {
  const approval = mapApproval(row.approval);
  const dbApproval = row.approval ?? facets.approval ?? 'not_required';

  return {
    id: row.listing_id,
    slug: row.slug,
    title: row.title,
    category: row.submarketplace_name,
    categoryId: categoryIdFromSlug(row.submarketplace_slug),
    submarketplaceSlug: row.submarketplace_slug,
    domain: row.domain_name ?? row.submarketplace_name,
    submarketplace: row.submarketplace_name,
    description: row.summary ?? '',
    owner: row.department_name ?? 'Service Owner',
    sla: mapSla(row.default_sla),
    approval,
    approvalLabel: approvalLabelForDbValue(filterDefinitions, dbApproval),
    approvalDetail: row.approval_detail ?? approvalDetailLabel(approval),
    risk: mapRisk(row.risk),
    requiredInputs: row.required_inputs ?? [],
    purpose: row.purpose ?? row.summary ?? '',
    primaryActionLabel: row.primary_action_label ?? 'Request Service',
    facets,
  };
}

function mapDetailRow(row: ServiceRow): DiscoveryServiceDetailDto {
  const approval = mapApproval(row.approval);
  const owner = row.department_name ?? 'Service Owner';

  return {
    id: `${row.listing_id}-detail`,
    serviceId: row.listing_id,
    service: row.service_name ?? row.title,
    purpose: row.purpose ?? row.summary ?? '',
    whenToUse: row.when_to_use ?? [],
    whenNotToUse: row.when_not_to_use ?? [],
    requiredInputs: row.required_inputs ?? [],
    owner,
    queue: `${owner} Queue`,
    sla: mapSla(row.default_sla),
    approval,
    approvalDetail: row.approval_detail ?? approvalDetailLabel(approval),
    escalationTrigger: 'SLA breach or unresolved blocker beyond agreed timeline',
    fulfilmentPath: row.fulfilment_path ?? 'standard_fulfilment',
    relatedKnowledge: [],
    relatedServices: [],
    auditNote: 'Catalogue entry sourced from discovery.listings (Drive marketplace).',
  };
}

export async function fetchDriveCategories(client: pg.PoolClient): Promise<DiscoveryCategoryDto[]> {
  const result = await client.query<{
    slug: string;
    name: string;
    tagline: string | null;
  }>(
    `SELECT slug, name, tagline
     FROM discovery.submarketplaces
     WHERE tenant_id = current_setting('app.tenant_id')::uuid
       AND status = 'active'
     ORDER BY sort_order`,
  );

  return result.rows.map((row) => ({
    id: categoryIdFromSlug(row.slug),
    slug: row.slug,
    name: row.name,
    description: row.tagline ?? '',
    ownerType: 'Service Owner',
  }));
}

async function loadServiceRows(client: pg.PoolClient): Promise<ServiceRow[]> {
  const result = await client.query<ServiceRow>(`${SERVICE_SELECT} ORDER BY sm.sort_order, l.title`, [
    DRIVE_MARKETPLACE_ID,
  ]);
  return result.rows;
}

export async function fetchDriveCatalog(client: pg.PoolClient): Promise<{
  categories: DiscoveryCategoryDto[];
  services: DiscoveryServiceDto[];
  serviceDetails: DiscoveryServiceDetailDto[];
  filters: DiscoveryFilterDefinitionDto[];
}> {
  const [categories, filterDefinitions, facetMap, rows] = await Promise.all([
    fetchDriveCategories(client),
    fetchFilterDefinitions(client),
    fetchListingFacets(client, DRIVE_MARKETPLACE_ID),
    loadServiceRows(client),
  ]);

  const services = rows.map((row) =>
    mapServiceRow(row, facetMap.get(row.listing_id) ?? {}, filterDefinitions),
  );
  const serviceDetails = rows.map(mapDetailRow);

  return { categories, services, serviceDetails, filters: filterDefinitions };
}

export async function fetchDriveServiceDetails(
  client: pg.PoolClient,
): Promise<DiscoveryServiceDetailDto[]> {
  const result = await client.query<ServiceRow>(`${SERVICE_SELECT} ORDER BY sm.sort_order, l.title`, [
    DRIVE_MARKETPLACE_ID,
  ]);
  return result.rows.map(mapDetailRow);
}

export async function fetchDriveServices(client: pg.PoolClient): Promise<DiscoveryServiceDto[]> {
  const catalog = await fetchDriveCatalog(client);
  return catalog.services;
}

export async function fetchDriveServiceById(
  client: pg.PoolClient,
  listingId: string,
): Promise<{ service: DiscoveryServiceDto; detail: DiscoveryServiceDetailDto } | null> {
  const catalog = await fetchDriveCatalog(client);
  const service = catalog.services.find((s) => s.id === listingId);
  const detail = catalog.serviceDetails.find((d) => d.serviceId === listingId);
  if (!service || !detail) return null;
  return { service, detail };
}
