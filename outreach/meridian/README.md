# Meridian / Longitude Labs — BlueFin Research Extension, Connection Mapping, and Build-Before-Outreach Strategy

**Evidence cutoff:** 22 August 2026  
**Validation pass:** 23 August 2026  
**Candidate:** Giacomo Cappelletto  
**Purpose:** Determine the strongest technically substantive artifact to build before approaching Meridian (Longitude Labs), based on Meridian's public product/research agenda and Giacomo's demonstrated engineering/research background.

> **Evidence discipline.** This report distinguishes public research findings, public product statements, code-derived findings, and inference. It does **not** infer that Meridian's private product has any weakness merely because BlueFin exposes that weakness in third-party frontier spreadsheet agents.

---

## 1. Executive Recommendation

**Meridian should remain a top-priority target.** Its public product and research agenda is unusually aligned with Giacomo's strongest demonstrated work: auditable action-taking agents in finance, tracing and evaluation, robustness research, spreadsheet/desktop engineering, and full-stack systems.

The most relevant current technical problem is **not simply dynamic correctness**. BlueFin already measures dynamic behavior through expert-authored perturbation criteria evaluated by an agentic LLM judge. The stronger extension is to ask whether dynamic failures can be **detected deterministically, localized structurally, reproduced across spreadsheet engines, and separated from judge error**.

The recommended artifact is **BlueFin Robustness Auditor**: a companion open-source study that reconstructs workbook dependency graphs, applies deterministic finance-domain perturbations, checks structural and financial invariants, generates minimal counterexamples, and quantifies agreement/disagreement with BlueFin's existing LLM grader. It should be published as a companion repository and technical memo first; a narrowly scoped BlueFin PR should follow only if results show a concrete reusable extension seam.

The strongest first contact is **Srivatsa Kundurthy** because he is BlueFin's first author and the public repository's most clearly evidenced active maintainer. **George Fang** is the strongest product-systems contact if the result centers on engine fidelity, spreadsheet abstractions, or structural validation. **John Ling** is appropriate once a finding has broader research/product implications.

The largest risk is redundancy: a project that merely adds more counterfactual input changes would reproduce BlueFin's existing perturbation methodology rather than extend it.

---

## 2. Evidence Ledger

| Claim | Supporting evidence | Source | Publication date | Event date | Confidence | Fact / inference |
|---|---|---|---|---|---|---|
| Meridian describes itself as an AI-powered modeling layer for Excel. | Official homepage and About page use this framing. | [Meridian home](https://www.meridian.ai/), [About](https://www.meridian.ai/about) | Current | Current | High | Fact |
| Meridian says it is building an "AI execution layer for finance." | Explicit official About-page statement. | [About](https://www.meridian.ai/about) | Current | Current | High | Fact |
| Meridian's agent is intended to operate with context across models, documents, and templates. | Official mission/vision statement. | [About](https://www.meridian.ai/about) | Current | Current | High | Fact |
| Meridian supports PDFs, CSVs, dataroom documents, and connected workspace context. | Product homepage and launch post describe directory/multi-file context. | [Home](https://www.meridian.ai/), [Launch post](https://www.meridian.ai/blog) | 11 Feb 2026 for launch post | 2026 | High | Fact |
| Source-level traceability is a core public product property. | Homepage says every formula/number can be traced; launch post says results trace to source data. | [Home](https://www.meridian.ai/), [Launch post](https://www.meridian.ai/blog) | 11 Feb 2026 | 2026 | High | Fact |
| Meridian operates in Excel through a plugin and also through its own app. | Security FAQ and product pages explicitly describe Excel plugin + Meridian app. | [Security](https://www.meridian.ai/security) | Current | Current | High | Fact |
| Meridian publicly supports audit/review workflows including broken-formula and structural checks. | Security FAQ lists model review, audit, reconciliation, error detection, and explicit auditing for broken formulas/structural issues. | [Security](https://www.meridian.ai/security) | Current | Current | High | Fact |
| BlueFin contains 131 tasks and 3,225 rubric criteria. | Paper abstract and public README. | [BlueFin paper](https://arxiv.org/abs/2605.30907), [repo](https://github.com/Longitude-Labs/bluefin) | 29 May 2026 | 2026 | High | Fact |
| BlueFin evaluates synthesis, manipulation, and interrogation/comprehension. | Paper and repository task structure. | BlueFin paper/repo | 29 May 2026 | 2026 | High | Fact |
| BlueFin identifies dynamic correctness as a particular frontier-model weakness. | Paper abstract and Meridian's BlueFin post. | [Paper](https://arxiv.org/abs/2605.30907), [Meridian BlueFin post](https://www.meridian.ai/blog/all/bluefin) | May/June 2026 | 2026 | High | Fact |
| BlueFin already includes perturbation grading. | Public rubric and grader contain a dedicated Perturbation section that mutates inputs and checks downstream values. | [`scoring/grade.py`](https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py), task rubrics | Current repo | Current | High | Fact |
| BlueFin's manipulation/synthesis grader is agentic. | `grade.py` creates an LLM judge with spreadsheet tools and asks it to evaluate rubric criteria. | [`scoring/grade.py`](https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py) | Current | Current | High | Fact |
| BlueFin reports strong human calibration for its judge. | Paper reports alpha=0.826 and macro-F1=0.839 against expert consensus. | BlueFin paper | 29 May 2026 | 2026 | High | Fact |
| Aggregate judge calibration does not establish equal reliability for every structural failure class. | The published metrics are aggregate; no public failure-class-specific deterministic-vs-judge study was found. | Paper + repo review | — | — | High | Inference |
| BlueFin workbook state is implemented with `openpyxl`. | `SpreadsheetEnv` loads and mutates workbooks using openpyxl. | [`mcp_server/spreadsheet_env.py`](https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/spreadsheet_env.py) | Current | Current | High | Fact |
| BlueFin recalculates formulas with LibreOffice headless. | `recalc.py` invokes `soffice/libreoffice`. | [`mcp_server/recalc.py`](https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/recalc.py) | Current | Current | High | Fact |
| Spreadsheet-engine fidelity is therefore a valid evaluation question. | LibreOffice is a practical reproducible engine, but not identical to Microsoft Excel; the project must classify engine disagreement separately from workbook error. | Code-derived | — | — | High | Inference |
| SpreadsheetArena studies preference and finance-specific quality dimensions. | Official post and paper describe blind pairwise evaluation and expert finance review. | [SpreadsheetArena post](https://www.meridian.ai/blog/all/spreadsheet-arena), [paper](https://arxiv.org/abs/2603.10002) | 13/16 Feb 2026 | 2026 | High | Fact |
| Finance expert judgments differ materially from general crowd preference. | Meridian reports expert/crowd agreement only around half the time and highlights finance-specific formatting conventions. | SpreadsheetArena post | 13 Feb 2026 | 2026 | High | Fact |
| Meridian publicly worked on reliability for long AI workflows. | Changelog cites conversation stalls during longer workflows, large tool-loop failures, retry behavior, and interrupted reasoning. | [Changelog](https://www.meridian.ai/changelog) | March 2026 | March 2026 | High | Fact |
| Meridian publicly worked on checkpoint/state integrity. | Changelog cites large checkpoint-save failures, tool-result persistence, unsaved-change handling, conversation persistence, and window-state restore. | Changelog | March 2026 | March 2026 | High | Fact |
| Spreadsheet link persistence and deleted-sheet references are public engineering concerns. | Changelog explicitly lists fixes for both. | Changelog | March 2026 | March 2026 | High | Fact |
| Document extraction and data-validation support were active engineering areas. | Changelog describes fuller source-content parsing and stronger spreadsheet data validation. | Changelog | 20 Mar 2026 | 20 Mar 2026 | High | Fact |
| Meridian's public hiring material names React, NestJS, and Postgres. | Full-stack role explicitly lists the stack. | [Ashby role](https://jobs.ashbyhq.com/meridian-ai/26e6e052-6a0f-4e90-9781-c52f2ce40092/) | 2026 | 2026 | High | Fact |
| Meridian has publicly described a platform abstraction spanning spreadsheet surfaces. | Same role describes an abstraction layer across multiple spreadsheet surfaces and portability problems. | Ashby role | 2026 | 2026 | High | Fact |
| Electron/desktop and Office.js experience are directly relevant to published engineering needs. | Ashby role lists Electron/mobile architecture and spreadsheet engines/Office.js as bonuses. | Ashby role | 2026 | 2026 | High | Fact |
| Public BlueFin contribution surface is small and still evolving. | Repo currently has a small public task subset, one test module, very few commits, no visible open issues, and only two visible PRs at validation time. | [BlueFin repo](https://github.com/Longitude-Labs/bluefin) | Current | Current | High for snapshot | Fact |
| BlueFin maintainers are actively editing perturbation rubrics. | 16 Jun commit removes a placeholder perturbation criterion; current PR refreshes task rubrics including sensitivity cases. | [Commit 643336b](https://github.com/Longitude-Labs/bluefin/commit/643336ba21526666b51bc9e2decd25d57d0e3434), PR #2 | June 2026 | June 2026 | High | Fact |
| Meridian explicitly invites researchers working on spreadsheet reasoning/evaluation to build on BlueFin. | Closing call-to-action in official BlueFin post. | Meridian BlueFin post | 2026 | 2026 | High | Fact |
| Giacomo's experience directly supports this project scope. | CV repository/resume documents financial agent architecture, governed SQL, citation retrieval, typed contracts, tracing, LLM judging, robustness research, Tauri/Rust desktop work, and full-stack deployment. | `JJCAPPE/cv`, uploaded resume | Current | 2025–2026 | High | Fact |

### Evidence classification for the 15 pressure points

| Pressure point | Classification | Basis |
|---|---|---|
| Dynamic correctness under changed assumptions | **Confirmed Meridian research focus** | BlueFin paper + perturbation rubrics |
| Hardcoded intermediates where formulas should remain | **Confirmed Meridian research focus** | BlueFin Model Integration/Pitfalls + official BlueFin framing |
| Formula overwrite / formula drift | **Confirmed Meridian research focus** | Formula correctness and pitfalls; public dynamic-correctness discussion |
| Broken or stale cross-sheet references | **Confirmed Meridian product focus** and research adjacency | Changelog + BlueFin integration rubrics |
| Scenario-switch / sensitivity-table integrity | **Confirmed Meridian research focus** | Public `d970b98b` sensitivity/perturbation rubric |
| Circular references / hidden dependency failures | **Strong inference** | Recalc enables iterative calculation; no equivalent explicit research program found |
| Source provenance from output to source material | **Confirmed Meridian product focus** | Homepage/launch traceability claims |
| Extracted number/unit/date/period/sign correctness | **Confirmed product focus; strong research inference** | Extraction/data-validation product work; not isolated as a named BlueFin dimension |
| Formatting as semantic information | **Confirmed Meridian research focus** | SpreadsheetArena finance expert analysis + BlueFin presentation rubric |
| Recovery from partial/failed tool sequences | **Confirmed Meridian product focus** | Changelog reliability fixes |
| Long-running operation/checkpoint integrity | **Confirmed Meridian product focus** | Changelog checkpoint/tool-loop/state fixes |
| Numerical vs financial-method vs presentation quality | **Confirmed Meridian research focus** | Separate BlueFin rubric dimensions + SpreadsheetArena expert study |
| LLM judge reliability vs programmatic checks | **Confirmed research concern; proposed comparison is complementary** | BlueFin judge calibration exists; failure-class-specific hybrid study not found |
| Portability across engines/surfaces | **Confirmed Meridian product focus; strong research inference** | Ashby portability/abstraction role + BlueFin LibreOffice implementation |
| Minimal counterexample generation | **Unsupported as an existing Meridian focus; strong candidate extension** | No equivalent public implementation found |

---

## 3. BlueFin and Meridian Product Technical Review

### 3.1 Code-derived BlueFin architecture

Public repository structure:

```text
agents/       provider adapters, agent loop, trajectory logging
mcp_server/   stateful spreadsheet environment and tools
scoring/      agentic grading and score computation
prompts/      agent prompts
run_configs/  benchmark run configuration
adapters/     task conversion
 tasks/       public manipulation/synthesis/interrogation subset
 tests/       current tool/environment tests
```

BlueFin exposes a **20-tool environment**: 17 registry tools plus `get_workbook_state`, `recalc_workbook`, and `done`. The tools cover reading, writing, sheet/row/column mutation, formatting, charting, sandboxed Python, recalculation, and completion.

`SpreadsheetEnv` is stateful and backed by `openpyxl`. Formula strings remain visible until recalculation. `recalc_workbook` writes the workbook and invokes LibreOffice headlessly, then reloads a `data_only=True` copy so subsequent reads can expose cached computed values. Mutations invalidate the recalculated cache.

### 3.2 Grading architecture

Manipulation/synthesis grading is rubric-based and agentic. Current rubric sections are:

1. Formula Correctness
2. Model Integration
3. Output Validation
4. Perturbation
5. Presentation
6. Pitfalls

For Perturbation, the grader instructs the judge to preserve a pristine state, mutate the specified input, recalculate/re-observe the specified downstream value, compare against a target, and restore state. Therefore **"add counterfactual testing to BlueFin" is redundant**.

Interrogation uses answer grading rather than workbook-rubric grading.

### 3.3 What BlueFin already measures well

BlueFin already goes far beyond static cell-output checks. It explicitly addresses formula structure, source/integration links, numerical outputs, counterfactual propagation, presentation quality, and known pitfalls. Its paper additionally reports expert validation of the agentic judge.

A useful extension must therefore improve **diagnostic resolution, determinism, evaluator calibration, or reproducibility**, not merely add another spreadsheet generator or another single perturbation.

### 3.4 Complementary extension seams

**Deterministic dependency-graph analysis — complementary.** No public first-class subsystem was found that models formula dependencies as a graph, compares graph topology before/after an agent edit, normalizes copied formula families, or localizes the first broken dependency.

**Minimal counterexample search — complementary.** Existing BlueFin perturbations are authored cases with target outputs. No public component was found that searches for the smallest valid input change that exposes a latent defect.

**Failure-class-specific judge calibration — complementary.** BlueFin publishes strong aggregate calibration. A study that injects known failure classes and compares deterministic labels, LLM judge labels, and human labels would answer a different question.

**Engine sensitivity — complementary.** The public harness uses LibreOffice; Meridian's product is Excel-centric. A small, carefully bounded study of when engine behavior changes evaluation is useful, provided engine disagreement is not mislabeled as agent error.

**Provenance evaluation — product-relevant but second-phase.** Meridian publicly emphasizes source traceability, but the current public BlueFin release does not make document-to-cell provenance the core benchmark dimension. This is a valid later extension, not the best ten-day first build.

**Trajectory/checkpoint fault injection — product-relevant but not yet a confirmed BlueFin direction.** Meridian's changelog strongly supports product relevance; BlueFin currently emphasizes resulting workbook quality rather than fault-tolerant execution.

### 3.5 Public task surface

At validation time, the public GitHub subset contains:

- **7 manipulation tasks:** `2aac5a2a`, `2bdd0f12`, `67cbe713`, `95d3752e`, `d970b98b`, `e13c5e9d`, `eae8665e`
- **1 synthesis task:** `TTWO_Operating_Model_DCF`
- **1 interrogation task:** `0122`

That means there are **8 public workbook-producing manipulation/synthesis tasks** suitable for the core structural study. The experimental design should not pretend there are 10–20 independent public workbook tasks. Instead, use those 8 workbooks plus multiple **controlled, labelled mutants** and, where licensing permits, multiple saved model outputs.

### 3.6 Repository activity and contribution posture

The public repository is early-stage: few commits, one visible test module, no open issues at validation time, and two visible PRs (one superseded, one open task-data refresh). The latest code-derived maintenance evidence includes a June commit by GitHub user `srkvatsa` fixing a placeholder perturbation criterion and PR #2 refreshing seven manipulation tasks.

**Recommendation:** companion repository + study first; contribution proposal second; focused PR only after maintainers indicate the extension fits the repository boundary.

---

## 4. Network Map

### 4.1 Ranked map

| Target person | Current role / evidence | Technical relevance | Connection path | Relationship strength | Recommended approach |
|---|---|---|---|---|---|
| **Srivatsa Kundurthy** | BlueFin first author; SpreadsheetArena coauthor; public BlueFin commit author/reviewer | Direct benchmark/evaluation relevance | Evidence-based cold research contact | **D** | First technical contact after results exist |
| **George Fang** | Meridian CTO & co-founder; BlueFin coauthor; prior engineering at Scale AI per Meridian About | Spreadsheet systems, portability, product architecture | Evidence-based cold technical contact | **D** | Best if findings center on engine fidelity, dependency abstractions, or platform architecture |
| **John Ling** | Meridian CEO & co-founder; BlueFin and SpreadsheetArena coauthor; prior Special Projects at Scale AI | Research-to-product strategy | Evidence-based cold founder contact | **D** | Use once result has broad evaluation/product implication |
| **Clara Na** | BlueFin/SpreadsheetArena coauthor, CMU affiliation in papers | Evaluation methodology, structured artifacts | Cold academic/research contact | **D** | Strong external-methodology reviewer |
| **Anoushka Mohta** | Meridian; BlueFin coauthor | Finance/evaluation research | Cold Meridian research contact | **D** | Backup research contact |
| **Colton Moraine** | BlueFin coauthor | Benchmark research | Cold research contact | **D** | Backup benchmark contact |
| **Case Winter** | BlueFin coauthor | Finance-model methodology/evaluation | Cold research contact | **D** | Useful if finance-method failures dominate |
| **Zach Kirshner** | Meridian COO & co-founder; BlueFin/SpreadsheetArena coauthor | Product/finance workflow framing | Cold founder/product contact | **D** | Secondary founder path |
| **Brian Kulis** | BU professor and Giacomo's current research supervisor | Robustness/evaluation critique | Direct relationship | **A** | Ask for experimental-design critique, not a manufactured Meridian intro |
| **Dartmouth → John Ling path** | John Ling's Dartmouth history may be public, but no first-degree intermediary was verified | Potential future warm route | No verified chain | **X** | Exclude until a real intermediary is identified |
| **Banca Mediolanum / Databricks → Meridian** | Domain overlap only | Potentially relevant ecosystem | No verified person-to-person chain | **X** | Exclude |
| **BU / rowing alumni → Meridian** | No verified Meridian path found | Potential community route | Speculative | **X** | Exclude |

### 4.2 Five strongest paths

#### Path 1 — Giacomo → Srivatsa Kundurthy

**Chain:** direct research cold outreach.  
**Evidence:** BlueFin first author; current public BlueFin maintenance activity is tied to `srkvatsa`; Meridian explicitly invites researchers to build on BlueFin.  
**Why legitimate:** the message can be about a reproduced benchmark result and a concrete evaluator-design question, not employment.  
**Ask:** whether deterministic structural checks belong as an additional rubric signal, a diagnostic layer, or a judge-calibration instrument.  
**Evidence required first:** reproducible repo, >=30 labelled mutants, >=3 localized failures, disagreement matrix, concise memo.

#### Path 2 — Giacomo → George Fang

**Chain:** artifact → CTO.  
**Evidence:** CTO, BlueFin coauthor, public role descriptions around spreadsheet surfaces and portability.  
**Ask:** how much confidence should come from engine-independent structural validation versus Excel-native execution.  
**Evidence required first:** engine caveat, dependency graph implementation, at least one reproducible structural failure, no overclaim about Meridian internals.

#### Path 3 — Giacomo → Clara Na

**Chain:** direct research contact.  
**Evidence:** BlueFin and SpreadsheetArena coauthor; CMU affiliation in the research papers.  
**Ask:** whether deterministic checks are best used as labels/features for a learned judge, independent evaluators, or calibration controls.  
**Evidence required first:** failure-class definitions and human-labelled calibration sample.

#### Path 4 — Giacomo → John Ling

**Chain:** artifact → founder/research sponsor.  
**Evidence:** CEO/cofounder; coauthor of Meridian spreadsheet-evaluation work; public statements that research insights feed product decisions.  
**Ask:** whether the more valuable benchmark frontier is broader task coverage or deeper evidence explaining why a workbook fails.  
**Evidence required first:** a result with product/research implications rather than only tooling.

#### Path 5 — Giacomo → Brian Kulis → technical critique

**Chain:** direct current research relationship.  
**Evidence:** current BU robustness research.  
**Why legitimate:** robustness/evaluation design is directly relevant to the project.  
**Ask:** challenge perturbation validity, independence of samples, calibration methodology, and whether the claimed research question is actually falsifiable.  
**Evidence required first:** draft methods + first result table.  
**Important:** do not ask Kulis for a Meridian introduction unless he independently indicates a real relationship.

---

## 5. Project Comparison

Scores are 1–10 on Meridian specificity, research contribution, product relevance, technical depth, candidate fit, public feasibility, demonstrability, scope realism, contribution potential, and conversation value.

| Rank | Project | Meridian | Research | Product | Depth | Fit | Public | Demo | Scope | Contribution | Conversation | Total /100 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **1** | **BlueFin Robustness Auditor + Judge Calibration** | 10 | 10 | 9 | 10 | 10 | 9 | 9 | 8 | 10 | 10 | **95** |
| **2** | **Minimal Counterexample Generator for Financial Models** | 10 | 10 | 9 | 10 | 9 | 10 | 10 | 7 | 9 | 10 | **94** |
| **3** | **Financial Invariant Checker for BlueFin** | 10 | 9 | 10 | 9 | 10 | 10 | 8 | 8 | 9 | 9 | **92** |
| **4** | **Spreadsheet Engine Fidelity Benchmark** | 9 | 9 | 10 | 9 | 9 | 10 | 8 | 9 | 9 | 9 | **91** |
| **5** | **Source-to-Cell Provenance Evaluation Suite** | 10 | 9 | 10 | 10 | 10 | 7 | 10 | 6 | 8 | 10 | **90** |
| **6** | **Agent Trajectory Failure/Recovery Benchmark** | 9 | 9 | 10 | 9 | 10 | 8 | 9 | 7 | 8 | 9 | **88** |

### Why the top project wins

The top project asks a question Meridian has publicly made important but does not merely reproduce BlueFin: **what extra evaluation fidelity and diagnosis do deterministic structural methods add to a calibrated agentic grader?** It also exploits Giacomo's real strengths in agent evaluation/tracing, financial workflows, robustness research, and systems implementation.

### Other candidates

**Minimal Counterexample Generator.** Search the allowed assumption space for the smallest valid change that reveals an invariant or dependency failure, then return the first divergent cell and causal path. Highest demo value; slightly narrower than the selected study.

**Financial Invariant Checker.** Declarative, applicability-aware checks for balance sheets, debt schedules, cash roll-forwards, EV-to-equity bridges, and formula continuity. Strongest likely reusable BlueFin component.

**Spreadsheet Engine Fidelity Benchmark.** Compare a tightly defined set of formula/workbook semantics under LibreOffice and Microsoft Excel; use openpyxl only for preservation/introspection. Very strong fallback if evaluator disagreement is small.

**Source-to-Cell Provenance Suite.** Use synthetic or public SEC/XBRL source facts and measure source, period, unit, sign, lineage, and stale-source handling. Excellent product relevance but too broad for the first ten days.

**Trajectory Failure/Recovery Benchmark.** Inject interrupted saves, duplicate calls, timeout/partial writes, and stale state into long tool sequences. Public changelog makes this product-relevant, but it is less directly established as BlueFin's research direction.

---

## 6. Selected Project Research Specification

### 6.1 Project name

**BlueFin Robustness Auditor**  
Suggested repository: `bluefin-robustness`

### 6.2 Research question

> Do deterministic structural and financial checks identify dynamically fragile financial workbooks that BlueFin's existing rubric-and-LLM evaluation misses, ambiguously diagnoses, or classifies differently?

Secondary question:

> Can minimal counterfactual perturbations localize the first broken dependency and provide more diagnostic evidence than a binary perturbation criterion?

### 6.3 Hypotheses

- **H1 — Static/dynamic gap:** workbooks with similar static scores can have materially different systematic robustness under bounded perturbations.
- **H2 — Evaluator complementarity:** deterministic checks will catch some structural defects missed by the LLM judge, while the LLM judge will outperform deterministic checks on ambiguous finance-method criteria.
- **H3 — Localization:** dependency-path analysis can reduce a downstream wrong result to a small set of first-divergence cells for a meaningful fraction of injected failures.
- **H4 — Perturbation density:** multiple bounded perturbations can expose latent defects that a single authored perturbation does not.
- **H5 — Engine sensitivity:** some cases will be engine-sensitive, but engine disagreement should be separable from agent/model failure.

### 6.4 Public dataset and task selection

Use the **8 public manipulation/synthesis workbook tasks** in the current GitHub release where feasible. Do not report them as 20 independent tasks. Expand the evaluation set through:

1. the 8 source/golden workbooks;
2. >=30 controlled labelled mutants across those workbooks;
3. saved agent outputs only when licensing and reproducibility permit.

Prioritize:

- `d970b98b` — debt, SOFR, PUE, facility sizing, DSCR/LLCR, sensitivity logic;
- `e13c5e9d` — financial statements, roll-forwards, period linkage;
- `eae8665e` — LBO summary/returns and purchase-multiple sensitivity;
- `95d3752e` — cross-sheet income/integration logic;
- `2aac5a2a` — waterfall/tier/return mechanics.

### 6.5 Baselines

1. BlueFin full rubric score.
2. BlueFin Perturbation subsection score.
3. Static deterministic formula/reference checker.
4. Full robustness auditor.
5. Optional second judge model for judge-sensitivity analysis.

The research object is the **evaluation layer**, not a new model leaderboard.

### 6.6 Perturbation method

Define deterministic YAML/JSON specs with semantic name, cell/range, baseline, bounded domain, allowed transform, discrete/continuous type, and expected invariant/direction.

Example:

```yaml
input: Inputs!F14
semantic_name: SOFR
baseline: 0.043
domain: [0.02, 0.08]
levels: [-0.20, -0.10, 0.10, 0.20]
transform: relative
```

Perturbation families:

- revenue growth / price / volume;
- margins and tax rates;
- working-capital days;
- capex/depreciation;
- SOFR/base rate and credit spread;
- WACC/terminal growth;
- leverage/facility size/acquisition or exit multiple;
- dates/fiscal periods;
- FX rates;
- scenario selectors.

All ranges must be finance-domain plausible; arbitrary Gaussian noise is not sufficient.

### 6.7 Workbook dependency model

Parse formulas into a workbook intermediate representation:

- `CellNode`
- `RangeNode`
- `NamedRangeNode`
- `ExternalReferenceNode`

Edges:

- `DIRECT_REFERENCE`
- `RANGE_REFERENCE`
- `NAMED_RANGE`
- `EXTERNAL_LINK`
- `TABLE_REFERENCE` where supported

Normalize relative references so copied formulas can be grouped into formula families. Detect:

- formulas replaced by constants;
- anomalous breaks in repeated formula regions;
- lost/changed dependency edges;
- cross-sheet rewiring;
- deleted/broken references;
- newly introduced cycles where detectable.

### 6.8 Invariant framework

Every invariant has:

```text
id
scope
applicability
confidence
required cells/ranges
evaluation function
tolerance
financial rationale
expected direction (optional)
```

High-confidence first-wave checks:

- balance sheet balance;
- cash roll-forward;
- retained-earnings roll-forward where explicit;
- debt roll-forward: BOP + draws - repayment = EOP;
- enterprise-to-equity value bridge where explicit;
- forecast-period/date continuity;
- formula-family continuity;
- source-link continuity;
- no unexpected spreadsheet errors;
- scenario selector affects intended descendants and restores correctly.

Do not universalize convention-dependent rules. Each financial invariant records applicability and confidence.

### 6.9 Failure taxonomy

**Structural**
- hardcoded intermediary / overwritten formula;
- formula-family drift;
- stale or broken reference;
- wrong cross-sheet link;
- circular dependency;
- deleted-sheet reference.

**Dynamic**
- stale output;
- partial propagation;
- scenario-switch failure;
- sensitivity failure;
- correct static value but incorrect behavior after input change.

**Financial/methodological**
- balance mismatch;
- roll-forward mismatch;
- valuation-bridge inconsistency;
- sign/unit/period inconsistency;
- numerically consistent but financially invalid methodology.

**Provenance (optional phase)**
- unsupported source;
- stale source;
- source period/unit mismatch.

**Evaluation-system**
- LLM judge false positive;
- LLM judge false negative;
- engine-ambiguous case;
- nondeterministic judge disagreement.

### 6.10 Hybrid grading

Never collapse all evidence into one scalar at the start. Report separately:

```text
BlueFin score
Static structural score
Dynamic robustness score
Financial-invariant score
Judge/programmatic agreement
Engine confidence
```

The LLM judge remains necessary for open-ended finance-method and presentation criteria. Deterministic checks provide high-confidence evidence for structural cases where exact programmatic verification is appropriate.

### 6.11 Controlled judge-calibration study

Generate labelled mutants of golden workbooks:

1. replace a formula with its current displayed value;
2. redirect a forecast formula to the prior period;
3. invert a sign;
4. break a cross-sheet link;
5. alter one formula in a repeated forecast region;
6. disconnect a scenario selector;
7. shift a date/period mapping;
8. introduce a downstream hardcode.

For every mutant record deterministic expected label, BlueFin judge label, and for a 30–50 case subset a human-reviewed label. Compute precision/recall/F1 by failure type and agreement statistics (e.g. Cohen's kappa for paired binary labels; report raw confusion matrices regardless).

### 6.12 Minimal counterexample generation

For each perturbable input/output path:

1. search within the allowed domain;
2. identify the smallest change that triggers an invariant or expected-output failure;
3. traverse descendants in dependency order;
4. identify the first divergent cell(s);
5. report the broken path and uncertainty.

Example result format:

```text
Baseline WACC: 8.00%
Smallest exposing WACC: 8.37%
First divergent cell: DCF!J41
Path: Assumptions!B12 -> DCF!J16 -> DCF!J29 -> DCF!J41 -> Summary!F8
Failure: formula-family drift
Engine: LibreOffice 26.x
Confidence: high
```

Diagnosis and suggested repair must remain separate; repair is not counted as successful until re-evaluated.

### 6.13 Workbook-engine plan

**openpyxl:** parsing/preservation/metadata, not formula execution.  
**LibreOffice:** primary reproducible calculation engine because it matches the public BlueFin harness.  
**Microsoft Excel:** validation reference for a small representative subset if an actual Excel automation environment is available.  

If Excel and LibreOffice disagree on a case, classify it as **engine-ambiguous** until resolved. Never count engine divergence as an agent failure by default.

### 6.14 Architecture

Do **not** force Meridian's full public product stack into a ten-day research prototype.

Initial implementation:

```text
Python 3.12
src/bluefin_robustness/
  workbook/
    parser.py
    formulas.py
    graph.py
    diff.py
  perturb/
    spec.py
    runner.py
    search.py
  invariants/
    structural.py
    finance.py
    registry.py
  grading/
    deterministic.py
    bluefin_adapter.py
    agreement.py
  reports/
    html.py
  cli.py
```

Recommended libraries: `openpyxl`, `networkx`, `pydantic`, `pandas` or `polars`, `scipy`, `pytest`, `typer`, `rich`.

A lightweight React report viewer is optional only after the research core is complete. NestJS/Postgres/queues are unnecessary for the initial study.

### 6.15 Data model

- `Run`
- `Workbook`
- `WorkbookVersion`
- `Cell`
- `Formula`
- `DependencyEdge`
- `Perturbation`
- `Invariant`
- `InvariantResult`
- `Failure`
- `JudgeResult`
- `Counterexample`
- `EngineResult`

Use JSON/Parquet/SQLite initially. PostgreSQL is not justified until there is a multi-user or service requirement.

### 6.16 CLI/API

Canonical CLI:

```bash
bluefin-robustness analyze workbook.xlsx
bluefin-robustness perturb case.yaml
bluefin-robustness compare baseline.xlsx candidate.xlsx
bluefin-robustness calibrate ./mutants
bluefin-robustness report ./runs/run-001
```

Optional later service:

```text
POST /runs
GET /runs/:id
GET /runs/:id/failures
GET /runs/:id/dependencies/:cell
```

### 6.17 Statistical analysis

Primary outcomes:

- failure detection rate by class;
- false-positive rate by class;
- deterministic-vs-LLM agreement;
- failures exposed per valid perturbation;
- minimum perturbation magnitude to failure;
- localization depth/path length;
- engine disagreement rate.

Because the public task count is small, emphasize paired task-level effects, raw counts, bootstrap confidence intervals where meaningful, and uncertainty. Avoid overclaiming statistical significance from correlated mutants.

### 6.18 Reproducibility plan

- locked Python environment (`uv.lock` or equivalent);
- Docker image with documented LibreOffice version;
- deterministic perturbation seeds/specs;
- immutable task manifest with BlueFin commit SHA;
- command to reproduce every table/figure;
- GitHub Actions unit/smoke tests;
- raw result JSON/Parquet checked in where licensing permits;
- exact model/judge names and API dates in experiment metadata;
- no private Meridian APIs or customer data.

### 6.19 Test strategy

Unit tests:

- formula reference parsing;
- relative-reference normalization;
- graph edge generation;
- mutation injection;
- invariant pass/fail cases;
- pristine-state restoration;
- counterexample search boundaries.

Integration tests:

- one small synthetic workbook end-to-end;
- one public BlueFin workbook end-to-end;
- deterministic replay of selected perturbations;
- workbook preservation hash/feature checks where possible.

Regression tests:

- every accepted labelled mutant remains correctly classified;
- known engine-ambiguous cases remain explicitly flagged.

### 6.20 Ethical and licensing considerations

BlueFin is licensed **CC BY-NC 4.0**. Attribute it, preserve licensing notices for copied/adapted assets, state changes, and do not assume copied task/workbook assets can be redistributed under a permissive commercial license. Prefer scripts that reference/download the upstream public dataset rather than duplicating all task assets.

Use only public, synthetic, self-created, or properly licensed financial inputs. Do not use Meridian customer data, leaked dataroom materials, or Banca Mediolanum proprietary artifacts.

### 6.21 Expected negative results

Scientifically useful negative outcomes include:

- deterministic checks add little beyond BlueFin's existing grader;
- formula-family heuristics overflag legitimate irregular formulas;
- LibreOffice and Excel agree on almost all selected cases;
- minimal perturbation size is not meaningful for discrete scenario logic;
- the LLM judge clearly outperforms deterministic rules on methodological criteria;
- provenance cannot be evaluated rigorously from the current public release.

These outcomes should be reported, not hidden.

### 6.22 Exact success criteria

Initial project succeeds if:

1. all 8 available public manipulation/synthesis workbook tasks are attempted and exclusions are justified;
2. >=30 labelled controlled mutants exist across >=5 failure classes;
3. deterministic-vs-LLM agreement is quantified by failure class;
4. >=3 failures are localized to a reproducible first-divergence dependency path;
5. at least one result is not trivially equivalent to an existing BlueFin criterion;
6. every headline table can be regenerated from a clean checkout;
7. engine ambiguity is represented explicitly;
8. a 2–3 page memo communicates the methods and negative results;
9. a two-minute demo shows one minimal counterexample end-to-end;
10. no conclusion depends on claims about Meridian's private system.

---

## 7. Ten-Day Initial Build Plan

| Day | Work | Exit criterion |
|---|---|---|
| **1** | Pin BlueFin commit; reproduce environment/tests; run and grade at least one public task; inspect task/rubric schemas. | One task runs/recalculates/grades reproducibly; manifest records versions. |
| **2** | Implement workbook IR, formula parsing, cross-sheet references, normalized formula families, dependency graph. | Dependency paths and graph stats generated for selected workbooks. |
| **3** | Build controlled mutation framework: hardcode, wrong ref, sign error, formula drift, broken link, period shift. | >=20 labelled mutants with unit tests. |
| **4** | Deterministic structural grader: hardcode/formula-loss, formula-family drift, edge changes, broken refs. | High detection on synthetic mutants with documented false positives. |
| **5** | Implement 4–6 applicability-aware financial invariants. | >=3 public models have meaningful deterministic invariant coverage. |
| **6** | Perturbation runner: bounded specs, state restore, recalculation, output capture. | >=50 deterministic perturbation executions across public cases/mutants. |
| **7** | Minimal-counterexample search and first-divergence localization. | >=3 interpretable counterexamples with dependency paths. |
| **8** | Run BlueFin judge against clean/mutant cases; human-review calibration subset. | Confusion matrix + per-class agreement table. |
| **9** | Engine/reproducibility checks; technical memo and figures. | Frozen results, engine caveat, draft 2–3 page memo. |
| **10** | Public packaging: README, architecture diagram, CI, demo, contribution proposal. | Fresh-checkout reproduction passes; two-minute demo complete. |

### Required final package

```text
bluefin-robustness/
  README.md
  LICENSE / LICENSES.md
  pyproject.toml
  uv.lock
  src/
  tests/
  configs/
  experiments/
  results/
  docs/
    technical-memo.pdf
    architecture.svg
    methodology.md
  demo/
```

It must contain:

- public GitHub repository;
- reproducible environment;
- tested benchmark runner;
- the 8 public workbook tasks where feasible plus justified controlled mutants;
- quantitative result tables;
- failure examples;
- 2–3 page technical memo;
- architecture diagram;
- 2-minute demonstration;
- contribution proposal or draft BlueFin PR only if justified by evidence.

---

## 8. Outreach Strategy

### 8.1 Sequence

**First contact: Srivatsa Kundurthy**  
Best channel: concise email if a public research email is available, otherwise a professional LinkedIn message. GitHub should be used for contribution-specific discussion after the artifact exists, not as an unsolicited personal message channel.

Initial message should lead with one quantitative result and one technical question. It should not lead with an internship request.

**Backup technical/research contact: Clara Na**  
Use when the core finding concerns evaluator design, human calibration, or structured-artifact quality.

**Product-systems contact: George Fang**  
Use when the strongest result concerns spreadsheet engines, dependency abstractions, portability, runtime state, or deterministic structural verification.

**Founder/strategy contact: John Ling**  
Use after the work supports a broader claim about evaluation strategy or research-to-product implications.

**Other research-author backups:** Anoushka Mohta, Colton Moraine, Case Winter.

### 8.2 Warm path

No evidence-backed first-degree introduction to Meridian was found. The direct relationship with Brian Kulis is valuable for **technical critique**, not as an assumed introduction route.

Ask Kulis to challenge:

- whether perturbations are semantically valid;
- whether mutants constitute independent evidence;
- whether evaluator disagreement is measured correctly;
- whether the research question is falsifiable;
- whether negative results are interpretable.

Only pursue an introduction if he independently identifies a genuine personal relationship.

### 8.3 Timing

Do not contact Meridian before:

- repository is public;
- result table is stable;
- at least three failure traces exist;
- memo is readable in <=5 minutes;
- one-command reproduction works.

### 8.4 Follow-up cadence

- **Day 0:** result-driven technical note.
- **Day 5–7:** one follow-up only if it contains new evidence, a corrected result, or a concrete contribution proposal.
- If no response after that, stop.
- If a maintainer responds on GitHub, keep contribution discussion on GitHub.

### 8.5 Exact technical question

> BlueFin already tests dynamic correctness through rubric-authored perturbations and an agentic judge. Does adding deterministic dependency/invariant checks materially improve evaluation fidelity, or are those checks more useful as diagnostic evidence and calibration for the existing judge?

### 8.6 Draft initial technical outreach

**Subject:** BlueFin: deterministic robustness checks vs. the agentic grader

Hi Srivatsa,

I've been extending BlueFin's evaluation rather than building another spreadsheet agent.

I built a deterministic robustness layer that reconstructs workbook dependency graphs, applies bounded financial perturbations, and localizes the first broken downstream dependency. I then compared those results against BlueFin's existing agentic perturbation grader.

The interesting result so far is **[ONE QUANTITATIVE FINDING]**. I've reproduced it across **[N]** public BlueFin cases and documented the engine limitations separately.

Repository: **[link]**  
Short memo: **[link]**

I'd be interested in your criticism of one specific question: do you think deterministic structural checks like these are best treated as an additional rubric signal, a calibration tool for the LLM judge, or something outside BlueFin's intended evaluation boundary?

Giacomo

---

## 9. Positioning Output

### 9.1 50-word builder description

Giacomo Cappelletto is a computer engineer who builds auditable agent systems and evaluates where they fail. He has deployed action-taking financial agents with governed data access, retrieval, tracing, and LLM evaluation, while conducting ML research on robustness under controlled perturbations. His work combines systems engineering, measurement, and applied financial workflows.

### 9.2 120-word technical project summary

BlueFin Robustness Auditor extends Meridian's public BlueFin evaluation framework with deterministic structural diagnostics rather than another spreadsheet-generation agent. It reconstructs cell-level dependency graphs, identifies formula-family drift and overwritten formulas, applies reproducible finance-domain perturbations, and evaluates structural and financial invariants after recalculation. For each failure, the system searches for a minimal counterexample, identifies the first incorrect downstream cell, and reports the dependency path responsible for propagation. The study compares these deterministic judgments against BlueFin's existing agentic LLM grader, quantifying agreement and disagreement by failure type while separately measuring spreadsheet-engine sensitivity. The initial release evaluates public BlueFin workbooks and controlled failure mutants, producing reproducible quantitative results, failure traces, a technical memo, and a focused visualization of static versus dynamic workbook correctness.

### 9.3 Email subject lines

1. **BlueFin: deterministic robustness checks vs. the agentic grader**
2. **A BlueFin extension for diagnosing dynamic spreadsheet failures**
3. **Finding the first broken dependency in BlueFin workbooks**

### 9.4 GitHub repository description

> Deterministic dependency, perturbation, invariant, and judge-calibration tooling for diagnosing dynamic failures in BlueFin financial workbooks.

### 9.5 Technical memo abstract

BlueFin demonstrates that frontier agents frequently produce financial workbooks that appear correct statically but fail when assumptions change. Its existing evaluation addresses this through expert-authored perturbation rubrics evaluated by an agentic LLM judge. We study whether deterministic workbook analysis provides complementary evidence. Our system reconstructs formula dependencies, detects structural discontinuities, executes bounded finance-domain perturbations, checks applicable financial invariants, and searches for minimal counterexamples that expose latent defects. We compare these results against BlueFin's existing grader and measure disagreement by failure category, while separately testing sensitivity to spreadsheet calculation engines. The objective is not to replace expert or LLM evaluation, but to determine which failure classes can be verified more reproducibly, localized more precisely, and presented with stronger causal evidence through programmatic analysis.

### 9.6 Three resume bullets to emphasize

1. **Owned architecture and implementation of an internal AI-agent platform spanning a Databricks model-serving runtime, enterprise chat application, and prompt/evaluation system; translated stakeholder requirements into deployed workflows.**
2. **Built a LangGraph/MLflow agent with governed dynamic SQL, citation-backed document retrieval, request-scoped context, typed Pydantic contracts, evidence review, and end-to-end tracing.**
3. **Shipped React/Vite, FastAPI, and Dash/Flask applications with SSE streaming, authenticated sessions, PostgreSQL persistence, versioned prompts, LLM judging, and Databricks Asset Bundle deployment.**

For research-first outreach, substitute bullet 3 with:

> **Researching robust human-motion retrieval by learning fixed-length embeddings from temporal 2D/3D pose sequences and evaluating metric-learning objectives with Recall@K and mAP under noise, occlusion, temporal jitter, and viewpoint shift.**

---

## 10. Disconfirmation and Stop Conditions

### Abandon the selected project if

- BlueFin publishes an equivalent deterministic dependency/invariant evaluator before implementation begins;
- the proposed structural measurements reduce almost entirely to existing rubric checks and add no diagnostic information;
- the public workbook subset cannot support meaningful graph/invariant analysis;
- engine disagreement dominates results so strongly that workbook robustness cannot be separated from evaluator-engine behavior.

If that happens, switch to the **Spreadsheet Engine Fidelity Benchmark**.

### Choose a different BlueFin contribution if

The deterministic auditor produces no useful evaluator disagreement or localization value. Prefer, in order:

1. spreadsheet-engine fidelity;
2. minimal counterexample generation as a standalone tool;
3. declarative financial-invariant library;
4. trajectory/checkpoint fault injection.

### Contact a different person if

- evaluator methodology dominates → **Srivatsa Kundurthy / Clara Na**;
- spreadsheet runtime/portability dominates → **George Fang**;
- finance-methodological failures dominate → **Case Winter or another directly evidenced finance/research contributor**;
- broad research/product strategy dominates → **John Ling**;
- repository mechanics dominate → the maintainer who actually engages on the issue/PR.

### Deprioritize Meridian if

- it stops publishing or engaging around spreadsheet-agent research;
- BlueFin becomes inactive and its research effort disperses;
- Meridian moves materially away from financial-model execution/evaluation;
- the public work no longer overlaps with spreadsheet correctness, agent systems, or evaluation;
- a stronger target provides a demonstrably better match to Giacomo's systems/research work.

### Claims to avoid

Do **not** claim:

- "Meridian's agent has a hardcoding problem."
- "Meridian needs this dependency checker."
- "Meridian's product fails under changed assumptions."
- "BlueFin does not test dynamic correctness."

Defensible framing:

> Meridian's public research shows that frontier spreadsheet agents remain weak on dynamic correctness, while its public product emphasizes traceability, auditability, and structural model integrity.

And:

> This project tests whether deterministic structural diagnostics add useful evidence beyond BlueFin's existing agentic perturbation evaluation.

---

## Final Decision

The original seed hypothesis is **partially confirmed but must be narrowed**.

The strongest artifact is **not** a generic counterfactual benchmark: BlueFin already tests dynamic correctness. The differentiated contribution is the diagnostic and calibration layer underneath that question:

> **dependency structure + deterministic invariants + systematic perturbations + minimal counterexamples + LLM-judge calibration + explicit spreadsheet-engine uncertainty.**

The recommended sequence is:

**build → measure → attempt to falsify → publish → request technical criticism → discuss contribution → only later discuss working with Meridian.**

This sequence creates a legitimate research conversation regardless of whether an internship is available and avoids making unsupported claims about Meridian's private systems.

---

## Primary source index

See [`SOURCES.md`](./SOURCES.md) for the source-by-source validation ledger and [`VALIDATION.md`](./VALIDATION.md) for the critical audit performed before publication.