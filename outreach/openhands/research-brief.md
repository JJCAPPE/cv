# OpenHands Contribution and Technical Opportunity Research Brief

**Candidate:** Giacomo Cappelletto  
**Evidence cutoff:** 22 August 2026  
**Selected artifact:** **OpenHands Automation Event Ledger & Deterministic Replay Harness**  
**Proposed standalone repository:** `JJCAPPE/openhands-automation-event-ledger`

> **Audit note.** The initial broad “runtime lifecycle replay” hypothesis was narrowed after source validation. OpenHands has already used Quint to resolve a Runtime API duplicate-pod race, while the Automation ingestion roadmap published on 21 August 2026 exposes a newer, public, reproducible, and currently unclaimed reliability boundary in issues [#358](https://github.com/OpenHands/automation/issues/358), [#361](https://github.com/OpenHands/automation/issues/361), and [#363](https://github.com/OpenHands/automation/issues/363). The recommendation below therefore preserves the reliability and replay objective but anchors it to an exact upstream seam.

## Evidence labels

- **[Verified fact]** Directly supported by a checked primary source.
- **[Strong inference]** A conclusion drawn from multiple primary sources or code structure; not stated verbatim by OpenHands.
- **[Weak inference]** Plausible but dependent on missing implementation or organizational context.
- **[Unknown or inaccessible]** The public or authorized sources checked did not establish the claim.

---

## 1. Executive recommendation

1. Build **OpenHands Automation Event Ledger & Deterministic Replay Harness**.
2. Target `OpenHands/automation` [#358](https://github.com/OpenHands/automation/issues/358) first, then [#361](https://github.com/OpenHands/automation/issues/361).
3. Extract the transport-neutral `accept_event()` seam without changing existing webhook behavior.
4. Add durable incoming-event identity, redelivery deduplication, unmatched-event visibility, atomic event-to-run provenance, and bounded retention.
5. Prove correctness with Hypothesis stateful tests and a real two-process PostgreSQL race test.
6. Produce a sanitized replay fixture and static timeline, but keep experimental visualization outside the upstream patch.
7. Do not begin with Quint; OpenHands has already validated Quint for Runtime API lifecycle races, while this failure boundary is primarily transactional.
8. Do not build a generic verification plugin; OpenHands already operates a critic, code-review, QA, and iteration stack.
9. Do not lead with multi-repository orchestration; the unresolved problem is broader than repository selection and exceeds a credible first four-week contribution.
10. Begin technical outreach only after a failing-before/passing-after reproduction and an upstream-sized patch exist.

---

## 2. OpenHands technical map

### Strategic direction

**[Verified fact]** OpenHands’ flagship public repository now presents **Agent Canvas** as a self-hosted developer control center that can run OpenHands, Claude Code, Codex, Gemini, and other ACP-compatible agents across local, remote, and cloud backends. Its architecture uses one or more Agent Servers and can pair them with an Automation Server for scheduled or event-triggered runs. Sources: [OpenHands README](https://github.com/OpenHands/OpenHands/blob/main/README.md), [Agent Canvas architecture](https://github.com/OpenHands/OpenHands/blob/main/docs/architecture.md), and the [Agent Canvas initiative](https://github.com/OpenHands/OpenHands/issues/14374).

| Area | What exists | Active direction | Material gap | Domain | Public ownership signal | External contribution assessment |
|---|---|---|---|---|---|---|
| **Agent Canvas** | React/TypeScript operator interface for conversations, terminal, browser, files, settings, backends, and Automations. It can connect to multiple Agent Servers. | Multi-backend operation, local/self-hosted execution, ACP agents, automations, and richer operator visibility. | Backend capability discovery, cross-backend state consistency, and failure visibility. | Product, frontend, distributed client state | Robert Brennan set the 2026 Canvas direction; Joe Pelletier, Graham Neubig, and active Canvas contributors appear repeatedly in roadmap issues. | **High** for scoped tests and backend-state fixtures; **low** for an unsolicited broad redesign. |
| **OpenHands Automations** | Python/FastAPI service with cron and event triggers, run history, scheduler, dispatcher, watchdog, SQLAlchemy, Alembic, local/cloud execution modes. | A five-phase plan now unifies webhook and stream transports: transport-neutral ingestion, provider descriptors, Slack Socket Mode, event persistence/deduplication, and external-subject conversation reuse. | Durable event identity, replay safety, multi-replica deduplication, unmatched-event visibility, and end-to-end audit evidence. | Backend, distributed systems, integrations | Vasco Schiavo authored [#358–#363](https://github.com/OpenHands/automation/issues/363) on 21 August 2026. | **Very high.** This is the strongest current public contribution seam. |
| **Software Agent SDK / Agent Server** | Python and REST APIs for agents, tools, conversations, workspaces, multiple agents, MCP, skills, persistence, and remote Agent Server execution. | Production-agent composability, multiple-agent tasks, remote workspaces, and SDK-backed developer experiences. | Streaming correctness, trace/session identity, deterministic fixture replay, and stable cross-service correlation. | Agent infrastructure, backend, evaluation | Xingyao Wang, Simon Rosenberg, Engel Nyst, Vasco Schiavo, and other SDK maintainers. | **High**, but cross-cutting architectural changes need maintainer design agreement. |
| **Agent Client Protocol** | Agent Canvas and SDK support ACP-based third-party harnesses. | Consistent Claude Code, Codex, Gemini, local, containerized, and hosted behavior. | Authentication-state truthfulness, credential materialization, error parity, and backend conformance. | Security, integration, UX | Simon Rosenberg authored [#15643](https://github.com/OpenHands/OpenHands/issues/15643); existing PR [#16145](https://github.com/OpenHands/OpenHands/pull/16145) already addresses the reported banner gap. | **Medium.** The named issue is occupied; broader conformance tests could still be useful later. |
| **Runtime API / sandbox lifecycle** | Runtime allocation and isolated workspaces, including Kubernetes-backed internal runtime provisioning. | Reliable allocation, replacement, cancellation, and cleanup. | Public contribution access is limited because important production Runtime API implementation and telemetry are not all in the main OSS surface. | Kubernetes, distributed systems, formal methods | Ray Myers’ Quint model and the public post [“It Told Me No”](https://www.openhands.dev/blog/quint-it-told-me-no) document ownership and method. | **Medium-low** for a first contribution; useful as methodological precedent, not the primary build target. |
| **Enterprise Agent Control Plane** | Governance over agent execution, policies, permissions, budgets, auditability, usage, cost, and organizational workflows. | Reliable Automations, centralized visibility, policy enforcement, and operational control. | Much of the tenancy and production control-plane code is private. | Enterprise platform, security, observability | OpenHands’ [Enterprise control-plane post](https://www.openhands.dev/blog/openhands-enterprise-agent-control-plane) and current [Enterprise Agent Engineer role](https://jobs.ashbyhq.com/openhands/57564a95-13b6-47b1-b601-dd2353484e47). | **Low** for private internals; **high** for OSS reliability primitives that strengthen auditability. |
| **Observability, auditability, cost** | Run histories, event streams, tracing, model/tool activity, and enterprise usage/cost views. | Causal attribution across agents, conversations, tools, runtimes, and Automations. | Durable linkage among incoming event, AutomationRun, conversation, trace, model usage, and irreversible effects. | Observability, data model | Simon Rosenberg owns the current multi-agent trace/session design issue [#4365](https://github.com/OpenHands/software-agent-sdk/issues/4365). | **Medium-high** after the selected event ledger establishes a durable upstream identity. |
| **Verification Stack** | Critic model, structured code review, executable QA, and `/iterate` remediation loop. | Higher-quality agent-generated changes and automated merge-readiness workflows. | Stable interfaces and calibrated trajectory/output scoring remain research opportunities, but a generic verifier would duplicate existing work. | Evaluation, developer tooling | Xingyao Wang and Calvin Smith document the stack in [OpenHands’ Verification Stack post](https://www.openhands.dev/blog/20260506-the-verification-stack). | **Medium**, but low expected attention for a parallel generic plugin. |
| **OpenHands Index / benchmarks** | Continuous evaluation across issue resolution, greenfield development, frontend, testing, and information gathering; public benchmark infrastructure is migrating to SDK V1. | Broader and more reproducible agent evaluation with cost and runtime as first-class metrics. | Trace-level diagnosis linked to aggregate benchmark outcomes. | Research infrastructure | OpenHands research and benchmark maintainers; sources: [Index post](https://www.openhands.dev/blog/openhands-index), [Index site](https://index.openhands.dev/), and [benchmarks README](https://github.com/OpenHands/benchmarks/blob/main/README.md). | **High** for benchmark-specific contributions, but less direct than the selected reliability gap. |
| **Integrations** | Git providers, MCP catalog, Slack, Linear, Jira, GitHub, and numerous skills/plugins in `OpenHands/extensions`. | Shared integration catalog and event-driven Automations. | Provider-neutral authentication, event identity, delivery contracts, replay windows, and idempotency. | Integrations, security | Automation and Extensions maintainers; [Extensions README](https://github.com/OpenHands/extensions/blob/main/README.md). | **High** when contribution improves infrastructure rather than adding a one-off tile. |
| **Multi-agent** | SDK supports major tasks involving multiple agents and a task/delegation tool. | Better nested-agent operation and evaluation. | Trace/session semantics are currently ambiguous for subagents. | Agent architecture, observability | Simon Rosenberg’s [#4365](https://github.com/OpenHands/software-agent-sdk/issues/4365). | **Medium-high**, but requires a design decision before implementation. |
| **Multi-repository** | Agents can already clone and edit additional repositories when instructed; public roadmap asks for automatic awareness and better productization. | Primary-repository semantics, related-repo discovery, declarative runtime environments, and repository-specific instruction loading. | Dependency ordering, branch coordination, credentials, AGENTS/repo knowledge precedence, and recoverable partial execution. | Product, context architecture, distributed workflow | Graham Neubig, Engel Nyst, and Joe Pelletier signals in [#7752](https://github.com/OpenHands/OpenHands/issues/7752) and SDK [#4239](https://github.com/OpenHands/software-agent-sdk/issues/4239). | **Medium-low** for a first contribution because expected behavior remains underspecified. |

### Required issue status check

All statuses below were re-read on 22 August 2026.

| Required item | Verified state | Superseding or adjacent work | Actionability conclusion |
|---|---|---|---|
| [OpenHands/OpenHands #7752](https://github.com/OpenHands/OpenHands/issues/7752) — multiple repositories | **Open; reopened; roadmap** | Maintainer discussion states that agents can already clone additional repos; the unresolved part is first-class context, primary-repo, rules, and setup semantics. SDK [#4239](https://github.com/OpenHands/software-agent-sdk/issues/4239) tracks automatic cross-repo awareness. | Important but too ambiguous for the strongest first four-week contribution. |
| [#9414](https://github.com/OpenHands/OpenHands/issues/9414) — personal conversation dashboard | **Open; roadmap** | Requirements cover active conversations, grouping by repository/PR, PR/issue state, unresolved comments, failing tests, and intervention needs. | Real product priority, but frontend/product-heavy and less differentiated for Giacomo. |
| [#15643](https://github.com/OpenHands/OpenHands/issues/15643) — ACP auth state | **Open; good first issue** | Tested implementation PR [#16145](https://github.com/OpenHands/OpenHands/pull/16145) is open and covers the configured-vs-signed-in distinction; another overlapping PR also exists. | Occupied. Do not duplicate. |
| [#15623](https://github.com/OpenHands/OpenHands/issues/15623) — Automation migration recovery | **Open; good first issue** | PR [#16114](https://github.com/OpenHands/OpenHands/pull/16114) implements one-shot stale-SQLite recovery with tests; additional competing PRs exist. | Crowded and substantially implemented. |
| [#15769](https://github.com/OpenHands/OpenHands/issues/15769) — Azure DevOps MCP | **Open; good first issue; MCP** | Draft `OpenHands/extensions` PR [#384](https://github.com/OpenHands/extensions/pull/384) adds the catalog entry, auth modes, logo, and contract tests. | Occupied. |
| [#16430](https://github.com/OpenHands/OpenHands/issues/16430) — file-upload progress | **Open; medium-priority frontend bug** | Draft PR [#16487](https://github.com/OpenHands/OpenHands/pull/16487) adds upload progress, optimistic message state, and tests. | Occupied. |

---

## 3. Five evidenced problem opportunities

### Rank 1 — Durable Automation event identity, redelivery deduplication, and replay safety

**Classification:** [Verified fact]  
**Confidence:** 0.97  
**Evidence:** [Automation #358](https://github.com/OpenHands/automation/issues/358), [#361](https://github.com/OpenHands/automation/issues/361), [#363](https://github.com/OpenHands/automation/issues/363), and current [`event_router.py`](https://github.com/OpenHands/automation/blob/main/openhands/automation/event_router.py).

**What is verified.** The current HTTP handler verifies and parses an incoming event, matches triggers, inserts `AutomationRun` rows, and commits, but it does not persist the incoming integration event as a durable entity. Issue #361 explicitly identifies missing provider-event deduplication, unsafe replay, invisible unmatched events, lack of retry after routing failure, no shared delivery record across transports, and weak debugging.

**User and enterprise impact.** A provider redelivery can start a second agent run. That can repeat comments, commits, pushes, pull requests, tickets, or other non-idempotent effects. A user with a wrong JMESPath filter cannot distinguish “the event never arrived” from “the event arrived and matched nothing.” Enterprise operators lack an auditable event-to-run record.

**Likely root difficulty.** Correct behavior depends on database transactionality, stable provider identifiers, multi-process uniqueness, retention, provider-friendly response semantics, and avoiding partial event/run commits.

**Existing attempts.** #358 and #361 provide a detailed maintainer-authored design. A checked code and PR search found no matching `accept_event` or `IntegrationEvent` implementation in `OpenHands/automation` as of the cutoff.

**Local reproduction.** Yes. Configure an event Automation and post the same GitHub delivery twice; then race the same provider event through two service processes sharing PostgreSQL.

**External contributor suitability.** **Excellent.** The issues are open, unassigned, precisely scoped, and define acceptance criteria. Acceptance is still a maintainer decision; “excellent” is an evidence-based feasibility assessment, not a guarantee.

**Estimated scope.** Two to four weeks for #358, #361, concurrency/property tests, and a companion replay report.

---

### Rank 2 — Durable Automation run evidence after ephemeral bash-event retention

**Classification:** [Verified fact]  
**Confidence:** 0.95  
**Evidence:** [OpenHands/automation #337](https://github.com/OpenHands/automation/issues/337).

**What is verified.** The issue documents that finished-run logs and exit-code verification are read from Agent Server `bash_events`, which can be pruned or explicitly cleared. The durable `AutomationRun` can therefore outlive the evidence used to display logs and verify its result.

**Impact.** Historical debugging can lose stdout/stderr and a verifiable exit code after retention or sandbox teardown. This weakens auditability and may make a previously completed run appear unverifiable.

**Root difficulty.** The implementation must choose the final capture point, cap and truncate output safely, migrate the run schema, preserve live streaming while a run is active, and provide consistent local/cloud behavior.

**Existing attempts.** Earlier work records `bash_command_id`, which narrows verification to the correct command. #337 addresses the remaining durability boundary.

**Local reproduction.** Yes. Complete a run, delete or prune its bash events, and request historical logs/verification.

**External suitability.** High.

**Estimated scope.** One to two weeks for a focused backend implementation; two to three weeks including Canvas fallback behavior.

---

### Rank 3 — Live streaming retry, ordering, and backpressure correctness

**Classification:** [Verified fact]  
**Confidence:** 0.94  
**Evidence:** [software-agent-sdk #4077](https://github.com/OpenHands/software-agent-sdk/issues/4077).

**What is verified.** The issue audits the live token/delta path and identifies duplicated token emission across retries, inconsistent empty-stream retries, unbounded delivery scheduling, state-update hangs on wedged clients, and a final ordering barrier that excludes delta futures. It explicitly distinguishes transient streaming defects from the correct durable final message.

**Impact.** Users can see duplicated or garbled text; pending tasks can accumulate; a stuck WebSocket can block pause, interrupt, or finalization signals.

**Root difficulty.** Async ordering, bounded queues, retry attempt identity, subscriber isolation, send timeouts, and low-latency delivery must be reconciled without breaking durable history.

**Existing attempts.** Some sub-items have adjacent PRs, but the issue remains open and broad. A contribution should select one independently testable defect rather than claim the entire issue.

**Local reproduction.** Yes, with a provider stub that fails mid-stream and a deliberately slow WebSocket subscriber.

**External suitability.** Good, but scope control is essential.

**Estimated scope.** Two to five weeks depending on the selected subproblem.

---

### Rank 4 — Multi-agent trace and session identity

**Classification:** [Verified fact]  
**Confidence:** 0.93  
**Evidence:** [software-agent-sdk #4365](https://github.com/OpenHands/software-agent-sdk/issues/4365).

**What is verified.** A task subagent receives its own `session_id` but is created within the parent tool span’s active context, inheriting the parent `trace_id`. One trace can therefore contain spans stamped with different sessions. The issue is assigned to Simon Rosenberg and labelled `Needs Design`.

**Impact.** Trace consumers, trajectory exporters, cost accounting, and latency attribution can interpret nested-agent work inconsistently.

**Root difficulty.** This is a semantic decision: keep delegates in the parent trace/session, create detached linked traces, or explicitly support one trace containing multiple sessions.

**Existing attempts.** The issue presents alternatives but deliberately does not select one.

**Local reproduction.** Yes, using an in-memory trace exporter.

**External suitability.** Medium-high for a reproducer and design experiment; lower for an unsolicited semantic change.

**Estimated scope.** Two to four weeks after maintainer contract agreement.

---

### Rank 5 — Deterministic real-trajectory fixture replay is not first-class

**Classification:** [Verified fact plus strong inference]  
**Confidence:** 0.89  
**Evidence:** [software-agent-sdk #3549](https://github.com/OpenHands/software-agent-sdk/issues/3549).

**What is verified.** The cross-test loads frozen real LLM completion fixtures and then replaces them with synthetic mock responses. The issue asks whether those fixtures should become a first-class deterministic replay suite or whether the test should be renamed/split.

**Impact.** Tests can appear to validate recorded real trajectories while actually exercising handwritten mocks, reducing confidence in behavioral regression coverage.

**Root difficulty.** Agent and tool-call schemas evolve; a real frozen trajectory may no longer align with current tool sequences or model contracts. Replay needs versioning and useful mismatch diagnostics.

**Existing attempts.** The issue identifies the bypass but no completed first-class replay system was found in the checked source.

**Local reproduction.** Yes.

**External suitability.** High for a narrowly scoped fixture and compatibility layer; moderate for a broad replay framework.

**Estimated scope.** One to three weeks.

---

## 4. Project candidates and scorecard

Scores are 0–10. The selected build is exactly one project; the first candidate is the source-audited, narrowed form of the preferred Reliability Specification hypothesis.

| Candidate | Current relevance | Technical depth | External feasibility | Reproducible data | 2–4 week feasibility | Demonstration value | Giacomo alignment | Maintainer attention | Total / 80 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **A. Automation Event Ledger & Deterministic Replay Harness** | **10** | **9** | **9** | **10** | **9** | **9** | **10** | **9** | **75** |
| **B. Verification Stack merge-readiness plugin** | 7 | 8 | 8 | 9 | 8 | 8 | 9 | 5 | 62 |
| **C. Multi-repository orchestration prototype** | 7 | 9 | 5 | 7 | 5 | 9 | 8 | 6 | 56 |

### Candidate A — selected

This project preserves the original state-machine, replay, property-testing, visualization, and CI concepts but anchors them to the new Automation ingestion boundary. It has exact open issues, an accessible code path, provider fixtures, real database semantics, and objective success criteria.

**Why not model the entire runtime lifecycle first?** OpenHands has already applied Quint to a Runtime API duplicate-pod race. A new broad model would risk redundancy and require private implementation context. The event ledger instead produces executable tests against public code and can later become one input to broader lifecycle reasoning.

### Candidate B — Verification Stack plugin

A credible implementation could combine tests, static analysis, repository rules, security checks, trajectory criticism, and merge-readiness scoring. It loses because OpenHands already has a critic, code-review plugin, QA plugin, and `/iterate` loop. Without a clearly missing public extension contract or labeled data, it risks becoming a parallel generic PR checker.

### Candidate C — Multi-repository orchestration

A credible system would model repository relationships, dependency order, primary-repository context, branch/worktree isolation, coordinated changes, and recoverable partial completion. It loses on four-week feasibility and upstream clarity. OpenHands can already clone additional repositories; the unresolved semantics span product, context loading, credentials, setup scripts, and atomicity across providers.

### Selection

**Selected:** Candidate A, **OpenHands Automation Event Ledger & Deterministic Replay Harness**.

---

## 5. Selected build specification

### Exact problem statement

**[Verified fact]** The Automation service currently treats an integration event as transient input to run creation rather than a durable entity. Provider redelivery can create duplicate runs, an unmatched event leaves no durable trace, and process-local deduplication is insufficient once stream ingestion runs across multiple replicas. Sources: [#361](https://github.com/OpenHands/automation/issues/361) and current [`event_router.py`](https://github.com/OpenHands/automation/blob/main/openhands/automation/event_router.py).

The implementation must establish this invariant:

> For an authenticated provider event with a stable provider event identifier, accepting that event one or more times—sequentially or concurrently—creates the corresponding Automation runs at most once, while preserving one durable record of the unique event and committing the event and its run set atomically.

### Target user

- OpenHands Automation maintainers debugging event-driven workflows.
- Self-hosted teams receiving GitHub, Slack, Jira, Linear, or custom events.
- Enterprise operators who require event-to-run auditability.
- Future stream-transport maintainers, especially the Slack Socket Mode work in [#360](https://github.com/OpenHands/automation/issues/360).

### Architecture

```text
HTTP webhook / future stream transport
                 |
                 v
      acquisition + authentication
                 |
                 v
           AcceptedEvent
                 |
                 v
           accept_event()
           /           \
          /             \
 IntegrationEvent     trigger matching
   durable ledger           |
          \                  v
           \--------> AutomationRun(s)
                one DB transaction
                       |
                       v
                  dispatcher
```

Companion reliability harness:

```text
sanitized provider fixture
          |
          v
fault/interleaving generator
 duplicate | reorder | concurrent delivery | missing ID
          |
          v
OpenHands accept_event adapter
          |
          +--> invariant checker
          +--> IntegrationEvent / AutomationRun snapshot
          +--> minimized counterexample
          +--> JSON, JUnit, and static HTML report
```

### Upstream interface

The first patch should follow the contract proposed in [#358](https://github.com/OpenHands/automation/issues/358):

```python
@dataclass
class AcceptedEvent:
    source: str
    event_key: str
    payload: dict
    provider_event_id: str | None = None
    subject: EventSubject | None = None
    occurred_at: datetime | None = None


@dataclass
class AcceptResult:
    matched: int
    run_ids: list[str]
    duplicate: bool = False


async def accept_event(
    org_id: uuid.UUID,
    event: AcceptedEvent,
    session: AsyncSession,
    *,
    request: Request | None = None,
) -> AcceptResult:
    ...
```

The second patch should implement the durable entity described in [#361](https://github.com/OpenHands/automation/issues/361):

```text
IntegrationEvent
- id
- org_id
- source
- provider_event_id
- event_key
- payload
- received_at
- matched_count
- processing_status
- error
```

**[Strong inference]** One schema question should be raised rather than silently changed: the issue proposes uniqueness over `(source, provider_event_id)`. A multi-organization test should establish whether that identity is globally provider-scoped or should include `org_id`; the implementation should follow the maintainer’s decision.

### Companion repository structure

```text
openhands-automation-event-ledger/
├── README.md
├── pyproject.toml
├── docs/
│   ├── architecture.md
│   ├── invariants.md
│   ├── upstream-mapping.md
│   └── experiments.md
├── src/oh_event_lab/
│   ├── model.py
│   ├── fixtures.py
│   ├── replay.py
│   ├── faults.py
│   ├── invariants.py
│   ├── minimize.py
│   ├── timeline.py
│   └── adapters/
│       └── openhands_automation.py
├── fixtures/
│   ├── github/
│   ├── slack/
│   └── custom/
├── tests/
│   ├── test_sequential_dedupe.py
│   ├── test_concurrent_dedupe.py
│   ├── test_atomicity.py
│   ├── test_unmatched_visibility.py
│   ├── test_retention.py
│   └── stateful/
│       └── test_event_state_machine.py
├── docker/
│   └── compose.postgres.yml
└── reports/
    └── sample-replay.html
```

### Technology choices

| Technology | Decision | Reason |
|---|---|---|
| Python 3.12+ | Use | Matches `OpenHands/automation`. |
| Pydantic | Use | Typed provider fixture and replay contracts. |
| SQLAlchemy/Alembic | Use upstream | Matches the service’s data and migration stack. |
| PostgreSQL | Required for concurrency proof | The key invariant depends on real shared-database transaction and uniqueness behavior. |
| SQLite | Compatibility coverage | Useful for self-hosted local mode, but not sufficient as the only concurrency proof. |
| Pytest | Use | Upstream-aligned regression suite. |
| Hypothesis `RuleBasedStateMachine` | Use for MVP | Generates duplicate/reordered sequences and shrinks counterexamples while invoking real Python/SQL behavior. |
| Static HTML + JSON/JUnit | Use | Demonstrates the timeline and integrates with CI without creating a frontend project. |
| Quint | Defer | Proven valuable inside OpenHands for Kubernetes Runtime API races, but unnecessary for the first transactional event-ledger proof. |
| TLA+ | Do not use initially | Higher adoption and maintenance cost than Quint in this project context. |
| Temporal-style workflow testing | Do not introduce | #361 explicitly defers an async routing worker until measurements justify it; the contribution should not replace the architecture. |

### Explicit invariants

1. One provider event identity creates one routed run set.
2. Sequential duplicate delivery creates no second run.
3. Concurrent duplicate delivery across processes creates no second run.
4. A duplicate is acknowledged successfully to the provider.
5. An event with no matching Automation remains durably queryable with `matched_count = 0`.
6. Events without a provider identifier remain recordable but are not falsely deduplicated.
7. The event row and generated runs commit atomically.
8. Pruning is bounded and cannot remove an event still needed by an active operation.
9. Existing Automation definitions require no change.
10. Existing event-router wire behavior and tests remain unchanged through the #358 refactor.

### Two-week MVP

| Days | Deliverable | Exit test |
|---|---|---|
| 1–3 | Local fork implementing the #358 `accept_event()` seam | Existing event-router suite passes without modification; direct ingestion tests pass. |
| 4–7 | `IntegrationEvent` model, migration, ID extraction, dedupe, unmatched-event persistence, atomic commit, pruning | Sequential duplicate and unmatched-event tests pass. |
| 8–10 | Fixture format, replay CLI, invariant checker, Hypothesis state machine | Generated duplicate/reordered sequences shrink to readable counterexamples. |
| 11–12 | Two Automation processes against one PostgreSQL database | Same event raced through both processes creates exactly one run set. |
| 13–14 | Before/after report, latency measurement, design note, upstream-separated commits | Fresh clone reproduces the result from documented commands. |

### Four-to-six-week extension

1. Add provider fixtures for GitHub, Slack, and custom webhooks.
2. Record trigger-evaluation explanations for unmatched events.
3. Add a read endpoint for recent, unmatched, duplicate, and failed events.
4. Add a minimal Agent Canvas diagnostic surface only after the backend contract is accepted.
5. Simulate two Slack Socket Mode connections and multi-replica delivery.
6. Link `IntegrationEvent → AutomationRun → conversation_id → trace_id` after maintainer agreement.
7. Incorporate [#337](https://github.com/OpenHands/automation/issues/337) so the audit chain retains terminal output and exit code.
8. Add a Quint model only if stream supervision, reconnects, leases, and replica lifecycle produce state-space complexity beyond executable property tests.

### Test matrix

| Test | Expected result |
|---|---|
| Same GitHub delivery twice, sequentially | One event and one run set; both requests receive provider-success semantics. |
| Same delivery raced through two processes | Exactly one event and one run set. |
| Identical payload with different provider IDs | Two distinct events. |
| Events with no provider ID | Both are stored and not deduplicated against each other. |
| Valid event matching no Automation | Durable event with `matched_count = 0`; no runs. |
| Failure while inserting the run set | No committed event claiming successful processing and no partial run set. |
| Duplicated and reordered generated sequence | All invariants hold. |
| Pruning boundary | Storage remains bounded; retained records satisfy the configured policy. |
| Existing webhook fixtures | Existing response shape and behavior stay compatible. |
| Load test | No duplicate runs or transaction corruption under a documented concurrent workload. |

### Measurable success criteria

- Zero duplicate `AutomationRun` sets for stable event IDs under sequential and concurrent redelivery tests.
- All accepted unmatched events remain queryable.
- No test produces a success-marked event without its complete expected run set.
- The existing event-router suite passes unchanged after #358.
- At least 10,000 bounded generated event sequences run without invariant violation after the fix.
- The two-process race reproduces the pre-fix risk or demonstrates the missing guard and passes with the implementation.
- Before/after routing latency is published; any regression is quantified rather than omitted.
- No queue, worker, or new orchestration dependency is introduced in the MVP.
- At least one upstream-sized PR is ready for review.

### Demonstration script

1. Start PostgreSQL and two Automation service processes against the same database.
2. Configure one GitHub event Automation.
3. Send the same signed delivery ID concurrently to both processes.
4. Show the baseline behavior or missing dedupe guarantee.
5. Switch to the patched branch and repeat the identical race.
6. Print:

```text
accepted requests:          2
unique IntegrationEvents:   1
AutomationRun sets:         1
duplicate acknowledgments:  1
invariant violations:       0
```

7. Send a valid event whose filter matches nothing.
8. Show `matched_count = 0`, no run, and a durable event record.
9. Open the static replay report showing the original delivery, duplicate attempt, routing decision, transaction result, and first relevant invariant.

### Likely upstream contribution points

**PR A — #358**

- `openhands/automation/ingest.py`
- minimal `event_router.py` refactor
- direct `AcceptedEvent` tests
- unchanged existing router tests and response contract

**PR B — #361**

- `IntegrationEvent` ORM model
- Alembic migration
- provider event-ID extraction
- `accept_event()` transaction and duplicate semantics
- pruning
- PostgreSQL concurrency/integration tests

**Only if requested later**

- event-query API
- Canvas diagnostics
- trigger mismatch explanations
- cross-service correlation fields

### Risks and kill criteria

| Risk | Response |
|---|---|
| #358 or #361 is claimed by a maintainer-approved PR | Convert the companion harness into a conformance suite for that PR, or switch to #337 if no independent value remains. |
| Replay grows into a second Automation engine | Stop. Replay must call or model the accepted ingestion boundary, not duplicate trigger/execution logic. |
| Schema semantics are contested | Raise the smallest design question and keep experimental alternatives outside the upstream patch. |
| Visualization consumes MVP time | Remove it; retain JSON/JUnit and one static HTML timeline. |
| Formal modeling delays executable proof | Defer Quint until the real concurrency test is green. |
| No reproducible reliability property by day five | Narrow to #358-only behavior preservation or switch to #337. |
| Required correctness depends on private production services | Do not claim production validation; keep the result scoped to public code and local Postgres. |

---

## 6. Contribution sequence

1. **No outreach:** fork and reproduce locally.
2. **Implement #358 locally:** prove that the seam preserves behavior and tests.
3. **Create the two-process failure test:** establish evidence before proposing a schema change.
4. **Issue discussion on #358:** post the reproduction, test result, exact file boundary, and link to the design note. Ask only a genuinely unresolved question.
5. **Draft PR A:** pure refactor and direct ingestion tests; no dedupe or schema change.
6. **Rebase and validate:** existing suite, static checks, response compatibility, direct unit tests.
7. **Implement #361 on the accepted seam:** migration, event persistence, dedupe, atomicity, pruning, concurrency tests.
8. **Draft PR B:** keep the experimental replay UI and fault generator in the companion repository.
9. **Final validation:** PostgreSQL race, SQLite compatibility, Hypothesis sequences, latency, secret scanning, fresh-clone instructions.
10. **Technical contact only after evidence:** the artifact and PR create the reason for the conversation; do not ask about internships first.

---

## 7. Connection map

### Network-audit result

**[Unknown or inaccessible]** No verified first- or second-degree personal route to OpenHands was established in the authorized Gmail, Google Contacts, Google Drive, public GitHub, or public web sources checked. No LinkedIn connections export was available in the authorized file sources. No direct Brian Kulis–OpenHands or Brian Kulis–Graham Neubig relationship was established. Private message content is not copied into this public report.

The strongest paths are therefore artifact-mediated public technical paths.

| Target | Current role / signal | Technical relevance | Path | Evidence | Strength | Best channel | Appropriate first ask | Contact timing |
|---|---|---|---|---|---:|---|---|---|
| **Vasco Schiavo** | Member of Technical Staff, Agent R&D; author of #358–#363 | Exact Automation ingestion and reliability roadmap | Direct public OSS path; no personal connection verified | [OpenHands About](https://www.openhands.dev/about), [#363](https://github.com/OpenHands/automation/issues/363) | **5/5** | Existing issue or draft PR | One narrow event-identity or transaction-contract question backed by the race test | **After local reproduction** |
| **Ray Myers** | Chief Architect in the Quint Runtime API case study | Formal methods, runtime ownership, distributed lifecycle correctness | Direct public technical path | [Quint case study](https://www.openhands.dev/blog/quint-it-told-me-no) | **4/5** | Relevant public issue/discussion after evidence | Whether the post-MVP multi-replica transport properties warrant a Quint model | After #358-quality evidence |
| **Simon Rosenberg** | Senior Researcher; owner of #4365 | Multi-agent trace/session semantics and cross-layer observability | Direct public OSS path | [OpenHands About](https://www.openhands.dev/about), [#4365](https://github.com/OpenHands/software-agent-sdk/issues/4365) | **4/5** | GitHub | Desired identity relation across IntegrationEvent, run, conversation, and trace | After MVP |
| **Xingyao Wang** | Chief AI Officer and SDK/research contributor | Agent architecture, verification, trajectory evaluation | Direct public technical path | [OpenHands About](https://www.openhands.dev/about), [Verification Stack](https://www.openhands.dev/blog/20260506-the-verification-stack) | **4/5** | GitHub technical discussion | How durable event/run evidence should enter agent evaluation | After an upstream patch exists |
| **Graham Neubig** | Chief Scientist | Research direction, evaluation, multi-repo/context roadmap | Direct public technical path | [OpenHands About](https://www.openhands.dev/about), [#7752](https://github.com/OpenHands/OpenHands/issues/7752) | **3/5** | GitHub, only when design touches product/research semantics | What event-diagnostic evidence is most useful to users and evaluations | After core backend proof |
| **Joe Pelletier** | Head of Product and Operations | Agent Canvas dashboard, integrations, operator workflows | Direct public product/OSS path | [OpenHands About](https://www.openhands.dev/about), [#9414](https://github.com/OpenHands/OpenHands/issues/9414), [#15769](https://github.com/OpenHands/OpenHands/issues/15769) | **3/5** | Relevant GitHub issue | How unmatched/duplicate event evidence should surface in Canvas | After backend contract is stable |
| **Professor Brian Kulis** | BU research advisor | Experimental rigor and stateful-testing methodology, not verified OpenHands access | No OpenHands route established | BU relationship is verified in Giacomo’s CV; connector role is not | **1/5** | None for introduction purposes | Do not request an introduction unless he independently confirms a relevant relationship | Not part of initial sequence |

---

## 8. Three recommended people to approach first

### 1. Vasco Schiavo

**Exact technical question:**

> For #361, I reproduced duplicate run creation risk under concurrent redelivery and have #358 working as a transport-neutral seam. Before I finalize the migration, do you want `provider_event_id` uniqueness to follow the issue literally at `(source, provider_event_id)`, or should the invariant be organization-scoped? I can provide the two-process PostgreSQL race test for either contract.

### 2. Ray Myers

**Exact technical question:**

> I’m using Hypothesis stateful tests plus real PostgreSQL concurrency to specify the `accept_event()` and deduplication invariants because the first failure boundary is transactional rather than Kubernetes lifecycle. Would you keep formal modeling at that executable boundary, or is there a property—especially once multi-replica Socket Mode lands—that you would also want expressed in Quint?

### 3. Simon Rosenberg

**Exact technical question:**

> For a durable Automation event record, what identifier relationship should be preserved across `IntegrationEvent → AutomationRun → conversation → trace` so that nested-agent work and run-level cost or latency can be attributed without creating another ambiguous session boundary?

These questions should not be sent until the corresponding evidence exists.

---

## 9. Giacomo’s company-specific positioning

### Positioning statement

> **I build the infrastructure around agents that turns a working demo into a system you can inspect, evaluate, and operate.**

### Concrete evidence

- Giacomo’s `cv` repository states that he owned an internal AI-agent runtime, enterprise chat application, and prompt/evaluation platform from architecture through deployment. It records a typed LangGraph/MLflow execution harness with Pydantic contracts, policy-controlled tools, governed SQL, citation-backed retrieval, request-scoped context, evidence review, and tracing. Source: [`resume/content/devtools-agents.tex`](https://github.com/JJCAPPE/cv/blob/main/resume/content/devtools-agents.tex).
- The same CV records developer and evaluator workflows with React, FastAPI, SSE streaming, PostgreSQL, versioned prompts, side-by-side benchmarks, and Databricks Asset Bundles. This directly supports the selected project’s API, persistence, tracing, evaluation, and deployment requirements.
- His pose-embedding work uses configurable experiments, robustness testing, Recall@K and mAP, and a tested PyTorch contextual-loss implementation with finite-output and gradient checks. Source: [`pose-embedding/contextual-similarity-study-pack`](https://github.com/JJCAPPE/pose-embedding/blob/main/contextual-similarity-study-pack/README.md).
- His rowing repository turns a research pipeline into an operable package with CLI/TUI orchestration, provenance, match overrides, reports, tests, and portable model bundles rather than a notebook-only experiment. Source: [`rowing-dynamics-analysis`](https://github.com/JJCAPPE/rowing-dynamics-analysis/blob/main/README.md).
- His Tauri/React/Rust inventory rewrite includes quantified size, memory, startup, and search-latency improvements, demonstrating performance and production-software credibility. Source: the same CV file.

### OpenHands-specific interpretation

- Governed tool execution maps to Automation effects and enterprise policy boundaries.
- Request-scoped context and typed contracts map to provider events, run identity, and replay schemas.
- MLflow tracing and evaluation map to durable event-to-run provenance and fault diagnosis.
- Robustness experiments under temporal corruption map directly to delayed, duplicated, missing, and reordered event delivery.
- Full-stack delivery supports both the backend implementation and a restrained diagnostic surface.

---

## 10. Proposed repository and README outline

### Repository name

`JJCAPPE/openhands-automation-event-ledger`

Avoid a name such as `openhands-reliability-framework`; it would overstate the scope and imply a competing platform.

### README outline

1. Problem and current OpenHands issue mapping
2. Reproduced redelivery behavior
3. Reliability invariants
4. Architecture
5. AcceptedEvent and IntegrationEvent contracts
6. Local PostgreSQL setup
7. Sequential and concurrent duplicate tests
8. Unmatched-event replay
9. Property-based fault model
10. Static replay report
11. Results and latency measurements
12. Upstream patch map
13. Security, fixture sanitization, and secret handling
14. Known limitations
15. Deliberate non-goals

### 150-word abstract

OpenHands Automation Event Ledger is an executable reliability study and upstream implementation for event-driven OpenHands Automations. It targets the ingestion boundary defined in OpenHands/automation issues #358 and #361: separating authenticated event acquisition from routing, then persisting accepted integration events so provider redeliveries cannot create duplicate agent runs. The project models each accepted event with durable provider identity, routing outcome, and run linkage, and tests the resulting invariants against real PostgreSQL transaction semantics. A Hypothesis state-machine harness generates duplicated, reordered, missing-ID, unmatched, and concurrently delivered events, while multi-process fault tests verify that identical provider events create runs at most once. A deterministic replay report reconstructs routing decisions from sanitized fixtures and exposes duplicate or unmatched-event histories. The project is intentionally narrower than a new workflow engine or coding-agent wrapper: its goal is to make an existing OpenHands execution path auditable, reproducible, and safe under redelivery and multi-replica event ingestion at scale.

---

## 11. Source appendix

The detailed claim-level audit is in [`source-audit.md`](./source-audit.md). The following sources carry the main recommendation.

### OpenHands architecture and strategy

- **Current** — [OpenHands/Agent Canvas README](https://github.com/OpenHands/OpenHands/blob/main/README.md): flagship Canvas purpose, ACP agents, local/remote/cloud backends, Automations, Agent Server architecture.
- **Current** — [Agent Canvas architecture](https://github.com/OpenHands/OpenHands/blob/main/docs/architecture.md): system boundaries, frontend modules, Agent Server and Automation Server roles.
- **11 May 2026** — [Agent Canvas Initiative #14374](https://github.com/OpenHands/OpenHands/issues/14374): strategic move to Agent Canvas, open-source Automations, SDK foundation, and enterprise control plane.
- **16 June 2026** — [Introducing Agent Canvas](https://www.openhands.dev/blog/introducing-agent-canvas): product launch and agent/automation workflow framing.
- **Current** — [Automation README](https://github.com/OpenHands/automation/blob/main/README.md): beta service scope and implementation stack.
- **Current** — [Software Agent SDK README](https://github.com/OpenHands/software-agent-sdk/blob/main/README.md): agents, tools, workspaces, multiple-agent tasks, Agent Server, MCP, skills, and examples.

### Selected current problem

- **21 August 2026** — [Automation #358](https://github.com/OpenHands/automation/issues/358): transport-neutral `accept_event()` extraction and behavior-preservation criteria.
- **21 August 2026** — [Automation #361](https://github.com/OpenHands/automation/issues/361): persistent incoming-event ledger, provider-event deduplication, unmatched-event visibility, atomicity, and pruning.
- **21 August 2026** — [Automation #363](https://github.com/OpenHands/automation/issues/363): complete five-phase webhook/Socket Mode ingestion roadmap.
- **Current at cutoff** — [`event_router.py`](https://github.com/OpenHands/automation/blob/main/openhands/automation/event_router.py): fused verification, parsing, matching, run creation, commit, and replay-risk comment.

### Alternatives and adjacent problems

- **13 August 2026** — [Automation #337](https://github.com/OpenHands/automation/issues/337): durable run history currently depends on ephemeral Agent Server bash events.
- **10 July 2026** — [SDK #4077](https://github.com/OpenHands/software-agent-sdk/issues/4077): streaming retry, ordering, timeout, and backpressure defects.
- **4 August 2026** — [SDK #4365](https://github.com/OpenHands/software-agent-sdk/issues/4365): subagent trace/session identity ambiguity.
- **6 June 2026** — [SDK #3549](https://github.com/OpenHands/software-agent-sdk/issues/3549): real frozen LLM fixtures replaced by synthetic responses.
- **7 July 2026** — [Quint Runtime API case study](https://www.openhands.dev/blog/quint-it-told-me-no): formal modeling of the duplicate-pod lifecycle race.
- **22 June 2026** — [Verification Stack](https://www.openhands.dev/blog/20260506-the-verification-stack): critic, code review, executable QA, and `/iterate`.
- **18 June 2026** — [ACP support](https://www.openhands.dev/blog/use-any-coding-agent-in-openhands-with-acp): ACP in Canvas and the SDK.
- **29 January 2026** — [OpenHands Index](https://www.openhands.dev/blog/openhands-index): multi-category evaluation with cost and runtime.

### Required issue and PR validation

- [#7752](https://github.com/OpenHands/OpenHands/issues/7752), [#9414](https://github.com/OpenHands/OpenHands/issues/9414), [#15643](https://github.com/OpenHands/OpenHands/issues/15643), [#15623](https://github.com/OpenHands/OpenHands/issues/15623), [#15769](https://github.com/OpenHands/OpenHands/issues/15769), and [#16430](https://github.com/OpenHands/OpenHands/issues/16430) were all re-read on 22 August 2026.
- Superseding or competing work checked: [#16145](https://github.com/OpenHands/OpenHands/pull/16145), [#16114](https://github.com/OpenHands/OpenHands/pull/16114), [OpenHands/extensions #384](https://github.com/OpenHands/extensions/pull/384), and [#16487](https://github.com/OpenHands/OpenHands/pull/16487).

### Candidate evidence

- [JJCAPPE/cv — devtools and agents résumé](https://github.com/JJCAPPE/cv/blob/main/resume/content/devtools-agents.tex)
- [JJCAPPE/pose-embedding — contextual-similarity study pack](https://github.com/JJCAPPE/pose-embedding/blob/main/contextual-similarity-study-pack/README.md)
- [JJCAPPE/rowing-dynamics-analysis](https://github.com/JJCAPPE/rowing-dynamics-analysis/blob/main/README.md)

### Network evidence limitation

**[Unknown or inaccessible]** Authorized private sources were searched for OpenHands personnel, company names, relevant investors, and a Brian Kulis route. No verified warm path was established. The absence of a result is not proof that no relationship exists; it means no relationship should be represented as established in an outreach plan.

---

## Final decision

The artifact should not be presented as a general OpenHands reliability framework. It should be presented as a precise contribution to a current, documented boundary:

> **authenticated provider event → durable event identity → at-most-once run-set creation under redelivery → auditable routing outcome**

That gives Giacomo a technically legitimate later introduction:

> I reproduced a current OpenHands Automation reliability gap, implemented the transport-neutral ingestion seam and durable event ledger, tested concurrent redelivery against shared PostgreSQL, and produced a minimized replay fixture with failing-before/passing-after evidence.
