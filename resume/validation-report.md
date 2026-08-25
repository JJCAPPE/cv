# Resume validation report

**Date:** 24 August 2026  
**Release candidate:** `resume/evidence-linked-validation`

## Deterministic PDF and ATS gates

The synchronized compiled artifacts pass the repository validator with the following master/canonical measurements:

- one US-Letter page;
- 456 extracted words;
- 14 rendered bullets;
- 9 unique PDF links;
- 174,421 bytes;
- Poppler/PyMuPDF token parity: 1.0;
- bottom clearance: 0.716 in;
- embedded, subsetted Latin Modern fonts;
- no Unicode replacement characters, stale domains, malformed links, encryption, or PDF-integrity errors;
- byte-identical `resume-master.pdf`, `resume-giacomo-cappelletto.pdf`, and `site/public/resume.pdf`.

All eight targeted variants pass the same compilation, integrity, extraction, font, evidence-ledger, and link-annotation gates.

## HackerRank Hiring Agent rubric replay

This is an evidence-bound deterministic replay against the current `software_engineering_intern` criteria in `interviewstreet/hiring-agent`. It does not represent a stochastic provider-backed ensemble, because the official evaluator requires an external configured LLM provider.

| Category | Score | Evidence boundary |
|---|---:|---|
| Open Source | 8 / 35 | Multiple maintained public repositories, documentation, and reproducible artifacts; no qualifying pull request to an externally owned repository was found under `JJCAPPE`. |
| Self Projects | 30 / 30 | Multiple substantial, directly linked projects with source and deployments, including Rowbook, NoteWorthy, Deskinator, MOVE, and the rowing research system. |
| Production Experience | 25 / 25 | Banca Mediolanum ownership, architecture, deployment, benchmarking, cross-functional advisory work, plus shipped product engineering at Societa Cappelletto and TickIT. |
| Technical Skills | 10 / 10 | Python, TypeScript, SQL, Rust, C/C++, full-stack systems, ML, data infrastructure, evaluation, and deployment evidence. |
| Bonus | +3 | Research depth, Division I athletics, academic performance, and technical leadership. |
| Deductions | -4 | No verified third-party open-source contribution. |
| **Final** | **72 / 100** | The remaining material gap is third-party open-source contribution evidence, not resume wording. |

## Review boundary

The ten-second and sixty-second human-review gates remain intentionally separate in `reviewer-scorecard.md`; they are not mislabeled as automated checks.
