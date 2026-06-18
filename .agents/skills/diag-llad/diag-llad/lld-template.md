# Low Level Architecture Design — [System / Module Name]

> Template organized around the UML 2.5 / C4 L3 structure defined in `lld-checklist.md`.
> Primary meta-standards: UML 2.5, C4 Model (L3), ISO/IEC/IEEE 42010.
> Every diagram must satisfy `shared/readability-rules.md` and use the style directives from `shared/house-style.md`.
> Delete sections not applicable to your context.

---

## 1. Scope and Purpose

### 1.1 Scope
One paragraph stating which container, module, or bounded context this LLAD covers, and what it explicitly excludes.

### 1.2 Parent Context
Reference the parent HLD or C4 L2 container that this document elaborates. Include document ID and version if available.

### 1.3 Design Drivers

| Driver | Constraint or Goal |
|--------|-------------------|
| [Performance] | [e.g., p99 < 200ms for primary endpoint] |
| [Scalability] | [e.g., stateless components to enable horizontal scaling] |
| [Maintainability] | [e.g., single-responsibility components, test coverage ≥ 80%] |

---

## 2. Component Overview

### 2.1 Component Diagram (C4 L3)

> See `lld-checklist.md §C4 L3 — Component Diagram` for Mandatory Elements.
> Show the internal components of the container, their responsibilities, and relationships.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Component Diagram — C4 L3]
Render with Mermaid C4Component or PlantUML C4_Component.puml
Add %%{init: ...}%% theme directive (see house-style.md)
```

### 2.2 Component Descriptions

| Component | Technology | Responsibility |
|-----------|-----------|---------------|
| [Name] | [Tech] | [One-line purpose] |

---

## 3. Key Sequence Flows

> See `lld-checklist.md §UML Sequence Diagram` for Mandatory Elements.
> Provide one sequence diagram per primary use case or critical flow.
> Include at least one failure/alternative path.

### 3.1 [Primary Flow Name]

```
[DIAGRAM: Sequence Diagram — Primary Flow]
Render with Mermaid sequenceDiagram
Add %%{init: ...}%% theme directive (see house-style.md)
```

### 3.2 [Secondary or Error Flow Name] *(optional)*

```
[DIAGRAM: Sequence Diagram — Error or Secondary Flow]
```

---

## 4. Domain Model

### 4.1 Class Diagram

> See `lld-checklist.md §UML Class Diagram` for Mandatory Elements.
> Show entities, value objects, services, and repositories for the bounded context.
> Include legend table for relationship types.

```
[DIAGRAM: Class Diagram]
Render with Mermaid classDiagram
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## 5. State Machines *(include when entities have complex lifecycles)*

> See `lld-checklist.md §State Machine Diagram` for Mandatory Elements.
> One diagram per stateful entity.

### 5.1 [Entity Name] Lifecycle

```
[DIAGRAM: State Machine — [Entity Name]]
Render with Mermaid stateDiagram-v2
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## 6. Interface Contracts

### 6.1 API Endpoints *(for API containers)*

| Method | Path | Request Body | Response | Auth |
|--------|------|-------------|----------|------|
| POST | /[resource] | [Schema] | 201 {id} | JWT |
| GET | /[resource]/{id} | — | 200 {object} | JWT |

### 6.2 Events Published *(for event-driven containers)*

| Event | Schema | Producer | Consumer(s) | Notes |
|-------|--------|---------|------------|-------|
| [EventName] | [Schema ref] | [Component] | [Component(s)] | [Delivery guarantee] |

### 6.3 Events Consumed

| Event | Schema | Producer | Handler component | Notes |
|-------|--------|---------|------------------|-------|
| [EventName] | [Schema ref] | [Upstream] | [Component] | [Idempotency strategy] |

---

## 7. Data Design *(for components owning persistent state)*

### 7.1 Schema Summary

| Table / Collection | Primary Key | Key Columns | Indexes | Notes |
|-------------------|-------------|------------|---------|-------|
| [Name] | [PK] | [columns] | [indexes] | [PII / sensitive flag] |

---

## 8. Error Handling and Resilience

| Failure Mode | Detection | Response | Recovery |
|-------------|-----------|----------|---------|
| [External call timeout] | Timeout after [N]ms | Return 503 / enqueue retry | Exponential backoff, max 3 retries |
| [Validation error] | Input schema check | Return 400 with error code | Client must correct request |
| [Data store unavailable] | Connection error | Circuit breaker open | Fail fast; alert on-call |

---

## 9. Security Considerations

| Concern | Control |
|---------|---------|
| Authentication | [Mechanism — e.g., JWT validated at gateway] |
| Authorization | [Mechanism — e.g., role-based, checked in service layer] |
| Input validation | [All inputs validated against schema before processing] |
| Secrets management | [No secrets in code; injected via environment / secret store] |
| Logging of sensitive data | [PII fields masked in logs] |

---

## 10. Open Issues and Decisions

| ID | Question | Owner | Due | Status |
|----|---------|-------|-----|--------|
| LLD-01 | [Decision or open question] | [Name/role] | [Date] | Open |
