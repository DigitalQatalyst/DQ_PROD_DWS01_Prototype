import { Router, type Request, type Response } from 'express';
import { config } from '../config.js';
import { withTenantContext } from '../db/with-tenant.js';
import { DEFAULT_TENANT_ID } from './constants.js';
import {
  fetchDriveCatalog,
  fetchDriveServiceById,
  fetchDriveServices,
} from './queries.js';

export const discoveryRouter = Router();

function resolveTenantId(_req: Request): string {
  return config.discovery.tenantId;
}

discoveryRouter.get('/catalog', async (_req: Request, res: Response) => {
  if (!config.database.enabled) {
    res.status(503).json({
      error: 'catalog_unavailable',
      message: 'DATABASE_URL is not configured; discovery catalog requires Postgres.',
    });
    return;
  }

  try {
    const payload = await withTenantContext(resolveTenantId(_req), async (client) => {
      const catalog = await fetchDriveCatalog(client);
      return { ...catalog, source: 'supabase' as const };
    });

    res.json(payload);
  } catch (err) {
    console.error('[discovery] catalog fetch failed', err);
    res.status(500).json({ error: 'catalog_fetch_failed' });
  }
});

discoveryRouter.get('/services', async (_req: Request, res: Response) => {
  if (!config.database.enabled) {
    res.status(503).json({ error: 'catalog_unavailable' });
    return;
  }

  try {
    const services = await withTenantContext(resolveTenantId(_req), fetchDriveServices);
    res.json({ services, source: 'supabase' });
  } catch (err) {
    console.error('[discovery] services list failed', err);
    res.status(500).json({ error: 'services_fetch_failed' });
  }
});

discoveryRouter.get('/services/:id', async (req: Request, res: Response) => {
  if (!config.database.enabled) {
    res.status(503).json({ error: 'catalog_unavailable' });
    return;
  }

  try {
    const found = await withTenantContext(resolveTenantId(req), (client) =>
      fetchDriveServiceById(client, req.params.id),
    );
    if (!found) {
      res.status(404).json({ error: 'service_not_found' });
      return;
    }
    res.json({ ...found, source: 'supabase' });
  } catch (err) {
    console.error('[discovery] service detail failed', err);
    res.status(500).json({ error: 'service_fetch_failed' });
  }
});

export { DEFAULT_TENANT_ID };
