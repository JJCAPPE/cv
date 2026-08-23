# Meridian Strategy — Critical Validation Record

**Validated:** 23 August 2026  
**Target evidence cutoff:** 22 August 2026

This record documents the adversarial review performed before opening the PR. The objective is to make clear which parts of the original hypothesis survived verification, which were narrowed, and what remains uncertain.

## 1. Required-section completeness audit

The main report contains all ten requested deliverables:

- [x] 1. Executive Recommendation (under 300 words)
- [x] 2. Evidence Ledger with >15 substantive entries
- [x] 3. BlueFin and Product Technical Review
- [x] 4. Network Map with required A/B/C/D/X classification and five strongest paths
- [x] 5. Six-project numerical comparison using all ten requested criteria
- [x] 6. Selected Project Research Specification
- [x] 7. Ten-Day Initial Build Plan with exit criteria
- [x] 8. Outreach Strategy
- [x] 9. Positioning Output
- [x] 10. Disconfirmation and Stop Conditions

The selected-project specification explicitly covers:

- [x] research question
- [x] hypotheses
- [x] public dataset/task selection
- [x] baseline systems
- [x] perturbation method
- [x] invariant framework
- [x] failure taxonomy
- [x] grading design
- [x] statistical analysis
- [x] architecture
- [x] data model
- [x] APIs/CLI
- [x] reproducibility plan
- [x] test strategy
- [x] limitations
- [x] ethical/licensing considerations
- [x] expected negative results
- [x] exact success criteria

## 2. Hypothesis audit

### Original hypothesis

> The strongest artifact is an extension measuring whether an apparently correct workbook remains correct when assumptions/source data change.

### Verdict

**Partially confirmed, materially narrowed.**

BlueFin already has a dedicated `Perturbation` grading section, and its official paper explicitly identifies dynamic correctness as a key weakness. Therefore a project whose novelty is merely "counterfactual testing" would be redundant.

### Surviving research gap

The defensible extension is:

> deterministic dependency/invariant diagnostics + systematic perturbation coverage + minimal counterexamples + failure-class-specific judge calibration + explicit spreadsheet-engine uncertainty.

This is complementary to BlueFin because its public manipulation/synthesis grader is agentic even when assessing perturbation criteria.

## 3. Public-task-count correction

The public GitHub repository currently exposes:

- 7 manipulation tasks;
- 1 synthesis task;
- 1 interrogation task.

Thus only **8 public manipulation/synthesis tasks produce workbooks suitable for the structural benchmark core**. The report intentionally avoids claiming there are 10–20 independent public workbook tasks.

The 10–20/30+ evaluation-instance requirement is satisfied through a clearly separated experimental design using:

- all feasible public workbook tasks;
- controlled labelled failure mutants;
- optional saved model outputs where licensing/reproducibility allow.

Controlled mutants are **not** represented as independent source tasks in statistical reporting.

## 4. BlueFin architecture validation

Verified directly in public source:

- [x] `SpreadsheetEnv` uses `openpyxl`.
- [x] Recalculation is delegated to LibreOffice/`soffice`.
- [x] There are 17 registry tools plus `get_workbook_state`, `recalc_workbook`, and `done` = 20 environment tools.
- [x] Manipulation/synthesis grading is an LLM-agent tool loop.
- [x] Rubrics contain Formula Correctness, Model Integration, Output Validation, Perturbation, Presentation, and Pitfalls.
- [x] `d970b98b` contains explicit perturbations involving debt spread, loan sizing, interest rate, LTV, facility size, and PUE.
- [x] Public tests currently center on tool/environment/recalc/scoring/adapter basics.
- [x] License is CC BY-NC 4.0.

## 5. Product-claim validation

Verified from Meridian first-party pages:

- [x] AI-powered modeling layer for Excel.
- [x] "AI execution layer for finance" wording.
- [x] Context across models, documents, templates.
- [x] PDF/CSV/dataroom context.
- [x] Formula/number/source traceability.
- [x] Excel plugin and Meridian application surfaces.
- [x] Audit/review, reconciliation, error-detection use cases.
- [x] Public March 2026 engineering fixes around long workflows, tool loops, checkpoint saves, tool-result persistence, spreadsheet links, deleted-sheet references, document extraction, data validation, formatting, and streaming state.
- [x] Public full-stack role naming React, NestJS, Postgres, desktop app/plugins, spreadsheet-surface abstraction, Office.js/spreadsheet engines, and Electron experience.

### Explicit non-claim

None of those statements proves that Meridian's **current private product** suffers from the benchmark failures discussed in BlueFin. The report consistently treats benchmark weaknesses and product priorities as separate evidence categories.

## 6. Network audit

### Verified direct relationship

- Brian Kulis — direct current research relationship and saved contact.

### Justified cold technical contacts

- Srivatsa Kundurthy — BlueFin first author and current public BlueFin commit author/reviewer.
- George Fang — Meridian CTO/cofounder and BlueFin coauthor.
- John Ling — Meridian CEO/cofounder and BlueFin/SpreadsheetArena coauthor.
- Clara Na — BlueFin/SpreadsheetArena coauthor.
- Other BlueFin authors where role/relevance is evidenced.

### Rejected speculative paths

The final report does **not** treat any of the following as a warm introduction:

- Brian Kulis -> Srivatsa Kundurthy;
- Dartmouth alumni -> John Ling;
- Banca Mediolanum/Databricks -> Meridian;
- BU rowing/student-athlete network -> Meridian.

No first-degree chain was verified, so these remain `X` until evidence appears.

## 7. Project-scope audit

### Kept

- dependency graph;
- normalized formula-family drift detection;
- deterministic bounded perturbations;
- applicability-aware financial invariants;
- controlled fault injection;
- LLM-judge disagreement analysis;
- minimal counterexamples;
- small engine-fidelity validation;
- reproducible CLI/reporting.

### Deferred from initial ten-day scope

- full source-provenance/SEC/XBRL benchmark;
- production-grade web application;
- NestJS/Postgres/queue architecture;
- Office.js/Electron/Tauri product clone;
- broad frontier-model leaderboard.

These were deferred because they reduce research focus or create signaling-driven complexity without improving the central experiment.

## 8. Statistical validity audit

The plan explicitly avoids pseudo-replication:

- controlled mutants are labelled instances, not claimed as independent tasks;
- raw counts and per-failure-class confusion matrices are primary;
- paired effects and bootstrap intervals may be reported where meaningful;
- small-N significance claims are discouraged;
- human review is proposed for a bounded calibration subset;
- engine-ambiguous cases are not counted as model failures by default.

## 9. Licensing audit

BlueFin's public license is **CC BY-NC 4.0**.

Consequences incorporated into the plan:

- attribution is required;
- copied/adapted BlueFin materials retain applicable license constraints;
- do not relicense copied task/workbook data as unrestricted permissive code;
- prefer scripts/manifests that reference/download upstream assets rather than duplicating the entire dataset;
- no commercial-use claim is made.

## 10. Hallucination-risk removals/corrections

The validation pass removed or narrowed the following risky statements from the prior narrative:

1. **"BlueFin does not test counterfactual correctness."** False; it has explicit perturbation grading.
2. **"There are 10–20 public BlueFin workbook tasks available for the initial study."** Not supported by the current public GitHub subset; corrected to 8 manipulation/synthesis workbook tasks plus labelled mutants.
3. **"Brian Kulis can introduce Srivatsa Kundurthy."** Not verified; removed as a warm path.
4. **"Dartmouth provides a usable warm path to John Ling."** Not verified; classified `X`.
5. **"Banca Mediolanum/Databricks contacts provide a Meridian path."** Not verified; classified `X`.
6. **"BlueFin judge weakness is established."** Too strong; the paper reports strong aggregate calibration. The project asks a narrower failure-class-specific complementarity question.
7. **"LibreOffice divergence implies BlueFin errors."** Unsupported; engine divergence is treated as an ambiguity/confounder.
8. **"Meridian's product has the same hardcoding/dynamic failures as benchmark agents."** Unsupported; explicitly prohibited throughout the report.
9. **"Mirroring Meridian's stack is itself valuable."** Rejected; research prototype uses the simplest technically justified stack.
10. **"A BlueFin PR should be the first publication step."** Rejected; companion study first, PR only after evidence and maintainer alignment.

## 11. Final adversarial assessment

### Why this strategy is still strong

The project sits directly at the intersection of two verified Meridian priorities:

1. public research on spreadsheet-agent evaluation and dynamic correctness;
2. public product emphasis on traceability, auditability, multi-sheet structural integrity, and reliable agent execution.

It also uses demonstrated candidate capabilities rather than requiring a new specialty from scratch.

### Main unresolved risks

- deterministic formula-family heuristics may generate too many false positives;
- the public task subset may be too small for broad generalization;
- Excel-vs-LibreOffice semantics may create ambiguous cases;
- BlueFin's calibrated agentic judge may already catch most injected faults;
- maintainers may prefer benchmark expansion over deterministic instrumentation.

All five risks produce actionable stop/pivot conditions in the report.

## 12. Completion gate

The research package is ready to merge only if the PR diff contains exactly the intended `outreach/meridian/` documentation, links resolve syntactically, and no unrelated repository files changed. PR review should confirm these conditions before merge.