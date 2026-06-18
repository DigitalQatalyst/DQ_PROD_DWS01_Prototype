# High Level Design — [System Name]

> Template organized around the TOGAF ADM / 4+1 Core 6 + Supporting 3 structure defined in `hld-checklist.md`.
> Primary meta-standards: TOGAF ADM, 4+1 View Model / RUP, ISO/IEC/IEEE 42010.
> Every diagram must satisfy `shared/readability-rules.md` and use the style directives from `shared/house-style.md`.
> Delete sections not applicable to your context.

---

## 1. Introduction and Goals

### 1.1 Purpose
One paragraph describing what this system does and why it is being built or changed.

### 1.2 Stakeholders

| Stakeholder | Role | Key Concerns |
|-------------|------|-------------|
| Product Owner | Requirements authority | Feature delivery, time-to-market |
| Engineering Lead | Technical authority | Feasibility, scalability |
| Security | Compliance and risk | Data protection, auth controls |
| Operations | Runability | Observability, incident response |

### 1.3 Quality Goals (Top 5)

| Priority | Quality Attribute | Measurable Goal |
|----------|-----------------|----------------|
| 1 | Availability | 99.9% uptime per calendar month |
| 2 | Response Time | p99 API response < 500ms under normal load |
| 3 | Security | Zero PII stored unencrypted |
| 4 | Scalability | Support 10x current peak load with no code changes |
| 5 | Recoverability | RTO < 1 hour, RPO < 15 minutes |

---

## 2. Constraints

### 2.1 Technical Constraints

| Constraint | Rationale |
|-----------|-----------|
| Deploy on [cloud/platform] | [Rationale] |
| [Database] as primary database | [Rationale] |
| REST + JSON for external APIs | Partner compatibility |

### 2.2 Organizational Constraints

| Constraint | Rationale |
|-----------|-----------|
| Team of [N] engineers | Bounded delivery capacity |
| Go-live by [DATE] | Business commitment |

### 2.3 Regulatory Constraints

| Regulation | Applicable Scope |
|-----------|----------------|
| [Regulation] | [Applicable scope] |

[Provide the equivalent list for your project here.]

---

## 3. Solution Strategy

### 3.1 Architectural Style
Describe the chosen architectural style (e.g., microservices, modular monolith, event-driven, layered) and the reasons for the choice.

### 3.2 Key Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API style | REST/JSON | Team familiarity; partner compatibility |
| Async messaging | Apache Kafka | High-throughput, durable event log |
| Auth | OAuth 2.0 + OIDC | Industry standard; existing IdP |
| Container orchestration | [Platform] | [Rationale] |

### 3.3 Architecture Decision Records (ADRs)
Link to ADR log or summarize the top 3 decisions here.

---

# Part 1: Core Views

---

## Context View (4+1: wrapper)

> C4 L1. See `hld-checklist.md §Context View` for Mandatory Elements and compliance criteria.
> Apply readability-rules.md: ≤12 nodes, ≤15 edges. Split into Actors + System-boundary diagrams if >8 externals.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Context View — C4 L1]
Render with Mermaid C4Context or PlantUML C4_Context.puml
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## Logical View (4+1: Logical)

> Static decomposition into layers/domains with dependencies. No deployment content.
> See `hld-checklist.md §Logical View` for Mandatory Elements.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Logical View — UML Package / C4 L2 logical subset]
Render with Mermaid flowchart TD with subgraphs
Add %%{init: ...}%% theme directive (see house-style.md)
```

### Logical Component Descriptions

| Component | Layer / Domain | Responsibility |
|-----------|---------------|---------------|
| [Name] | [Layer] | [One-line purpose] |

---

## Process View (4+1: Process)

> Runtime collaboration between containers. See `hld-checklist.md §Process View` for Mandatory Elements.
> Do NOT rename to "Runtime View" — 4+1 uses "Process".
> Include legend table immediately below the diagram.

```
[DIAGRAM: Process View — C4 Container with runtime annotations]
Render with Mermaid C4Container or PlantUML C4_Container.puml
Add %%{init: ...}%% theme directive (see house-style.md)
```

### Container Descriptions

| Container | Type | Tech Stack | Responsibility |
|-----------|------|-----------|---------------|
| [Name] | API / SPA / DB / Queue / Worker | [Stack] | [One-line purpose] |

---

## Development View (4+1: Development)

> Code organization, repos, modules, and build artifacts. No runtime infrastructure.
> See `hld-checklist.md §Development View` for Mandatory Elements.
> Subgraph titles: plain IDs with bracketed display names. Artifact nodes: double-bracket [[name]].
> Include legend table immediately below the diagram.

```
[DIAGRAM: Development View — UML Package / flowchart]
Render with Mermaid flowchart TD with subgraphs for repos and modules
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## Physical View (4+1: Physical)

> Deployment topology + trust zones + availability + SLA overlay.
> See `hld-checklist.md §Physical View` for Mandatory Elements.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Physical View — C4 Deployment + cloud annotations]
Render with PlantUML C4_Deployment or draw.io (for cloud icons)
```

### Threat Model Summary
Prose summary of: external entry points, trust boundaries, primary attack surfaces, and controls in place.

### Availability Strategy
Prose summary of: HA topology (active-active/active-passive), failover mechanism, DR region if applicable.

### Data Classification Matrix

| Data Element | Classification | Storage Location | Encryption at Rest | Retention |
|-------------|---------------|-----------------|-------------------|-----------|
| [Element] | [Classification] | [Location] | [Algorithm] | [Period] |

### Environment Summary

| Environment | Purpose | Region | HA |
|-------------|---------|--------|----|
| Development | Engineer testing | Single AZ | No |
| Staging | Integration / load testing | Multi-AZ | Partial |
| Production | Live traffic | Multi-AZ | Yes |

---

## Scenarios View (4+1: +1)

> End-to-end user journeys cross-referencing containers from Process View.
> See `hld-checklist.md §Scenarios View` for Mandatory Elements.

```
[DIAGRAM: Scenarios View — Mermaid journey]
Minimum 2 journeys. Each stage cross-references containers from Process View.
```

---

# Part 2: Supporting Views

---

## Business Capability View (include when TOGAF Business Architecture required)

> Technology-agnostic capability map. Include when TOGAF Business Architecture is in scope.
> See `hld-checklist.md §Business Capability View` for Mandatory Elements.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Business Capability View — capability map]
Render with Mermaid flowchart TD with subgraphs for capability groups
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## Data Flow View (include for data-centric or compliance contexts)

> Data lineage: sources, processors, sinks, data classification, trust boundaries.
> See `hld-checklist.md §Data Flow View` for Mandatory Elements.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Data Flow View — DFD-style labeled flowchart]
Render with Mermaid flowchart LR
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## Integration Map (include when >2 external integrations)

> Integration inventory with protocol, sync/async, SLA, auth, data volume.
> See `hld-checklist.md §Integration Map` for Mandatory Elements.
> Arrow labels: 3–5 word purposes only. Details in legend table.
> Include legend table immediately below the diagram.

```
[DIAGRAM: Integration Map — labeled flowchart]
Render with Mermaid flowchart LR
Add %%{init: ...}%% theme directive (see house-style.md)
```

---

## 4. Crosscutting Concerns

### 4.1 Observability

| Concern | Tooling | Notes |
|---------|---------|-------|
| Metrics | [Tool] | SLO dashboards |
| Logging | Structured JSON | Correlation ID on all requests |
| Tracing | [Tool] | Trace across service boundaries |
| Alerting | [Tool] | On SLO breach |

### 4.2 Error Handling and Resilience

| Pattern | Where Applied |
|---------|--------------|
| Circuit breaker | All synchronous downstream calls |
| Retry with exponential backoff | HTTP calls to external systems |
| Dead-letter queue | All async consumers |
| Idempotency key | [Critical processing endpoint] |

---

## 5. Quality Requirements

### 5.1 Quality Scenarios

| ID | Quality | Scenario | Stimulus | Response | Measure |
|----|---------|----------|---------|---------|---------|
| Q1 | Performance | Peak load | [N] concurrent users | API responds | p99 < 500ms |
| Q2 | Availability | AZ failure | One AZ goes offline | System continues | < 30s degradation |
| Q3 | Security | Injection attempt | Malformed input | Input rejected | 0 successful injections |

---

## 6. Risks and Technical Debt

| ID | Risk / Debt | Likelihood | Impact | Mitigation |
|----|------------|-----------|--------|-----------|
| R1 | [External dependency SLA] | Medium | High | Circuit breaker + fallback |
| R2 | [Database scalability] | Low | High | Read replicas + caching |
| TD1 | [Legacy module lacking tests] | N/A | Medium | Add tests before next change |

---

## 7. Glossary

| Term | Definition |
|------|-----------|
| ADR | Architecture Decision Record |
| SLO | Service Level Objective |
| HA | High Availability |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
