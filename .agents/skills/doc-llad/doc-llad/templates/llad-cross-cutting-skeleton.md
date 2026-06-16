# {{concern_name}} — Cross-Cutting Architecture Design

**Document ID:** {{document_id}}  
**Version:** {{version}}  
**Date:** {{date}}  
**Status:** Draft

<!-- COVER: insert OpenXML navy cover block here -->

<!-- Amendment History — OpenXML styled paragraph -->
<!-- Distribution List — OpenXML styled paragraph -->
<!-- Approval Record — OpenXML styled paragraph -->

---

# 1. Overview and Introduction

<!-- gate: G1 -->

## 1.1 Business Context

| # | Title | Description |
|---|-------|-------------|
| 1 | Strategic Context | |
| 2 | Sponsoring Organisation | |
| 3 | User Communities | |
| 4 | Data Sensitivity | |
| 5 | Document Scope | |

## 1.2 Platform Vision

| # | Title | Description |
|---|-------|-------------|
| 1 | Platform Objective | |
| 2 | Platform Strategy | |
| 3 | Technology Foundation | |
| 4 | Architecture Model | |

## 1.3 Document Scope and References

### 1.3.1 Design Scope

| # | System | Stage coverage |
|---|--------|----------------|

### 1.3.2 Platform Architecture Document Set

| ID | Document | System / Scope | Type | Status |
|----|----------|----------------|------|--------|
| GAP-ANNEX | LLAD Traceability Annex (Gap Register + ADR Register) | Cross-cutting | Traceability and Decision Register | Living document |

### 1.3.3 Baseline References

| # | Document | Version | Formal Title |
|---|----------|---------|--------------|

---

# 2. Platform Context

<!-- gate: G2 -->

## 2.1 Platform Architecture Model

## 2.2 Solution Landscape

### 2.2.1 The Hub

### 2.2.2 Application Spokes

### 2.2.3 Platform Service Spokes

## 2.3 User Communities

---

# 3. Concern Architecture Overview

<!-- gate: G3 -->

## 3.1 Concern Mandate

## 3.2 Governing Boundaries

## 3.3 Relationship to Other Cross-Cutting Documents

## 3.4 Design Principles

| ID | Principle | Rationale | Implication | Baseline reference |
|----|-----------|-----------|-------------|-------------------|

<!-- DDD only: sections 3.5–3.10 are added after 3.4 per doc-author-ddd.md -->

---

# 4. Fit-Gap Analysis

<!-- gate: G4 -->

## 4.1 Methodology

## 4.2 Baseline Traceability

**Table 1 — Summary count:**

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Specification conformant | | |
| 2 | Gap | | |
| 3 | Not applicable | | |
| **Total** | | | |

## 4.3 NFR Coverage

**Table 1 — Summary count:**

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Specification conformant | | |
| 2 | Gap | | |
| 3 | Not applicable | | |
| **Total** | | | |

## 4.4 Design Gaps

Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex (`workspace/llad-annex/annex-gap-register.md`). The table below summarises gaps relevant to this document.

| # | Gap ID | Description | Priority | Owner | Resolution gate |
|---|--------|-------------|----------|-------|----------------|

---

# 5. Concern Domains

<!-- gates: G5–GN — one gate per concern domain below -->

## 5.1 {{domain_name}}

<!-- gate: G5 -->

### 5.1.1 Domain Scope

### 5.1.2 Design

### 5.1.3 Per-System Application

| # | System | How concern applies | Key artefact | Conformance status |
|---|--------|--------------------|--------------|--------------------|

### 5.1.4 Constraints and Obligations

| # | Constraint | Source | Applies to | Consequence of breach |
|---|-----------|--------|------------|----------------------|

### 5.1.5 Architecture Decisions and Open Items

<!-- Add further ## 5.N domains as required, following the same sub-section pattern -->

---

# 6. Architecture Governance

<!-- gate: GN+1 -->

## 6.1 Architecture Principles Conformance

## 6.2 Architecture Decision Records

Architecture decisions governing this concern are recorded in full in the LLAD Traceability Annex. The following decisions are relevant to this document.

| ID | Title | Status | Decision summary |
|----|-------|--------|-----------------|

## 6.3 Non-Functional Requirements Summary

## 6.4 Open Items Summary

## 6.5 Configuration Record Backlog (CRD/AB-XC)

<!-- Type 2 (build/evidence) items only — not open design decisions -->

The following items represent fully specified design decisions that require provisioning, IaC authoring, or evidence capture work to be completed. These are not open design gaps — the design is decided and documented in the referenced sections. Progress is tracked in the CRD/AB-XC companion record.

| # | Item | Design reference | Gate |
|---|------|-----------------|------|

---

# Appendix A — Glossary

# Appendix B — Acronyms

# Appendix C — Reference Documents

# Appendix D — Architecture Decision Records (Full)
