# OpenHands Outreach Research Package

**Research cutoff:** 22 August 2026

This folder contains the source-audited build-before-outreach strategy for OpenHands.

## Decision

Build **OpenHands Automation Event Ledger & Deterministic Replay Harness**, targeting the public Automation ingestion roadmap in:

- [`OpenHands/automation` #358](https://github.com/OpenHands/automation/issues/358)
- [`OpenHands/automation` #361](https://github.com/OpenHands/automation/issues/361)
- tracking issue [#363](https://github.com/OpenHands/automation/issues/363)

The project narrows the original broad lifecycle-replay hypothesis to a public, reproducible transaction boundary: durable incoming-event identity, provider-redelivery deduplication, unmatched-event visibility, atomic event-to-run provenance, and replay-based regression tests.

## Files

- [`research-brief.md`](./research-brief.md) — complete recommendation, technical map, opportunities, scorecard, selected build, contribution plan, connection map, positioning, and source appendix.
- [`source-audit.md`](./source-audit.md) — claim-level source validation and hallucination corrections.
- [`network-audit.md`](./network-audit.md) — authorized-source connection-path findings, with private content excluded.
- [`issue-status.csv`](./issue-status.csv) — checked status of required issues, adjacent PRs, and selected opportunity issues.
- [`project-scorecard.csv`](./project-scorecard.csv) — candidate scoring used for the decision.

## Audit conclusions

- The required issues were re-read rather than assumed actionable.
- ACP #15643, migration recovery #15623, Azure DevOps MCP #15769, and file-upload progress #16430 already have substantial open implementation PRs.
- The selected #358/#361 boundary is current, issue-backed, open, and no matching implementation PR was found in the checked Automation repository search at the cutoff.
- The broad Runtime API Quint idea was not retained as the first build because OpenHands has already used Quint to resolve a duplicate-pod lifecycle race.
- No verified warm first- or second-degree path to OpenHands was established; the recommended route is a substantive public contribution.

## Outreach rule

Do not contact maintainers about internships before the artifact has a failing-before/passing-after reproduction, a two-process PostgreSQL race test, a minimized replay fixture, and an upstream-sized patch.
