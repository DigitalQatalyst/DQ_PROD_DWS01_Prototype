# Supplement: doc-author — DDD (Cross-Cutting Data Design)

**Loaded by:** orchestrator when `report_type: cross-cutting-ddd`
**Extends:** `supplements/cross-cutting/doc-author-cross-cutting.md` — load the base supplement first; this file adds to it.
**Overrides:**
- Section 3 assembly — adds sections 3.5-3.10 after section 3.4 Design Principles
- Section 5 assembly — replaces the generic section 5.N.2 guidance with per-domain column patterns for the DDD concern domains

**Slot files consumed:** `s3-concern-overview.md`, `s5/{concern-slug}.md` (same as base supplement)

---

## Section 3 additional sub-sections — DDD-specific

After rendering section 3.4 Design Principles per the base supplement, render the following sub-sections in order. These sub-sections are unique to DDD and must not be added to other cross-cutting documents.

### Section 3.5 Subject Areas

1. Open with 2 sentences: state that subject areas are the highest-level data organisation grouping entity groups into business-aligned domains, and that each subject area maps to one or more delivery stages and a primary store.
2. Table: `# | Subject Area | Entity Groups | Primary Store(s) | Stage(s)` — 5 cols.

### Section 3.6 Conceptual Data Model

Open with 2 sentences: state this is the business-level model independent of store technology and physical schema, and that it is derived from the HLAD and organised by the subject areas defined in section 3.5.

#### Section 3.6.1 Entity Groups

1. Open with 1 sentence: "The following entity groups are the authoritative conceptual decomposition of the platform data."
2. Table: `# | Entity Group | Subject Area | Primary Store (SoR)` — 4 cols.

#### Section 3.6.2 Inter-Group Relationships

1. Open with 1 sentence stating these are business-level associations — not physical foreign keys — that cross entity group boundaries and inform which subject areas are coupled at the data level.
2. Table: `Source group | Relationship | Target group | Cardinality` — 4 cols.
3. Cardinality values: "Many-many", "One-many", "One-to-one" — natural language only. No arrow notation. No FK language.

#### Section 3.6.3 Store Allocation Matrix

1. Open with 1 sentence; define the abbreviations inline: "**SoR** = System of Record; **Proj** = one-way projection; **Ref** = URL or GUID reference only; **—** = no data held."
2. Table: columns for each data store in the platform — 5 cols maximum. Cell values: **SoR**, **Proj**, **Ref**, or **—**. No arrow notation anywhere in this table.

### Section 3.7 Logical Data Model

1. Open with 2 sentences: state this is the target design (not the current as-built state), and that deviations from the current implementation are recorded as design gaps in Section 4 and the LLAD Traceability Annex. State that DDL, column inventory, and entity inventory are implementation artefacts maintained in version-controlled migration files and are not reproduced here.
2. One H3 sub-section per subject area defined in section 3.5.
3. Each sub-section opener: 2 sentences naming the canonical entities required by the area and describing their structural role.
4. Entity table: `Entity (canonical) | Key attributes | Key relationships | Store assignment` — 4 cols.

**Key relationships column — approved phrasing (use exactly these forms):**
- "One-to-many with [Entity]"
- "Many-to-one with [Entity]"
- "Many-to-many with [Entity]" or "Many-to-many with [Entity] (via [junction])"
- "Bridge: [A] and [B]" — use "and" not an arrow
- "Cross-store join to [Entity] via [key field]"
- "Referenced by [Entity] (inbound FK only)"
- "One-to-one with [Entity]"

**Never use the arrow symbol in the Key relationships column or anywhere else in this section.**

**Store assignment column:** Use store name plus role — "Application PostgreSQL (SoR)", "CRM platform (projection)", "Application PostgreSQL (SoR); binary in object storage". No arrow notation.

### Section 3.8 Physical Data Model

1. Open with 2 sentences: state this is the intended schema design; DDL, column inventory, and full entity inventory are maintained in version-controlled migration files and solution packages and are not reproduced in this document.
2. One H3 sub-section per store, covering: primary application database schemas, secondary application database, CRM platform, binary/object storage, and cross-store reference catalogue.

**Application database schemas:**
- Design principles table first: `Principle | Target design` — 2 cols. Cover: primary key convention, soft delete, audit timestamps, naming convention, cross-store join key column.
- Cluster inventory table second: `# | Cluster | Prefix pattern | Sub-domain` — 4 cols (or `# | Cluster | Sub-domain` — 3 cols for schemas without prefix conventions).
- Close with 1 sentence on cross-schema FK restriction.

**CRM platform:**
- Opener sentence: state the solution name, managed/unmanaged status, publisher prefix, and current version.
- Entity category table: `Category | Entity type | Domain purpose` — 3 cols.

**Binary/object storage:**
- Container table: `Container | Purpose | Access pattern` — 3 cols.

**Cross-Store Reference Catalogue:**
- Opener: 1 sentence stating every cross-store data reference must appear in this catalogue; an undeclared reference is a design gap requiring a recorded ADR before implementation.
- Table: `# | Source | Target | Direction | Mechanism` — 5 cols.
- **Direction column rule:** Use plain English — "One-way projection to CRM", "Read-only lookup (both directions)", "URL reference only". Never use the arrow symbol.

### Section 3.9 Data Classification Framework

Open with 1 sentence: state the framework assigns a sensitivity tier to each entity group and governs the handling obligations and applicable regulatory articles that flow from that tier.

#### Section 3.9.1 Classification Tiers

1. One sentence: "The following tiers are the authoritative classification vocabulary for the platform; no entity group may be assigned a tier not in this list."
2. Table: `Tier | Definition | Examples` — 3 cols. Recommended rows: PII, Sensitive, Internal, Public.

#### Section 3.9.2 Entity Group Classification

1. One sentence: state the table assigns a classification tier to each entity group and identifies the determining fields or attributes that drive that classification.
2. Table: `# | Entity Group | Classification tier | Determining fields` — 4 cols. One row per entity group.

#### Section 3.9.3 Handling Obligations

1. One sentence: state obligations apply at the tier level and are non-negotiable for any store holding data at that tier.
2. Table: `Tier | Encryption at rest | Access logging | Residency restriction | Retention and purge obligations` — 5 cols. One row per tier.

#### Section 3.9.4 Data Subject Categories and Regulatory Rights

1. One sentence: state the recognised data subject categories and the applicable data protection regulation articles.
2. Table: `# | Category | Identity directory | Regulatory Articles | Rights applicable` — 5 cols.

### Section 3.10 Data Lifecycle Model

Open with 1 sentence: state that four lifecycle stages apply to all entity groups and that section 5 specifies the concrete retention windows and purge mechanisms.

#### Section 3.10.1 Lifecycle Stages

1. One sentence: "The following stages apply to all entity groups; transitions are triggered by the events in the Transition trigger column."
2. Table: `Stage | Definition | Transition trigger` — 3 cols. Four rows: Create, Active, Archived, Purged.
3. **Column name rule:** The header must read "Transition trigger" — not any form containing an arrow symbol.

#### Section 3.10.2 Entity Group Lifecycle Obligations

1. One sentence: state the table records the lifecycle transition triggers and cross-store purge obligations for each entity group, and that entity groups with projections require coordinated purge across both stores.
2. Table: `# | Entity Group | Transition to Archived | Transition to Purged | Cross-store purge?` — 5 cols. One row per entity group.
3. **Column name rule:** Column headers are "Transition to Archived" and "Transition to Purged" — never use arrow notation in column headers.
4. Close section 3.10 with 1-2 sentences on cross-store purge coordination: name which entity groups require it and reference the open gap for cross-store purge orchestration.

---

## Section 5 DDD concern domains

DDD uses fixed concern domains in a fixed gate sequence. Do not invent additional domains or reorder them.

[Provide the equivalent domain list for your project here. A typical data design document covers the following concern domains:]

| Gate | Domain | Heading |
|------|--------|---------|
| 5 | Application Database Schema Design | `## 5.1 Application Database Schema Design` |
| 6 | Secondary Data Store Model | `## 5.2 Secondary Data Store Model` |
| 7 | CRM Platform Data Model | `## 5.3 CRM Platform Data Model` |
| 8 | Binary and Document Storage | `## 5.4 Binary and Document Storage` |
| 9 | Cross-Store Data Flows and Consistency | `## 5.5 Cross-Store Data Flows and Consistency` |
| 10 | Data Access Control and Credentials | `## 5.6 Data Access Control and Credentials` |
| 11 | Data Residency and Retention | `## 5.7 Data Residency and Retention` |
| 12 | Data Change Audit and Attribution | `## 5.8 Data Change Audit and Attribution` |

Apply the base supplement instructions for sections 5.N.1 Domain Scope, 5.N.3 Per-System Application, 5.N.4 Constraints and Obligations, and 5.N.5 Open Items unchanged. The section 5.N.2 Design instructions below override the base supplement's generic guidance for each domain.

---

### Section 5.1 — Application Database Schema Design (section 5.N.2 Design)

Open with 2-3 sentences: state the schema isolation strategy (e.g. separate schemas for different sub-domains); the access surface (e.g. PostgREST, direct connections); and any Row Level Security gaps.

Render separate H4 sub-sections for each database schema.

For each schema:
1. One sentence naming the subject areas and entity groups it governs.
2. Design principles table: `Principle | Target design` — 2 cols.
3. Cluster inventory table: `# | Cluster | Prefix pattern | Sub-domain` — 4 cols (or `# | Cluster | Sub-domain` — 3 cols for schemas without prefix conventions).

---

### Section 5.2 — Secondary Data Store Model (section 5.N.2 Design)

Open with 2-3 sentences: state ownership boundary (the secondary store schema must be owned exclusively by its owning service); describe any extension pattern; describe CRM sync obligations.

Two tables:

**Table 1 — Entity extensions:** `Entity | Extension type | Field(s) | Relation type | Sync obligation` — 5 cols.
**Relation type column rule:** Use ORM relation-type name followed by the related entity — no arrow notation.

**Table 2 — DB connection design:** `# | Aspect | Dev | Staging+` — 4 cols. Rows: schema location, connection owner, access model, migration management.

---

### Section 5.3 — CRM Platform Data Model (section 5.N.2 Design)

Open with 2-3 sentences: state the solution name, managed/unmanaged status, publisher prefix, and current version; state the configure-over-customise principle; state the number of custom entity groups.

Two tables:

**Table 1 — Entity group inventory:** `# | Entity group | Entity type | Key fields | Sync direction` — 5 cols.
**Sync direction column rule:** Use plain English — "Platform System of Record", "One-way projection from secondary store", "Cross-store join (read-only lookup via {{cross-system-join-key}})". Never use the arrow symbol.

**Table 2 — Solution structure:** `Aspect | Value` — 2 cols. Rows: solution name, managed/unmanaged, publisher prefix, current version, promotion path.

---

### Section 5.4 — Binary and Document Storage (section 5.N.2 Design)

Open with 2-3 sentences: name the storage accounts in scope; state the managed identity requirement at production tiers (reference the gap if not yet implemented); state the SAS token mandate.

Two tables:

**Table 1 — Storage account inventory:** `# | Storage account | Container | Purpose | Access method` — 5 cols.
**Table 2 — Consumer access obligations:** `# | Consumer | Access method | Auth mechanism | Gap ref` — 5 cols. One row per consumer-container pair.

---

### Section 5.5 — Cross-Store Data Flows and Consistency (section 5.N.2 Design)

Open with 2-3 sentences: state the number of declared cross-store flows; name the integration mechanism; state the eventual-consistency posture.

Three parts in order:

**Part 1 — Flow inventory table:** `# | Flow | Source | Target | Trigger` — 5 cols. One row per declared cross-store flow.

**Part 2 — Cross-store join chain:** Prose only (no table). Describe the join chain using "references", "carries", "identifies", "maps to", "links to" — no arrow notation. Cover the full join chain across stores.

**Part 3 — Consistency posture:** 1-2 sentences stating the eventual-consistency posture and referencing the open gaps for retry and dead-letter mechanisms by ID.

---

### Section 5.6 — Data Access Control and Credentials (section 5.N.2 Design)

Open with 2-3 sentences: state the credential-per-service principle; name the target secret storage location (e.g. Key Vault at production tiers; environment variables at dev with gap reference); note any service principal sharing gap.

One table:

**Per-store credential design:** `# | Store | Service | Credential type | Secret location` — 5 cols. One row per store-service pair. Reference gap IDs in the Secret location cell where obligations are not yet met. Do not add a sixth column for gaps — keep to 5 cols maximum.

---

### Section 5.7 — Data Residency and Retention (section 5.N.2 Design)

Open with 2-3 sentences: state the data residency obligation (cite applicable regulation); name the relevant RSR requirement; state any dev environment gap (non-compliant hosting, no approved carve-out).

Two tables:

**Table 1 — Store residency:** `# | Store | Residency requirement | Data boundary | Regulatory obligation` — 4 cols. One row per store. (4 cols only — do not add a fifth gap column; reference gaps in the Data boundary cell.)

**Table 2 — Entity group retention:** `# | Entity group | Classification | Retention window | Gap ref` — 5 cols. One row per entity group.

---

### Section 5.8 — Data Change Audit and Attribution (section 5.N.2 Design)

Open with 2-3 sentences: state that actor attribution on all PII and Sensitive entity mutations is a governing principle; describe the cross-store attribution join chain at a high level; state any audit gap.

Two parts in order:

**Part 1 — Attribution join chain:** Prose only (no table). Describe the full chain using "references", "carries", "identifies" — no arrow notation.

**Part 2 — Obligations table:** `# | Entity group | Store | Attribution fields | Requirement` — 5 cols. Group rows by classification tier (PII entity groups first, then Sensitive, then Internal). Reference gap IDs in the Requirement cell. Do not add a sixth column — keep to 5 cols.
