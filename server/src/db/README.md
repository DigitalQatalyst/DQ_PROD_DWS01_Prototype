# DWS.01 Database Migrations

This folder contains plain PostgreSQL migrations and seeds for the BFF database.
The project uses `pg` directly; no ORM migration framework is required for the
MVP launch.

## Commands

Run from `server/` with `DATABASE_URL` configured in the repository-root `.env`
or `server/.env`:

```bash
npm run db:migrate
npm run db:seed
npm run db:validate:mvp
```

## Files

- `migrations/0001_mvp_services_knowledge.sql` creates the MVP Services +
  Knowledge launch schema.
- `seeds/0001_mvp_services_knowledge_seed.sql` inserts deterministic launch
  seed data for roles, users, departments, marketplace areas, services,
  requests, comments, attachments, activity, status history, closure, rating,
  feature flags, and audit events.

## Scope Boundary

The MVP schema deliberately excludes Trackers, Tasks, Workflows, Analytics,
approvals, role permissions, advanced governance, KPI reporting, and a complex
generic marketplace engine. Future areas remain extension points through
`marketplace_areas` and `feature_flags`.
