# DWS.01 MVP Canonical Database Entity Relationships

This diagram set defines the MVP launch database/entity relationship scope for DWS.01. It is a database/entity model, not an object-oriented class model: entities show table-oriented fields and relationships only, with no methods. The diagrams are split by product area so the MVP launch scope remains readable while covering identity, marketplace content, service request handling, tracker management, analytics, platform administration, feature flags, audit, and reporting snapshots.

Source inputs:

- `docs/architecture/llad-data-architecture-v1.0-draft.md`
- `docs/architecture/diagrams/llad-data-architecture-c4-l3.md`
- `src/types/platform.ts`
- `src/types/serviceLifecycle.ts`
- `src/mocks/platform.mock.ts`
- Additional inspected MVP sources: `src/config/launchFlags.ts`, `src/types/tracker.ts`, `src/data/trackerAreaData.ts`, `src/types/analyticsMarketplace.ts`, `src/types/knowledgeDiscovery.ts`, `src/config/permissions.ts`

## Shared PlantUML Style

Each PlantUML block is standalone and includes the same light theme so rendered PNG/SVG output remains readable.

## MVP Canonical Entity Overview

```plantuml
@startuml DWS01_MVP_Canonical_Entity_Overview
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam package {
  BackgroundColor #eef2ff
  BorderColor #475569
  FontColor #111827
}

title DWS.01 MVP Canonical Entity Overview

package "Identity & Access" {
  class User <<entity>>
  class Role <<entity>>
  class Permission <<entity>>
}

package "Marketplace" {
  class Marketplace <<entity>>
  class MarketplaceAsset <<entity>>
}

package "Services / CRM" {
  class ServiceDefinition <<entity>>
  class Request <<entity>>
}

package "Trackers" {
  class Tracker <<entity>>
  class TrackerRecord <<entity>>
}

package "Analytics" {
  class AnalyticsAsset <<entity>>
  class KpiSet <<snapshot>>
}

package "Admin / Flags / Audit" {
  class ContentItem <<entity>>
  class FeatureFlag <<entity>>
  class AuditEvent <<event>>
}

Role "1" -- "0..*" Permission : grants through RolePermission
User "1" -- "0..*" Role : receives through UserRole
Marketplace "1" -- "0..*" MarketplaceAsset : publishes assets
MarketplaceAsset "0..*" -- "0..*" ServiceDefinition : can expose services
ServiceDefinition "1" -- "0..*" Request : creates requests
Tracker "1" -- "0..*" TrackerRecord : owns records
AnalyticsAsset "0..*" -- "0..*" Tracker : may analyse
AnalyticsAsset "0..*" -- "0..*" Request : may analyse
ContentItem "0..*" -- "0..*" MarketplaceAsset : manages content
FeatureFlag "1" -- "0..*" MarketplaceAsset : controls visibility
FeatureFlag "1" -- "0..*" AnalyticsAsset : controls visibility
User "1" -- "0..*" AuditEvent : creates events
AuditEvent "0..*" ..> KpiSet : feeds snapshots

note bottom of FeatureFlag
  MVP launch visibility is
  controlled by feature flags.
end note

@enduml
```

## Identity & Access

`AccessPolicy` is not shown as a separate table because no `AccessPolicy` source type was present in the inspected files. MVP authorization is represented through `UserRole`, `RolePermission`, and `FeatureFlagAssignment`; `Persona` remains an experience/default route context.

```plantuml
@startuml DWS01_Identity_Access_Entity_Model
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Identity & Access Entity Relationships

class Unit <<entity>> {
  +unitId: UUID
  +name: String
  +leadUserId: UUID
  +health: HealthState
}

class Team <<entity>> {
  +teamId: UUID
  +unitId: UUID
  +leadUserId: UUID
  +flowHealth: HealthState
}

class User <<entity>> {
  +userId: UUID
  +displayName: String
  +email: String
  +unitId: UUID
  +teamId: UUID
  +personaId: UUID
  +status: UserStatus
}

class Persona <<entity>> {
  +personaId: UUID
  +name: String
  +tier: PersonaTier
  +defaultRoute: String
}

class Role <<entity>> {
  +roleId: UUID
  +roleName: String
  +roleScope: String
  +status: RoleStatus
}

class Permission <<entity>> {
  +permissionId: UUID
  +permissionKey: String
  +permissionFamily: String
  +description: String
}

class UserRole <<join table>> {
  +userRoleId: UUID
  +userId: UUID
  +roleId: UUID
  +assignedAt: DateTime
}

class RolePermission <<join table>> {
  +rolePermissionId: UUID
  +roleId: UUID
  +permissionId: UUID
  +grantedAt: DateTime
}

Unit "1" -- "0..*" Team : contains teams
Unit "1" -- "0..*" User : scopes users
Team "1" -- "0..*" User : has users
Persona "1" -- "0..*" User : sets experience
User "1" -- "0..*" UserRole : has assignments
Role "1" -- "0..*" UserRole : assigned to users
Role "1" -- "0..*" RolePermission : grants permissions
Permission "1" -- "0..*" RolePermission : included in roles

note right of Persona
  Persona governs experience
  and default route context.
  It is not authorisation.
end note

note bottom of Role
  Role and Permission
  control access.
end note

@enduml
```

## Marketplace

```plantuml
@startuml DWS01_Marketplace_Entity_Model
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Marketplace Entity Relationships

class Marketplace <<entity>> {
  +marketplaceId: UUID
  +code: String
  +name: String
  +marketplaceType: MarketplaceType
  +enabled: Boolean
}

class MarketplaceSection <<entity>> {
  +sectionId: UUID
  +marketplaceId: UUID
  +label: String
  +sortOrder: Integer
}

class MarketplaceCategory <<entity>> {
  +categoryId: UUID
  +sectionId: UUID
  +name: String
  +categoryType: String
}

class MarketplaceAsset <<entity>> {
  +assetId: UUID
  +categoryId: UUID
  +title: String
  +assetType: String
  +ownerUserId: UUID
  +status: AssetStatus
}

class MarketplaceAssetVersion <<entity>> {
  +versionId: UUID
  +assetId: UUID
  +versionLabel: String
  +publishedAt: DateTime
  +status: VersionStatus
}

class MarketplaceAssetAccess <<entity>> {
  +accessId: UUID
  +assetId: UUID
  +roleId: UUID
  +personaId: UUID
  +accessLevel: String
}

class MarketplaceAssetUsage <<event>> {
  +usageId: UUID
  +assetId: UUID
  +userId: UUID
  +eventType: String
  +createdAt: DateTime
}

class User <<external entity>> {
  +userId: UUID
}

Marketplace "1" -- "0..*" MarketplaceSection : has sections
MarketplaceSection "1" -- "0..*" MarketplaceCategory : has categories
MarketplaceCategory "1" -- "0..*" MarketplaceAsset : has assets
MarketplaceAsset "1" -- "0..*" MarketplaceAssetVersion : has versions
MarketplaceAsset "1" -- "0..*" MarketplaceAssetAccess : has access rules
MarketplaceAsset "1" -- "0..*" MarketplaceAssetUsage : records usage
User "1" -- "0..*" MarketplaceAssetUsage : generates events

note bottom of Marketplace
  MVP marketplaces include:
  Service Marketplace,
  Knowledge / Guidelines,
  Tracker Marketplace,
  Analytics Marketplace,
  Knowledge / DQ DNA.
end note

@enduml
```

## Services / CRM - Catalogue and Request Core

```plantuml
@startuml DWS01_Services_CRM_Request_Core
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}

title DWS.01 Services / CRM - Catalogue and Request Core

class ServiceCategory <<entity>> {
  +serviceCategoryId: UUID
  +name: String
  +ownerType: String
}

class ServiceDefinition <<entity>> {
  +serviceDefinitionId: UUID
  +serviceCategoryId: UUID
  +title: String
  +ownerUserId: UUID
  +approvalRequirement: ApprovalRequirement
  +risk: ServiceRisk
}

class ServiceRequiredInput <<entity>> {
  +inputId: UUID
  +serviceDefinitionId: UUID
  +label: String
  +inputType: String
  +required: Boolean
}

class ServiceSLA <<entity>> {
  +serviceSlaId: UUID
  +serviceDefinitionId: UUID
  +slaLabel: String
  +targetHours: Integer
  +priority: String
}

class RequestQueue <<entity>> {
  +requestQueueId: UUID
  +name: String
  +ownerTeamId: UUID
  +queueType: String
}

class Request <<entity>> {
  +requestId: UUID
  +serviceDefinitionId: UUID
  +requestQueueId: UUID
  +requesterUserId: UUID
  +assignedUserId: UUID
  +status: RequestStatus
  +slaState: SlaState
}

class User <<external entity>> {
  +userId: UUID
}

class Approval <<entity>> {
  +approvalId: UUID
  +requestId: UUID
  +approverUserId: UUID
  +decisionState: ApprovalDecisionState
  +rationale: String
}

ServiceCategory "1" -- "0..*" ServiceDefinition : has services
ServiceDefinition "1" -- "0..*" ServiceRequiredInput : requires inputs
ServiceDefinition "1" -- "1..*" ServiceSLA : has SLA rules
ServiceDefinition "1" -- "0..*" Request : creates requests
RequestQueue "1" -- "0..*" Request : owns queue items
User "1" -- "0..*" Request : submits requests
User "0..1" -- "0..*" Request : fulfils requests
Request "1" -- "0..*" Approval : may require approvals
User "1" -- "0..*" Approval : decides approvals

@enduml
```

## Services / CRM - Request Detail Records

```plantuml
@startuml DWS01_Services_CRM_Request_Details
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Services / CRM - Request Detail Records

class Request <<entity>> {
  +requestId: UUID
  +status: RequestStatus
  +slaState: SlaState
  +urgency: Urgency
}

class RequestComment <<entity>> {
  +commentId: UUID
  +requestId: UUID
  +authorUserId: UUID
  +body: Text
  +createdAt: DateTime
}

class RequestInternalNote <<entity>> {
  +internalNoteId: UUID
  +requestId: UUID
  +authorUserId: UUID
  +body: Text
  +visibility: InternalOnly
}

class RequestAttachment <<entity>> {
  +attachmentId: UUID
  +requestId: UUID
  +fileRef: String
  +uploadedByUserId: UUID
}

class RequestEvidence <<entity>> {
  +evidenceId: UUID
  +requestId: UUID
  +evidenceType: String
  +status: EvidenceStatus
}

class RequestActivity <<event>> {
  +activityId: UUID
  +requestId: UUID
  +actorUserId: UUID
  +activityType: String
  +createdAt: DateTime
}

class RequestStatusHistory <<entity>> {
  +statusHistoryId: UUID
  +requestId: UUID
  +oldStatus: RequestStatus
  +newStatus: RequestStatus
  +changedAt: DateTime
}

class RequestSLAEvent <<event>> {
  +slaEventId: UUID
  +requestId: UUID
  +eventType: String
  +slaState: SlaState
  +createdAt: DateTime
}

class RequestEscalation <<entity>> {
  +escalationId: UUID
  +requestId: UUID
  +severity: String
  +ownerUserId: UUID
  +status: String
}

class RequestClosure <<entity>> {
  +closureId: UUID
  +requestId: UUID
  +closedByUserId: UUID
  +closureOutcome: Text
  +closedAt: DateTime
}

class RequestRating <<entity>> {
  +ratingId: UUID
  +requestId: UUID
  +submittedByUserId: UUID
  +score: Integer
}

class RequestReopen <<entity>> {
  +reopenId: UUID
  +requestId: UUID
  +requestedByUserId: UUID
  +reason: Text
  +createdAt: DateTime
}

Request "1" -- "0..*" RequestComment : has requester comments
Request "1" -- "0..*" RequestInternalNote : has internal notes
Request "1" -- "0..*" RequestAttachment : has attachments
Request "1" -- "0..*" RequestEvidence : has evidence
Request "1" -- "0..*" RequestActivity : has activity
Request "1" -- "0..*" RequestStatusHistory : has status history
Request "1" -- "0..*" RequestSLAEvent : has SLA events
Request "1" -- "0..*" RequestEscalation : has escalations
Request "1" -- "0..1" RequestClosure : has closure
Request "1" -- "0..1" RequestRating : has rating
Request "1" -- "0..*" RequestReopen : has reopen records

note right of RequestInternalNote
  Internal notes are not
  requester-facing comments.
end note

@enduml
```

## Trackers

```plantuml
@startuml DWS01_Tracker_Hub_Entity_Model
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Tracker Hub Entity Relationships

class Tracker <<entity>> {
  +trackerId: UUID
  +name: String
  +trackerClass: TrackerClass
  +ownerUnitId: UUID
  +ownerTeamId: UUID
  +status: TrackerStatus
}

class TrackerFieldDefinition <<entity>> {
  +fieldDefinitionId: UUID
  +trackerId: UUID
  +fieldName: String
  +fieldType: String
  +required: Boolean
}

class TrackerView <<entity>> {
  +trackerViewId: UUID
  +trackerId: UUID
  +viewName: String
  +filterJson: JSON
}

class TrackerRecord <<entity>> {
  +trackerRecordId: UUID
  +trackerId: UUID
  +ownerUserId: UUID
  +assignedTeamId: UUID
  +status: String
  +priority: TrackerPriority
}

class TrackerRecordValue <<entity>> {
  +recordValueId: UUID
  +trackerRecordId: UUID
  +fieldDefinitionId: UUID
  +valueText: Text
}

class TrackerRecordComment <<entity>> {
  +commentId: UUID
  +trackerRecordId: UUID
  +authorUserId: UUID
  +body: Text
}

class TrackerRecordEvidence <<entity>> {
  +evidenceId: UUID
  +trackerRecordId: UUID
  +status: EvidenceStatus
  +evidenceRef: String
}

class TrackerRecordActivity <<event>> {
  +activityId: UUID
  +trackerRecordId: UUID
  +actorUserId: UUID
  +activityType: String
  +createdAt: DateTime
}

class TrackerRecordStatusHistory <<entity>> {
  +statusHistoryId: UUID
  +trackerRecordId: UUID
  +oldStatus: String
  +newStatus: String
  +changedAt: DateTime
}

class User <<external entity>> {
  +userId: UUID
}

class Team <<external entity>> {
  +teamId: UUID
}

class Unit <<external entity>> {
  +unitId: UUID
}

Tracker "1" -- "0..*" TrackerFieldDefinition : defines fields
Tracker "1" -- "0..*" TrackerView : defines views
Tracker "1" -- "0..*" TrackerRecord : has records
TrackerRecord "1" -- "0..*" TrackerRecordValue : has values
TrackerFieldDefinition "1" -- "0..*" TrackerRecordValue : constrains value
TrackerRecord "1" -- "0..*" TrackerRecordComment : has comments
TrackerRecord "1" -- "0..*" TrackerRecordEvidence : has evidence
TrackerRecord "1" -- "0..*" TrackerRecordActivity : has activity
TrackerRecord "1" -- "0..*" TrackerRecordStatusHistory : has history
User "1" -- "0..*" TrackerRecord : owns records
Team "1" -- "0..*" TrackerRecord : receives assignments
Unit "0..1" -- "0..*" Tracker : owns tracker
Team "0..1" -- "0..*" Tracker : owns tracker

note bottom of Tracker
  MVP tracker examples:
  Workload Distribution, Squad Backlog,
  Project Backlog, Strategic Initiatives,
  Project Health, Governance Follow-up,
  Action Log, Decision, Risk / Issue.
end note

@enduml
```

## Analytics

```plantuml
@startuml DWS01_Analytics_Marketplace_Entity_Model
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}

title DWS.01 Analytics Marketplace Entity Relationships

class AnalyticsCategory <<entity>> {
  +analyticsCategoryId: UUID
  +name: String
  +description: Text
}

class AnalyticsAsset <<entity>> {
  +analyticsAssetId: UUID
  +analyticsCategoryId: UUID
  +name: String
  +assetType: AssetType
  +dataScope: String
  +refreshRhythm: String
}

class AnalyticsMetricDefinition <<entity>> {
  +metricDefinitionId: UUID
  +analyticsAssetId: UUID
  +metricName: String
  +aggregationRule: String
}

class AnalyticsAssetAccess <<entity>> {
  +assetAccessId: UUID
  +analyticsAssetId: UUID
  +roleId: UUID
  +personaId: UUID
  +accessLevel: String
}

class AnalyticsViewUsage <<event>> {
  +viewUsageId: UUID
  +analyticsAssetId: UUID
  +userId: UUID
  +viewedAt: DateTime
}

class AnalyticsExport <<event>> {
  +analyticsExportId: UUID
  +analyticsAssetId: UUID
  +userId: UUID
  +exportFormat: String
  +exportedAt: DateTime
}

class User <<external entity>> {
  +userId: UUID
}

class Tracker <<external entity>> {
  +trackerId: UUID
}

class Request <<external entity>> {
  +requestId: UUID
}

class KpiSet <<snapshot>> {
  +kpiSetId: UUID
  +scope: String
  +metricsJson: JSON
}

AnalyticsCategory "1" -- "0..*" AnalyticsAsset : has assets
AnalyticsAsset "1" -- "0..*" AnalyticsMetricDefinition : defines metrics
AnalyticsAsset "1" -- "0..*" AnalyticsAssetAccess : has access rules
User "1" -- "0..*" AnalyticsViewUsage : views assets
User "1" -- "0..*" AnalyticsExport : exports assets
AnalyticsAsset "1" -- "0..*" AnalyticsViewUsage : records views
AnalyticsAsset "1" -- "0..*" AnalyticsExport : records exports
AnalyticsAsset "0..*" -- "0..*" Tracker : may reference trackers
AnalyticsAsset "0..*" -- "0..*" Request : may reference requests
AnalyticsAsset "0..*" -- "0..*" KpiSet : may reference KPIs

@enduml
```

## Platform Admin / Feature Flags

```plantuml
@startuml DWS01_Platform_Admin_Feature_Flags
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Platform Admin and Feature Flag Entity Relationships

class ContentCollection <<entity>> {
  +contentCollectionId: UUID
  +name: String
  +collectionType: String
  +status: ContentStatus
}

class ContentItem <<entity>> {
  +contentItemId: UUID
  +contentCollectionId: UUID
  +title: String
  +itemType: String
  +status: ContentStatus
}

class ContentRevision <<entity>> {
  +contentRevisionId: UUID
  +contentItemId: UUID
  +versionLabel: String
  +createdByUserId: UUID
  +createdAt: DateTime
}

class ContentOwner <<entity>> {
  +contentOwnerId: UUID
  +contentItemId: UUID
  +ownerUserId: UUID
  +ownerTeamId: UUID
  +ownerType: String
}

class ContentAccess <<entity>> {
  +contentAccessId: UUID
  +contentItemId: UUID
  +roleId: UUID
  +personaId: UUID
  +accessLevel: String
}

class FeatureFlag <<entity>> {
  +featureFlagId: UUID
  +flagKey: String
  +featureArea: String
  +enabled: Boolean
  +environment: String
}

class FeatureFlagAssignment <<entity>> {
  +assignmentId: UUID
  +featureFlagId: UUID
  +targetType: FlagTargetType
  +targetId: UUID
  +enabled: Boolean
}

class User <<external entity>> {
  +userId: UUID
}

class Team <<external entity>> {
  +teamId: UUID
}

class Role <<external entity>> {
  +roleId: UUID
}

class Persona <<external entity>> {
  +personaId: UUID
}

ContentCollection "1" -- "0..*" ContentItem : has content
ContentItem "1" -- "0..*" ContentRevision : has revisions
ContentItem "1" -- "0..*" ContentOwner : has owners
ContentItem "1" -- "0..*" ContentAccess : has access rules
User "0..1" -- "0..*" ContentOwner : owns content
Team "0..1" -- "0..*" ContentOwner : owns content
FeatureFlag "1" -- "0..*" FeatureFlagAssignment : has assignments
Role "0..1" -- "0..*" FeatureFlagAssignment : targets role
Persona "0..1" -- "0..*" FeatureFlagAssignment : targets persona
User "0..1" -- "0..*" FeatureFlagAssignment : targets user
FeatureFlag "0..*" -- "0..*" ContentItem : controls visibility

note right of FeatureFlag
  MVP launch flags include
  marketplace, services,
  trackers, analytics,
  platformAdmin, auth,
  and database visibility.
end note

@enduml
```

## Audit / Reporting

```plantuml
@startuml DWS01_Audit_Reporting_Entity_Model
skinparam backgroundColor #ffffff
skinparam defaultFontColor #111827
skinparam ArrowColor #4b5563
skinparam shadowing false
skinparam roundCorner 8
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #f8fafc
  BorderColor #334155
  FontColor #111827
  StereotypeFontColor #475569
  AttributeFontColor #1f2937
}
skinparam note {
  BackgroundColor #fff7cc
  BorderColor #9a7b00
  FontColor #111827
}

title DWS.01 Audit and Reporting Entity Relationships

class User <<external entity>> {
  +userId: UUID
}

class AuditEvent <<event>> {
  +auditEventId: UUID
  +actorUserId: UUID
  +entityType: String
  +entityId: UUID
  +eventType: String
  +severity: AuditSeverity
  +createdAt: DateTime
}

class UsageEvent <<event>> {
  +usageEventId: UUID
  +userId: UUID
  +sourceArea: String
  +sourceEntityType: String
  +sourceEntityId: UUID
  +createdAt: DateTime
}

class ReportSnapshot <<snapshot>> {
  +reportSnapshotId: UUID
  +snapshotType: String
  +scope: String
  +snapshotJson: JSON
  +createdAt: DateTime
}

class KpiSet <<snapshot>> {
  +kpiSetId: UUID
  +name: String
  +scope: String
  +metricsJson: JSON
  +createdAt: DateTime
}

class Request <<source entity>> {
  +requestId: UUID
}

class TrackerRecord <<source entity>> {
  +trackerRecordId: UUID
}

class MarketplaceAssetUsage <<source event>> {
  +usageId: UUID
}

class AnalyticsViewUsage <<source event>> {
  +viewUsageId: UUID
}

User "1" -- "0..*" AuditEvent : creates events
User "1" -- "0..*" UsageEvent : creates usage
AuditEvent "0..*" ..> Request : references entity
AuditEvent "0..*" ..> TrackerRecord : references entity
UsageEvent "0..*" ..> MarketplaceAssetUsage : consolidates usage
UsageEvent "0..*" ..> AnalyticsViewUsage : consolidates usage
Request "0..*" ..> KpiSet : contributes metrics
TrackerRecord "0..*" ..> KpiSet : contributes metrics
MarketplaceAssetUsage "0..*" ..> KpiSet : contributes metrics
AnalyticsViewUsage "0..*" ..> KpiSet : contributes metrics
KpiSet "1" -- "0..*" ReportSnapshot : produces snapshots

note right of AuditEvent
  Append-only record.
  Normal users cannot delete.
  References entities using
  entityType and entityId.
end note

@enduml
```

## Post-MVP Entities

Task and WorkflowItem are intentionally excluded from the MVP diagrams because `src/config/launchFlags.ts` marks `tasks.enabled`, `workflows.enabled`, `performance.enabled`, and `governance.enabled` as false for the sidebar launch scope. They remain future foundation entities for later LLAD expansion. Approval is retained only in the Services / CRM diagram because service requests may require approval in the MVP request-handling flow.

## Legend

| Notation | Meaning |
|---|---|
| `<<entity>>` | Canonical database-backed table or record type. |
| `<<join table>>` | Relationship table used to model many-to-many access or assignment. |
| `<<event>>` | Append-only event or usage record. |
| `<<snapshot>>` | Derived reporting or KPI snapshot. |
| `<<external entity>>` | Entity defined in another diagram and referenced here for relationship clarity. |
| `1` | Exactly one related row. |
| `0..1` | Optional one related row. |
| `0..*` | Zero or many related rows. |
| `--` | Persistent relationship, normally a foreign key or join relationship. |
| `..>` | Derived dependency, generic entity reference, or reporting derivation. |

## Self-Check

| Check | Result | Notes |
|---|---|---|
| Renderer is PlantUML | PASS | All diagrams are PlantUML UML class diagrams. |
| Methods removed | PASS | No entity contains class-style operations from the earlier diagram. |
| MVP scope covered | PASS | Identity, marketplace, services/CRM, trackers, analytics, admin, feature flags, audit, and reporting are present. |
| Split for readability | PASS | Dense product areas are split into focused diagrams instead of one unreadable diagram. |
| Array relationship fields removed | PASS | Relationships such as queue ownership, request membership, and permissions are represented by references or join tables. |
| Request comments vs internal notes separated | PASS | RequestComment and RequestInternalNote are separate entities. |
| Post-MVP task/workflow dominance avoided | PASS | Task and WorkflowItem are excluded from MVP diagrams and documented as post-MVP. |
| Audit append-only rule captured | PASS | AuditEvent includes append-only and normal-user deletion notes. |
| Feature flags captured | PASS | FeatureFlag and FeatureFlagAssignment model MVP launch visibility control. |
