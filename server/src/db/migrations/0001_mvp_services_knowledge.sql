-- DWS.01 MVP Services + Knowledge database schema.
-- Scope: Associate/Admin, departments, Discern, Deploy, service requests,
-- request details, feature flags, and audit only.

create extension if not exists "pgcrypto";

create or replace function dws_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists departments (
  department_id   uuid primary key default gen_random_uuid(),
  department_name text not null unique,
  description     text,
  status          text not null default 'Active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint departments_status_chk check (status in ('Active', 'Inactive'))
);

create table if not exists users (
  user_id               uuid primary key default gen_random_uuid(),
  display_name          text not null,
  email                 text not null unique,
  status                text not null default 'Active',
  default_department_id uuid references departments(department_id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint users_status_chk check (status in ('Active', 'Inactive', 'Pending'))
);

create table if not exists roles (
  role_id     uuid primary key default gen_random_uuid(),
  role_name   text not null unique,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists user_roles (
  user_role_id uuid primary key default gen_random_uuid(),
  user_id      uuid not null references users(user_id) on delete cascade,
  role_id      uuid not null references roles(role_id) on delete restrict,
  created_at   timestamptz not null default now(),
  constraint user_roles_user_role_uk unique (user_id, role_id)
);

create table if not exists admin_department_assignments (
  assignment_id     uuid primary key default gen_random_uuid(),
  admin_user_id     uuid not null references users(user_id) on delete cascade,
  department_id     uuid not null references departments(department_id) on delete cascade,
  assignment_status text not null default 'Active',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint admin_department_assignments_status_chk check (assignment_status in ('Active', 'Inactive')),
  constraint admin_department_assignments_admin_dept_uk unique (admin_user_id, department_id)
);

create table if not exists marketplace_areas (
  area_id                  uuid primary key default gen_random_uuid(),
  area_code                text not null unique,
  area_name                text not null,
  description              text,
  launch_visibility_status text not null,
  sort_order               integer not null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  constraint marketplace_areas_visibility_chk check (launch_visibility_status in ('active', 'hidden', 'post_mvp'))
);

create table if not exists knowledge_categories (
  category_id         uuid primary key default gen_random_uuid(),
  marketplace_area_id uuid not null references marketplace_areas(area_id) on delete restrict,
  name                text not null,
  description         text,
  sort_order          integer not null default 0,
  status              text not null default 'Active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint knowledge_categories_status_chk check (status in ('Active', 'Inactive')),
  constraint knowledge_categories_area_name_uk unique (marketplace_area_id, name)
);

create table if not exists knowledge_assets (
  knowledge_asset_id uuid primary key default gen_random_uuid(),
  category_id        uuid not null references knowledge_categories(category_id) on delete restrict,
  title              text not null,
  description        text,
  content_type       text not null,
  content_body       text,
  asset_url          text,
  status             text not null default 'Draft',
  published_at       timestamptz,
  owner_user_id      uuid references users(user_id) on delete set null,
  version            text not null default '1.0',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint knowledge_assets_status_chk check (status in ('Draft', 'Published', 'Archived'))
);

create table if not exists service_categories (
  service_category_id uuid primary key default gen_random_uuid(),
  marketplace_area_id uuid not null references marketplace_areas(area_id) on delete restrict,
  name                text not null,
  description         text,
  sort_order          integer not null default 0,
  status              text not null default 'Active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint service_categories_status_chk check (status in ('Active', 'Inactive')),
  constraint service_categories_area_name_uk unique (marketplace_area_id, name)
);

create table if not exists service_definitions (
  service_id          uuid primary key default gen_random_uuid(),
  service_category_id uuid not null references service_categories(service_category_id) on delete restrict,
  department_id       uuid not null references departments(department_id) on delete restrict,
  service_name        text not null,
  description         text,
  owner_user_id       uuid references users(user_id) on delete set null,
  owner_team_label    text,
  expected_sla_label  text,
  status              text not null default 'Draft',
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint service_definitions_status_chk check (status in ('Draft', 'Published', 'Archived')),
  constraint service_definitions_category_name_uk unique (service_category_id, service_name)
);

create table if not exists service_required_inputs (
  required_input_id uuid primary key default gen_random_uuid(),
  service_id        uuid not null references service_definitions(service_id) on delete cascade,
  label             text not null,
  description       text,
  input_type        text not null,
  is_required       boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint service_required_inputs_type_chk check (input_type in ('text', 'textarea', 'select', 'date', 'file', 'url', 'number')),
  constraint service_required_inputs_service_label_uk unique (service_id, label)
);

create table if not exists service_requests (
  request_id                 uuid primary key default gen_random_uuid(),
  service_id                 uuid not null references service_definitions(service_id) on delete restrict,
  requester_user_id          uuid not null references users(user_id) on delete restrict,
  department_id              uuid not null references departments(department_id) on delete restrict,
  assigned_admin_user_id     uuid references users(user_id) on delete set null,
  title                      text not null,
  description                text,
  status                     text not null default 'Draft',
  health_state               text not null default 'Healthy',
  priority                   text not null default 'Medium',
  sla_state                  text not null default 'Not Started',
  submitted_at               timestamptz,
  last_updated_at            timestamptz not null default now(),
  closed_at                  timestamptz,
  current_next_action        text,
  required_information_state text not null default 'Not Required',
  visibility_scope           text not null default 'requester_and_department_admins',
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  constraint service_requests_status_chk check (status in ('Draft', 'Submitted', 'In Review', 'Awaiting Information', 'In Progress', 'Resolved', 'Closed', 'Reopened', 'Cancelled')),
  constraint service_requests_health_state_chk check (health_state in ('Healthy', 'Amber', 'At Risk', 'Blocked', 'Closed')),
  constraint service_requests_priority_chk check (priority in ('Low', 'Medium', 'High', 'Critical')),
  constraint service_requests_sla_state_chk check (sla_state in ('Not Started', 'On Track', 'At Risk', 'Breached', 'Paused', 'Resolved')),
  constraint service_requests_required_info_chk check (required_information_state in ('Not Required', 'Requested', 'Provided', 'Accepted')),
  constraint service_requests_visibility_scope_chk check (visibility_scope in ('requester_and_department_admins', 'department_admins_only'))
);

create table if not exists service_request_input_responses (
  response_id       uuid primary key default gen_random_uuid(),
  request_id        uuid not null references service_requests(request_id) on delete cascade,
  required_input_id uuid not null references service_required_inputs(required_input_id) on delete restrict,
  response_value    text,
  file_url          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint service_request_input_responses_request_input_uk unique (request_id, required_input_id)
);

create table if not exists service_request_comments (
  comment_id     uuid primary key default gen_random_uuid(),
  request_id     uuid not null references service_requests(request_id) on delete cascade,
  author_user_id uuid not null references users(user_id) on delete restrict,
  comment_body   text not null,
  visibility     text not null default 'requester_visible',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint service_request_comments_visibility_chk check (visibility in ('requester_visible', 'admin_internal'))
);

create table if not exists service_request_attachments (
  attachment_id       uuid primary key default gen_random_uuid(),
  request_id          uuid not null references service_requests(request_id) on delete cascade,
  uploaded_by_user_id uuid not null references users(user_id) on delete restrict,
  file_name           text not null,
  file_type           text,
  file_url            text not null,
  attachment_type     text,
  visibility          text not null default 'requester_visible',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint service_request_attachments_visibility_chk check (visibility in ('requester_visible', 'admin_internal'))
);

create table if not exists service_request_activity (
  activity_id          uuid primary key default gen_random_uuid(),
  request_id           uuid not null references service_requests(request_id) on delete cascade,
  actor_user_id        uuid references users(user_id) on delete set null,
  activity_type        text not null,
  activity_label       text not null,
  activity_description text,
  visibility           text not null default 'requester_visible',
  created_at           timestamptz not null default now(),
  constraint service_request_activity_visibility_chk check (visibility in ('requester_visible', 'admin_internal'))
);

create table if not exists service_request_status_history (
  status_history_id uuid primary key default gen_random_uuid(),
  request_id        uuid not null references service_requests(request_id) on delete cascade,
  previous_status   text,
  new_status        text not null,
  changed_by_user_id uuid references users(user_id) on delete set null,
  change_reason     text,
  created_at        timestamptz not null default now(),
  constraint service_request_status_history_prev_chk check (previous_status is null or previous_status in ('Draft', 'Submitted', 'In Review', 'Awaiting Information', 'In Progress', 'Resolved', 'Closed', 'Reopened', 'Cancelled')),
  constraint service_request_status_history_new_chk check (new_status in ('Draft', 'Submitted', 'In Review', 'Awaiting Information', 'In Progress', 'Resolved', 'Closed', 'Reopened', 'Cancelled'))
);

create table if not exists service_request_closures (
  closure_id      uuid primary key default gen_random_uuid(),
  request_id      uuid not null references service_requests(request_id) on delete cascade,
  closed_by_user_id uuid not null references users(user_id) on delete restrict,
  closure_summary text not null,
  closure_status  text not null,
  closed_at       timestamptz not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint service_request_closures_request_uk unique (request_id),
  constraint service_request_closures_status_chk check (closure_status in ('Resolved', 'Closed', 'Reopened'))
);

create table if not exists service_request_ratings (
  rating_id        uuid primary key default gen_random_uuid(),
  request_id       uuid not null references service_requests(request_id) on delete cascade,
  rated_by_user_id uuid not null references users(user_id) on delete restrict,
  rating_score     integer not null,
  feedback_comment text,
  created_at       timestamptz not null default now(),
  constraint service_request_ratings_request_uk unique (request_id),
  constraint service_request_ratings_score_chk check (rating_score between 1 and 5)
);

create table if not exists feature_flags (
  feature_flag_id uuid primary key default gen_random_uuid(),
  flag_key        text not null unique,
  name            text not null,
  description     text,
  enabled         boolean not null default false,
  scope           text not null default 'global',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists audit_events (
  audit_event_id uuid primary key default gen_random_uuid(),
  actor_user_id  uuid not null references users(user_id) on delete restrict,
  entity_type    text not null,
  entity_id      uuid not null,
  action         text not null,
  description    text,
  severity       text not null default 'Info',
  created_at     timestamptz not null default now(),
  constraint audit_events_severity_chk check (severity in ('Info', 'Warning', 'Critical'))
);

create or replace function dws_prevent_audit_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_events are append-only';
end;
$$;

drop trigger if exists departments_set_updated_at on departments;
create trigger departments_set_updated_at before update on departments for each row execute function dws_set_updated_at();
drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at before update on users for each row execute function dws_set_updated_at();
drop trigger if exists roles_set_updated_at on roles;
create trigger roles_set_updated_at before update on roles for each row execute function dws_set_updated_at();
drop trigger if exists admin_department_assignments_set_updated_at on admin_department_assignments;
create trigger admin_department_assignments_set_updated_at before update on admin_department_assignments for each row execute function dws_set_updated_at();
drop trigger if exists marketplace_areas_set_updated_at on marketplace_areas;
create trigger marketplace_areas_set_updated_at before update on marketplace_areas for each row execute function dws_set_updated_at();
drop trigger if exists knowledge_categories_set_updated_at on knowledge_categories;
create trigger knowledge_categories_set_updated_at before update on knowledge_categories for each row execute function dws_set_updated_at();
drop trigger if exists knowledge_assets_set_updated_at on knowledge_assets;
create trigger knowledge_assets_set_updated_at before update on knowledge_assets for each row execute function dws_set_updated_at();
drop trigger if exists service_categories_set_updated_at on service_categories;
create trigger service_categories_set_updated_at before update on service_categories for each row execute function dws_set_updated_at();
drop trigger if exists service_definitions_set_updated_at on service_definitions;
create trigger service_definitions_set_updated_at before update on service_definitions for each row execute function dws_set_updated_at();
drop trigger if exists service_required_inputs_set_updated_at on service_required_inputs;
create trigger service_required_inputs_set_updated_at before update on service_required_inputs for each row execute function dws_set_updated_at();
drop trigger if exists service_requests_set_updated_at on service_requests;
create trigger service_requests_set_updated_at before update on service_requests for each row execute function dws_set_updated_at();
drop trigger if exists service_request_input_responses_set_updated_at on service_request_input_responses;
create trigger service_request_input_responses_set_updated_at before update on service_request_input_responses for each row execute function dws_set_updated_at();
drop trigger if exists service_request_comments_set_updated_at on service_request_comments;
create trigger service_request_comments_set_updated_at before update on service_request_comments for each row execute function dws_set_updated_at();
drop trigger if exists service_request_attachments_set_updated_at on service_request_attachments;
create trigger service_request_attachments_set_updated_at before update on service_request_attachments for each row execute function dws_set_updated_at();
drop trigger if exists service_request_closures_set_updated_at on service_request_closures;
create trigger service_request_closures_set_updated_at before update on service_request_closures for each row execute function dws_set_updated_at();
drop trigger if exists feature_flags_set_updated_at on feature_flags;
create trigger feature_flags_set_updated_at before update on feature_flags for each row execute function dws_set_updated_at();
drop trigger if exists audit_events_prevent_update_delete on audit_events;
create trigger audit_events_prevent_update_delete before update or delete on audit_events for each row execute function dws_prevent_audit_event_mutation();

create index if not exists users_default_department_id_idx on users(default_department_id);
create index if not exists user_roles_user_id_idx on user_roles(user_id);
create index if not exists user_roles_role_id_idx on user_roles(role_id);
create index if not exists admin_department_assignments_admin_status_idx on admin_department_assignments(admin_user_id, assignment_status);
create index if not exists admin_department_assignments_department_status_idx on admin_department_assignments(department_id, assignment_status);
create index if not exists knowledge_categories_area_status_idx on knowledge_categories(marketplace_area_id, status);
create index if not exists knowledge_assets_category_status_published_idx on knowledge_assets(category_id, status, published_at);
create index if not exists knowledge_assets_owner_user_id_idx on knowledge_assets(owner_user_id);
create index if not exists service_categories_area_status_idx on service_categories(marketplace_area_id, status);
create index if not exists service_definitions_category_status_idx on service_definitions(service_category_id, status);
create index if not exists service_definitions_department_status_idx on service_definitions(department_id, status);
create index if not exists service_definitions_owner_user_id_idx on service_definitions(owner_user_id);
create index if not exists service_required_inputs_service_sort_idx on service_required_inputs(service_id, sort_order);
create index if not exists service_requests_requester_created_idx on service_requests(requester_user_id, created_at);
create index if not exists service_requests_assigned_status_idx on service_requests(assigned_admin_user_id, status);
create index if not exists service_requests_department_status_idx on service_requests(department_id, status);
create index if not exists service_requests_department_required_info_idx on service_requests(department_id, required_information_state);
create index if not exists service_requests_service_id_idx on service_requests(service_id);
create index if not exists service_request_input_responses_request_id_idx on service_request_input_responses(request_id);
create index if not exists service_request_input_responses_required_input_id_idx on service_request_input_responses(required_input_id);
create index if not exists service_request_comments_request_created_idx on service_request_comments(request_id, created_at);
create index if not exists service_request_comments_author_user_id_idx on service_request_comments(author_user_id);
create index if not exists service_request_attachments_request_created_idx on service_request_attachments(request_id, created_at);
create index if not exists service_request_attachments_uploaded_by_user_id_idx on service_request_attachments(uploaded_by_user_id);
create index if not exists service_request_activity_request_created_idx on service_request_activity(request_id, created_at);
create index if not exists service_request_activity_actor_user_id_idx on service_request_activity(actor_user_id);
create index if not exists service_request_status_history_request_created_idx on service_request_status_history(request_id, created_at);
create index if not exists service_request_status_history_changed_by_user_id_idx on service_request_status_history(changed_by_user_id);
create index if not exists service_request_closures_closed_by_user_id_idx on service_request_closures(closed_by_user_id);
create index if not exists service_request_ratings_rated_by_user_id_idx on service_request_ratings(rated_by_user_id);
create index if not exists audit_events_actor_created_idx on audit_events(actor_user_id, created_at);
create index if not exists audit_events_entity_created_idx on audit_events(entity_type, entity_id, created_at);
