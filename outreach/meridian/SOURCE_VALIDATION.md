# Meridian Strategy — Source Validation and Hallucination Audit

**Validation date:** 23 August 2026  
**Scope:** `outreach/meridian/README.md`

This file records the critical source checks performed before the strategy was committed. It is intended to prevent unsupported claims from becoming outreach talking points.

## 1. Primary-source checks

| Topic | Source checked | What is directly supported | What is not inferred from it |
|---|---|---|---|
| Meridian product positioning | https://www.meridian.ai/ | Meridian is an AI-powered modeling layer for Excel; product messaging emphasizes model confidence, source alignment and error detection | Does not prove any particular private-agent failure rate |
| Meridian mission / leadership | https://www.meridian.ai/about | "AI execution layer for finance"; John Ling CEO/cofounder, George Fang CTO/cofounder, Zach Kirshner COO/cofounder; George and John have Scale histories as described there | Does not establish that any founder is personally reachable through Giacomo's network |
| Product traceability and surfaces | https://www.meridian.ai/blog | 11 Feb 2026 launch post says Meridian has context across models, PDFs, dataroom docs and decks, with traceability; works in Meridian app, Excel and Google Sheets | Does not establish exact internal architecture |
| Existing-workbook auditing | https://www.meridian.ai/security | Meridian can analyze/audit/update/extend existing workbooks and users can ask it to audit broken formulas/structural issues | Does not prove that the product lacks deterministic structural validation |
| Reliability/product engineering | https://www.meridian.ai/changelog | March 2026 fixes include large tool-loop failures, incomplete multi-action tool calls, tool-result persistence, checkpoint save failures, spreadsheet link persistence, deleted-sheet references, document extraction, streaming and state reliability | These are public product fixes, not BlueFin benchmark findings and not evidence of current unresolved defects |
| BlueFin benchmark scope | https://arxiv.org/abs/2605.30907 | 131 tasks, 3,225 criteria; synthesis/manipulation/comprehension; judge calibration alpha=0.826, macro-F1=0.839; frontier agents weak on dynamic correctness | Does not mean the public GitHub release contains all 131 tasks |
| BlueFin research framing | https://www.meridian.ai/blog/all/bluefin | Integration, auditability, structure and robustness under assumption changes are explicit benchmark concerns; Meridian invites others to build on the work | Does not authorize commercial reuse beyond repository license |
| SpreadsheetArena | https://www.meridian.ai/blog/all/spreadsheet-arena and paper | Pairwise preference evaluation; formatting/structure matter; finance experts disagree materially with crowd preference | Does not imply presentation should override numerical/structural correctness |
| BlueFin public architecture | https://github.com/Longitude-Labs/bluefin | `agents`, `mcp_server`, `scoring`, `tasks`, `tests`, etc.; 20-tool environment documented in README | Does not prove private Meridian product uses the same harness |
| BlueFin grader | https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py | Perturbation is already a first-class rubric section; an agentic judge uses spreadsheet tools to inspect/mutate workbook state | Therefore the strategy must not claim to invent dynamic correctness testing |
| Spreadsheet environment | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/spreadsheet_env.py | openpyxl-backed state; recalc values are overlaid after calculation; writes invalidate cached recalculated state | openpyxl is not used as a full formula evaluator |
| Recalculation | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/recalc.py | Headless LibreOffice (`soffice`) recalculates workbooks; iterative calculation is enabled | Results should not be described as Microsoft Excel-native evaluation |
| BlueFin license | https://github.com/Longitude-Labs/bluefin/blob/main/LICENSE | CC BY-NC 4.0; attribution and non-commercial constraints apply to covered material | A companion repo must not silently relicense copied BlueFin assets permissively |
| Public task count | GitHub task directories | 7 manipulation + 1 synthesis + 1 interrogation public task directories at validation time | The plan must not claim 10–20 independent public workbook tasks |
| Manipulation perturbations | `tasks/manipulation/d970b98b/rubric.json` | Public rubric includes perturbations for Debt Spread, Loan Sizing Scalar, Interest Rate, LTV, Facility Size and PUE | A robustness project must go beyond repeating these exact checks |
| Repository activity | PR #2 + commit `643336b...` | Public manipulation task data/rubrics are actively being refreshed; `srkvatsa` authored/committed the perturbation-rubric fix and is requested as reviewer on PR #2 | Does not establish a formal contribution policy |
| Issues/contribution guide | GitHub issue search + root listing | No open issues were returned during validation; no `CONTRIBUTING.md` was found in the reviewed root listing | Absence of a contribution guide does not mean contributions are unwelcome |

## 2. Candidate-evidence checks

Validated against `JJCAPPE/cv` and the uploaded resume:

- Boston University B.S. Computer Engineering, expected May 2028, GPA 3.97.
- Current BU research with Prof. Brian Kulis on robustness of temporal pose-sequence embeddings under noise, occlusion, temporal jitter and viewpoint shift.
- Banca Mediolanum experience includes ownership of an internal AI-agent architecture, LangGraph/MLflow, governed dynamic SQL, citation-backed retrieval, request-scoped context, typed Pydantic contracts, evidence review, tracing, versioned prompts and LLM judging.
- Production/web stack evidence includes React/Vite, FastAPI, Flask/Dash, SSE, authenticated sessions, PostgreSQL and Databricks deployment.
- Desktop software evidence includes an Electron-to-Tauri/React/Rust inventory rebuild with measured performance improvements.
- `JJCAPPE/rowing-dynamics-analysis` provides repository-level evidence of a nontrivial ML/data pipeline with testing, reporting, model evaluation and provenance-aware artifacts.

No unsupported claim is made that Giacomo has already built spreadsheet parsing, Excel add-ins, Office.js integrations or financial-model benchmark infrastructure.

## 3. Network checks

Connected Gmail / Google Contacts were queried for Meridian / Longitude Labs, George Fang, John Ling, Srivatsa Kundurthy and BlueFin-related direct correspondence. No direct Meridian relationship was found.

Brian Kulis is present as a real saved contact and is independently supported by the CV as Giacomo's current research supervisor.

### Excluded speculative paths

The following were intentionally classified `X` rather than represented as warm paths:

- Dartmouth alumni → John Ling, because no actual intermediary was established.
- Banca Mediolanum / Databricks → Meridian, because domain overlap is not a relationship chain.
- BU rowing/student-athlete network → Meridian, because no person-to-person path was established.
- Brian Kulis → Srivatsa Kundurthy, because academic adjacency alone does not prove a personal relationship.

No private LinkedIn graph was available through a connected tool, so the report does not claim LinkedIn-derived first-degree relationships.

## 4. Critical corrections from the earlier draft

### Correction A — dynamic correctness is not the missing feature

**Earlier risk:** framing the project as adding counterfactual/dynamic correctness evaluation.  
**Validated correction:** BlueFin already explicitly grades perturbations. The selected project is now about deterministic structural diagnosis, systematic perturbation density, failure localization, judge calibration and engine uncertainty.

### Correction B — public sample size

**Earlier risk:** proposing a 10–20-task public BlueFin workbook study.  
**Validated correction:** current GitHub exposes 7 manipulation + 1 synthesis + 1 interrogation tasks. The plan uses the 8 workbook-producing tasks and reports controlled mutants separately.

### Correction C — warm network claims

**Earlier risk:** overstating BU/Cornell/Dartmouth adjacency as an introduction path.  
**Validated correction:** no verified warm Meridian intro is claimed. Brian Kulis is used as a technical reviewer first.

### Correction D — BlueFin contribution strategy

**Earlier risk:** assuming a direct PR should be the primary artifact.  
**Validated correction:** the public repo is compact, the task release is limited, and no contribution guide was located. The recommendation is companion repo + study first, narrow PR later only after measured evidence shows a useful seam.

### Correction E — engine semantics

**Earlier risk:** treating workbook recalculation as generic Excel behavior.  
**Validated correction:** BlueFin's public recalc path uses LibreOffice. The study must tag engine provenance and mark Excel/LibreOffice disagreement as engine-ambiguous.

## 5. Claims requiring future revalidation before outreach

Because these can change between build and contact, re-check immediately before outreach:

1. BlueFin repository HEAD, open PRs/issues and contribution guidance.
2. Public task count and whether new benchmark subsets were released.
3. Current Meridian team roles and BlueFin maintainer activity.
4. Whether a deterministic robustness/dependency extension has already appeared publicly.
5. Meridian product/changelog direction.
6. Any newly established warm relationship through BU, Cornell, Scale, investors or prior employers.
7. BlueFin license terms and any dataset-specific terms.

## 6. Completion standard for this planning package

The planning package is considered validated only if:

- every required report section exists;
- the selected project is complementary to, not a restatement of, current BlueFin perturbation grading;
- public task counts match the repository at validation time;
- product claims are sourced to Meridian primary materials;
- BlueFin implementation claims are sourced to repository code;
- network strengths do not exceed the evidence;
- license constraints are explicit;
- unsupported claims about Meridian's private product are absent;
- stop conditions include the possibility that the project is redundant or technically infeasible.

All of these conditions were checked before opening the PR containing this package.
