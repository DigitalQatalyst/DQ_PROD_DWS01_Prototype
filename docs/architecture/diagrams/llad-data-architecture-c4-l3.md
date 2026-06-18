# DWS.01 Data & Intelligence Layer - Database Architecture C4 L3

```plantuml
@startuml DWS01_Data_Architecture_C4_L3
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

skinparam backgroundColor #0d1117
skinparam defaultFontColor #e6edf3
skinparam ArrowColor #9aa4b2
skinparam shadowing false
skinparam roundCorner 8

LAYOUT_LEFT_RIGHT()
LAYOUT_WITH_LEGEND()

title DWS.01 Data & Intelligence Layer - Database Architecture C4 L3

Container_Ext(bff, "Application API / BFF", "Express / BFF", "Validates data requests")
Container_Ext(domain, "Domain Services", "Node.js services", "Own governed changes")
System_Ext(iam, "Microsoft Entra ID", "OIDC / OAuth2", "Supplies identity claims")
System_Ext(ms365, "Microsoft 365", "Graph / storage", "Holds evidence artefacts")
ContainerDb_Ext(redis, "Redis State Store", "Redis", "Caches session state")

Container_Boundary(data, "Data & Intelligence Layer - Supabase PostgreSQL / Data API") {
    Component(data_api, "Supabase Data API", "PostgREST / Supabase", "Mediates data access")
    Component(rls, "RLS Policy Engine", "PostgreSQL RLS", "Enforces row scope")
    Component(platform_schema, "platform Schema", "PostgreSQL schema", "Owns foundation records")
    Component(account_schema, "s2_account Schema", "PostgreSQL schema", "Anchors transactions")
    Component(ops_schema, "s3_ops Schema", "PostgreSQL schema", "Stores workflow records")
    Component(audit_store, "Audit Event Store", "PostgreSQL tables", "Preserves evidence")
    Component(reporting_store, "Reporting Snapshots", "PostgreSQL tables", "Feeds dashboards")
}

Rel(bff, data_api, "Requests scoped data", "HTTPS / REST")
Rel(domain, data_api, "Persists domain records", "Supabase Data API")
Rel(iam, platform_schema, "Maps identity claims", "OIDC claims")
Rel(data_api, rls, "Applies access policy", "PostgreSQL policy")
Rel(rls, platform_schema, "Checks user scope", "SQL / RLS")
Rel(rls, account_schema, "Filters transactions", "SQL / RLS")
Rel(rls, ops_schema, "Filters workflows", "SQL / RLS")
Rel(domain, audit_store, "Writes audit events", "Supabase Data API")
Rel(domain, account_schema, "Writes request anchor", "Supabase Data API")
Rel(domain, ops_schema, "Writes workflow state", "Supabase Data API")
Rel(account_schema, audit_store, "Emits lifecycle evidence", "DB trigger / service write")
Rel(ops_schema, audit_store, "Emits workflow evidence", "DB trigger / service write")
Rel(audit_store, reporting_store, "Feeds governance metrics", "SQL view / batch")
Rel(reporting_store, bff, "Serves dashboard data", "HTTPS / REST")
Rel(ms365, audit_store, "Links evidence artefacts", "Graph reference")

@enduml
```

Legend:

| Arrow label | Protocol | Mode | Notes |
|---|---|---|---|
| Requests scoped data | HTTPS / REST | sync | BFF mediates client access; no direct client database calls. |
| Persists domain records | Supabase Data API | sync | Domain services own governed mutations. |
| Maps identity claims | OIDC claims | sync | Claims map into canonical user and role records. |
| Applies access policy | PostgreSQL policy | sync | RLS and database roles enforce data scope. |
| Checks user scope | SQL / RLS | sync | Uses platform users, roles, units, teams, and permissions. |
| Filters transactions | SQL / RLS | sync | Applies request and queue visibility. |
| Filters workflows | SQL / RLS | sync | Applies workflow and approval visibility. |
| Writes audit events | Supabase Data API | sync | Service-written audit evidence. |
| Writes request anchor | Supabase Data API | sync | Persists `s2_account.requests` anchor. |
| Writes workflow state | Supabase Data API | sync | Persists workflow and approval records. |
| Emits lifecycle evidence | DB trigger / service write | sync | Captures request state changes. |
| Emits workflow evidence | DB trigger / service write | sync | Captures approval and workflow changes. |
| Feeds governance metrics | SQL view / batch | async | Supports dashboard snapshots. |
| Serves dashboard data | HTTPS / REST | sync | Reporting data is returned through the BFF. |
| Links evidence artefacts | Graph reference | sync | Microsoft 365 stores artefacts; DWS.01 stores governed references. |

Notation:

- `Container_Boundary` is the single C4 L3 parent container boundary.
- `Component` nodes are internal data-layer components inside that parent container.
- `Container_Ext`, `ContainerDb_Ext`, and `System_Ext` nodes are outside the zoomed container.
- Solid relationships represent synchronous access unless the legend marks batch or async behaviour.
