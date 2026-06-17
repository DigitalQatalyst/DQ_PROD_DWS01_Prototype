create table if not exists iam_users (
  id uuid primary key default gen_random_uuid(),
  entra_subject_id text unique not null,
  email text unique not null,
  display_name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists iam_roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists iam_permissions (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists iam_role_permissions (
  role_id uuid not null references iam_roles(id),
  permission_id uuid not null references iam_permissions(id),
  primary key (role_id, permission_id)
);

create table if not exists iam_user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references iam_users(id),
  role_id uuid not null references iam_roles(id),
  unit_scope text,
  team_scope text,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  assigned_by uuid references iam_users(id),
  assignment_reason text,
  created_at timestamptz not null default now()
);

create table if not exists iam_permission_exceptions (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references iam_users(id),
  requested_scope text not null,
  business_reason text not null,
  status text not null default 'submitted',
  approver_user_id uuid references iam_users(id),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists iam_delegations (
  id uuid primary key default gen_random_uuid(),
  delegator_user_id uuid not null references iam_users(id),
  delegate_user_id uuid not null references iam_users(id),
  scope text not null,
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists iam_auth_sessions (
  id uuid primary key,
  user_id uuid not null references iam_users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table if not exists iam_audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_user_id uuid references iam_users(id),
  actor_email text,
  session_id uuid,
  resource text,
  decision text,
  reason text,
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);

create index if not exists idx_iam_audit_events_occurred_at on iam_audit_events(occurred_at desc);
create index if not exists idx_iam_audit_events_actor_user_id on iam_audit_events(actor_user_id);
create index if not exists idx_iam_user_role_assignments_user_id on iam_user_role_assignments(user_id);
