# OpenHands Research Source Audit

**Audit date:** 22 August 2026  
**Purpose:** Claim-level validation for `research-brief.md`

## Audit method

1. Re-read every required GitHub issue through the GitHub API-backed connector.
2. Checked known adjacent or superseding pull requests rather than treating open issues as unclaimed.
3. Read current OpenHands, Automation, SDK, Extensions, and Benchmarks repository documentation.
4. Used official OpenHands product, engineering, research, team, and job pages for company-level claims.
5. Read Giacomo’s public GitHub files for candidate evidence.
6. Searched authorized Gmail, Google Contacts, Google Drive, public GitHub contribution history, and public web sources for a warm route. No private message bodies or personal-contact details are retained in this public package.
7. Removed or downgraded claims that depended on inaccessible production systems, inferred personal relationships, or unsupported current titles.

## Validation table

| ID | Primary source | Date / state checked | Claims supported | Validation result and limitation |
|---|---|---|---|---|
| S01 | [OpenHands README](https://github.com/OpenHands/OpenHands/blob/main/README.md) | Current main at cutoff | Agent Canvas purpose; ACP-compatible agents; local/remote/cloud backends; Automation Server pairing | **Valid primary source.** Current repository documentation. |
| S02 | [Agent Canvas architecture](https://github.com/OpenHands/OpenHands/blob/main/docs/architecture.md) | Current main at cutoff | Canvas boundaries, Agent Server, optional Automation Server, frontend responsibilities | **Valid primary source.** |
| S03 | [Agent Canvas Initiative #14374](https://github.com/OpenHands/OpenHands/issues/14374) | Created 11 May 2026; completed 17 Aug 2026 | Strategic shift to Canvas, OSS Automations, SDK foundation, enterprise control plane | **Valid strategy source.** Historical initiative, not a currently open task. |
| S04 | [Introducing Agent Canvas](https://www.openhands.dev/blog/introducing-agent-canvas) | 16 Jun 2026 | Agent Canvas launch and operator-workspace direction | **Valid official product source.** |
| S05 | [Automation README](https://github.com/OpenHands/automation/blob/main/README.md) | Current main at cutoff | Beta status, cron/event execution, Python/FastAPI/SQLAlchemy/Alembic stack | **Valid primary source.** |
| S06 | [SDK README](https://github.com/OpenHands/software-agent-sdk/blob/main/README.md) | Current main at cutoff | Agent SDK scope, multiple-agent tasks, Agent Server, MCP, skills/plugins | **Valid primary source.** |
| S07 | [Automation #358](https://github.com/OpenHands/automation/issues/358) | Open; created/updated 21 Aug 2026 | `accept_event()` seam, no blockers, behavior-preservation criteria | **Valid and current.** No matching implementation PR found in checked PR/code search. Acceptance remains unguaranteed. |
| S08 | [Automation #361](https://github.com/OpenHands/automation/issues/361) | Open; created/updated 21 Aug 2026 | Missing event persistence/dedupe, proposed IntegrationEvent, atomicity, multi-process acceptance tests | **Valid and current.** The production-impact statements are maintainer-authored issue evidence, not independently inspected production telemetry. |
| S09 | [Automation #363](https://github.com/OpenHands/automation/issues/363) | Open; created 21 Aug 2026 | Five-phase shared webhook/Socket Mode ingestion roadmap and dependencies | **Valid and current.** |
| S10 | [`event_router.py`](https://github.com/OpenHands/automation/blob/main/openhands/automation/event_router.py) | Current main at cutoff | Handler currently fuses authentication, parsing, matching, run creation, and commit; replay-risk comment | **Valid code source.** |
| S11 | [Automation #337](https://github.com/OpenHands/automation/issues/337) | Open; 13 Aug 2026 | Finished-run logs/exit verification rely on ephemeral bash events | **Valid issue evidence.** Implementation should be reconfirmed against main before coding. |
| S12 | [SDK #4077](https://github.com/OpenHands/software-agent-sdk/issues/4077) | Open; 10 Jul 2026 | Streaming retry duplication, backpressure, timeout, and ordering defects | **Valid issue evidence.** Some sub-items have adjacent PRs; do not claim the entire issue is untouched. |
| S13 | [SDK #4365](https://github.com/OpenHands/software-agent-sdk/issues/4365) | Open; 4 Aug 2026; assigned; Needs Design | Parent trace ID with subagent session ID and unresolved semantics | **Valid current design issue.** |
| S14 | [SDK #3549](https://github.com/OpenHands/software-agent-sdk/issues/3549) | Open; updated 3 Aug 2026 | Frozen real LLM fixture loaded then replaced by mocks | **Valid current issue.** |
| S15 | [OpenHands #7752](https://github.com/OpenHands/OpenHands/issues/7752) | Open/reopened; updated 11 Aug 2026 | Multi-repo selection remains roadmap work | **Valid current issue.** Maintainer comments show manual multi-repo operation already exists; the missing feature is first-class semantics. |
| S16 | [SDK #4239](https://github.com/OpenHands/software-agent-sdk/issues/4239) | Open roadmap; updated 27 Jul 2026 | Automatic cross-repo awareness and maintained repository knowledge | **Valid current issue.** |
| S17 | [OpenHands #9414](https://github.com/OpenHands/OpenHands/issues/9414) | Open roadmap; updated 3 Aug 2026 | Conversation/PR dashboard requirements | **Valid current product issue.** |
| S18 | [OpenHands #15643](https://github.com/OpenHands/OpenHands/issues/15643) | Open; updated 21 Aug 2026 | ACP auth banner differs across local, Docker, and cloud contexts | **Valid issue. Occupied by existing implementation work.** |
| S19 | [PR #16145](https://github.com/OpenHands/OpenHands/pull/16145) | Open, non-draft at cutoff | Configured-credential banner implementation and test evidence | **Valid adjacent PR.** Do not recommend duplicating #15643. |
| S20 | [OpenHands #15623](https://github.com/OpenHands/OpenHands/issues/15623) | Open; updated 19 Aug 2026 | Stale SQLite Alembic revision can break Automation startup | **Valid issue.** |
| S21 | [PR #16114](https://github.com/OpenHands/OpenHands/pull/16114) | Open, non-draft at cutoff | One-shot stale-database recovery and tests | **Valid adjacent PR.** Additional competing PRs mean the issue is crowded. |
| S22 | [OpenHands #15769](https://github.com/OpenHands/OpenHands/issues/15769) | Open; updated 27 Jul 2026 | Azure DevOps MCP marketplace gap | **Valid issue.** |
| S23 | [Extensions PR #384](https://github.com/OpenHands/extensions/pull/384) | Open draft at cutoff | Azure DevOps catalog entry, auth modes, logo, and tests | **Valid adjacent PR.** Do not recommend duplicate implementation. |
| S24 | [OpenHands #16430](https://github.com/OpenHands/OpenHands/issues/16430) | Open; updated 10 Aug 2026 | Missing file-upload progress and disappearing prompt behavior | **Valid issue.** |
| S25 | [PR #16487](https://github.com/OpenHands/OpenHands/pull/16487) | Open draft at cutoff | Optimistic upload state, progress UI, and tests | **Valid adjacent PR.** |
| S26 | [“It Told Me No”](https://www.openhands.dev/blog/quint-it-told-me-no) | 7 Jul 2026 | Existing Quint model helped resolve Runtime API duplicate-pod race | **Valid official engineering source.** This is why the report does not recommend starting with a duplicate broad Runtime model. |
| S27 | [Verification Stack](https://www.openhands.dev/blog/20260506-the-verification-stack) | 22 Jun 2026 | Critic, code review, QA, `/iterate`, and reported operational metrics | **Valid official engineering source.** Reported metrics are OpenHands’ own measurements. |
| S28 | [ACP support](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp) | 18 Jun 2026 | ACP support in Canvas and SDK | **Valid official product/engineering source.** |
| S29 | [Enterprise Agent Control Plane](https://www.openhands.dev/blog/openhands-enterprise-agent-control-plane) | 6 May 2026 | Governance, policies, budgets, audit, usage, and enterprise workflow direction | **Valid official product source.** Private implementation details remain inaccessible. |
| S30 | [OpenHands Index](https://www.openhands.dev/blog/openhands-index) | 29 Jan 2026 | Evaluation categories and ability/cost/runtime framing | **Valid official research source.** |
| S31 | [OpenHands About](https://www.openhands.dev/about) | Checked 22 Aug 2026 | Current listed roles for Graham Neubig, Xingyao Wang, Simon Rosenberg, Joe Pelletier, and Vasco Schiavo | **Valid current team source.** Ray Myers’ Chief Architect title is taken from S26, not inferred from the About page. |
| S32 | [Enterprise Agent Engineer role](https://jobs.ashbyhq.com/openhands/57564a95-13b6-47b1-b601-dd2353484e47) | Checked 22 Aug 2026 | Automation server, auditing, visibility, governance, observability, and reliability/cost/latency/outcome evaluation priorities | **Valid current job-description signal at cutoff.** Job availability can change later. |
| S33 | [Giacomo’s devtools-agents résumé source](https://github.com/JJCAPPE/cv/blob/main/resume/content/devtools-agents.tex) | Current main at cutoff | Enterprise agent platform, typed contracts, evaluation, tracing, full stack, quantified systems work | **Valid candidate source.** |
| S34 | [Pose study-pack README](https://github.com/JJCAPPE/pose-embedding/blob/main/contextual-similarity-study-pack/README.md) | Current main at cutoff | Tested PyTorch reference objective and finite-gradient smoke test | **Valid candidate source.** |
| S35 | [Rowing pipeline README](https://github.com/JJCAPPE/rowing-dynamics-analysis/blob/main/README.md) | Current main at cutoff | Operable research pipeline, packaging, reports, provenance, tests, and model bundles | **Valid candidate source.** |

## Hallucination checks and corrections

- **Corrected:** The broad lifecycle-replay project was not retained as the primary recommendation because it overlapped with existing Quint Runtime API work and relied on inaccessible production context.
- **Corrected:** Required issues were not assumed actionable merely because they were open. Existing PRs were checked for #15643, #15623, #15769, and #16430.
- **Corrected:** Multi-repository work was not described as impossible today. Public maintainer comments establish that the agent can clone additional repositories; first-class context and setup semantics remain unresolved.
- **Corrected:** No warm connection to OpenHands, a founder, a maintainer, or an investor is asserted.
- **Corrected:** Brian Kulis is not represented as a connector. Only the advisor relationship is verified.
- **Qualified:** The absence of a matching `accept_event` or `IntegrationEvent` PR is based on checked GitHub code/PR search at the cutoff; it is not a guarantee that no private branch exists.
- **Qualified:** Production impact described in #361 is attributed to the issue and current architecture; the report does not claim independent access to OpenHands production telemetry.
- **Qualified:** Current roles and job postings are time-sensitive and are dated to the cutoff.

## Unsupported claims deliberately excluded

- OpenHands acceptance of a future PR.
- Exact production duplicate-run incidence.
- Private Runtime API state schemas or production logs.
- A LinkedIn first- or second-degree connection not present in an authorized export.
- Any direct or indirect Brian Kulis introduction path.
- A claim that one database uniqueness key is definitively correct before maintainers confirm the identity scope.
