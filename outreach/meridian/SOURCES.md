# Meridian / BlueFin Source Validation Ledger

**Evidence cutoff for strategic claims:** 22 August 2026  
**Validation performed:** 23 August 2026

This file records the primary and high-quality secondary sources used in `README.md`, what each source supports, and what it does **not** support. It is intended to make later revalidation straightforward and to prevent unsupported claims from drifting into outreach copy.

## Primary Meridian sources

| Source | URL | Date | Supports | Does not support |
|---|---|---|---|---|
| Meridian homepage | https://www.meridian.ai/ | Current | AI modeling layer for Excel; connected workspace across spreadsheets/PDFs/CSVs/dataroom docs; formula/number traceability; inconsistency/error checking; EDGAR/XBRL product example | Any claim that Meridian's private production agent shares BlueFin benchmark failures |
| Meridian About | https://www.meridian.ai/about | Current | "AI execution layer for finance" language; models/documents/templates context; founders and prior Scale AI backgrounds | Detailed internal system architecture beyond public statements |
| Meridian launch post | https://www.meridian.ai/blog | 11 Feb 2026 | $17M seed announcement; source traceability; Meridian app + Excel + Google Sheets; models/PDFs/dataroom docs; early customer/traction statements | Current revenue or customer count beyond the dated post |
| Meridian Security | https://www.meridian.ai/security | Current | Excel plugin; Meridian app; audit/review workflows; multi-sheet workbooks; permissions/audit logs/retention statements | Independent security certification beyond what Meridian itself claims |
| Meridian Changelog | https://www.meridian.ai/changelog | March 2026 entries | Long-workflow stalls; large tool-loop failures; retry behavior; checkpoint save failures; tool-result persistence; spreadsheet link persistence; deleted-sheet reference handling; document extraction; data validation; formatting; streaming state | A claim that these historical bugs remain present now; a claim that they reflect BlueFin research priorities |
| BlueFin announcement | https://www.meridian.ai/blog/all/bluefin | June 2026 | Dynamic correctness framing; benchmark motivation; invitation to researchers to build on BlueFin | Any claim that BlueFin does not already test perturbations |
| SpreadsheetArena announcement | https://www.meridian.ai/blog/all/spreadsheet-arena | 13 Feb 2026 | Blind pairwise evaluation; domain-dependent preferences; finance-specific professional conventions; crowd/expert disagreement | Direct evidence about Meridian's private spreadsheet agent quality |
| Meridian Careers | https://www.meridian.ai/careers | Current | Company still presents engineering/talent surface; current public careers page state | Historical role details unless linked to archived/current Ashby posting |
| Meridian full-stack Ashby role | https://jobs.ashbyhq.com/meridian-ai/26e6e052-6a0f-4e90-9781-c52f2ce40092/ | 2026 snapshot | React, NestJS, Postgres; desktop app/plugins; spreadsheet-surface abstraction; portability; AI-native spreadsheet tools; Office.js/spreadsheet-engine and Electron experience as relevant bonuses | Proof that every component of Meridian currently uses this stack; private implementation details |

## BlueFin primary research/code sources

| Source | URL | Date | Supports |
|---|---|---|---|
| BlueFin paper | https://arxiv.org/abs/2605.30907 | 29 May 2026 | 131 tasks; 3,225 criteria; synthesis/manipulation/comprehension; dynamic-correctness weakness; expert validation; judge alpha=0.826 and macro-F1=0.839 |
| BlueFin repository | https://github.com/Longitude-Labs/bluefin | Current snapshot | Public harness architecture, task subset, license, test surface, current history |
| BlueFin README | https://github.com/Longitude-Labs/bluefin/blob/main/README.md | Current | 20-tool environment; task examples; scoring categories; environment layout; CC BY-NC 4.0 |
| `scoring/grade.py` | https://github.com/Longitude-Labs/bluefin/blob/main/scoring/grade.py | Current | Agentic manipulation/synthesis grader; dedicated Perturbation playbook; state mutation/restore instructions |
| `mcp_server/spreadsheet_env.py` | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/spreadsheet_env.py | Current | Stateful openpyxl environment; recalc cache; tool history/cache invalidation |
| `mcp_server/recalc.py` | https://github.com/Longitude-Labs/bluefin/blob/main/mcp_server/recalc.py | Current | LibreOffice/soffice headless recalculation; iterative-calc settings; structural validation helper |
| `tests/test_tools.py` | https://github.com/Longitude-Labs/bluefin/blob/main/tests/test_tools.py | Current | Current public tests focus on tool registry/environment/recalc/scoring/adapter basics |
| `tasks/manipulation/d970b98b/rubric.json` | https://github.com/Longitude-Labs/bluefin/blob/main/tasks/manipulation/d970b98b/rubric.json | Current | Explicit formula, integration, output, perturbation, presentation, pitfalls criteria; SOFR/PUE/facility-size sensitivity tests |
| Manipulation task directory | https://github.com/Longitude-Labs/bluefin/tree/main/tasks/manipulation | Current | Seven public manipulation tasks at validation time |
| Synthesis task directory | https://github.com/Longitude-Labs/bluefin/tree/main/tasks/synthesis | Current | One public synthesis workbook task at validation time |
| Interrogation task directory | https://github.com/Longitude-Labs/bluefin/tree/main/tasks/interrogation | Current | One public interrogation task at validation time |
| Commit `643336b` | https://github.com/Longitude-Labs/bluefin/commit/643336ba21526666b51bc9e2decd25d57d0e3434 | 16 Jun 2026 | `srkvatsa` authored/committed a rubric fix removing a placeholder perturbation criterion |
| PR #2 | https://github.com/Longitude-Labs/bluefin/pull/2 | Current snapshot | Ongoing task/rubric refresh; sensitivity/perturbation content being maintained |
| BlueFin license | https://github.com/Longitude-Labs/bluefin/blob/main/LICENSE | Current | CC BY-NC 4.0; attribution and non-commercial constraints |

## SpreadsheetArena primary research

| Source | URL | Date | Supports |
|---|---|---|---|
| SpreadsheetArena paper | https://arxiv.org/abs/2603.10002 | 16 Feb 2026 arXiv record | Blind pairwise spreadsheet evaluation; multi-dimensional artifact quality; finance expert evaluation; author affiliations |
| Meridian SpreadsheetArena post | https://www.meridian.ai/blog/all/spreadsheet-arena | 13 Feb 2026 | Public interpretation of feature effects and crowd/expert disagreement |

## Candidate evidence

| Source | Location | Supports |
|---|---|---|
| CV repository | https://github.com/JJCAPPE/cv | Current resume variants, project/site evidence |
| Uploaded resume | `resume-giacomo-cappelletto(4).pdf` | BU Computer Engineering, May 2028, GPA 3.97; Banca Mediolanum agent architecture; governed SQL/RAG/tracing/LLM judging; robustness research; Tauri/React/Rust desktop rewrite; full-stack systems |
| Rowing dynamics repository | https://github.com/JJCAPPE/rowing-dynamics-analysis | Demonstrated research software, temporal/biomechanics pipeline, synchronized noisy data, test/report infrastructure |

## Network evidence rules

The network map deliberately uses a conservative standard:

- **A:** direct relationship verified from connected data.
- **B:** a first-degree intermediary with a verified relationship to the target.
- **C:** shared institution/employer/collaborator/event/community with a real, evidenced bridge but no direct intro proof.
- **D:** justified cold contact based on direct technical relevance.
- **X:** speculative; excluded from outreach.

### Verified

- Brian Kulis is a direct current research relationship and a saved Google contact.
- Srivatsa Kundurthy is BlueFin first author and a public active BlueFin code maintainer (`srkvatsa`).
- George Fang is Meridian CTO/cofounder and BlueFin coauthor.
- John Ling is Meridian CEO/cofounder and BlueFin/SpreadsheetArena coauthor.
- Clara Na is a BlueFin/SpreadsheetArena coauthor with CMU affiliation in the papers.
- Anoushka Mohta, Colton Moraine, Case Winter, and Zach Kirshner are BlueFin coauthors; Meridian affiliation/role is used only where independently supported by Meridian or public professional sources.

### Not verified; therefore excluded as warm paths

- Brian Kulis personally knows Srivatsa Kundurthy.
- A Dartmouth alumnus known to Giacomo can introduce John Ling.
- Banca Mediolanum or Databricks colleagues have a first-degree Meridian relationship.
- BU rowing/student-athlete alumni provide a Meridian introduction.

## External comparison sources used only for context

These sources may inform the research landscape but are not necessary to establish Meridian-specific claims:

- WorkstreamBench: https://arxiv.org/abs/2605.22664
- Finch: https://arxiv.org/abs/2512.13168

They should not be cited as evidence of Meridian's internal priorities.

## Source-quality conclusion

The final strategy relies primarily on **Meridian first-party pages, the BlueFin/SpreadsheetArena papers, and the public BlueFin codebase**. Secondary sources are used only where primary material is unavailable and are not used to infer private product weaknesses.