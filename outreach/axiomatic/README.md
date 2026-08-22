# Axiomatic AI outreach research package

**Prepared for:** Giacomo Cappelletto  
**Evidence cutoff:** 22 August 2026  
**Purpose:** select and specify the single most technically credible artifact to build before approaching Axiomatic AI.

## Decision

Build **ReproGate: a provenance-gated, fault-injected paper-to-simulation reliability benchmark**.

ReproGate tests whether a scientific agent can turn engineering literature into an executable model while preserving source attribution, preventing validation-target leakage, recovering from realistic failures, producing a scientifically defensible validation decision, and replaying the run exactly.

This is the narrowed and research-grade form of the original **Verified Paper-to-Notebook Reliability Workbench** hypothesis. The interface and notebook are outputs; the contribution is the assurance protocol and benchmark.

## Package

- [`axiomatic-research-brief.md`](./axiomatic-research-brief.md) — complete company-specific research, project selection, experimental specification, connection map, and builder narrative.
- [`reprogate-experiment-spec.md`](./reprogate-experiment-spec.md) — implementation-facing protocol, schemas, metrics, ablations, and phase gates.
- [`connection-map.md`](./connection-map.md) — realistic academic and professional paths, with evidence strength and contact timing.
- [`source-audit.md`](./source-audit.md) — claim-by-claim source validation, stale-issue reconciliation, caveats, and hallucination controls.
- [`sources.yaml`](./sources.yaml) — machine-readable source register, access dates, immutable GitHub revisions, and source quality.
- [`completeness-checklist.md`](./completeness-checklist.md) — required-output coverage and final audit record.

## Core recommendation

Use **Meijaard et al. (2007), _Linearized dynamics equations for the balance and steer of a bicycle: a benchmark and review_**, as the first paper-to-simulation case. It is technically meaningful, CPU-feasible, multimodal, parameter-rich, independently implemented, and suitable for a clean separation between model-construction evidence and validation evidence.

## Evidence notation

- **[V]** verified public evidence
- **[A]** authorized private-account evidence
- **[I]** inference supported by multiple public signals
- **[S]** speculation requiring validation
- **[N]** not publicly knowable

## Scope boundary

This package does not contact Axiomatic employees, request introductions, apply for roles, file issues, or interact with Axiomatic systems. It specifies research, implementation, validation, and a later outreach sequence only.
