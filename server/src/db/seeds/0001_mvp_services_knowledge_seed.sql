-- DWS.01 MVP Services + Knowledge seed data.
-- Idempotent fixture set for the June 19, 2026 MVP launch demo.

insert into departments (department_id, department_name, description, status)
values
  ('10000000-0000-4000-8000-000000000001', 'HRA', 'Human resources and associate support services.', 'Active'),
  ('10000000-0000-4000-8000-000000000002', 'IT', 'Access, systems, devices, and platform support.', 'Active'),
  ('10000000-0000-4000-8000-000000000003', 'Admin', 'Workspace administration and office support.', 'Active'),
  ('10000000-0000-4000-8000-000000000004', 'Marketing / MarkCom', 'Campaign, communication, and brand support.', 'Active'),
  ('10000000-0000-4000-8000-000000000005', 'Knowledge', 'Knowledge article, guideline, and publication support.', 'Active')
on conflict (department_name) do update set
  description = excluded.description,
  status = excluded.status;

insert into users (user_id, display_name, email, status, default_department_id)
values
  ('20000000-0000-4000-8000-000000000001', 'Amina Hassan', 'amina.hassan@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000003'),
  ('20000000-0000-4000-8000-000000000002', 'Hannah Reed', 'hra.admin@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000003', 'Ian Chen', 'it.admin@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000002'),
  ('20000000-0000-4000-8000-000000000004', 'Nora Patel', 'admin.ops@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000003'),
  ('20000000-0000-4000-8000-000000000005', 'Maya Okafor', 'markcom.admin@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000004'),
  ('20000000-0000-4000-8000-000000000006', 'Kofi Mensah', 'knowledge.admin@digitalqatalyst.com', 'Active', '10000000-0000-4000-8000-000000000005')
on conflict (email) do update set
  display_name = excluded.display_name,
  status = excluded.status,
  default_department_id = excluded.default_department_id;

insert into roles (role_id, role_name, description)
values
  ('21000000-0000-4000-8000-000000000001', 'Associate', 'Launch user who can browse Discern/Deploy and submit/view own service requests.'),
  ('21000000-0000-4000-8000-000000000002', 'Admin', 'Launch operator who can manage assigned and department-scoped service requests.')
on conflict (role_name) do update set
  description = excluded.description;

insert into user_roles (user_role_id, user_id, role_id)
values
  ('22000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001'),
  ('22000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002'),
  ('22000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000002'),
  ('22000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', '21000000-0000-4000-8000-000000000002'),
  ('22000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000002'),
  ('22000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', '21000000-0000-4000-8000-000000000002')
on conflict (user_id, role_id) do nothing;

insert into admin_department_assignments (assignment_id, admin_user_id, department_id, assignment_status)
values
  ('23000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Active'),
  ('23000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Active'),
  ('23000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'Active'),
  ('23000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000004', 'Active'),
  ('23000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000005', 'Active')
on conflict (admin_user_id, department_id) do update set
  assignment_status = excluded.assignment_status;

insert into marketplace_areas (area_id, area_code, area_name, description, launch_visibility_status, sort_order)
values
  ('30000000-0000-4000-8000-000000000001', 'discern', 'Discern', 'Knowledge Marketplace for published guidance and standards.', 'active', 10),
  ('30000000-0000-4000-8000-000000000002', 'deploy', 'Deploy', 'Services Marketplace for service request submission.', 'active', 20),
  ('30000000-0000-4000-8000-000000000003', 'design', 'Design', 'Post-MVP marketplace extension point.', 'hidden', 30),
  ('30000000-0000-4000-8000-000000000004', 'drive', 'Drive', 'Post-MVP marketplace extension point.', 'hidden', 40)
on conflict (area_code) do update set
  area_name = excluded.area_name,
  description = excluded.description,
  launch_visibility_status = excluded.launch_visibility_status,
  sort_order = excluded.sort_order;

insert into feature_flags (feature_flag_id, flag_key, name, description, enabled, scope)
values
  ('31000000-0000-4000-8000-000000000001', 'marketplace.discern.enabled', 'Discern Marketplace', 'Controls Discern / Knowledge Marketplace visibility.', true, 'global'),
  ('31000000-0000-4000-8000-000000000002', 'marketplace.deploy.enabled', 'Deploy Marketplace', 'Controls Deploy / Services Marketplace visibility.', true, 'global'),
  ('31000000-0000-4000-8000-000000000003', 'services.serviceHub.enabled', 'Service Hub', 'Controls launch Service Hub visibility.', true, 'global'),
  ('31000000-0000-4000-8000-000000000004', 'services.requestQueues.enabled', 'Request Queues', 'Controls Admin request queue visibility.', true, 'global'),
  ('31000000-0000-4000-8000-000000000005', 'marketplace.design.enabled', 'Design Marketplace', 'Hidden post-MVP marketplace area.', false, 'global'),
  ('31000000-0000-4000-8000-000000000006', 'marketplace.drive.enabled', 'Drive Marketplace', 'Hidden post-MVP marketplace area.', false, 'global'),
  ('31000000-0000-4000-8000-000000000007', 'trackers.enabled', 'Trackers', 'Post-MVP tracker area.', false, 'global'),
  ('31000000-0000-4000-8000-000000000008', 'tasks.enabled', 'Tasks', 'Post-MVP task area.', false, 'global'),
  ('31000000-0000-4000-8000-000000000009', 'workflows.enabled', 'Workflows', 'Post-MVP workflow area.', false, 'global'),
  ('31000000-0000-4000-8000-000000000010', 'analytics.enabled', 'Analytics', 'Post-MVP analytics area.', false, 'global')
on conflict (flag_key) do update set
  name = excluded.name,
  description = excluded.description,
  enabled = excluded.enabled,
  scope = excluded.scope;

insert into knowledge_categories (category_id, marketplace_area_id, name, description, sort_order, status)
values
  ('32000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Getting Started', 'Launch onboarding and first-use guidance.', 10, 'Active'),
  ('32000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'Ways of Working', 'DQ operating practices and collaboration standards.', 20, 'Active'),
  ('32000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'Service Requests', 'Guidance for submitting and tracking service requests.', 30, 'Active'),
  ('32000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', 'Evidence and Closure', 'Evidence and closure quality standards.', 40, 'Active')
on conflict (marketplace_area_id, name) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  status = excluded.status;

insert into knowledge_assets (knowledge_asset_id, category_id, title, description, content_type, content_body, asset_url, status, published_at, owner_user_id, version)
values
  ('33000000-0000-4000-8000-000000000001', '32000000-0000-4000-8000-000000000001', 'DWS Getting Started', 'How Associates use the launch workspace, Discern, Deploy, and Services.', 'Article', 'Start from Home, browse Discern for guidance, use Deploy to submit service requests, and track work in My Requests.', null, 'Published', '2026-06-18T08:00:00Z', '20000000-0000-4000-8000-000000000006', '1.0'),
  ('33000000-0000-4000-8000-000000000002', '32000000-0000-4000-8000-000000000002', 'DQ Ways of Working', 'Core working norms for the DWS.01 MVP launch.', 'Guide', 'Use visible request comments for requester collaboration and internal notes only for Admin-only coordination.', null, 'Published', '2026-06-18T08:05:00Z', '20000000-0000-4000-8000-000000000006', '1.0'),
  ('33000000-0000-4000-8000-000000000003', '32000000-0000-4000-8000-000000000003', 'Service Request Guidelines', 'How to choose a service, provide required inputs, and track request status.', 'Process Reference', 'Pick the closest published service card, complete required inputs, attach supporting material when needed, then track updates in My Requests.', null, 'Published', '2026-06-18T08:10:00Z', '20000000-0000-4000-8000-000000000006', '1.0'),
  ('33000000-0000-4000-8000-000000000004', '32000000-0000-4000-8000-000000000004', 'Evidence and Closure Standards', 'Minimum evidence and closure expectations for service requests.', 'Operating Standard', 'Closed requests should have a clear closure summary, requester-visible activity, and attachments where evidence is required.', null, 'Published', '2026-06-18T08:15:00Z', '20000000-0000-4000-8000-000000000006', '1.0')
on conflict (knowledge_asset_id) do update set
  category_id = excluded.category_id,
  title = excluded.title,
  description = excluded.description,
  content_type = excluded.content_type,
  content_body = excluded.content_body,
  asset_url = excluded.asset_url,
  status = excluded.status,
  published_at = excluded.published_at,
  owner_user_id = excluded.owner_user_id,
  version = excluded.version;

insert into service_categories (service_category_id, marketplace_area_id, name, description, sort_order, status)
values
  ('40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', 'HRA Services', 'People and policy support services.', 10, 'Active'),
  ('40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 'IT Services', 'Access and system support services.', 20, 'Active'),
  ('40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', 'Admin Services', 'Office support and logistics services.', 30, 'Active'),
  ('40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', 'Marketing / MarkCom Services', 'Campaign and communications support services.', 40, 'Active'),
  ('40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', 'Knowledge Services', 'Knowledge article and guideline publication services.', 50, 'Active')
on conflict (marketplace_area_id, name) do update set
  description = excluded.description,
  sort_order = excluded.sort_order,
  status = excluded.status;

insert into service_definitions (
  service_id,
  service_category_id,
  department_id,
  service_name,
  description,
  owner_user_id,
  owner_team_label,
  expected_sla_label,
  status,
  published_at
)
values
  ('41000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Employee Letter Request', 'Request employment, confirmation, or support letters.', '20000000-0000-4000-8000-000000000002', 'HRA Support', '2 business days', 'Published', '2026-06-18T09:00:00Z'),
  ('41000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Policy Clarification Request', 'Ask HRA for guidance on people policies or benefits.', '20000000-0000-4000-8000-000000000002', 'HRA Support', '2 business days', 'Published', '2026-06-18T09:05:00Z'),
  ('41000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Access Request', 'Request system, workspace, or permission access.', '20000000-0000-4000-8000-000000000003', 'IT Access', '1 business day', 'Published', '2026-06-18T09:10:00Z'),
  ('41000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'System Issue Support', 'Report a platform, system, device, or application issue.', '20000000-0000-4000-8000-000000000003', 'IT Support', '4 business hours', 'Published', '2026-06-18T09:15:00Z'),
  ('41000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Office Support Request', 'Request general office or workplace support.', '20000000-0000-4000-8000-000000000004', 'Admin Operations', '2 business days', 'Published', '2026-06-18T09:20:00Z'),
  ('41000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Meeting Logistics Request', 'Request meeting room, logistics, or setup support.', '20000000-0000-4000-8000-000000000004', 'Admin Operations', '1 business day', 'Published', '2026-06-18T09:25:00Z'),
  ('41000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 'Campaign Support Request', 'Request support for campaign planning or execution.', '20000000-0000-4000-8000-000000000005', 'Marketing / MarkCom', '3 business days', 'Published', '2026-06-18T09:30:00Z'),
  ('41000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 'Communications Review Request', 'Request review of internal or external communications.', '20000000-0000-4000-8000-000000000005', 'Marketing / MarkCom', '2 business days', 'Published', '2026-06-18T09:35:00Z'),
  ('41000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'Knowledge Article Update Request', 'Request update to existing knowledge marketplace content.', '20000000-0000-4000-8000-000000000006', 'Knowledge Content', '3 business days', 'Published', '2026-06-18T09:40:00Z'),
  ('41000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 'Guideline Publication Request', 'Request publication of a new guideline or standard.', '20000000-0000-4000-8000-000000000006', 'Knowledge Content', '4 business days', 'Published', '2026-06-18T09:45:00Z')
on conflict (service_category_id, service_name) do update set
  department_id = excluded.department_id,
  description = excluded.description,
  owner_user_id = excluded.owner_user_id,
  owner_team_label = excluded.owner_team_label,
  expected_sla_label = excluded.expected_sla_label,
  status = excluded.status,
  published_at = excluded.published_at;

insert into service_required_inputs (service_id, label, description, input_type, is_required, sort_order)
select sd.service_id, input.label, input.description, input.input_type, input.is_required, input.sort_order
from service_definitions sd
cross join (
  values
    ('Request description', 'Describe what you need and the desired outcome.', 'textarea', true, 10),
    ('Business reason', 'Explain why the request is needed.', 'textarea', true, 20),
    ('Required date', 'Date by which support is needed.', 'date', true, 30),
    ('Department or team', 'Department or team impacted by the request.', 'text', true, 40),
    ('Supporting attachment', 'Optional supporting file or evidence link.', 'file', false, 50)
) as input(label, description, input_type, is_required, sort_order)
where sd.status = 'Published'
on conflict (service_id, label) do update set
  description = excluded.description,
  input_type = excluded.input_type,
  is_required = excluded.is_required,
  sort_order = excluded.sort_order;

insert into service_requests (
  request_id,
  service_id,
  requester_user_id,
  department_id,
  assigned_admin_user_id,
  title,
  description,
  status,
  health_state,
  priority,
  sla_state,
  submitted_at,
  last_updated_at,
  closed_at,
  current_next_action,
  required_information_state,
  visibility_scope
)
values
  ('50000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'Employment confirmation letter', 'Need an employment confirmation letter for bank documentation.', 'Submitted', 'Healthy', 'Medium', 'On Track', '2026-06-18T10:00:00Z', '2026-06-18T10:00:00Z', null, 'HRA Admin to review request details.', 'Not Required', 'requester_and_department_admins'),
  ('50000000-0000-4000-8000-000000000002', '41000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'CRM access request', 'Need CRM access for launch support activities.', 'In Review', 'Healthy', 'High', 'On Track', '2026-06-18T10:15:00Z', '2026-06-18T11:00:00Z', null, 'IT Admin validating access scope.', 'Not Required', 'requester_and_department_admins'),
  ('50000000-0000-4000-8000-000000000003', '41000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', 'Launch meeting logistics', 'Need room setup and hybrid call support for MVP launch review.', 'Awaiting Information', 'Amber', 'Medium', 'Paused', '2026-06-18T10:30:00Z', '2026-06-18T11:10:00Z', null, 'Requester to confirm attendee count.', 'Requested', 'requester_and_department_admins'),
  ('50000000-0000-4000-8000-000000000004', '41000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000005', 'Internal launch campaign support', 'Need MarkCom support for internal announcement copy.', 'In Progress', 'Healthy', 'Medium', 'On Track', '2026-06-18T10:45:00Z', '2026-06-18T12:00:00Z', null, 'MarkCom drafting first copy pass.', 'Not Required', 'requester_and_department_admins'),
  ('50000000-0000-4000-8000-000000000005', '41000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', 'Update request guidelines article', 'Please update the service request guideline with Pending Information steps.', 'Resolved', 'Healthy', 'Low', 'Resolved', '2026-06-18T11:00:00Z', '2026-06-18T14:00:00Z', null, 'Requester to review resolved update.', 'Accepted', 'requester_and_department_admins'),
  ('50000000-0000-4000-8000-000000000006', '41000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'Unable to access DWS preview', 'DWS preview session returned an access error during validation.', 'Closed', 'Closed', 'Critical', 'Resolved', '2026-06-18T08:30:00Z', '2026-06-18T13:15:00Z', '2026-06-18T13:15:00Z', 'Closed after requester confirmation.', 'Accepted', 'requester_and_department_admins')
on conflict (request_id) do update set
  service_id = excluded.service_id,
  requester_user_id = excluded.requester_user_id,
  department_id = excluded.department_id,
  assigned_admin_user_id = excluded.assigned_admin_user_id,
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  health_state = excluded.health_state,
  priority = excluded.priority,
  sla_state = excluded.sla_state,
  submitted_at = excluded.submitted_at,
  last_updated_at = excluded.last_updated_at,
  closed_at = excluded.closed_at,
  current_next_action = excluded.current_next_action,
  required_information_state = excluded.required_information_state,
  visibility_scope = excluded.visibility_scope;

insert into service_request_input_responses (request_id, required_input_id, response_value, file_url)
select
  sr.request_id,
  sri.required_input_id,
  case sri.label
    when 'Request description' then sr.description
    when 'Business reason' then 'Needed for the DWS.01 MVP launch readiness workflow.'
    when 'Required date' then '2026-06-19'
    when 'Department or team' then d.department_name
    when 'Supporting attachment' then null
    else null
  end as response_value,
  case sri.label
    when 'Supporting attachment' then concat('mock://attachments/', sr.request_id::text, '/supporting-evidence.pdf')
    else null
  end as file_url
from service_requests sr
join departments d on d.department_id = sr.department_id
join service_required_inputs sri on sri.service_id = sr.service_id
where sr.request_id in (
  '50000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000002',
  '50000000-0000-4000-8000-000000000003',
  '50000000-0000-4000-8000-000000000004',
  '50000000-0000-4000-8000-000000000005',
  '50000000-0000-4000-8000-000000000006'
)
on conflict (request_id, required_input_id) do update set
  response_value = excluded.response_value,
  file_url = excluded.file_url;

insert into service_request_comments (comment_id, request_id, author_user_id, comment_body, visibility, created_at)
values
  ('60000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'I need this for bank onboarding documentation.', 'requester_visible', '2026-06-18T10:01:00Z'),
  ('60000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'Checking whether CRM access should be standard or elevated.', 'admin_internal', '2026-06-18T11:02:00Z'),
  ('60000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', 'Please confirm attendee count and whether recording is required.', 'requester_visible', '2026-06-18T11:12:00Z'),
  ('60000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000005', 'Draft copy is in progress; first version will be shared today.', 'requester_visible', '2026-06-18T12:03:00Z'),
  ('60000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', 'Article updated with Pending Information guidance.', 'requester_visible', '2026-06-18T13:58:00Z'),
  ('60000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'Access token mapping corrected and verified.', 'requester_visible', '2026-06-18T13:00:00Z')
on conflict (comment_id) do update set
  comment_body = excluded.comment_body,
  visibility = excluded.visibility;

insert into service_request_attachments (attachment_id, request_id, uploaded_by_user_id, file_name, file_type, file_url, attachment_type, visibility, created_at)
values
  ('61000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'letter-request-details.pdf', 'application/pdf', 'mock://files/letter-request-details.pdf', 'supporting_document', 'requester_visible', '2026-06-18T10:02:00Z'),
  ('61000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'crm-access-justification.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'mock://files/crm-access-justification.docx', 'business_reason', 'requester_visible', '2026-06-18T10:16:00Z'),
  ('61000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'access-fix-confirmation.txt', 'text/plain', 'mock://files/access-fix-confirmation.txt', 'closure_evidence', 'admin_internal', '2026-06-18T13:05:00Z')
on conflict (attachment_id) do update set
  file_name = excluded.file_name,
  file_type = excluded.file_type,
  file_url = excluded.file_url,
  attachment_type = excluded.attachment_type,
  visibility = excluded.visibility;

insert into service_request_activity (activity_id, request_id, actor_user_id, activity_type, activity_label, activity_description, visibility, created_at)
values
  ('62000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'request_submitted', 'Request submitted', 'Associate submitted employee letter request.', 'requester_visible', '2026-06-18T10:00:00Z'),
  ('62000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'request_assigned', 'Request assigned', 'IT Admin assigned as fulfilment owner.', 'requester_visible', '2026-06-18T10:45:00Z'),
  ('62000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', 'information_requested', 'Information requested', 'Admin requested attendee count from requester.', 'requester_visible', '2026-06-18T11:10:00Z'),
  ('62000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000005', 'status_changed', 'Status changed', 'MarkCom moved request to in progress.', 'requester_visible', '2026-06-18T12:00:00Z'),
  ('62000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', 'status_changed', 'Status changed', 'Knowledge Admin marked content update resolved.', 'requester_visible', '2026-06-18T14:00:00Z'),
  ('62000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'request_closed', 'Request closed', 'IT Admin closed request after access validation.', 'requester_visible', '2026-06-18T13:15:00Z'),
  ('62000000-0000-4000-8000-000000000007', '50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'internal_note', 'Internal review note', 'Validate CRM entitlement before provisioning.', 'admin_internal', '2026-06-18T11:05:00Z')
on conflict (activity_id) do update set
  activity_type = excluded.activity_type,
  activity_label = excluded.activity_label,
  activity_description = excluded.activity_description,
  visibility = excluded.visibility;

insert into service_request_status_history (status_history_id, request_id, previous_status, new_status, changed_by_user_id, change_reason, created_at)
values
  ('63000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Draft', 'Submitted', '20000000-0000-4000-8000-000000000001', 'Requester submitted the request.', '2026-06-18T10:00:00Z'),
  ('63000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', 'Submitted', 'In Review', '20000000-0000-4000-8000-000000000003', 'IT Admin started review.', '2026-06-18T11:00:00Z'),
  ('63000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', 'Submitted', 'Awaiting Information', '20000000-0000-4000-8000-000000000004', 'Attendee count is required before fulfilment.', '2026-06-18T11:10:00Z'),
  ('63000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', 'In Review', 'In Progress', '20000000-0000-4000-8000-000000000005', 'MarkCom began fulfilment.', '2026-06-18T12:00:00Z'),
  ('63000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000000005', 'In Progress', 'Resolved', '20000000-0000-4000-8000-000000000006', 'Knowledge article update completed.', '2026-06-18T14:00:00Z'),
  ('63000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000006', 'Resolved', 'Closed', '20000000-0000-4000-8000-000000000003', 'Requester confirmed access issue was fixed.', '2026-06-18T13:15:00Z')
on conflict (status_history_id) do update set
  previous_status = excluded.previous_status,
  new_status = excluded.new_status,
  changed_by_user_id = excluded.changed_by_user_id,
  change_reason = excluded.change_reason;

insert into service_request_closures (closure_id, request_id, closed_by_user_id, closure_summary, closure_status, closed_at)
values
  ('64000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'Access mapping corrected; requester confirmed DWS preview is available.', 'Closed', '2026-06-18T13:15:00Z')
on conflict (request_id) do update set
  closed_by_user_id = excluded.closed_by_user_id,
  closure_summary = excluded.closure_summary,
  closure_status = excluded.closure_status,
  closed_at = excluded.closed_at;

insert into service_request_ratings (rating_id, request_id, rated_by_user_id, rating_score, feedback_comment)
values
  ('65000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', 5, 'Fast support and clear confirmation.')
on conflict (request_id) do update set
  rated_by_user_id = excluded.rated_by_user_id,
  rating_score = excluded.rating_score,
  feedback_comment = excluded.feedback_comment;

insert into audit_events (audit_event_id, actor_user_id, entity_type, entity_id, action, description, severity, created_at)
values
  ('70000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'service_request', '50000000-0000-4000-8000-000000000001', 'request_submitted', 'Associate submitted Employee Letter Request.', 'Info', '2026-06-18T10:00:00Z'),
  ('70000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'service_request', '50000000-0000-4000-8000-000000000002', 'request_assigned', 'IT Admin assigned to CRM access request.', 'Info', '2026-06-18T10:45:00Z'),
  ('70000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', 'service_request', '50000000-0000-4000-8000-000000000003', 'request_status_changed', 'Meeting logistics request moved to Awaiting Information.', 'Warning', '2026-06-18T11:10:00Z'),
  ('70000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000003', 'service_request', '50000000-0000-4000-8000-000000000006', 'request_closed', 'DWS preview access issue closed.', 'Info', '2026-06-18T13:15:00Z'),
  ('70000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', 'knowledge_asset', '33000000-0000-4000-8000-000000000001', 'knowledge_asset_published', 'DWS Getting Started published.', 'Info', '2026-06-18T08:00:00Z'),
  ('70000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', 'knowledge_asset', '33000000-0000-4000-8000-000000000004', 'knowledge_asset_published', 'Evidence and Closure Standards published.', 'Info', '2026-06-18T08:15:00Z'),
  ('70000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000002', 'service_definition', '41000000-0000-4000-8000-000000000001', 'service_definition_published', 'Employee Letter Request published.', 'Info', '2026-06-18T09:00:00Z'),
  ('70000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', 'service_definition', '41000000-0000-4000-8000-000000000003', 'service_definition_published', 'Access Request published.', 'Info', '2026-06-18T09:10:00Z'),
  ('70000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000004', 'feature_flag', '31000000-0000-4000-8000-000000000001', 'feature_flag_changed', 'Discern marketplace enabled for MVP launch.', 'Info', '2026-06-18T09:50:00Z'),
  ('70000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000004', 'feature_flag', '31000000-0000-4000-8000-000000000007', 'feature_flag_changed', 'Trackers disabled for MVP launch.', 'Info', '2026-06-18T09:51:00Z')
on conflict (audit_event_id) do nothing;
