---
shared-source: shared/diagrams/standards-map.md
shared-version: 0.1.0
generated-at: 2026-05-19T14:23:31.423Z
do-not-edit: true
---

# Architecture Diagram Standards Map

## Primary Architecture Meta-Standards

These three meta-standards govern how the skill structures viewpoints, concerns, and documentation. They are always active; all HLD and LLD artifacts are produced within their framing.

### TOGAF ADM — Architecture Development Method

TOGAF defines four architecture domains that map to HLD layers:

| TOGAF Domain | HLD Layer | Primary Diagrams |
|-------------|-----------|-----------------|
| Business Architecture | Conceptual / Functional | Business Capability View |
| Data Architecture | Data | Data Flow View |
| Application Architecture | Logical / Process / Development | Views 2, 3, 4 |
| Technology Architecture | Physical | Physical View |

Use TOGAF framing when: the project has enterprise architecture governance, cross-organizational scope, or an explicit TOGAF ADM engagement. TOGAF Business Architecture is the primary trigger for including HLD Supporting View: Business Capability View.

---

### 4+1 View Model / RUP (Kruchten 1995)

Organizes architecture documentation into four views plus scenarios. The HLD Core 6 maps directly to these:

| 4+1 View | HLD View | LLD Realization |
|----------|----------|----------------|
| Logical | Logical View | L1 Component (C4 L3), L3 Class |
| Process | Process View | L4 Sequence, L5 State Machine |
| Development | Development View | L1 Component internals |
| Physical | Physical View | LS2 Deployment Detail |
| Scenarios (+1) | Scenarios View | L4 Sequence (use-case level) |
| (wrapper) | Context View | — |

The LLD sits within 4+1 as the detailed realization of the Logical and Process views for a single container.

---

### ISO/IEC/IEEE 42010:2011 — Architecture Description

Defines the conceptual framework for architecture descriptions. Mandates that every architecture description:
1. Identify **stakeholders** and their **concerns**.
2. Select **viewpoints** that address those concerns.
3. Produce **views** that conform to those viewpoints.
4. Use identifiable **model kinds** and **correspondence rules**.

In practice this shapes *how* every diagram section is documented: audience, concerns addressed, notation chosen, and the mandatory-elements checklist that defines what a conformant view must contain.

---

## Notation Standards (per diagram)

These are rendering/notation choices made per diagram. Each skill's checklist file declares the primary notation for each diagram section.

### C4 Model

**Governs:** Context (L1), Container (L2), Component (L3) diagrams.

| Level | Diagram | Audience |
|-------|---------|----------|
| L1 | System Context | Everyone |
| L2 | Container | Developers, architects |
| L3 | Component | Developers |

C4 is notation-agnostic with first-class support in Structurizr DSL and C4-PlantUML stdlib; Mermaid supports `C4Context` and `C4Container` only. See `c4-reference.md` for element rules and common mistakes.

---

### UML 2.x

**Governs:** Class, Sequence, State Machine, Activity, Package, Deployment diagrams.

| Diagram | Type | Primary Use |
|---------|------|------------|
| Class | Structural | Domain model, API types |
| Sequence | Behavioral | Message flows, API interactions |
| State Machine | Behavioral | Entity lifecycle |
| Activity | Behavioral | Business process, workflow |
| Package | Structural | Code organization |
| Deployment | Structural | Physical topology |

Best rendered via PlantUML (highest UML fidelity) or Mermaid (subset, sufficient for most uses).

---

### Crow's Foot ERD

**Governs:** Relational data models — entities, attributes, PKs, FKs, cardinality.

Directly supported by Mermaid `erDiagram`. Cardinality notation:

| Mermaid | Meaning |
|---------|---------|
| `\|\|--\|\|` | One and only one — One and only one |
| `\|\|--o{` | One and only one — Zero or more |
| `\|\|--\|{` | One and only one — One or more |
| `o\|--o{` | Zero or one — Zero or more |

---

### OpenAPI 3.x

**Governs:** REST API contracts — endpoints, request/response schemas, security schemes.

The primary artifact is an OpenAPI 3.x YAML file, not a diagram. Rendering and validation tools:
- **Swagger UI** — interactive browser UI: `docker run -p 8080:8080 -e SWAGGER_JSON=/spec/openapi.yaml swaggerapi/swagger-ui`
- **Redoc** — read-only docs: `npx @redocly/cli preview-docs openapi.yaml`
- **Spectral** — linter/validator: `npx @stoplight/spectral-cli lint openapi.yaml`

Supplemented by a Mermaid sequence diagram showing a representative endpoint interaction.

---

### AsyncAPI 2.x

**Governs:** Asynchronous event / message contracts — channels, messages, schemas, bindings.

The primary artifact is an AsyncAPI YAML file. Used wherever an event-driven interface is documented (Kafka topics, WebSocket channels, AMQP queues). Key elements:

| Element | Purpose |
|---------|---------|
| `channels` | Named message channels (topics, queues) |
| `messages` | Message schemas with payload and headers |
| `bindings` | Protocol-specific config (kafka, amqp, ws) |
| `servers` | Broker connection details per environment |

Rendering: Redocly AsyncAPI, AsyncAPI Studio (`npx @asyncapi/cli preview`).

---

## Appendix — Reference & Optional Standards

The following are valuable in specific contexts but are not required for typical HLD/LLD work. They are demoted from primary status; use them only when explicitly required by the engagement context.

---

### Rozanski & Woods — Software Systems Architecture

R&W defines a set of architectural viewpoints including Functional, Information, Concurrency, Development, Deployment, and Operational. Useful when stakeholder-driven viewpoint selection is the primary concern. Demoted to appendix; the 4+1 View Model is preferred for its direct mapping to C4 and UML rendering.

| R&W Viewpoint | Closest 4+1 Equivalent |
|--------------|----------------------|
| Functional | Logical View |
| Information | Data Flow View |
| Concurrency | Process View |
| Development | Development View |
| Deployment | Physical View |
| Operational | DDR / Operational view document |

---

### arc42 (12-Section Documentation Template)

arc42 is a pragmatic, ISO 42010-aligned documentation template. It is now treated as a *documentation skeleton reference*, not a primary standard. The HLD template (`hld-template.md`) preserves arc42-compatible section numbering but is organized around the 4+1 Core 6 + Supporting 3 structure.

| # | arc42 Section | Maps to HLD Section |
|---|--------------|---------------------|
| 1 | Introduction & Goals | §1 Introduction |
| 3 | Context & Scope | View 1 (Context) |
| 5 | Building Block View | Views 2, 4 (Logical, Development) |
| 6 | Runtime View | View 3 (Process) |
| 7 | Deployment View | View 5 (Physical) |
| 9 | Architecture Decisions | ADR table |

---

### ArchiMate 3.x

Three-layer model (Business / Application / Technology) tightly integrated with TOGAF. Use when TOGAF ADM is the explicit governance framework. Render with Archi (free) or BiZZdesign.

| Layer | Elements |
|-------|----------|
| Business | Role, Process, Function, Event, Service |
| Application | Application Component, Function, Service, Interface |
| Technology | Node, Artifact, Network, Device, System Software |

---

### BPMN 2.0

Use when a process spans organizational boundaries or will be consumed by a BPM engine (Camunda, Flowable, jBPM). Mermaid does not support BPMN; use Camunda Modeler or draw.io BPMN library.

| Element | Purpose |
|---------|---------|
| Start/End Events | Process trigger and termination |
| Tasks | Units of work (User, Service, Script) |
| Gateways | Exclusive / Parallel / Inclusive branching |
| Message Flows | Inter-pool (inter-organization) communication |

---

### Cloud Provider Icon Sets

| Vendor | Official Icon Set | URL |
|--------|-----------------|-----|
| AWS | AWS Architecture Icons | https://aws.amazon.com/architecture/icons/ |
| Azure | Azure Architecture Icons | https://learn.microsoft.com/en-us/azure/architecture/icons/ |
| GCP | Google Cloud Icons | https://cloud.google.com/icons |

Use in draw.io (import .xml stencil libraries) or PlantUML (`awslib` / `azure` community libraries). When using Mermaid or Structurizr, fall back to labeled shapes and add a legend.

---

### 4+1 View Model — Full Mapping Table

| 4+1 View | UML Equivalents | C4 Equivalents | HLD View | LLD Diagrams |
|----------|----------------|----------------|----------|-------------|
| Logical | Class, State | L3 Component, L4 Code | Logical View | L1, L2, L3 |
| Process | Sequence, Activity | Runtime sequences | Process View | L4 Sequence, L5 State |
| Development | Component, Package | L2 Container internals | Development View | L1 Component |
| Physical | Deployment | C4 Deployment | Physical View | LS2 Deployment Detail |
| Scenarios (+1) | Use Case | User journeys | Scenarios View | L4 (use-case sequences) |
| (wrapper) | Context diagram | L1 Context | Context View | — |
