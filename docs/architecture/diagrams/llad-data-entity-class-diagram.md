# DWS.01 Canonical Database Entity Relationships - UML Class

```plantuml
@startuml DWS01_Data_Entity_Class_Diagram

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

title DWS.01 Canonical Database Entity Relationships - UML Class

class Persona <<entity>> {
  +personaId: UUID
  +roleName: String
  +tier: PersonaTier
  +defaultRoute: String
  +activate(): void
}

class User <<entity>> {
  +userId: UUID
  +displayName: String
  +roleName: String
  +unitId: UUID
  +teamId: UUID
  +personaId: UUID
  +resolveScope(): AccessScope
}

class Unit <<entity>> {
  +unitId: UUID
  +name: String
  +leadUserId: UUID
  +health: HealthState
  +setHealth(state: HealthState): void
}

class Team <<entity>> {
  +teamId: UUID
  +unitId: UUID
  +leadUserId: UUID
  +flowHealth: HealthState
  +assignLead(userId: UUID): void
}

class Task <<entity>> {
  +taskId: UUID
  +ownerUserId: UUID
  +reviewerUserId: UUID
  +teamId: UUID
  +status: TaskStatus
  +slaState: SlaState
  +close(): void
}

class Request <<entity>> {
  +requestId: UUID
  +requesterUserId: UUID
  +ownerUserId: UUID
  +queueId: UUID
  +status: RequestStatus
  +slaState: SlaState
  +route(queueId: UUID): void
}

class Approval <<entity>> {
  +approvalId: UUID
  +approverUserId: UUID
  +linkedTaskId: UUID
  +linkedRequestId: UUID
  +status: ApprovalStatus
  +decide(state: ApprovalStatus): void
}

class WorkflowItem <<entity>> {
  +workflowId: UUID
  +linkedTaskId: UUID
  +linkedRequestId: UUID
  +approvalId: UUID
  +state: String
  +advance(state: String): void
}

class Queue <<entity>> {
  +queueId: UUID
  +name: String
  +ownerPersonaIds: UUID[]
  +requestIds: UUID[]
  +assignRequest(requestId: UUID): void
}

class KnowledgeAsset <<entity>> {
  +knowledgeId: UUID
  +title: String
  +type: KnowledgeType
  +status: KnowledgeStatus
  +linkTask(taskId: UUID): void
}

class AuditEvent <<event>> {
  +auditEventId: UUID
  +actorUserId: UUID
  +entityType: String
  +entityId: UUID
  +severity: AuditSeverity
  +append(): void
}

class KpiSet <<snapshot>> {
  +kpiSetId: UUID
  +scope: String
  +metricsJson: JSON
  +createdAt: DateTime
  +publish(): void
}

Persona "1" -- "0..*" User : defines persona
Unit "1" -- "0..*" Team : contains teams
Unit "1" -- "0..*" User : scopes users
Team "1" -- "0..*" User : assigns members
Team "1" -- "0..*" Task : owns tasks
User "1" -- "0..*" Task : owns tasks
User "1" -- "0..*" Request : submits requests
Queue "1" -- "0..*" Request : routes requests
Task "0..1" -- "0..*" Request : links request
Request "1" -- "0..*" Approval : requires approvals
Task "1" -- "0..*" Approval : receives reviews
WorkflowItem "0..*" -- "0..1" Request : tracks request
WorkflowItem "0..*" -- "0..1" Task : tracks task
Task "0..*" -- "0..*" KnowledgeAsset : references guidance
User "1" -- "0..*" AuditEvent : performs action
AuditEvent ..> KpiSet : feeds snapshot

note right of Request
  Target anchor:
  s2_account.requests
end note

note bottom of AuditEvent
  Append-only record.
  Normal users cannot delete.
end note

@enduml
```

Legend:

| Relationship | UML notation | Meaning |
|---|---|---|
| Association | `--` | Persistent foreign-key or join relationship between canonical records. |
| Dependency | `..>` | Derived or downstream usage without ownership of the source record. |
| Multiplicity | `1`, `0..1`, `0..*` | Cardinality at each relationship end. |
| `<<entity>>` | Stereotype | Canonical database-backed business entity. |
| `<<event>>` | Stereotype | Append-only event record. |
| `<<snapshot>>` | Stereotype | Reporting snapshot derived from governed records. |

Readability notes:

- Light theme is used to keep class text readable in exported PNG/SVG renders.
- Class, stereotype, attribute, note, and arrow colours are set explicitly to avoid low-contrast PlantUML defaults.
- The diagram intentionally keeps the audit-to-reporting dependency so the governance reporting path remains visible.
