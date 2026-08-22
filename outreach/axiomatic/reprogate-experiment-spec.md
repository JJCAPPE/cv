# ReproGate implementation and experiment specification

**Status:** pre-implementation research protocol  
**Evidence cutoff:** 22 August 2026  
**Primary domain:** canonical linear bicycle dynamics  
**Primary endpoint:** Trustworthy Artifact Rate

This document converts the full [Axiomatic research brief](./axiomatic-research-brief.md) into an implementation-facing protocol.

---

## 1. Falsifiable question

> Does a provenance-constrained, checkpointed paper-to-simulation pipeline with a process-enforced recipe–validation information barrier produce a higher trustworthy-artifact rate under document and dependency faults than whole-document extraction followed by uncheckpointed notebook generation?

A result is negative when ReproGate fails to improve the primary endpoint, improves only by abstaining, permits target influence, cannot resume correctly, or cannot reproduce its own outputs.

---

## 2. Pre-registered hypotheses

| ID | Hypothesis | Required effect |
|---|---|---|
| H1 | Checkpointing improves recovery | at least 50% relative reduction in irrecoverable/silent failure and at least 85% recovery of retryable faults |
| H2 | Typed provenance improves evidence fidelity | at least 0.95 page-level precision and recall for consumed parameters and targets |
| H3 | Process isolation prevents target influence | zero target-only build-hash changes; below 5% broader semantic leakage |
| H4 | Full system improves end-to-end trustworthiness | at least 25 percentage-point TAR improvement over B0 under mixed faults |
| H5 | Obligation-preserving compression controls context | at least 30% token reduction with no more than two percentage-point TAR change |

---

## 3. Primary case

Use Meijaard et al.'s canonical bicycle-dynamics benchmark.

### Builder inputs

- geometry;
- masses and centers of mass;
- inertia values;
- physical constants and conventions;
- equations and definitions required to form the canonical model.

### Validator-only targets

- canonical matrices `M`, `C1`, `K0`, `K2`;
- eigenvalues across a pre-registered speed grid;
- critical speeds;
- mode behavior and reference curves;
- results from independent public implementations.

### Non-contamination rule

The builder environment must not import or inspect BicycleParameters, PyDy, validator fixtures, target databases, or generated reference outputs.

---

## 4. Run-state machine

```text
CREATED
  ↓
INGESTING
  ├─ retryable error → CHECKPOINTED_RETRY
  ├─ terminal error  → FAILED_EXPLICIT
  ↓
EVIDENCE_READY
  ↓
RECIPE_SEALED
  ↓
BUILDING
  ├─ repairable error → REPAIRING → BUILDING
  ├─ terminal error   → FAILED_EXPLICIT
  ↓
BUILD_SEALED
  ↓
SIMULATING
  ├─ retryable error → CHECKPOINTED_RETRY
  ├─ terminal error  → FAILED_EXPLICIT
  ↓
SIMULATION_READY
  ↓
VALIDATING
  ↓
PASS | QUALIFIED_PASS | FAIL | ABSTAIN
  ↓
REPLAY_VERIFIED | REPLAY_FAILED
```

A run cannot transition to validation until the build manifest and builder read-set certificate are sealed.

---

## 5. Core schemas

### `DocumentManifest`

```yaml
document_id: string
sha256: string
source_url: string
citation: string
acquired_at: datetime
page_count: integer
parser_policy_id: string
license_note: string
```

### `PageArtifact`

```yaml
document_id: string
page_number: integer
page_image_sha256: string
normalized_text_sha256: string
width: integer
height: integer
role: recipe | validation | mixed | excluded
status: pending | complete | retryable_error | terminal_error
attempts: integer
parser_records: list
```

### `SourceSpan`

```yaml
source_span_id: string
document_sha256: string
page_number: integer
bbox: [x0, y0, x1, y1]
block_id: string
modality: text | equation | table | figure | caption
normalized_text_sha256: string
```

### `EvidenceClaim`

```yaml
claim_id: string
claim_type: parameter | equation | definition | assumption | target
canonical_name: string
value: any
unit: string | null
uncertainty: any | null
epistemic_status: stated | derived | inferred | assumption | default | conflicted | unresolved
confidence: float
source_span_ids: list[string]
parent_claim_ids: list[string]
contradicts: list[string]
```

### `ModelRecipe`

```yaml
recipe_id: string
required_claim_ids: list[string]
parameter_claim_ids: list[string]
equation_claim_ids: list[string]
assumption_claim_ids: list[string]
forbidden_target_ids: list[string]
compiler_version: string
environment_digest: string
```

### `ValidationTarget`

```yaml
target_id: string
metric: string
expected: any
tolerance: any
source_span_ids: list[string]
independence_grade: A | B | C
sealed: true
```

### `BuildManifest`

```yaml
build_id: string
recipe_sha256: string
compiler_version: string
environment_digest: string
read_set_sha256: string
read_claim_ids: list[string]
artifact_hashes: map[string, string]
created_at: datetime
```

### `SimulationRun`

```yaml
simulation_id: string
build_id: string
solver: string
solver_version: string
seed: integer
settings: map
runtime_seconds: float
peak_memory_mb: float
exit_status: string
output_hashes: map[string, string]
warnings: list
```

### `ValidationDecision`

```yaml
run_id: string
verification_checks: map[string, bool]
residuals: map[string, float]
target_ids: list[string]
independence_grade: A | B | C
verdict: pass | qualified_pass | fail | abstain
explanation_codes: list[string]
```

---

## 6. Provenance representation

Stable source-span identity:

```text
sha256(document_sha256 + page_number + normalized_bbox + normalized_text)
```

Required relationships:

- `wasDerivedFrom`;
- `used`;
- `generatedBy`;
- `supports`;
- `contradicts`;
- `assumes`;
- `defines`;
- `validates`;
- `replaces`;
- `retriedFrom`.

### Hard invariant

```text
ConsumedClaim => HasSourceSpan OR ExplicitAssumption OR ExplicitDefault
```

A default without a policy identifier is invalid.

---

## 7. Recipe–target firewall

### MVP isolation

- `recipe.sqlite`: readable by builder, not validator-exclusive secrets;
- `targets.sqlite`: unavailable to builder process;
- separate OS processes;
- builder capability token scoped to recipe reads;
- validator starts only after build sealing;
- append-only read audit;
- build hash and read-set certificate emitted before target access.

### Six-week isolation

- separate containers;
- read-only volumes;
- capability-scoped credentials;
- optional no-network builder;
- signed manifests;
- target volume absent from builder namespace.

### Leakage suite

1. **Target canary:** substitute a conspicuous target and require identical build hash.
2. **Target perturbation:** perturb all targets and require zero process-level build influence.
3. **Negative control:** perturb a recipe value and require the model to change.
4. **Artifact scan:** detect exact and transformed target values in code, comments, traces, and constants.
5. **Read-set verification:** require no target IDs or target-store paths.

---

## 8. Formal specification

Model the workflow in TLA+.

### Safety

```text
BuilderReadSet ∩ TargetStore = ∅
```

```text
PASS => Verified ∧ Validated ∧ ProvenanceComplete ∧ Replayable ∧ NoForbiddenReads
```

```text
CompletedCheckpoint => ImmutableWithinRunLineage
```

```text
TargetsChanged ∧ RecipeUnchanged => BuildArtifactUnchanged
```

### Liveness

```text
BoundedRetryableFailure ∧ FairScheduling
=> ◇(Completed ∨ ExplicitTerminalFailure)
```

TLC model checking runs in CI on bounded configurations.

---

## 9. Deterministic model compiler

The compiler should transform a validated `ModelRecipe` into ordinary Python modules and configuration rather than asking a model to write unrestricted code after targets are known.

Pipeline:

```text
ModelRecipe
→ schema and unit compiler
→ canonical typed intermediate representation
→ Python/NumPy/SciPy templates
→ static checks
→ unit tests
→ sealed build artifacts
```

Model assistance is allowed in extraction and targeted repair. Final execution and verdict logic are deterministic.

---

## 10. Verification checks

- all required claims present;
- units normalized and dimensionally consistent;
- all symbols defined;
- source spans resolve against immutable page artifacts;
- matrix dimensions valid;
- expected symmetry and sign conventions checked;
- code imports only allowlisted packages;
- unit and golden tests pass;
- runtime and memory within limit;
- no target reads;
- build and output replay hashes match.

---

## 11. Validation protocol

### Pre-registered tolerances

| Metric | Tolerance |
|---|---:|
| Matrix relative Frobenius error | `≤ 1e-6` |
| Matched eigenvalue error | `≤ 1e-4` |
| Critical-speed error | `≤ 0.05 m/s` |
| Figure-point relative error | `≤ 2%`, resolution-qualified |
| Required-target provenance | `100%` |
| Forbidden builder reads | `0` |

### Verdict semantics

- `pass`: verification complete, targets within tolerance, Grade A/B evidence, exact replay.
- `qualified_pass`: numerical success but Grade C evidence or material shared assumptions.
- `fail`: residual, provenance, leakage, execution, or replay condition fails.
- `abstain`: insufficient evidence is detected explicitly.

---

## 12. Baselines

| ID | Description |
|---|---|
| B0 | full PDF → one model call → notebook → one execution |
| B1 | page-aware parser and fallback only |
| B2 | provenance graph without target isolation |
| B3 | target isolation without checkpoint resumption |
| B4 | hand-curated recipe upper bound using the same compiler/simulator |

---

## 13. Fault taxonomy

### Document

- missing recipe or target page;
- split table;
- reordered/duplicated page;
- sign, exponent, denominator, or unit corruption;
- conflicting parameter;
- missing caption;
- cropped legend;
- oversized appendix;
- truncated parser output.

### Dependency

- 401, 408, 429, 500;
- reset or timeout;
- malformed JSON;
- empty success;
- repeated response;
- unavailable fallback.

### Execution

- missing or incompatible package;
- timeout or memory cap;
- NaN propagation;
- corrupted checkpoint;
- stale cache;
- interrupted notebook.

### Agent

- invalid structured output;
- fabricated source span;
- target copied into model;
- hidden default;
- ignored contradiction;
- premature success;
- repair without progress.

Every scenario includes a deterministic seed, injection site, expected detection, expected recovery, and forbidden outcome.

---

## 14. Metrics

### Extraction

- parameter P/R/F1;
- normalized exact match;
- equation semantic equivalence;
- table-cell F1;
- figure numeric error;
- epistemic-status accuracy;
- contradiction P/R.

### Provenance

- page and span P/R;
- bounding-box IoU;
- unsupported-claim and fabricated-span rates;
- percentage of consumed claims with valid evidence.

### Reliability

- detection and recovery rates;
- silent-failure rate;
- correct resumption;
- duplicate-work ratio;
- time to recovery;
- retry count;
- terminal-state correctness.

### Simulation and validation

- execution success;
- exact replay;
- matrix/eigenvalue/critical-speed error;
- runtime and memory;
- verdict accuracy;
- false-pass and false-fail rates;
- abstention and qualified-pass calibration.

### Leakage

- forbidden reads;
- target influence;
- canary leakage;
- target-value occurrence;
- semantic dependence.

### Primary endpoint

```text
TAR =
count(executable AND provenance-correct AND decision-correct
      AND leakage-free AND replayable)
/
count(all runs)
```

---

## 15. Statistical analysis

### MVP

- approximately 150 paired runs;
- identical fault and seed across B0 and ReproGate;
- McNemar for paired binary outcomes;
- paired bootstrap confidence interval for TAR difference;
- paired non-parametric tests for latency, tokens, and cost.

### Extension

- 600–1,000 paired runs;
- multiple papers, parsers, model tiers, and fault classes;
- Holm correction for secondary hypotheses;
- effect sizes and confidence intervals.

### Annotation

- two annotators on 20–30% of gold data;
- target agreement at least 0.80;
- adjudication log;
- ontology revision below threshold.

---

## 16. Ablations

- no fallback;
- no checkpoints;
- no provenance;
- no epistemic labels;
- no contradiction detector;
- same-context targets;
- prompt-only separation;
- no retry taxonomy;
- first/last truncation instead of semantic compression;
- single parser;
- free-form code generation;
- LLM verdict assignment.

---

## 17. Phase gates

### Gate 0 — feasibility

- deterministic hand-curated bicycle model matches reference;
- all oracle dependencies isolated from builder;
- tolerances fixed.

### Gate 1 — ingestion

- page hashes and status records complete;
- missing pages detected;
- interruption resumes correctly.

### Gate 2 — evidence

- all compiler inputs have source spans or explicit assumptions;
- contradiction representation works;
- no unsupported silent defaults.

### Gate 3 — firewall

- canary test passes;
- forbidden reads are zero;
- TLA+ safety checks pass.

### Gate 4 — end-to-end

- clean artifact executes;
- V&V verdict correct;
- exact replay;
- incident packet produced on failure.

### Gate 5 — research result

- paired baseline comparison complete;
- uncertainty and effect sizes reported;
- limitations and negative cases documented.

---

## 18. Two-week schedule

| Day | Deliverable |
|---:|---|
| 1 | protocol, gold annotation, schemas, tolerance policy, initial TLA+ |
| 2 | deterministic bicycle model and independent validator |
| 3 | page rendering, primary parser, hashes, roles, token estimates |
| 4 | checkpoints, retry taxonomy, continuation, corrupted-cache checks |
| 5 | evidence graph, units, contradictions, unsupported-claim detection |
| 6 | separate stores/processes, read audit, canaries, TLC |
| 7 | typed compiler, simulator, Marimo artifact |
| 8 | V&V gate and independence grades |
| 9 | B0/B1/B2 and approximately 150 paired fault runs |
| 10 | report, benchmark card, taxonomy, demo, tagged release |

---

## 19. Six-week schedule

| Week | Deliverable |
|---:|---|
| 1 | gold corpus and deterministic primary model |
| 2 | complete MVP and initial benchmark |
| 3 | secondary papers and multimodal/parser expansion |
| 4 | firewall, container, context, and model-routing ablations |
| 5 | large paired evaluation and adjudication |
| 6 | paper-style report, hardened CI, public release |

---

## 20. Success and stop conditions

### Required success

- parameter F1 at least 0.90;
- provenance P/R at least 0.95;
- 100% missing-page detection;
- zero silent missing-page failures;
- recovery at least 0.85;
- 100% deterministic replay;
- validation accuracy at least 0.95;
- false-pass rate at most 0.02;
- zero process-level forbidden reads;
- TAR improvement at least 25 percentage points.

### Stop or redirect

- no deterministic primary model after two engineering days;
- no Grade B validator available;
- annotation agreement below 0.80;
- false-pass rate above 2%;
- fault suite cannot be grounded in real failure modes;
- free-form generation remains unstable;
- work shifts toward interface polish;
- simulation adds no discriminative signal;
- source licensing prevents reproducible acquisition.

If simulation adds no value, redirect to the Scientific-Agent Context Reliability Layer using the same traces and fault harness.

---

## 21. Compute and cost envelope

- 8–16 CPU cores;
- 16–32 GB RAM;
- 20–100 GB disk;
- no required GPU;
- MVP external-model/OCR budget: approximately `$75–$300`;
- six-week budget: approximately `$300–$1,200`;
- lightweight CI/storage: generally below `$50` for the project period.

These are planning envelopes, not quotes. Report actual calls, pages, tokens, retries, latency, cost, and reused work.
