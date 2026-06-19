import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(here, '../../../.env') });
dotenv.config({ path: path.resolve(here, '../../.env') });

export function requireDatabaseUrl(): string {
  const databaseUrl = (process.env.DATABASE_URL ?? '').trim();
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run database migrations or seeds.');
  }
  return databaseUrl;
}

export function createPool(): pg.Pool {
  const databaseUrl = requireDatabaseUrl();
  return new pg.Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? undefined : { rejectUnauthorized: false },
    max: 3,
  });
}

export async function listSqlFiles(relativeDir: string): Promise<string[]> {
  const absoluteDir = path.resolve(here, relativeDir);
  const entries = await fs.readdir(absoluteDir);
  return entries
    .filter((entry) => entry.endsWith('.sql'))
    .sort()
    .map((entry) => path.join(absoluteDir, entry));
}

export async function readSqlFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export function migrationName(filePath: string): string {
  return path.basename(filePath);
}
