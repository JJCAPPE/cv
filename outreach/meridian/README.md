# Meridian / Longitude Labs — BlueFin Research Extension, Connection Mapping, and Build-Before-Outreach Strategy

**Research cut-off:** 22 August 2026  
**Validated:** 23 August 2026  
**Target company:** Meridian, legally Longitude Labs Inc.  
**Candidate:** Giacomo Cappelletto  
**Purpose:** determine the strongest technically substantive artifact to build before approaching Meridian, then define an evidence-backed publication and outreach sequence.

> This document deliberately separates public evidence about Meridian's product from public evidence about BlueFin. A benchmark weakness is **not** treated as proof of a weakness in Meridian's private product.

---

## 1. Executive Recommendation

Meridian should remain a **top-priority technical target**. The strongest public evidence shows a company building an AI execution layer for finance, operating across existing models, documents and spreadsheet surfaces, while also publishing research specifically on how spreadsheet agents fail under professional financial-modeling criteria.

The most relevant open technical question is **not simply dynamic correctness**. BlueFin already measures dynamic correctness through rubric-authored perturbation criteria executed by an agentic LLM judge. The stronger extension is to ask whether those failures can be made **more deterministic, localized, reproducible and diagnostically useful** through dependency-graph analysis, finance invariants, systematic perturbations, minimal counterexamples, judge-disagreement measurement and spreadsheet-engine sensitivity analysis.

The recommended artifact is **BlueFin Robustness Auditor**: a companion open-source study and tool that evaluates structural and dynamic workbook robustness, then compares deterministic findings against BlueFin's existing grader. Build it as a **companion repository and technical report first**. Propose a narrow BlueFin contribution only after results show a useful seam.

The strongest initial technical contact is **Srivatsa Kundurthy**, because he is BlueFin's first author and an active public repository maintainer. **George Fang** is the strongest product-systems escalation if the result concerns spreadsheet execution, state, engines or structural validation. **John Ling** becomes appropriate once there is a higher-level benchmark or product implication.

The largest strategic risk is **redundancy**. If the project only adds more hand-authored perturbations, it duplicates work BlueFin already does.

---

## 2. Evidence Ledger

| Claim | Supporting evidence | Primary source | Publication / ship date | Confidence | Fact or inference |
|---|---|---|---|---|---|
| Meridian describes itself as an AI-powered modeling layer for Excel | Official homepage states this directly | https://www.meridian.ai/ | Current | High | Fact |
| Meridian describes its mission as building an AI execution layer for finance | Official About page uses this language | https://www.meridian.ai/about | Current | High | Fact |
| Meridian wants agents to operate with context across models, documents and templates | Official About page | https://www.meridian.ai/about | Current | High | Fact |
| Meridian operates in its own app and inside Excel and Google Sheets | Launch post says the Meridian agent works across all three surfaces | https://www.meridian.ai/blog | 2026-02-11 | High | Fact |
| Meridian positions traceability to source data as a core product property | Launch post says every result traces back to source data | https://www.meridian.ai/blog | 2026-02-11 | High | Fact |
| Meridian supports existing multi-tab workbooks and deep formula dependencies | Security/product FAQ states it can analyze, audit, update and extend existing models | https://www.meridian.ai/security | Current | High | Fact |
| Meridian explicitly offers auditing for broken formulas and structural issues | Security/product FAQ | https://www.meridian.ai/security | Current | High | Fact |
| Meridian's public product history contains reliability work around long AI workflows | Changelog includes fixes for large tool loops, interrupted reasoning and incomplete multi-action tool calls | https://www.meridian.ai/changelog | 2026-03 | High | Fact |
| Meridian has worked on checkpoint and persistence reliability | Changelog includes large checkpoint save failures, tool-result persistence and conversation-state reliability fixes | https://www.meridian.ai/changelog | 2026-03 | High | Fact |
| Meridian has worked on spreadsheet reference persistence | Changelog has an explicit spreadsheet link reference persistence fix | https://www.meridian.ai/changelog | 2026-03-16 | High | Fact |
| Meridian has worked on deleted-sheet references | Changelog cites handling of deleted-sheet references to reduce #REF!-related issues | https://www.meridian.ai/changelog | 2026-03-09 | High | Fact |
| Document extraction quality is an active product concern | Changelog notes fuller source content during import/parsing | https://www.meridian.ai/changelog | 2026-03-20 | High | Fact |
| BlueFin contains 131 finance spreadsheet tasks and 3,225 granular criteria in the full benchmark | Paper abstract and Meridian announcement | https://arxiv.org/abs/2605.30907 ; https://www.meridian.ai/blog/all/bluefin | 2026-05-29 / 2026-06-26 | High | Fact |
| BlueFin covers synthesis, manipulation and interrogation/comprehension-style tasks | Paper and public repo | https://arxiv.org/abs/2605.30907 ; https://github.com/Longitude-Labs/bluefin | 2026 | High | Fact |
| Dynamic correctness is already a central BlueFin research focus | Paper says frontier models show particular weakness in dynamic correctness; Meridian post emphasizes failure when inputs move | Same as above | 2026 | High | Fact |
| BlueFin's public grader has an explicit Perturbation rubric section | `scoring/grade.py` and task rubrics include a Perturbation playbook | https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py | Current | High | Fact |
| BlueFin perturbation grading is agent-mediated | The LLM judge receives rubric criteria, mutates the workbook through tools and decides met/not-met | `scoring/grade.py` | Current | High | Fact |
| BlueFin's judge was calibrated against finance experts | Paper reports alpha=0.826 and macro-F1=0.839 | https://arxiv.org/abs/2605.30907 | 2026-05-29 | High | Fact |
| Aggregate judge calibration does not establish fault-class-specific reliability | Overall agreement does not imply equal performance on every structural failure category | Paper + grader design | — | High | Inference |
| BlueFin's public spreadsheet environment is openpyxl-backed | `SpreadsheetEnv` loads and mutates workbooks with openpyxl | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/spreadsheet_env.py | Current | High | Fact |
| BlueFin recalculates formula outputs with headless LibreOffice | `recalc.py` invokes `soffice --headless --calc` | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/recalc.py | Current | High | Fact |
| Engine fidelity is therefore a legitimate evaluation variable | Excel and LibreOffice are different calculation engines; engine-specific cases must not be mislabeled as agent failures | Code-derived | — | High | Inference |
| SpreadsheetArena finds professional finance conventions affect expert preference | Meridian's research post reports domain-specific formatting effects | https://www.meridian.ai/blog/all/spreadsheet-arena | 2026-02-13 | High | Fact |
| Crowd preference and finance-expert judgment differ materially | Meridian reports expert ratings agreed with crowd preference only about half the time | Same source | 2026-02-13 | High | Fact |
| The public BlueFin repo is a limited release, not the full 131-task benchmark | Public GitHub currently exposes 7 manipulation tasks, 1 synthesis task and 1 interrogation task | https://github.com/Longitude-Labs/bluefin/tree/main/tasks | Current | High | Fact |
| Public manipulation tasks are still being refreshed | Open PR #2 updates seven manipulation task files and rubrics | https://github.com/Longitude-Labs/bluefin/pull/2 | Current | High | Fact |
| Srivatsa Kundurthy is an active public maintainer | Commit 643336b is authored/committed by `srkvatsa`; PR #2 requests his review | https://github.com/Longitude-Labs/bluefin/commit/643336ba21526666b51bc9e2decd25d57d0e3434 ; PR #2 | 2026-06-16 / current | High | Fact |
| BlueFin's license is CC BY-NC 4.0 | Repository LICENSE | https://github.com/Longitude-Labs/bluefin/blob/main/LICENSE | Current | High | Fact |
| The public repo has no visible issue backlog at validation time | GitHub issue search returned no issues | https://github.com/Longitude-Labs/bluefin/issues | 2026-08-23 validation | Medium-high | Fact at validation time |
| Meridian explicitly invites others to build on BlueFin | BlueFin launch post invites work on spreadsheet reasoning, financial workflows and hard-to-verify evaluation | https://www.meridian.ai/blog/all/bluefin | 2026-06-26 | High | Fact |
| Giacomo has directly relevant financial-agent/evaluation experience | CV documents internal agent architecture, governed SQL, retrieval, tracing, LLM judging and production deployment | `resume/content/master.tex` in this repository | Current | High | Fact |
| Giacomo's current BU research already centers on controlled robustness evaluation | CV documents noise, occlusion, temporal jitter and viewpoint-shift evaluation | `resume/content/master.tex` | Current | High | Fact |
| Giacomo has desktop application experience relevant to spreadsheet tooling | CV documents an Electron-to-Tauri/React/Rust rebuild | `resume/content/master.tex` | Current | High | Fact |

### Evidence discipline

The following statements are **not** asserted:

- Meridian's private production agent has the same weaknesses measured in BlueFin.
- Meridian currently needs a deterministic dependency checker.
- BlueFin does not test dynamic correctness.
- Any specific public benchmark failure is a Meridian product bug.
- A warm introduction to Meridian has been established.

---

## 3. BlueFin and Meridian Product Technical Review

### 3.1 BlueFin public repository architecture

The current public repository is structured around:

```text
agents/          model/provider adapters + agent loop + trajectory logging
mcp_server/      spreadsheet environment and 20 exposed tools
scoring/         agentic grading and interrogation grading
prompts/         system prompt versions
run_configs/     run configuration
adapters/        task-delivery adapters
tasks/           public manipulation, synthesis and interrogation tasks
tests/           public test suite
```

The README documents a **20-tool** environment: 17 structured/code tools plus virtual tools for workbook state, recalculation and termination. The environment supports reading, cell/range writes, row/column/sheet mutations, formatting, charts, sandboxed Python and recalculation.

`SpreadsheetEnv` is stateful and openpyxl-backed. Formula strings remain available until recalculation, after which cached values from a `data_only=True` copy are overlaid on reads. Workbook mutations invalidate that cached calculated state.

Recalculation is performed by LibreOffice headless. That makes benchmark execution reproducible without depending on local Microsoft Excel, but it also means engine semantics must be treated as a possible confound rather than silently assumed equivalent to Excel.

### 3.2 BlueFin grading

For manipulation/synthesis workbooks the public grader separates criteria into:

1. Formula Correctness
2. Model Integration
3. Output Validation
4. Perturbation
5. Presentation
6. Pitfalls

The key correction to the original project hypothesis is that **Perturbation already exists**. The judge is instructed to save pristine state, mutate an input, observe a downstream cell, compare against a target and restore workbook state.

A concrete public example is task `d970b98b`, whose perturbation rubric already tests Debt Spread, Loan Sizing Scalar, Interest Rate, LTV Limit, Facility Size and PUE against expected downstream changes in DSCR, LLCR, debt balance and terminal value.

Therefore the proposed contribution must not be framed as "adding dynamic correctness to BlueFin." It must be framed as **deepening diagnosis and evaluation fidelity around dynamic correctness**.

### 3.3 What BlueFin currently measures well

BlueFin already has strong coverage of:

- formula structure;
- cross-sheet integration versus hardcoding;
- numerical outputs;
- dynamic propagation under specific counterfactual input changes;
- presentation and finance-format conventions;
- common spreadsheet pitfalls;
- expert-authored finance methodology;
- an LLM judge that has been calibrated against finance experts.

### 3.4 Plausible extension seams

The following are complementary based on current public code; they are not claims about unpublished Meridian research.

#### A. Deterministic dependency-graph diagnostics — strong extension candidate

The public grader can inspect formulas agentically, but there is no first-class public subsystem that builds a workbook dependency graph and measures:

- lost dependency edges;
- changed dependency paths;
- formula-family discontinuity;
- overwritten-formula regions;
- first divergent descendants after perturbation;
- graph reachability before/after an agent edit.

#### B. Minimal counterexample generation — strong extension candidate

BlueFin uses pre-authored perturbation points. That is distinct from automatically finding the smallest domain-valid input change that exposes a latent failure and then localizing where the failure first appears.

#### C. Judge-disagreement analysis — strong extension candidate

BlueFin validates the judge overall. A companion study can ask whether disagreement rates differ by failure type when deterministic structural checks are available.

#### D. Spreadsheet-engine sensitivity — strong extension candidate

Because the public harness uses openpyxl for representation and LibreOffice for formula recalculation, a limited Excel-vs-LibreOffice validation study can identify engine-ambiguous cases.

#### E. Provenance — confirmed Meridian product focus, weaker BlueFin extension evidence

Source-level traceability is central to Meridian's public product. It is not currently a first-class public BlueFin scoring dimension in the same way as formula/integration/perturbation criteria. Provenance is a valid second-stage extension, but it should not overload the ten-day v1.

#### F. Checkpoint/recovery robustness — confirmed Meridian product focus, not established BlueFin benchmark focus

Meridian's changelog shows active product engineering around large tool loops, checkpoint saves, duplicate tool actions, interrupted reasoning and persistence. A fault-injection benchmark is Meridian-specific, but it is better treated as a separate project candidate because BlueFin primarily grades final artifacts.

### 3.5 Pressure-point classification

| Pressure point | Evidence classification | Rationale |
|---|---|---|
| Dynamic correctness under changed assumptions | **Confirmed Meridian research focus** | BlueFin paper, launch post and public perturbation rubrics |
| Hardcoded intermediate values | **Confirmed Meridian research focus** | Model Integration / pitfalls and public discussion of linked models |
| Formula overwrite / drift | **Confirmed Meridian research focus** for formula correctness; **strong inference** for generalized drift detector | Current grading checks formulas but public code lacks generalized formula-family analysis |
| Broken/stale cross-sheet references | **Confirmed product focus + research adjacency** | Product changelog + Model Integration criteria |
| Scenario-switch / sensitivity integrity | **Confirmed Meridian research focus** | `d970b98b` perturbation/sensitivity rubric |
| Circular references / hidden dependency failures | **Strong inference** | Public recalc explicitly enables iterative calculation, but no dedicated research claim found |
| Source provenance | **Confirmed Meridian product focus** | Product/launch pages emphasize source traceability |
| Number/unit/date/period/sign extraction correctness | **Confirmed product focus / strong research inference** | Document extraction + financial correctness, but no dedicated public benchmark dimension verified |
| Formatting as semantic information | **Confirmed Meridian research focus** | SpreadsheetArena + BlueFin presentation criteria |
| Recovery from partial/failed agent sequences | **Confirmed Meridian product focus** | Changelog |
| Long-running state/checkpoint integrity | **Confirmed Meridian product focus** | Changelog |
| Numerical vs financial-method vs presentation correctness | **Confirmed Meridian research focus** | Separate BlueFin rubric dimensions + expert criteria |
| LLM judge reliability vs deterministic checks | **Confirmed evaluation concern; proposed comparison is an extension** | BlueFin validates its LLM judge; programmatic comparison is not first-class public work found |
| Portability across engines/spreadsheet surfaces | **Confirmed product focus / strong research inference** | Excel/Sheets/app support + LibreOffice public harness |
| Minimal counterexample generation | **Unsupported as existing Meridian focus; strong candidate extension** | No equivalent public feature located |

---

## 4. Network Map

### 4.1 Grounding and limits

Connected Gmail and Google Contacts were checked for Meridian, George Fang, John Ling, Srivatsa Kundurthy and BlueFin-related direct correspondence. No direct Meridian correspondence/contact was found. Brian Kulis is a real saved contact and current research relationship.

No connected LinkedIn connector is available, so no claim below depends on private LinkedIn graph access. Public professional histories are used only where independently available.

There is **no verified warm introduction to Meridian** at this stage.

### 4.2 Ranked contacts

| Target person | Current/public role | Technical relevance | Connection path | Evidence | Strength | Recommended approach |
|---|---|---|---|---|---|---|
| **Srivatsa Kundurthy** | BlueFin first author; Meridian/Cornell affiliation in published research; active public maintainer | Benchmark design, grading, spreadsheet-agent evaluation | Direct technical cold outreach after artifact | BlueFin paper; public commit by `srkvatsa`; PR #2 requests his review | **D** | First technical contact |
| **George Fang** | CTO & Co-Founder, Meridian; BlueFin coauthor | Spreadsheet runtime, agent systems, product architecture | Artifact-backed direct technical outreach | Meridian About + BlueFin | **D** | Best product-systems contact |
| **John Ling** | CEO & Co-Founder, Meridian; BlueFin/SpreadsheetArena author | Research/product strategy | Artifact-backed founder outreach | Meridian About + published research | **D** | Contact after strong result |
| **Clara Na** | BlueFin and SpreadsheetArena coauthor, CMU affiliation in papers | Evaluation methodology, structured artifacts | Research cold outreach | Papers | **D** | Excellent independent methodology contact |
| **Anoushka Mohta** | BlueFin coauthor | Benchmark/evaluation relevance | Direct research cold outreach | BlueFin paper | **D** | Meridian research backup |
| **Colton Moraine** | BlueFin coauthor | Benchmark/evaluation relevance | Direct research cold outreach | BlueFin paper | **D** | Meridian research backup |
| **Case Winter** | BlueFin coauthor | Finance methodology / model-quality interpretation | Direct research cold outreach | BlueFin paper | **D** | Finance-method backup |
| **Zach Kirshner** | COO & Co-Founder; BlueFin and SpreadsheetArena coauthor | Finance workflows / company-level product context | Founder cold path | Meridian About + research papers | **D** | Secondary founder path |
| **Brian Kulis** | BU professor; Giacomo's research supervisor | Robustness/evaluation design | Direct existing relationship | CV + Google Contacts | **A** | Ask for technical critique, not a forced intro |
| Dartmouth alumni route to John Ling | Potential institutional adjacency | Possible founder intro | No concrete intermediary verified | Public education history alone is insufficient | **X** | Exclude until a real intermediary exists |
| Banca Mediolanum → Meridian | Domain adjacency | Finance AI overlap | No person-to-person chain verified | Employer overlap only | **X** | Exclude |
| BU rowing/student-athlete route | Social-network possibility | None yet | No Meridian chain verified | None | **X** | Exclude |

### 4.3 Five strongest paths

#### Path 1 — Giacomo → Srivatsa Kundurthy

**Exact chain:** direct artifact-backed cold research outreach.  
**Evidence:** first author on BlueFin; public `srkvatsa` commit fixes a perturbation rubric; PR #2 requests his review.  
**Why legitimate:** the artifact directly extends his published evaluation agenda, and Meridian explicitly invites others to build on BlueFin.  
**Ask:** whether deterministic structural checks should be an additional rubric signal, a diagnostic/calibration layer, or outside BlueFin's intended scope.  
**Evidence required before contact:** reproducible repo, ≥30 controlled mutants, task-level result table, disagreement matrix, ≥3 interpretable counterexamples.

#### Path 2 — Giacomo → George Fang

**Exact chain:** direct technical outreach backed by a public artifact.  
**Evidence:** CTO, former Scale engineering per Meridian About, BlueFin coauthor.  
**Why legitimate:** strongest fit if findings concern spreadsheet state, engine fidelity, dependency structure or execution reliability.  
**Ask:** how much structural validation should be engine-independent versus Excel-native.  
**Evidence required:** dependency graph, engine-ambiguity handling and deterministic failure traces.

#### Path 3 — Giacomo → John Ling

**Exact chain:** artifact-backed founder outreach after a higher-level result exists.  
**Evidence:** CEO/cofounder and author on public evaluation research.  
**Why legitimate:** appropriate when findings affect benchmark strategy or product trust, not for first-line debugging.  
**Ask:** whether the next useful evaluation frontier is broader task coverage or deeper diagnostics explaining why a model breaks.  
**Evidence required:** concise technical memo with one nontrivial finding and product/research implication.

#### Path 4 — Giacomo → Clara Na

**Exact chain:** direct research contact.  
**Evidence:** BlueFin/SpreadsheetArena coauthor with CMU affiliation in the papers.  
**Why legitimate:** methodology question about evaluator design is directly in scope.  
**Ask:** whether deterministic structural evaluation is best used as an evaluator, judge feature or calibration instrument.  
**Evidence required:** human-labelled subset and judge/programmatic disagreement analysis.

#### Path 5 — Giacomo → Brian Kulis → technical critique

**Exact chain:** existing student-researcher relationship.  
**Evidence:** current BU research relationship and saved contact.  
**Why legitimate:** robustness experimental design overlaps directly with current research.  
**Ask:** challenge the perturbation design, failure taxonomy and statistical claims.  
**Evidence required:** experiment plan and first result table.  
**Important:** do not represent this as a Meridian introduction path unless Kulis independently identifies a real personal connection.

---

## 5. Project Comparison

Six projects were scored 1–10 on Meridian specificity, research contribution, product relevance, technical depth, candidate fit, public feasibility, demonstrability, scope realism, contribution potential and conversation value.

| Project | Meridian specificity | Research | Product | Depth | Fit | Public feasibility | Demo | Scope | Contribution | Conversation | Total /100 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **1. BlueFin Robustness Auditor + Judge Calibration** | 10 | 10 | 9 | 10 | 10 | 9 | 9 | 8 | 10 | 10 | **95** |
| **2. Spreadsheet Engine Fidelity Benchmark** | 9 | 9 | 10 | 9 | 9 | 10 | 8 | 9 | 9 | 9 | **91** |
| **3. Minimal Counterexample Generator** | 10 | 10 | 9 | 10 | 9 | 10 | 10 | 7 | 9 | 10 | **94** |
| **4. Financial Invariant Checker for BlueFin** | 10 | 9 | 10 | 9 | 10 | 10 | 8 | 8 | 9 | 9 | **92** |
| **5. Agent Trajectory Failure/Recovery Benchmark** | 9 | 9 | 10 | 9 | 10 | 8 | 9 | 7 | 8 | 9 | **88** |
| **6. Source-to-Cell Provenance Evaluation Suite** | 10 | 9 | 10 | 10 | 10 | 7 | 10 | 6 | 8 | 10 | **90** |

### 5.1 BlueFin Robustness Auditor + Judge Calibration — selected

**Research contribution:** make dynamic failures machine-inspectable and quantify where deterministic checks complement BlueFin's agentic judge.  
**Why it wins:** it directly engages the public BlueFin evaluation design without rebuilding a spreadsheet agent or Meridian product clone. It also exploits Giacomo's financial-agent, evaluation, tracing and robustness background.

### 5.2 Spreadsheet Engine Fidelity Benchmark

Run selected BlueFin cases through LibreOffice and Microsoft Excel validation, measuring formula/cached-value divergence, named-range/circular-calculation behavior and preservation failures. Narrower, very rigorous fallback if deterministic robustness adds little beyond existing grading.

### 5.3 Minimal Counterexample Generator

Search the domain-valid assumption space for the smallest input change that exposes a latent workbook defect, then identify the first divergent downstream dependency. Extremely strong demonstration value, but better as a component of project #1 than a standalone v1.

### 5.4 Financial Invariant Checker

Implement a declarative library for balance-sheet balance, debt/cash roll-forwards, valuation bridges, scenario behavior and formula continuity. Strong direct contribution potential, but needs careful applicability metadata to avoid enforcing one modeling convention universally.

### 5.5 Agent Trajectory Failure/Recovery Benchmark

Inject interruption, duplicate-action, partial-save and stale-state failures into long spreadsheet tool sequences. This maps closely to public product changelog signals, but BlueFin's public grading primarily evaluates final artifacts, so it is less direct as a BlueFin extension.

### 5.6 Source-to-Cell Provenance Evaluation Suite

Use synthetic/public source documents or XBRL facts and test source→assumption→formula→output lineage, including period/unit/sign metadata. Very product-relevant but too broad for a rigorous ten-day initial release.

---

## 6. Selected Project Research Specification

### 6.1 Name

**BlueFin Robustness Auditor**  
Suggested standalone repository: `bluefin-robustness`

### 6.2 Research question

> Do deterministic structural and financial checks identify dynamically fragile financial workbooks that BlueFin's existing rubric-and-LLM evaluation misses, ambiguously diagnoses or classifies differently?

Secondary question:

> Can minimal domain-valid counterfactual perturbations localize the first broken dependency and provide materially more diagnostic evidence than a binary perturbation criterion alone?

### 6.3 Hypotheses

- **H1 — static/dynamic separation:** workbook instances with similar static correctness can exhibit materially different robustness under systematic perturbation.
- **H2 — evaluator complementarity:** deterministic checks will catch some structural defects that the LLM judge misses, while the deterministic system will also overflag some legitimate irregular financial formulas.
- **H3 — localization:** dependency analysis can reduce a downstream wrong-output failure to a small set of first-divergence cells for a meaningful subset of cases.
- **H4 — perturbation density:** multiple bounded perturbations around an assumption can expose failures not revealed by one rubric-authored perturbation point.
- **H5 — engine sensitivity:** most common formulas will agree across LibreOffice and Excel, but a small non-zero subset will be engine-ambiguous and must not be mislabeled as model failures.

### 6.4 Public dataset and sample design

The full BlueFin paper describes 131 tasks, but the **public GitHub release currently exposes only 9 task directories:**

- 7 manipulation tasks: `2aac5a2a`, `2bdd0f12`, `67cbe713`, `95d3752e`, `d970b98b`, `e13c5e9d`, `eae8665e`;
- 1 synthesis task: `TTWO_Operating_Model_DCF`;
- 1 interrogation task: `0122`.

The initial workbook study should therefore use the **8 workbook-producing manipulation/synthesis tasks** as the independent public-workbook sample. Do not inflate N by calling mutants independent tasks.

To obtain adequate failure coverage, create **controlled mutants** of golden/reference workbooks. Report two sample sizes separately:

- `N_workbooks = 8` public workbook tasks;
- `N_mutants >= 30` controlled fault instances across those workbooks.

The interrogation task is useful for supplementary sensitivity experiments but should not be conflated with output-workbook grading.

### 6.5 Priority task ordering

1. **`d970b98b` — data-center project finance debt/sensitivities.** Best first case because the public rubric already includes SOFR/debt spread, PUE, loan sizing, LTV, facility size, DSCR, LLCR and terminal value perturbations.
2. **`e13c5e9d` — financial statements / project model.** Useful for accounting and roll-forward invariants.
3. **`eae8665e` — LBO summary and returns.** Useful for purchase multiple, leverage, debt/EBITDA and returns sensitivity.
4. **`2aac5a2a` — waterfall.** Useful for LP/GP waterfall mechanics and structural formula families.
5. **`95d3752e` — income / cross-sheet integration.** Useful for repeated formulas and source-link continuity.
6. Remaining manipulation tasks.
7. `TTWO_Operating_Model_DCF` synthesis output for an end-to-end generated-model case.

### 6.6 Baselines

Report separate baselines rather than one opaque composite:

1. BlueFin published/public rubric score.
2. BlueFin Perturbation section score.
3. Static deterministic structural checks.
4. Full deterministic robustness score.
5. Optional second LLM judge for judge-sensitivity analysis if budget permits.

The research object is the **evaluation system**, not a new frontier-model leaderboard. Avoid spending the ten-day window benchmarking many generation models.

### 6.7 Workbook dependency model

Parse each workbook into an intermediate representation containing:

- `CellNode`;
- `RangeNode`;
- `NamedRangeNode`;
- `ExternalReferenceNode` where parsable;
- formula AST / normalized formula family;
- cell metadata relevant to formatting and type.

Edge types:

- `DIRECT_REFERENCE`;
- `RANGE_REFERENCE`;
- `NAMED_RANGE`;
- `EXTERNAL_LINK`;
- `TABLE_REFERENCE` where supported.

Normalize copied formulas by relative reference offsets so that horizontally/vertically copied formulas can be recognized as the same family. This enables formula-drift detection without requiring literal formula equality.

### 6.8 Counterfactual perturbation engine

Perturbations should be deterministic, reproducible and financially bounded. Each perturbation record should contain:

```json
{
  "semantic_name": "SOFR",
  "cell": "Inputs!F14",
  "baseline": 0.043,
  "domain": [0.02, 0.08],
  "levels": [-0.20, -0.10, 0.10, 0.20],
  "transform": "relative_or_absolute",
  "expected_relations": []
}
```

Initial perturbation classes:

- revenue growth;
- price / volume;
- margin;
- tax rate;
- working-capital days;
- capex / depreciation;
- SOFR/base rate;
- credit/debt spread;
- WACC;
- terminal growth;
- leverage / LTV;
- purchase or exit multiple;
- debt fees;
- FX rates;
- fiscal dates/period boundaries;
- scenario selectors.

Never add arbitrary noise simply to increase test count.

### 6.9 Structural and financial invariants

Every invariant should expose:

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

High-confidence v1 invariants:

- balance sheet: assets = liabilities + equity;
- cash roll-forward;
- retained earnings roll-forward where identifiable;
- debt roll-forward: BOP + draws − repayment = EOP;
- enterprise-value-to-equity-value bridge where identifiable;
- forecast-period/date continuity;
- formula-family continuity across repeated regions;
- cross-sheet source-link continuity;
- no unexpected spreadsheet errors (`#REF!`, `#DIV/0!`, etc.);
- scenario selector changes intended descendants;
- restoration returns outputs to baseline state.

Use confidence/applicability tags. Do not enforce universal monotonicity or one bank's modeling convention on every workbook.

### 6.10 Failure taxonomy

**Structural**
- hardcoded intermediary;
- overwritten formula;
- formula-family drift;
- broken/stale cross-sheet reference;
- deleted-sheet reference;
- circular dependency or unexpected cycle;
- dependency-edge loss/change.

**Dynamic**
- stale output after valid input change;
- partial propagation;
- scenario-switch failure;
- sensitivity failure;
- correct static value but wrong dynamic behavior.

**Financial/methodological**
- balance mismatch;
- roll-forward mismatch;
- valuation bridge inconsistency;
- sign/unit/period mismatch;
- financially invalid but numerically coincidental result.

**Provenance (optional second phase)**
- unsupported source attribution;
- stale source;
- source period/unit mismatch.

**Evaluation-system**
- LLM judge false negative;
- LLM judge false positive;
- engine ambiguity;
- nondeterministic judge outcome.

### 6.11 Controlled mutation suite

Create labelled mutations such as:

1. replace a formula with its currently displayed numeric value;
2. redirect a formula to a prior-period cell;
3. invert a sign;
4. break a cross-sheet reference;
5. overwrite one formula in a repeated forecast region;
6. miswire a scenario selector;
7. shift a date/year mapping;
8. introduce a hardcoded downstream output;
9. delete or rename a referenced sheet in controlled tests;
10. create a stale source link.

Each mutant should record the exact injected change and expected failure class.

### 6.12 Hybrid grading design

Keep dimensions separate:

```text
Static correctness
Structural correctness
Dynamic robustness
Financial-invariant correctness
BlueFin judge result
Judge/programmatic agreement
Engine confidence
```

Do not collapse them into one scalar until after disagreement has been analyzed.

The deterministic layer should not silently defer to the LLM judge, and the LLM judge should not be allowed to hide deterministic structural failures. Instead, record disagreement explicitly.

### 6.13 Judge calibration experiment

For clean and mutated workbook instances, collect:

- deterministic expected label;
- BlueFin judge label;
- human label for a manually reviewed subset of at least 30 instances if feasible;
- evidence produced by each evaluator.

Metrics:

- precision/recall/F1 by failure class;
- confusion matrix;
- Cohen's kappa or another appropriate agreement statistic for labelled subsets;
- disagreement rate by task and fault type;
- judge-run variance if repeated judging is affordable.

The goal is **not** to argue that programmatic checks replace the judge. The useful result is to identify which criteria are reliably programmatic and which require finance-expert or LLM interpretation.

### 6.14 Minimal counterexamples

For a failing input/output relation:

1. identify the allowed perturbation domain;
2. search for the smallest magnitude change that triggers an invariant failure or divergence from expected behavior;
3. recalculate;
4. traverse the dependency graph from changed assumption to affected output;
5. locate the earliest divergent downstream cell;
6. report the path and evidence.

Example output shape:

```text
Base WACC: 8.00%
Smallest exposing perturbation: 8.37%
First divergent cell: DCF!J41
Path:
Assumptions!B12
→ DCF!J16
→ DCF!J29
→ DCF!J41
→ Summary!F8
Classification: formula drift
Engine: LibreOffice
Confidence: high
```

This is the strongest two-minute demonstration because it explains **why** the workbook fails rather than merely displaying a score.

### 6.15 Spreadsheet engines

**openpyxl**
- use for workbook representation, formulas and metadata;
- do not treat it as a calculation engine.

**LibreOffice**
- use as the canonical open benchmark engine because it matches BlueFin's public harness;
- label all calculated results with `engine=libreoffice`.

**Microsoft Excel**
- use as a validation reference for a small representative subset if accessible;
- do not make Excel automation a CI dependency in v1.

If Excel and LibreOffice disagree, classify the case **engine-ambiguous** rather than declaring the agent/model wrong.

### 6.16 Architecture

Do not mirror Meridian's historical stack just for signaling. A research-first v1 is better served by Python.

```text
bluefin-robustness/
├── src/bluefin_robustness/
│   ├── workbook/
│   │   ├── parser.py
│   │   ├── formulas.py
│   │   ├── graph.py
│   │   └── diff.py
│   ├── perturb/
│   │   ├── spec.py
│   │   ├── runner.py
│   │   └── search.py
│   ├── invariants/
│   │   ├── structural.py
│   │   ├── finance.py
│   │   └── registry.py
│   ├── grading/
│   │   ├── deterministic.py
│   │   ├── bluefin_adapter.py
│   │   └── agreement.py
│   ├── reports/
│   │   └── html.py
│   └── cli.py
├── tests/
├── experiments/
├── configs/
├── results/
└── docs/
```

Suggested dependencies:

- Python 3.12;
- openpyxl;
- NetworkX;
- Pydantic;
- pandas or Polars;
- scipy/statsmodels where needed;
- Typer/Rich;
- pytest.

Add a lightweight React viewer only after the analysis is working. PostgreSQL, NestJS, a job queue or Tauri are unnecessary in the ten-day research v1 unless experiment scale genuinely requires them.

### 6.17 Data model

```text
Run
Workbook
WorkbookVersion
Cell
Formula
DependencyEdge
Perturbation
Invariant
InvariantResult
Failure
JudgeResult
Counterexample
EngineResult
```

SQLite/JSON/Parquet is sufficient initially. The research should remain locally reproducible.

### 6.18 CLI / API

Canonical interface should be CLI-first:

```bash
bluefin-robustness analyze workbook.xlsx
bluefin-robustness perturb case.yaml
bluefin-robustness compare baseline.xlsx candidate.xlsx
bluefin-robustness calibrate ./mutants
bluefin-robustness report ./runs/run-001
```

Optional thin API later:

```http
POST /runs
GET /runs/:id
GET /runs/:id/failures
GET /runs/:id/dependencies/:cell
```

### 6.19 Statistical analysis

Report:

- detection rate by fault type;
- precision / false-positive rate on controlled mutants;
- LLM/programmatic agreement;
- failures exposed per perturbation family;
- perturbation magnitude to first failure;
- dependency localization depth/path length;
- engine disagreement rate;
- task-level paired comparisons where appropriate.

Because `N_workbooks=8` is small, emphasize raw counts, per-task results and bootstrap confidence intervals rather than overstated significance testing.

### 6.20 Reproducibility

Requirements:

- pin Python dependencies;
- Dockerfile or Docker Compose only if LibreOffice setup requires it;
- exact BlueFin commit SHA recorded for every run;
- deterministic mutation IDs and seeds;
- preserved original workbook bytes;
- machine-readable result files;
- CI smoke test on a tiny synthetic workbook;
- one-command regeneration of tables/figures from stored run outputs.

### 6.21 Test strategy

Unit tests:

- formula parser;
- relative-reference normalization;
- dependency graph construction;
- invariant evaluation;
- mutation injectors;
- counterexample search;
- workbook restore semantics.

Integration tests:

- synthetic workbook with known dependency graph;
- BlueFin task smoke test;
- LibreOffice recalc test;
- baseline → mutate → recalc → restore round-trip;
- repeated judge evaluation parser.

Regression tests:

- every discovered real false positive becomes a fixture;
- every engine-ambiguous workbook is tagged and excluded from deterministic correctness claims.

### 6.22 Ethical and licensing considerations

BlueFin's repository is **CC BY-NC 4.0**. Therefore:

- preserve attribution;
- link the original license;
- clearly mark modifications/adaptations;
- do not copy BlueFin assets into a separately permissive/commercially usable package without preserving the applicable non-commercial terms;
- prefer adapters that consume a separately cloned BlueFin checkout rather than redistributing workbook assets;
- use synthetic/public data for any added provenance examples;
- do not use Meridian customer data or private APIs.

### 6.23 Expected negative results

A strong study must accept these outcomes:

- deterministic checks may add little beyond BlueFin on the public tasks;
- formula-family heuristics may overflag legitimate exceptions;
- LibreOffice and Excel may agree on nearly all tested cases;
- minimal perturbation magnitude may be economically meaningless for some discrete assumptions;
- the LLM judge may outperform deterministic rules on finance-method criteria;
- provenance may not be supportable from the public task release.

These are publishable/decision-relevant if measured correctly.

### 6.24 Exact success criteria

The v1 is successful if:

1. all 8 public workbook-producing tasks are at least parsed/analyzed, or every exclusion is documented;
2. ≥30 controlled mutants are produced across ≥5 failure classes;
3. deterministic structural checks have measured precision/recall on the mutation suite;
4. BlueFin judge versus deterministic agreement is quantified;
5. ≥3 failures have reproducible first-divergence dependency paths;
6. at least one finding is genuinely diagnostic beyond an existing binary rubric criterion;
7. all reported tables regenerate from committed run metadata;
8. engine ambiguity is explicitly represented;
9. no conclusion depends on Meridian private systems;
10. the memo contains at least one result that could plausibly change evaluation methodology or task design.

---

## 7. Ten-Day Initial Build Plan

### Day 1 — Reproduce and freeze BlueFin

- clone BlueFin at a recorded commit SHA;
- run public tests;
- run/grade one manipulation task end to end;
- inspect all public task schemas and rubrics;
- create experiment manifest.

**Exit criterion:** one workbook can be parsed, recalculated and graded reproducibly; public task inventory is frozen.

### Day 2 — Workbook IR and dependency graph

- formula tokenizer/parser;
- cross-sheet references;
- normalized relative-reference representation;
- dependency graph;
- graph statistics and path query.

**Exit:** dependency paths can be generated for selected cells in all parsable workbook tasks.

### Day 3 — Controlled structural mutation suite

Inject labelled failures:

- formula→constant;
- wrong-period reference;
- sign inversion;
- cross-sheet break;
- formula-family drift;
- scenario miswire.

**Exit:** ≥20 deterministic mutants with expected labels and unit tests.

### Day 4 — Deterministic structural grader

Implement:

- formula-loss detection;
- broken reference detection;
- formula-family drift;
- unexpected constants;
- dependency-edge change.

**Exit:** initial confusion matrix on synthetic/controlled mutants; false positives manually reviewed.

### Day 5 — Finance invariants

Implement 4–6 high-confidence invariant families, prioritizing debt/cash/accounting/valuation relations that are actually applicable to public tasks.

**Exit:** meaningful invariant coverage on at least three public BlueFin workbooks with applicability metadata.

### Day 6 — Perturbation runner

- YAML/JSON perturbation schema;
- deterministic bounded levels;
- recalc;
- state reset/restore verification;
- run metadata.

**Exit:** ≥50 reproducible perturbation executions across multiple workbook tasks.

### Day 7 — Minimal counterexamples

- search smallest exposing perturbation;
- identify first divergent descendant;
- produce dependency-path explanation.

**Exit:** ≥3 clear counterexamples suitable for the demo.

### Day 8 — Judge calibration

Run BlueFin's public grader on:

- clean cases;
- selected mutants;
- naturally failing model outputs if legally/publicly available.

**Exit:** judge/programmatic disagreement table and confusion matrix by failure category.

### Day 9 — Engine validation and memo

- LibreOffice canonical runs;
- Excel validation on a small representative subset if accessible;
- mark ambiguous cases;
- draft 2–3 page technical memo;
- generate architecture diagram and result plots.

**Exit:** frozen quantitative tables + limitations section.

### Day 10 — Publication package

Finalize:

- public GitHub repo;
- reproducible environment;
- tested runner;
- all 8 public workbook tasks attempted/analyzed with exclusions documented;
- ≥30 mutants;
- result tables;
- failure examples;
- 2–3 page memo;
- architecture diagram;
- two-minute demo;
- contribution proposal or draft PR **only if** results justify one.

**Exit:** fresh-machine reproduction passes and every public claim has a source or experiment artifact.

---

## 8. Outreach Strategy

### 8.1 Sequence

1. **Technical critique from Brian Kulis** once experimental design and first results exist.
2. **Srivatsa Kundurthy** as first Meridian/BlueFin research contact after the public artifact is reproducible.
3. **Clara Na** as methodology backup if the result centers on evaluator design.
4. **George Fang** if the strongest finding concerns engine/state/dependency/runtime design.
5. **John Ling** after a result has broader benchmark/product-strategy significance.

This order can change based on the artifact. George does not automatically precede John, and a founder should not be the first contact for a narrow grading implementation question.

### 8.2 Initial contact objective

The first message should contain:

- one concrete quantitative finding;
- one link to the repo;
- one link to the short memo;
- one narrow technical question;
- **no internship request**.

### 8.3 Recommended first message

**Subject:** BlueFin: deterministic robustness checks vs. the agentic grader

Hi Srivatsa,

I've been extending BlueFin's evaluation rather than building another spreadsheet agent.

I built a deterministic robustness layer that reconstructs workbook dependency graphs, applies bounded financial perturbations, and localizes the first broken downstream dependency. I then compared those results against BlueFin's existing agentic perturbation grader.

The interesting result so far is **[ONE QUANTITATIVE FINDING]**. I've reproduced it across **[N] public BlueFin workbook cases / controlled mutants — state the denominator exactly]** and documented the engine limitations separately.

Repository: [link]  
Short memo: [link]

I'd be interested in your criticism of one specific question: do you think deterministic structural checks like these are best treated as an additional rubric signal, a calibration tool for the LLM judge, or something outside BlueFin's intended evaluation boundary?

Giacomo

### 8.4 Backup technical contact

**Clara Na** if the primary result is about evaluator reliability, human/LLM disagreement or structured-artifact quality.

### 8.5 Founder/product-system contact

**George Fang** if the result is primarily about dependency abstraction, spreadsheet execution, engine fidelity, persistence or state integrity.

**John Ling** if the result supports a broader claim about the next useful frontier in financial spreadsheet evaluation.

### 8.6 Warm path

Brian Kulis is a legitimate **A-level direct relationship**, but not a verified Meridian introduction path. Ask him to critique the research design first. Only request an introduction if he independently identifies a person he actually knows and believes the work is relevant to.

### 8.7 Best channel

Priority:

1. public/professional email when available from the research paper or official profile;
2. concise LinkedIn message if no email response and a profile is available;
3. GitHub issue/PR only for concrete repository contribution discussion, not recruiting outreach.

Do not contact the same person simultaneously across multiple channels.

### 8.8 Timing and follow-up cadence

- Contact only after repo + memo + one real result are public.
- One follow-up after **5–7 days**, only if it adds a new result or clarification.
- If there is no response after the follow-up, stop.
- If discussion moves to GitHub, keep technical contribution discussion there.

### 8.9 Exact technical question

> BlueFin already tests dynamic correctness through rubric-authored perturbations and an agentic judge. Does adding deterministic dependency/invariant checks materially improve evaluation fidelity, or would you prefer those checks to serve only as diagnostic evidence and judge calibration?

That question demonstrates that the existing benchmark was understood before proposing an extension.

---

## 9. Positioning Output

### 9.1 50-word builder description

Giacomo Cappelletto is a computer engineer who builds auditable agent systems and evaluates where they fail. He has deployed action-taking financial agents with governed data access, retrieval, tracing and LLM evaluation, while conducting ML research on robustness under controlled perturbations. His work combines systems engineering, measurement and applied financial workflows.

### 9.2 120-word technical project summary

BlueFin Robustness Auditor extends Meridian's public BlueFin evaluation framework with deterministic structural diagnostics rather than another spreadsheet-generation agent. It reconstructs cell-level dependency graphs, identifies formula-family drift and overwritten formulas, applies reproducible finance-domain perturbations, and evaluates structural and financial invariants after recalculation. For each failure, the system searches for a minimal counterexample, identifies the first incorrect downstream cell, and reports the dependency path responsible for propagation. The study compares these deterministic judgments against BlueFin's existing agentic LLM grader, quantifying agreement and disagreement by failure type while separately measuring spreadsheet-engine sensitivity. The initial release evaluates public BlueFin workbook tasks and controlled failure mutants, producing reproducible quantitative results, failure traces, a technical memo and a focused visualization of static versus dynamic workbook correctness.

### 9.3 Email subjects

1. **BlueFin: deterministic robustness checks vs. the agentic grader**
2. **A BlueFin extension for diagnosing dynamic spreadsheet failures**
3. **Finding the first broken dependency in BlueFin workbooks**

### 9.4 GitHub repository description

> Deterministic dependency, perturbation, invariant and judge-calibration tooling for diagnosing dynamic failures in BlueFin financial workbooks.

### 9.5 Technical memo abstract

BlueFin demonstrates that frontier agents frequently produce financial workbooks that appear correct statically but fail when assumptions change. Its existing evaluation addresses this through expert-authored perturbation rubrics evaluated by an agentic LLM judge. We study whether deterministic workbook analysis provides complementary evidence. Our system reconstructs formula dependencies, detects structural discontinuities, executes bounded finance-domain perturbations, checks applicable financial invariants, and searches for minimal counterexamples that expose latent defects. We compare these results against BlueFin's existing grader and measure disagreement by failure category, while separately testing sensitivity to spreadsheet calculation engines. The objective is not to replace expert or LLM evaluation, but to determine which failure classes can be verified more reproducibly, localized more precisely and presented with stronger causal evidence through programmatic analysis.

### 9.6 Three resume bullets to emphasize

Use the strongest existing, supportable evidence rather than inventing Meridian-specific wording:

- **Owned architecture and implementation of an internal AI-agent platform spanning a Databricks model-serving runtime, enterprise chat application and prompt/evaluation system; translated stakeholder requirements into deployed workflows.**
- **Built a LangGraph/MLflow agent with governed dynamic SQL, citation-backed document retrieval, request-scoped context, typed Pydantic contracts, evidence review and end-to-end tracing.**
- **Researching robust human-motion retrieval by learning fixed-length embeddings from temporal 2D/3D pose sequences and evaluating metric-learning objectives with Recall@K and mAP under noise, occlusion, temporal jitter and viewpoint shift.**

For a product-systems conversation with George Fang, the Tauri/Rust desktop-app performance bullet is a strong fourth bullet to surface.

---

## 10. Disconfirmation and Stop Conditions

### 10.1 Abandon the proposed project if

- a new public BlueFin branch/release already implements equivalent deterministic dependency/invariant diagnostics;
- the proposed metrics reduce almost entirely to existing rubric criteria and provide no additional failure localization;
- the public workbooks do not preserve enough formula structure for reliable analysis;
- engine differences dominate results so strongly that agent robustness cannot be separated from execution-engine behavior;
- a ten-day spike shows that a dependency parser robust enough for the selected Excel constructs is not achievable without a much larger implementation effort.

### 10.2 Choose a different BlueFin contribution if

If deterministic diagnostics add little, pivot in this order:

1. spreadsheet engine fidelity benchmark;
2. minimal counterexample generation as a focused tool;
3. declarative finance-invariant library;
4. trajectory/checkpoint fault-injection benchmark.

### 10.3 Contact a different person if

- **Judge methodology dominates:** Srivatsa Kundurthy or Clara Na.
- **Spreadsheet runtime / portability dominates:** George Fang.
- **Finance-methodology interpretation dominates:** Case Winter or another author with demonstrable finance-model expertise.
- **Benchmark strategy dominates:** Srivatsa Kundurthy, then John Ling.
- **Repository contribution mechanics dominate:** the maintainer who actually reviews the issue/PR.

### 10.4 Deprioritize Meridian if

Reassess if future public evidence shows that Meridian:

- stops publishing spreadsheet-agent/evaluation research;
- materially moves away from financial-model execution;
- no longer works on spreadsheet correctness, auditability or agent systems;
- has no credible future technical path for a 2027 student candidate;
- becomes a materially weaker fit than another company where the same artifact has clearer research/product value.

Current public evidence does **not** trigger these stop conditions.

### 10.5 Claims to avoid

Do not write or say:

- "Meridian's agent has a hardcoding problem."
- "Meridian needs my dependency checker."
- "Meridian's product fails under counterfactual assumptions."
- "BlueFin doesn't test dynamic correctness."
- "I have a warm path to Meridian through BU/Cornell/Dartmouth."

Use the narrower defensible claims:

- "Meridian's public BlueFin research shows that frontier spreadsheet agents remain weak on dynamic correctness."
- "BlueFin already tests that property; I investigated whether deterministic structural diagnostics add information beyond the current agentic perturbation evaluation."
- "Meridian's public product materials independently emphasize auditability, source traceability and robust spreadsheet workflows."

---

## Final Strategy

The recommended sequence is:

**build → measure → attempt to disconfirm → publish → invite technical criticism → discuss contribution → only later discuss working together.**

The central correction to the original hypothesis is decisive:

> **Counterfactual robustness is not itself the missing BlueFin capability. BlueFin already evaluates it. The differentiated contribution is a diagnostic layer beneath and beside that evaluation: dependency structure, deterministic invariants, systematic bounded perturbations, minimal counterexamples, judge calibration and explicit spreadsheet-engine uncertainty.**

That is close enough to Meridian's actual public 2026 research agenda to support a serious technical conversation, but distinct enough to stand as independent research rather than a portfolio clone.

---

## Primary Sources

### Meridian / Longitude Labs

- Meridian homepage: https://www.meridian.ai/
- Meridian About: https://www.meridian.ai/about
- Meridian launch announcement, 11 February 2026: https://www.meridian.ai/blog
- Meridian Security / product FAQ: https://www.meridian.ai/security
- Meridian public changelog: https://www.meridian.ai/changelog
- BlueFin announcement, 26 June 2026: https://www.meridian.ai/blog/all/bluefin
- SpreadsheetArena announcement, 13 February 2026: https://www.meridian.ai/blog/all/spreadsheet-arena
- SpreadsheetArena paper: https://www.meridian.ai/research/SpreadsheetArena.pdf

### BlueFin

- Paper: https://arxiv.org/abs/2605.30907
- Repository: https://github.com/Longitude-Labs/bluefin
- README: https://github.com/Longitude-Labs/bluefin/blob/main/README.md
- Grader: https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py
- Spreadsheet environment: https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/spreadsheet_env.py
- Recalculation engine: https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/recalc.py
- License: https://github.com/Longitude-Labs/bluefin/blob/main/LICENSE
- Public tasks: https://github.com/Longitude-Labs/bluefin/tree/main/tasks
- `d970b98b` rubric: https://github.com/Longitude-Labs/bluefin/blob/main/tasks/manipulation/d970b98b/rubric.json
- Active task refresh PR: https://github.com/Longitude-Labs/bluefin/pull/2
- Srivatsa rubric-fix commit: https://github.com/Longitude-Labs/bluefin/commit/643336ba21526666b51bc9e2decd25d57d0e3434

### Candidate evidence in this repository

- `resume/content/master.tex`
- Public engineering/research repositories referenced in the candidate profile, especially `JJCAPPE/rowing-dynamics-analysis` and `JJCAPPE/cv`.

For the separate source-by-source validation and hallucination audit, see [`SOURCE_VALIDATION.md`](./SOURCE_VALIDATION.md).
