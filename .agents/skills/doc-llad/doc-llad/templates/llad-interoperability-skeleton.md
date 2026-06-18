# {{system_name}} — Interoperability Low Level Architecture Design

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

# 3. API Architecture

<!-- gate: G3 -->

## 3.1 Design Principles

| # | Principle | Rationale | Implementation constraint |
|---|-----------|-----------|--------------------------|

## 3.2 API Surface Overview

| # | Domain | Route prefix | Upstream dependency | Estimated route count |
|---|--------|-------------|--------------------|-----------------------|

## 3.3 Data Architecture

| # | Store | Type | Access mode | Owned entities or containers | Credential model |
|---|-------|------|------------|------------------------------|-----------------|

## 3.4 Middleware Architecture

| # | Middleware | Purpose | Applies to |
|---|-----------|---------|------------|

## 3.5 Integration Boundary

| # | Concern | Owned by | Mechanism |
|---|---------|---------|-----------|

## 3.6 Real-time Layer (WebSocket/Socket.IO)

<!-- Include only if the system has a real-time layer; otherwise delete this section -->

| # | Concern | Specification |
|---|---------|--------------|

## 3.7 Security Architecture

| # | Control | Mechanism | Enforcement point | Baseline reference |
|---|---------|-----------|------------------|-------------------|

## 3.8 Deployment and Environment Strategy

| # | Environment | Runtime | Hosting | Deployment trigger |
|---|------------|---------|---------|-------------------|

## 3.9 DevOps and CI/CD

| # | Stage | Trigger | Action | Gate |
|---|-------|---------|--------|------|

## 3.10 Performance and Observability

| # | Constraint | Target | Measurement approach |
|---|-----------|--------|---------------------|

## 3.11 Test Strategy

| # | Test type | Tool | Gate | Evidence artefact |
|---|-----------|------|------|------------------|

---

# 4. Fit-Gap Analysis

<!-- gate: G4 -->

## 4.1 Methodology

## 4.2 Requirements Traceability

### 4.2.1 Technical Requirements

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

### 4.2.2 Non-Functional Requirements

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

## 4.3 Architecture Conformance

### 4.3.1 Integration Model

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

### 4.3.2 Security Architecture

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

### 4.3.3 Deployment Topology

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

### 4.3.4 DevOps and CI/CD

| # | Status | Count | Notes |
|---|--------|-------|-------|
| 1 | Conformant | | |
| 2 | Documented deviation | | |
| 3 | Gap | | |
| 4 | Deferred | | |
| 5 | Not applicable | | |
| **Total** | | | |

## 4.4 Gap Register

Design gaps identified during the fit-gap assessment are recorded in full in the LLAD Traceability Annex. The table below summarises gaps relevant to this document.

| Gap ID | Description | Priority | Status | ADGR reference |
|--------|-------------|----------|--------|----------------|

---

# 5. Route Domain Architecture

<!-- gates: G5–GN — one gate per domain below -->

## 5.1 {{domain_name}}

<!-- gate: G5 -->

### 5.1.1 Domain Scope

### 5.1.2 Operation Model

| # | Capability group | Operation type | Auth requirement |
|---|-----------------|---------------|-----------------|

### 5.1.3 Middleware and Enforcement

| # | Middleware | Scope | Purpose |
|---|-----------|-------|---------|

### 5.1.4 Upstream Integration

| # | Route group | Upstream service | Entity or container | Access mode |
|---|------------|-----------------|---------------------|------------|

### 5.1.5 Security

| # | Route group | Auth requirement | AuthZ check location | Sensitivity |
|---|------------|-----------------|---------------------|------------|

### 5.1.6 Architectural Decisions and Open Items

<!-- Add further ## 5.N domains as required, following the same sub-section pattern -->

---

# 6. Architecture Governance

<!-- gate: GN+1 -->

## 6.1 Architecture Principles Conformance

## 6.2 Architecture Decision Records

Architecture decisions governing this system are recorded in full in the LLAD Traceability Annex. The following decisions are relevant to this document.

| ID | Title | Status | Decision summary |
|----|-------|--------|-----------------|

## 6.3 Non-Functional Requirements Summary

## 6.4 Open Items Summary

## 6.5 Configuration Record Backlog (CRD/AB-XC)

<!-- Type 2 (build/evidence) items only — not open design decisions -->

| # | Item | Design reference | Gate |
|---|------|-----------------|------|

---

# Appendix A — Glossary

# Appendix B — Architecture Decision Records (Full)

# Appendix C — Reference Documents

# Appendix D — Diagram Source Files
