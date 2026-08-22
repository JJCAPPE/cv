# Axiomatic AI scientific-agent project and connection research brief

**Candidate:** Giacomo Cappelletto  
**Evidence cutoff:** 22 August 2026  
**Selected artifact:** **ReproGate — a provenance-gated, fault-injected paper-to-simulation reliability benchmark**

---

## Executive decision

Giacomo should build **ReproGate**, a public research system that takes an engineering paper, extracts a typed computational recipe with page-level provenance, compiles and runs an executable model, and validates the output against quantitative targets kept behind a separate information boundary. The system is then evaluated under missing pages, malformed equations, conflicting values, oversized documents, transient provider failures, incomplete figures, corrupted checkpoints, and validation-target leakage.

This is the research-grade narrowing of the original **Verified Paper-to-Notebook Reliability Workbench** idea. The generated Marimo or Jupyter notebook is a reproducibility artifact, not the principal contribution. The contribution is a falsifiable assurance protocol for scientific agents:

> Can a document-driven scientific agent produce an executable result that is attributable, resumable, independently checked, protected from target leakage, and exactly replayable under realistic faults?

The recommended first domain is the canonical bicycle-dynamics benchmark from Meijaard et al. It is technically substantive, CPU-feasible, multimodal, parameter-rich, supported by independent implementations, and cleanly separates construction evidence from held-out validation evidence.

### Evidence notation

- **[V] Verified public evidence**
- **[A] Authorized private-account evidence**
- **[I] Inference supported by multiple signals**
- **[S] Speculation requiring validation**
- **[N] Information not publicly knowable**

---

# 1. Why this is the correct artifact for Giacomo

Giacomo's strongest evidence is not that he has used an agent framework. It is that he repeatedly builds systems in which uncertain inputs are converted into typed, observable, executable workflows and then tested against external evidence:

- His current BU research evaluates fixed-length motion embeddings under noise, occlusion, temporal jitter, and viewpoint shift.
- At Banca Mediolanum he owned architecture and implementation of an internal LangGraph/MLflow agent platform with governed dynamic SQL, citation-backed retrieval, request-scoped context, typed Pydantic contracts, evidence review, prompt versioning, evaluation, and end-to-end traces.
- His rowing work transformed monocular video through pose extraction, 3D lifting, signal alignment, stroke segmentation, sequence modeling, and comparison against instrumented force telemetry.
- The rowing repository already exposes the habits ReproGate requires: feature contracts, masks, quality-control metadata, provenance, leakage warnings, deterministic model bundles, reports, and automated tests.

**[I]** ReproGate therefore looks like a credible continuation of demonstrated work rather than an opportunistic Axiomatic-themed demo.

---

# 2. Reconstructed Axiomatic technical program

## 2.1 Program-level model

Axiomatic's public work supports the following reconstruction:

```text
scientific question
        │
        ▼
literature and data discovery
        │
        ▼
multimodal document understanding
text · equations · tables · figures
        │
        ├────────────────────┐
        ▼                    ▼
construction recipe      validation targets
parameters               expected metrics
geometry                 reported values
assumptions              tolerances
        │                    │
        ▼                    │
typed computational model   │
        │                    │
        ▼                    │
domain-specific tools       │
simulation · fitting · proving · optimization
        │                    │
        ▼                    │
verification gates          │
        │                    │
        └──────────┬─────────┘
                   ▼
independent validation
                   │
                   ▼
artifacts, provenance, evaluation, memory
```

**[I]** The distinguishing technical concern is not merely tool orchestration. It is converting uncertain scientific evidence into executable objects while preserving assurance boundaries.

## 2.2 Lemma

**[V]** Axiomatic publicly positions Lemma as a scientific and engineering co-explorer. Public materials show persistent workspaces and generated artifacts such as Python, Markdown, extracted data, and interactive Marimo notebooks, with stated application areas spanning photonics, electronics, thermal systems, mechanics, and signal analysis.

Primary sources:

- [Axiomatic AI](https://axiomatic-ai.com/)
- [Lemma product page](https://axiomatic-ai.com/products/lemma/)

**[N]** Lemma's private agent graph, prompts, routing policy, memory implementation, production error rates, and customer workloads are not publicly knowable.

## 2.3 Literature-to-digital-twin workflow

Axiomatic's public grating-coupler case study is the clearest description of the literature-to-computation program. It demonstrates a workflow that:

1. interprets a paper's design and fabrication method;
2. extracts values needed to reconstruct the device;
3. separately extracts reported performance values for validation;
4. generates geometry;
5. runs an electromagnetic simulation using Tidy3D FDTD while the source work used a different numerical method;
6. computes engineering KPIs;
7. compares simulated outputs with reported targets;
8. rejects or qualifies results outside tolerance;
9. produces a report describing model, assumptions, simulation, and comparison.

Source: [Axiomatic — grating-coupler digital twin](https://axiomatic-ai.com/blog/grating-coupler-digital-twin)

Associated public authors: **Maosheng Yang, Flemming Holtorf, and Frank Schäfer**.

### Independence caveat

**[V]** A different numerical solver reduces implementation coupling.  
**[I]** It does not make validation fully independent when both simulations share geometry, materials, boundary conditions, or values derived from the same paper.

ReproGate should therefore grade validation evidence:

- **Grade A:** independent derivation plus different solver or experimental data;
- **Grade B:** independent implementation or numerical formulation, but shared physical assumptions;
- **Grade C:** same derivation or implementation family, suitable only as a regression check.

A Grade C numerical match can be a **qualified pass**, never an unqualified pass.

## 2.4 Public scientific tool fabric

At immutable `ax-mcp` revision [`ef53332`](https://github.com/Axiomatic-AI/ax-mcp/tree/ef53332b866b29b6d5d7a3dc6d77698e42334c24), Axiomatic publicly exposes MCP servers for:

- PDF parsing and annotation;
- equation derivation and checking;
- plot digitization;
- model fitting;
- numerical optimization and ODE work;
- paper search and knowledge-base retrieval;
- photonic circuit work;
- Tidy3D simulations;
- PDE solver verification.

The main inventory is documented in the [immutable README](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/README.md).

### AxTidy3D

**[V]** AxTidy3D generates executable electromagnetic-simulation code, executes local work, supports repair through previous-code and previous-error inputs, and uses an estimate-then-confirm state transition before paid cloud simulation. See the [immutable AxTidy3D README](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/tidy3d/README.md).

This shows that scientific-agent execution is expected to expose explicit state, cost, and continuation rather than be a single opaque call.

### AxModelFitter

**[V]** The current AxModelFitter generates executable JAX fitting code and runs it in a sandbox with JAX, Diffrax, Equinox, and Axiomatic's fitting library. Its examples include uncertainty estimation, ODE fitting, resonator fitting, and model comparison. See the [immutable README](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/modelfitter/README.md).

### AxEquationExplorer

**[V]** The equation tooling derives or checks expressions from papers and emits SymPy-compatible Python plus derivation context. Public documentation still notes a single-paper limitation. See the [equation server documentation](https://github.com/Axiomatic-AI/ax-mcp/tree/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/equations).

### AxPDE

**[V]** The `ax-mcp` head audited for this brief added PDE solver verification using the method of manufactured solutions. This is another direct signal that Axiomatic treats generated scientific code as an object that requires an external verification procedure, not only successful execution.

## 2.5 AxProverBase

**[V]** AxProverBase is a modular Lean 4 proving system with proposer, compiler/builder, reviewer, iterative memory processing, metrics aggregation, and output summarization. At immutable revision [`06dfadc`](https://github.com/Axiomatic-AI/ax-prover-base/tree/06dfadc9ab439755af5efcfe0add95bfef2733c7), the graph is explicit in [`agent.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/prover/agent.py).

```text
proposer
   ↓
builder / Lean compiler
   ↓
reviewer
   ↓
memory processor
   └──────────────→ proposer
   ↓
metrics and output summary
```

The builder tests a proposal in a temporary file, invokes Lean, checks remaining `sorry` declarations and prohibited proof behavior, and returns structured feedback. The reviewer separately examines the proposal before it is applied.

Transferable principles:

1. a generated object is a proposal, not a result;
2. deterministic external systems enforce hard constraints;
3. repair receives transformed feedback rather than an unbounded raw transcript;
4. state and metrics persist across iterations.

Public authors associated with AxProverBase include **Borja Requena Pozo, Austin Letson, Krystian Nowakowski, Izan Beltran Ferreiro, and Leopoldo Sarra**.

## 2.6 AxProver MCP and GitHub workflow

**[V]** A public MCP server exposes asynchronous Lean build and proving jobs with job IDs and status polling. See [`Axiomatic-AI/ax-prover-base-mcp`](https://github.com/Axiomatic-AI/ax-prover-base-mcp).

**[I]** Addressable jobs and polling are relevant to long scientific workflows because execution should survive request boundaries and client restarts.

## 2.7 AxDafny

**[V]** AxDafny uses verifier-guided generation and repair over Dafny. The reported benchmark shows that formally verified programs can still become operationally unusable after compilation through timeout or memory exhaustion.

Sources:

- [Axiomatic AxDafny post](https://axiomatic-ai.com/blog/axdafny/)
- [AxDafny paper](https://arxiv.org/abs/2606.32007)

Public authors: **Benjamin Breen, Austin Letson, Borja Requena Pozo, and Leopoldo Sarra**.

The transferable conclusion is precise:

> formal correctness, executable behavior, resource efficiency, and scientific validity require separate gates.

## 2.8 SorryDB

**[V]** SorryDB builds a dynamic theorem-proving benchmark from unresolved `sorry` declarations in real Lean repositories and preserves reproducible project environments. It addresses static-benchmark saturation, synthetic task construction, stale repository state, and missing dependencies.

Sources:

- [Axiomatic SorryDB post](https://axiomatic-ai.com/blog/sorrydb/)
- [SorryDB code](https://github.com/SorryDB/SorryDB)
- [SorryDB data](https://github.com/SorryDB/sorrydb-data)

Publicly listed authors include **Austin Letson, Leopoldo Sarra, Auguste Poiroux, Oliver Dressler, Paul Lezeau, Dhyan Aranha, Frederick Pu, Aaron Hill, Miguel Corredera Hidalgo, Julian Berman, George Tsoukalas, and Lenny Taelman**.

Methodological implication for ReproGate:

- benchmark inputs need immutable hashes;
- environments need exact snapshots;
- faults need deterministic manifests;
- held-out cases should evolve or remain contamination-resistant;
- success should not rely on memorizing a fixed final notebook.

## 2.9 Skill-Synthesizer

**[V]** Skill-Synthesizer studies query-aware long-term scientific-agent memory. It retrieves passages across prior skills, synthesizes a task-specific skill, and uses executable Python as a verification signal.

Sources:

- [Axiomatic Skill-Synthesizer post](https://axiomatic-ai.com/blog/skill-synthesizer/)
- [OpenReview paper record](https://openreview.net/forum?id=T3WDCimC5K)

Public authors: **Jacob McCarran, Rajsuryan Singh, Carlos Arribalzaga Jové, Khaled Ahmed, and Marco Del Tredici**.

**Access caveat:** automated access to the OpenReview PDF was not consistently reliable during the audit. The company post and the OpenReview record were used for identity and scope; implementation details not visible in those sources are not asserted.

**[N]** A public Axiomatic implementation repository for Skill-Synthesizer was not located.

## 2.10 AgentOptics

**[V]** AgentOptics presents an MCP-oriented optical-engineering agent framework with standardized tools and a task benchmark covering interpretation, role awareness, multi-step execution, linguistic robustness, and error handling.

Source: [AgentOptics on arXiv](https://arxiv.org/abs/2602.20144)

Public authors include **Zehao Wang, Mingzhe Han, Wei Cheng, Yue-Kai Huang, Philip Ji, Denton Wu, Mahdi Safari, Flemming Holtorf, Kenaish AlQubaisi, Norbert Linke, Danyang Zhuo, Yiran Chen, Ting Wang, Dirk Englund, and Tingjun Chen**.

**[I]** This is evidence that evaluation harnesses and closed-loop engineering tasks are part of Axiomatic's technical program, not peripheral product testing.

## 2.11 Enterprise and hiring signals

**[V]** Axiomatic announced an $18 million seed round in March 2026, bringing publicly disclosed funding to $25 million, with The Engine Ventures leading. The announcement tied the capital to enterprise deployment and technical integration.

- [Funding announcement](https://www.businesswire.com/news/home/20260309009285/en/Axiomatic-AI-Raises-%2418M-to-Build-the-Intelligence-Infrastructure-for-Verified-Science-Engineering)
- [The Engine Ventures company page](https://engineventures.com/companies/axiomatic-ai)

Current or recently listed roles at the audit date emphasized:

- formal and informal validation;
- systematic benchmarks and data curation;
- scientific-output verification;
- model routing and provider fallback;
- persistence and observability;
- SLOs and durable fixes;
- prompt evaluation and regression tests.

Primary listings audited:

- [Research Scientist — Scientific Reasoning](https://job-boards.eu.greenhouse.io/axiomaticai/jobs/4844948101)
- [Research Internship](https://job-boards.eu.greenhouse.io/axiomaticai/jobs/4845060101)
- [Staff Backend Engineer](https://job-boards.eu.greenhouse.io/axiomaticai/jobs/4885093101)

**[I]** An artifact combining scientific validity with production reliability would be legible to multiple Axiomatic teams.

---

# 3. Researcher and engineer map

## 3.1 Company and technical leadership

| Person | Public role or association | Technical relevance |
|---|---|---|
| Dirk Englund | Axiomatic cofounder and chief scientific officer; MIT EECS professor | Photonics, quantum engineering, scientific-agent direction, AgentOptics, and reporter of public MCP reliability issues |
| Leopoldo Sarra | Head of AI Research | AxProverBase, AxDafny, SorryDB, formal reasoning, agent evaluation |
| Kavitha Buddharaju | Head of Photonics | Photonic design workflows and domain validation |
| Jake Taylor | Cofounder and CEO | Overall technical and company strategy; not the recommended initial contact |
| Joyce Poon | Publicly listed advisor | Integrated photonics and a possible Boston photonics-community bridge |
| Frank Koppens | Publicly listed advisor and AxProver coauthor | Physics, scientific AI, formal reasoning |
| Marin Soljačić | Publicly listed advisor | Photonics and computational science |

Source: [Axiomatic team page](https://axiomatic-ai.com/team/)

## 3.2 Literature-to-model and engineering-agent work

| Work | Publicly associated researchers |
|---|---|
| Grating-coupler digital twin | Maosheng Yang, Flemming Holtorf, Frank Schäfer |
| AgentOptics | Zehao Wang, Mingzhe Han, Wei Cheng, Yue-Kai Huang, Philip Ji, Denton Wu, Mahdi Safari, Flemming Holtorf, Kenaish AlQubaisi, Norbert Linke, Danyang Zhuo, Yiran Chen, Ting Wang, Dirk Englund, Tingjun Chen |
| Public scientific MCPs | Public repository history includes Frank Schäfer, Borja Requena, Adrián Trejo, Flemming Holtorf, and other Axiomatic contributors; precise internal service ownership is not public |

## 3.3 Formal methods, memory, and benchmarks

| Work | Authors or associated researchers |
|---|---|
| AxProverBase | Borja Requena Pozo, Austin Letson, Krystian Nowakowski, Izan Beltran Ferreiro, Leopoldo Sarra |
| AxDafny | Benjamin Breen, Austin Letson, Borja Requena Pozo, Leopoldo Sarra |
| SorryDB | Austin Letson, Leopoldo Sarra, Auguste Poiroux, Oliver Dressler, Paul Lezeau, Dhyan Aranha, Frederick Pu, Aaron Hill, Miguel Corredera Hidalgo, Julian Berman, George Tsoukalas, Lenny Taelman |
| Skill-Synthesizer | Jacob McCarran, Rajsuryan Singh, Carlos Arribalzaga Jové, Khaled Ahmed, Marco Del Tredici |
| Broader AxProver work | Benjamin Breen, Marco Del Tredici, Jacob McCarran, Javier Aspuru Mijares, Weichen Winston Yin, Kfir Sulimany, Jacob M. Taylor, Frank H. L. Koppens, Dirk Englund |

---

# 4. Public failure surfaces

The issue status was re-fetched on 22 August 2026. An issue remaining open is not proof that it reproduces on the production service today. Current code was inspected to distinguish stale tickets from unresolved architectural classes.

## 4.1 `Axiomatic-AI/ax-mcp` issue #108 — Mistral OCR authentication failure

- **State:** **[V] open** at audit time; no issue comments.
- **Report:** Mistral-backed PDF parsing returned HTTP 401 and downstream PDF tools surfaced a server error.
- **Current code:** [`pdf_to_markdown.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/shared/documents/pdf_to_markdown.py) still selects `method=mistral` directly and exposes no page range, parser fallback, checkpoint, or continuation parameter.
- **Reproduction status:** not independently reproduced against Axiomatic's production API; the public code path is consistent with the architectural concern.
- **Broader class:** credential and capability discovery, fallback policy, degraded operation, explicit error classification, resumable page processing.
- **External contribution value:** medium after a clean current reproduction; a parser-adapter contract and tests would be more useful than a credential patch.

Issue: [#108](https://github.com/Axiomatic-AI/ax-mcp/issues/108)

## 4.2 Issue #95 — large-document and approximately 25,000-token failure

- **State:** **[V] open**; no issue comments.
- **Report:** long, image-heavy documents truncate or fail without clear continuation guidance.
- **Current code:** the public parser sends the complete file as a single unit and the public interface does not expose page range or continuation state.
- **Unknown:** the production backend may segment internally; public code does not establish that either way.
- **Broader class:** document decomposition, token estimation, partial-result semantics, failure localization, checkpoint continuation.
- **External contribution value:** high as an independent benchmark and moderate as a direct PR.

Issue: [#95](https://github.com/Axiomatic-AI/ax-mcp/issues/95)

## 4.3 Issue #94 — intermittent plot extraction failure

- **State:** **[V] open**; no issue comments.
- **Report:** roughly one in five identical calls failed and retry often succeeded.
- **Current code:** the plot tool makes one upstream request and has no visible retry. It also uses `random.sample` when more points exist than the response limit, without a visible deterministic seed. See [`server.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/plots/server.py).
- **Broader classes:** transient dependency failure and deterministic replay.
- **External contribution value:** high for a small focused PR: typed retry classification, deterministic sampling, request IDs, and golden-image tests. Too narrow for Giacomo's main artifact.

Issue: [#94](https://github.com/Axiomatic-AI/ax-mcp/issues/94)

## 4.4 Issue #64 — upstream quota and error propagation

- **State:** **[V] open**; no issue comments.
- **Report:** an upstream OpenAI 429 became a 500 visible to equation and plot tools.
- **Current code:** the shared MCP client uses a long fixed timeout and `raise_for_status`, but no visible retry, circuit breaker, request budget, or structured status taxonomy. See [`api_client.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/shared/api_client.py).
- **Related fix elsewhere:** Axiomatic's generated Python SDK documents retries for 408, 429, and 5xx, so a retry pattern exists but is not uniform across public artifacts.
- **Broader class:** provider-independent error taxonomy, quota-aware routing, idempotency, persistence, terminal-state clarity.

Issue: [#64](https://github.com/Axiomatic-AI/ax-mcp/issues/64)

## 4.5 Issue #53 — restore AxModelFitter safely

- **State:** **[V] open but stale**.
- **History:** AxModelFitter was temporarily removed over a security concern and later restored.
- **Current state:** the current server documents sandboxed JAX execution and is present in the MCP inventory.
- **Conclusion:** the requested feature exists despite the issue remaining open.
- **External contribution value:** low unless a new, reproducible sandbox or input-validation defect is demonstrated.

Issue: [#53](https://github.com/Axiomatic-AI/ax-mcp/issues/53)  
Removal PR: [#26](https://github.com/Axiomatic-AI/ax-mcp/pull/26)  
Restoration PR: [#57](https://github.com/Axiomatic-AI/ax-mcp/pull/57)

## 4.6 Issue #40 — missing document-tool examples

- **State:** **[V] open**.
- **Current state:** the document README now contains basic usage and limitations, partially addressing the report.
- **Remaining gap:** no substantial example covers long-document continuation, fallback, malformed pages, mixed modalities, or explicit recovery behavior.
- **External contribution value:** medium as part of a tested reliability suite; low as a standalone portfolio project.

Issue: [#40](https://github.com/Axiomatic-AI/ax-mcp/issues/40)  
Current documentation: [`documents/README.md`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/documents/README.md)

## 4.7 `Axiomatic-AI/ax-prover-base` issue #2 — incomplete provider calls

- **State:** **[V] open**.
- **Report:** incomplete Anthropic calls caused proving runs not to finish.
- **Current code:** a provider-neutral `LLMClient` now applies configurable retry to structured-output and tool-bound calls. The default configuration permits a very high attempt count with bounded exponential jitter.
- **Assessment:** **[I] likely partially addressed**, but no maintainer closure or public reproduction note proves resolution.
- **Residual concern:** high retry counts can hide provider degradation and create excessive latency or cost unless combined with deadlines, budgets, checkpoints, and explicit terminal state.

Issue: [#2](https://github.com/Axiomatic-AI/ax-prover-base/issues/2)  
Current retry client: [`utils/llm.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/utils/llm.py)  
Current retry defaults: [`config.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/config.py)

## 4.8 Issue #9 — warnings dominate context

- **State:** **[V] open**.
- **Current code:** the builder calls Lean with `show_warnings=False`; the build utility removes common warnings, notes, traces, and unused-variable messages.
- **Assessment:** **[I] the immediate warning-flood problem appears addressed in public code**.
- **Residual problem:** oversized build output is still reduced by retaining the beginning and end using a character bound. A decisive middle error can be omitted.
- **External contribution value:** a semantic obligation-preserving compressor is worthwhile, but it is a better ReproGate ablation than the main project.

Issue: [#9](https://github.com/Axiomatic-AI/ax-prover-base/issues/9)  
Warning handling: [`utils/build.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/utils/build.py)  
Builder and first/last truncation: [`prover/agent.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/prover/agent.py)

---

# 5. Ranked current problem classes

The score is an analyst judgment, not a disclosed Axiomatic priority. Weighting: 35% direct public evidence, 25% centrality to the technical program, 20% usefulness of an external artifact, and 20% fit with Giacomo.

| Rank | Problem class | Score / 100 | Evidence-based assessment |
|---:|---|---:|---|
| 1 | Scientific-workflow resumption and explicit terminal state | 93 | Repeatedly supported by document limits, asynchronous simulation, provider failures, AxProver behavior, and backend persistence requirements |
| 2 | Document-ingestion robustness | 91 | Directly visible in issues #108 and #95 and the current monolithic parser interface |
| 3 | Validation-target extraction and leakage prevention | 90 | Central to the public digital-twin method; no public benchmark was found that measures it |
| 4 | Transient dependency failure and provider error propagation | 87 | Issues #94, #64, and #2 plus infrastructure hiring signals |
| 5 | Provenance loss across extraction, modeling, and validation | 85 | Core to trustworthy engineering; only partly represented in current public contracts |
| 6 | Simulation reproducibility and deterministic replay | 83 | Central to digital twins and benchmarks; public plot sampling exposes a concrete deterministic-replay defect |
| 7 | Large-context handling | 79 | Explicit in issue #95 and AxProver output compaction |
| 8 | Equation, table, and figure extraction | 77 | Existing tools address these modalities, but semantic and reliability failures remain |
| 9 | Formal-verification efficiency | 75 | Directly established by AxDafny's runtime results |
| 10 | Compiler, solver, and tool-output context compression | 72 | Warning suppression exists; causal compression remains crude |
| 11 | Benchmark contamination and staleness | 68 | Strategically important, though SorryDB already provides a strong solution pattern |
| 12 | Long-term agent-memory quality | 65 | Active research area, but fewer observable production failure surfaces make it a weaker first artifact |

---

# 6. Project options and scoring

Scores use a 1–10 scale. Total is the unweighted sum across all requested dimensions.

| Candidate | Direct relevance | Originality | Scientific validity | OSS path | Data and solvers | Two-week feasibility | Six-week feasibility | Publishability | Giacomo fit | Attention likelihood | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **ReproGate: provenance-gated paper-to-simulation benchmark** | 10 | 9 | 9 | 9 | 10 | 8 | 9 | 9 | 10 | 9 | **92** |
| Resource-Aware AxDafny Evaluation | 9 | 9 | 9 | 10 | 9 | 6 | 8 | 9 | 6 | 8 | 83 |
| Scientific-Agent Context Reliability Layer | 8 | 8 | 8 | 10 | 10 | 9 | 8 | 7 | 10 | 8 | 86 |
| Validation Firewall Benchmark | 10 | 10 | 9 | 9 | 8 | 8 | 9 | 9 | 9 | 9 | 90 |

## 6.1 Alternative A — Resource-Aware AxDafny Evaluation

### Proposition

Classify generated programs into:

1. formally verified and efficient;
2. formally verified but operationally unusable;
3. functionally correct but verifier-rejected;
4. neither correct nor verifiable.

Measure runtime, peak memory, asymptotic probes, verifier cost, and feedback effectiveness.

### Strengths

- directly motivated by AxDafny;
- clear formal-methods question;
- public benchmark structure;
- potentially publishable.

### Weaknesses

- Giacomo does not yet demonstrate deep Dafny, symbolic execution, static analysis, or complexity-analysis work;
- a two-week version would likely be toolchain reproduction rather than original science;
- a weak version would appear to be benchmark plumbing around Axiomatic's contribution.

### Decision

Not selected. It becomes credible after Giacomo gains formal-methods depth.

## 6.2 Alternative B — Scientific-Agent Context Reliability Layer

### Proposition

Transform compiler, solver, parser, and tool output into a bounded representation preserving actionable errors, dependencies, unresolved obligations, warnings, provenance, and retry state.

### Strengths

- direct relation to AxProver issue #9 and large-document handling;
- excellent fit with Giacomo's observability and agent background;
- highly reusable;
- feasible in two weeks.

### Weaknesses

- scientific validity is harder to establish;
- evaluation can become subjective summary scoring;
- less visibly tied to a real executable scientific result.

### Decision

Not selected. Its obligation-preserving compressor belongs in ReproGate's six-week ablations.

## 6.3 Alternative C — Validation Firewall Benchmark

### Proposition

Measure whether scientific agents use expected curves, reported outcomes, or target values while constructing the model later claimed to be independently validated.

### Strengths

- directly related to Axiomatic's public digital-twin method;
- original and scientifically important;
- supports canaries, information-flow checks, interventions, and formal invariants.

### Weaknesses

- standalone scope can appear narrower than a scientific workflow;
- without execution it can resemble prompt-security work;
- semantic leakage from mixed paper pages is difficult to evaluate.

### Decision

Not selected alone. It becomes ReproGate's main differentiator.

## 6.4 Selected option

Exactly one project is selected:

# ReproGate

It combines the strongest elements of the original workbench hypothesis and the validation-firewall alternative while remaining public, domain-independent, and non-proprietary.

---

# 7. Selected project definition

## 7.1 Research question

> Does a provenance-constrained, checkpointed paper-to-simulation pipeline with a runtime-enforced recipe–validation information barrier produce a higher trustworthy-artifact rate under document and dependency faults than whole-document extraction followed by uncheckpointed notebook generation?

The proposition is falsified if ReproGate does not materially improve trustworthy-artifact rate, only increases abstention, fails to prevent target influence, cannot recover correctly, or cannot reproduce its own benchmark.

## 7.2 Hypotheses

### H1 — recovery

Checkpointed page- and stage-level execution will reduce irrecoverable or silent failure by at least 50% relative to an uncheckpointed baseline and recover at least 85% of injected retryable failures.

### H2 — provenance

A typed evidence graph will achieve at least 0.95 page-level precision and recall for consumed parameters and validation targets and reduce unreported assumptions and defaults.

### H3 — information separation

A process-enforced recipe–target boundary will reduce target-only influence on generated build artifacts to zero under exact build-hash tests and below 5% under broader semantic leakage tests.

### H4 — end-to-end trustworthiness

Under mixed corruption, ReproGate will improve **Trustworthy Artifact Rate** by at least 25 percentage points over the whole-document baseline.

### H5 — context control

An obligation-preserving context compressor will reduce agent-visible tokens by at least 30% while changing trustworthy-artifact rate by no more than two percentage points.

---

# 8. Recommended benchmark corpus

## 8.1 Primary paper

**Meijaard et al. (2007), _Linearized dynamics equations for the balance and steer of a bicycle: a benchmark and review_.**

Primary and supporting sources:

- [TU Delft publication record](https://research.tudelft.nl/en/publications/linearized-dynamics-equations-for-the-balance-and-steer-of-a-bicy)
- [Benchmark background and independent checks](https://arendschwab.com/research/benchmarkbicycle/)
- [BicycleParameters benchmark example](https://bicycleparameters.readthedocs.io/stable/gallery/examples/plot_benchmark.html)
- [PyDy Carvallo–Whipple implementation](https://pydy.readthedocs.io/en/stable/examples/carvallo-whipple.html)

### Why this paper

1. It is a real mechanics, stability, and controls problem rather than a toy ODE.
2. NumPy, SciPy, and SymPy are sufficient; no GPU or paid solver is required.
3. It includes prose, equations, parameter tables, definitions, and figures.
4. It provides a clear recipe–target split.
5. Independent implementations make the validation stronger than self-comparison.
6. It is adjacent to Giacomo's biomechanics, signal-processing, physical-modeling, and telemetry experience.
7. Hundreds of fault-injected runs can be executed on CPU.

### Construction recipe

- geometry;
- masses and centers of mass;
- inertia tensors;
- gravitational constant and physical conventions;
- canonical equations and variable definitions.

### Held-out targets

- canonical matrices `M`, `C1`, `K0`, and `K2`;
- eigenvalues across forward speed;
- weave, capsize, and caster-mode behavior;
- critical stability-transition speeds;
- digitized reference curves.

The builder must not import BicycleParameters, PyDy, or another oracle implementation. Those packages belong only to the validator.

### Scientific limitation

This case validates a computational implementation against accepted benchmark equations and reference implementations. It does not establish full experimental truth for every physical bicycle. The report must call the result **computational-model verification and benchmark validation**, not unrestricted physical validation.

## 8.2 Six-week extension protocol

Select four to eight additional papers using pre-registered inclusion criteria:

- legally accessible source;
- approximately 40 pages or fewer;
- deterministic CPU-compatible solver;
- at least ten explicit input parameters;
- at least three quantitative validation targets;
- at least two modalities among text, equations, tables, figures, and captions;
- no proprietary experimental data;
- at least one independent implementation, derivation, or experimental source.

Candidate domains:

1. an experimental bicycle-stability paper;
2. an RLC or active-filter paper using ngspice or PySpice;
3. a classical controls benchmark using SciPy Control;
4. a lightweight local photonics case using FEMWELL or a mode solver, only after the benchmark core is stable.

The repository should store acquisition scripts, bibliographic metadata, and hashes rather than redistributing copyrighted PDFs without permission.

---

# 9. Architecture

```text
                         ┌─────────────────────────────┐
                         │ immutable run manifest      │
                         │ hashes · versions · seeds   │
                         └──────────────┬──────────────┘
                                        │
PDF ──► page renderer ──► page artifacts ──► section graph
        │                    │                    │
        ├─ primary parser    ├─ image refs        ├─ token estimates
        ├─ fallback parser   ├─ captions          └─ page roles
        └─ explicit errors   └─ coordinates
                               │
                               ▼
                       evidence extraction
                 claims · equations · tables · figures
                               │
                               ▼
                       provenance graph
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
           sealed recipe store       sealed target store
           builder-readable          validator-readable
                  │                         │
                  ▼                         │
           typed model IR                  │
                  │                         │
                  ▼                         │
           model compiler                  │
                  │                         │
                  ▼                         │
          deterministic simulator          │
                  │                         │
                  └────────────┬────────────┘
                               ▼
                       verification and validation
                               │
             pass · qualified pass · fail · abstain
                               │
                               ▼
       Marimo notebook · report · traces · replay package
```

## 9.1 Recommended stack

- Python 3.12;
- Pydantic v2;
- Typer CLI;
- Marimo as the primary executable document;
- Jupyter export for interoperability;
- NumPy, SciPy, SymPy;
- SQLite for separated MVP stores;
- JSON-LD-style provenance export;
- OpenTelemetry-compatible traces and JSONL events;
- `uv.lock`;
- Docker or Podman image with pinned digest;
- pytest and Hypothesis;
- TLA+ and TLC for workflow invariants;
- GitHub Actions on Linux AMD64.

A small explicit state machine is preferred over an agent framework for the assurance core. LangGraph should be introduced only if an ablation demonstrates value.

---

# 10. Data schemas and provenance

## 10.1 Core objects

| Object | Required fields |
|---|---|
| `DocumentManifest` | document ID, SHA-256, source citation, acquisition date, page count, parser policy |
| `PageArtifact` | page number, image hash, text hash, dimensions, parser result, status, retry history |
| `SourceSpan` | document hash, page, bounding box, block ID, modality, normalized text hash |
| `EvidenceClaim` | claim ID, type, normalized value, unit, epistemic status, confidence, source spans, parent claims |
| `EquationClaim` | symbolic expression, variable definitions, source spans, semantic checks, unresolved symbols |
| `ParameterClaim` | name, value, unit, uncertainty, scope, stated/inferred status, contradictions |
| `ModelRecipe` | parameters, equations, assumptions, required claim IDs, environment, forbidden target IDs |
| `ValidationTarget` | metric, expected value or curve, tolerance, source spans, independence grade, sealed status |
| `BuildManifest` | recipe hash, compiler version, environment digest, read-set certificate, artifact hashes |
| `SimulationRun` | model hash, seed, solver settings, outputs, runtime, memory, warnings, exit status |
| `ValidationDecision` | verification checks, residuals, independence grade, verdict, explanation, target IDs |
| `FaultScenario` | fault type, location, severity, deterministic seed, expected detection, expected recovery |
| `RunEvent` | event ID, parent event, stage, timestamp, attempt, transition, error classification |

## 10.2 Epistemic status

Every value is classified as exactly one of:

- `stated`;
- `derived`;
- `inferred`;
- `assumption`;
- `default`;
- `conflicted`;
- `unresolved`.

A default may not enter a model silently. It requires a documented policy and must appear in the final assumptions table.

## 10.3 Stable provenance IDs

```text
source_span_id = sha256(
    document_sha256
    + page_number
    + normalized_bbox
    + normalized_text
)
```

Principal edges:

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

Every parameter consumed by the compiler must have a valid source span or an explicit assumption/default record.

---

# 11. Recipe–validation information barrier

This is the central differentiator.

## 11.1 Page and region roles

Each page or region is labeled:

- `recipe`;
- `validation`;
- `mixed`;
- `excluded`.

For mixed pages, target numbers are redacted from the builder-visible representation while equations and design information remain available.

## 11.2 Runtime separation

### MVP

- separate SQLite databases for recipe evidence and validation targets;
- separate Python processes;
- builder credentials allow recipe-store reads only;
- validator starts only after the build artifact and read-set certificate are finalized;
- every read is appended to an immutable audit log.

### Six-week extension

- separate containers;
- read-only recipe and target volumes;
- capability-scoped tokens;
- optional network isolation;
- signed build manifests;
- target store absent from the builder namespace.

Threat model: accidental or agent-mediated evidence contamination. The design does not claim protection against a hostile process that escapes its operating-system sandbox.

## 11.3 Leakage tests

### Target-canary test

Replace a target with a conspicuous canary while leaving the recipe unchanged.

```text
build_hash(original_targets) == build_hash(canary_targets)
```

### Target-perturbation test

Perturb all validation targets and calculate:

```text
Target Influence Rate =
P(build artifact changes | only target store changes)
```

Required process-level result: zero.

### Negative control

Perturb a true recipe parameter. The configuration and model output must change.

### Semantic audit

Search generated code, comments, intermediate messages, and constants for exact or transformed target values and target-specific identifiers.

A stable hash is necessary but insufficient if code generation is stochastic. The MVP should use deterministic templates after extraction wherever possible.

---

# 12. Formal-methods component

A compact TLA+ specification models documents, pages, attempts, checkpoints, stores, capabilities, run states, and verdicts.

## 12.1 Safety properties

### No target read

```text
BuilderReadSet ∩ TargetStore = ∅
```

### No unjustified pass

```text
PASS =>
    Verified
    ∧ Validated
    ∧ ProvenanceComplete
    ∧ Replayable
    ∧ NoForbiddenReads
```

### Evidence completeness

```text
ConsumedClaim =>
    HasSourceSpan ∨ IsExplicitAssumption ∨ IsExplicitDefault
```

### Checkpoint integrity

A completed checkpoint's content hash cannot change within the same run lineage.

### Target invariance

Changing only sealed validation targets cannot change the build artifact.

## 12.2 Liveness property

Under bounded retryable failures and fair scheduling:

```text
retryable stage
    eventually reaches
completed ∨ explicit_terminal_failure
```

TLC checks bounded instances in CI. This is a substantive formal component because it verifies workflow safety and information flow, not an unrelated theorem-prover demonstration.

---

# 13. Agent and deterministic components

## Model-assisted

1. page and section-role classification;
2. parameter and equation extraction;
3. table and figure interpretation;
4. contradiction candidate generation;
5. explanation of extraction or simulation failure.

## Deterministic

1. schema validation;
2. unit normalization;
3. source-span verification;
4. symbolic equation checks;
5. dimensional and range checks;
6. typed model compilation;
7. numerical simulation;
8. residual calculation;
9. verdict assignment;
10. replay and hash verification.

The final verdict must not be assigned by an LLM.

---

# 14. Verification and validation gates

## 14.1 Verification gate

A run passes verification only if:

- required claims are present;
- inputs have normalized units;
- no unresolved symbols remain;
- source spans resolve to immutable document artifacts;
- schemas validate;
- matrix dimensions and expected symmetry properties hold;
- code passes static and unit checks;
- execution completes within resource limits;
- no target-store reads occurred;
- replay is exact.

## 14.2 Validation gate

Initial bicycle-benchmark tolerances, fixed before generated outputs are inspected:

| Metric | Tolerance |
|---|---:|
| Canonical-matrix relative Frobenius error | ≤ `1e-6` |
| Matched eigenvalue error | ≤ `1e-4` |
| Critical-speed error | ≤ `0.05 m/s` |
| Digitized figure-point relative error | ≤ `2%`, subject to resolution |
| Required-target provenance | `100%` page-resolved |
| Forbidden builder reads | `0` |

## 14.3 Verdicts

### Pass

All required verification and validation conditions pass, replay is exact, provenance is complete, no information-boundary violation occurs, and evidence independence is Grade A or B.

### Qualified pass

Numerical targets pass, but evidence is Grade C, an important assumption is shared, a non-critical value is inferred, or figure resolution limits comparison.

### Fail

A required residual exceeds tolerance, provenance is missing, a forbidden target was read, replay differs, execution fails, or decision logic cannot establish correctness.

### Abstain

The system explicitly determines that evidence is insufficient to build or validate the model. Abstention is not a successful artifact, but is preferable to a false pass.

---

# 15. Baselines

## B0 — whole-document baseline

```text
full PDF
→ one model call
→ generated notebook
→ execute once
```

No typed provenance, checkpointing, target separation, or independent validator.

## B1 — robust parser only

Page-aware parsing and fallback, but no evidence graph or firewall.

## B2 — provenance without separation

Citations and graph exist, but recipe and targets share agent context.

## B3 — separation without resumption

Recipe and targets are isolated, but the workflow restarts after failure.

## B4 — hand-curated upper bound

A human-created recipe is compiled and simulated by the same deterministic execution layer. This isolates extraction failure from compiler or simulator error.

---

# 16. Fault-injection benchmark

Every fault has a deterministic seed, injection location, expected detection point, expected recovery, and forbidden outcomes.

## 16.1 Document faults

- remove a recipe page;
- remove a validation page;
- remove one side of a two-page table;
- reorder or duplicate pages;
- corrupt an equation sign;
- remove a denominator or exponent;
- alter a unit;
- insert conflicting values;
- hide a caption;
- crop a legend;
- add an oversized appendix;
- truncate parser output.

## 16.2 Dependency faults

- HTTP 401;
- HTTP 408;
- HTTP 429;
- HTTP 500;
- connection reset;
- timeout after partial processing;
- malformed JSON;
- empty nominally successful response;
- repeated response;
- unavailable fallback parser.

## 16.3 Execution faults

- missing dependency;
- incompatible version;
- solver timeout;
- memory cap;
- NaN or complex-value propagation;
- corrupted checkpoint;
- stale cache;
- incomplete notebook execution.

## 16.4 Agent faults

- invalid structured output;
- fabricated source span;
- target copied into model code;
- implicit default;
- contradiction ignored;
- premature success;
- repeated non-progressing repair.

---

# 17. Evaluation metrics

## 17.1 Extraction

- parameter precision, recall, and F1;
- unit-normalized exact match;
- equation semantic equivalence through symbolic simplification and randomized numeric tests;
- table-cell F1;
- figure-target numeric error;
- epistemic-status accuracy;
- contradiction precision and recall.

## 17.2 Provenance

- page precision and recall;
- source-span precision and recall;
- bounding-box intersection over union;
- unsupported-claim rate;
- fabricated-span rate;
- consumed claims with valid provenance.

## 17.3 Reliability

- fault-detection rate;
- recovery rate;
- silent-failure rate;
- correct-resumption rate;
- duplicate-work ratio;
- time to recovery;
- retry count;
- terminal-state correctness.

## 17.4 Simulation

- execution success;
- deterministic replay;
- matrix error;
- eigenvalue-assignment error;
- critical-speed error;
- output-plot data hash;
- runtime and peak memory.

## 17.5 Validation

- verdict accuracy;
- false-pass rate;
- false-fail rate;
- abstention rate;
- qualified-pass calibration;
- Brier score when confidence is reported.

False-pass rate is the safety-critical metric.

## 17.6 Leakage

- forbidden-read count;
- target influence rate;
- canary leakage rate;
- target-value occurrence in build artifacts;
- semantic target dependence.

## 17.7 Primary endpoint

```text
Trustworthy Artifact Rate (TAR) =
number of runs that are
    executable
    AND provenance-correct
    AND decision-correct
    AND leakage-free
    AND exactly replayable
divided by total runs
```

TAR prevents a system from appearing successful merely because it generated executable Python.

---

# 18. Statistical plan

## MVP

Approximately 150 paired runs using the same paper, corruption scenario, provider/model where applicable, and deterministic seed across B0 and ReproGate.

## Six-week extension

Approximately 600–1,000 paired runs across multiple papers, parser configurations, two model tiers, fault classes, and firewall/context ablations.

## Analysis

- McNemar's test for paired binary outcomes such as TAR;
- paired bootstrap confidence intervals for TAR difference;
- permutation or Wilcoxon signed-rank tests for latency, cost, and token use;
- Holm correction for secondary comparisons;
- effect sizes with confidence intervals, not p-values alone.

Two annotators should independently label at least 20–30% of the gold corpus. Target inter-annotator agreement: at least 0.80, with adjudication and ontology revision below that threshold.

---

# 19. Ablations

1. remove parser fallback;
2. remove page-level checkpoints;
3. remove provenance graph;
4. remove epistemic labels;
5. remove contradiction detection;
6. place recipe and targets in the same context;
7. use prompt-only separation rather than process separation;
8. remove retry classification;
9. replace semantic compression with first/last truncation;
10. use one parser only;
11. allow free-form code generation instead of typed templates;
12. allow an LLM to assign the verdict.

The central comparison is same-context evidence versus the process-enforced target firewall.

---

# 20. Error-analysis methodology

Every failed run produces an incident packet containing:

- run manifest;
- document and corruption hashes;
- event timeline;
- first causal failure;
- propagated failures;
- final visible symptom;
- explicit or silent status;
- affected claims and artifacts;
- recovery attempts;
- model, parser, and provider versions;
- estimated unnecessary work.

Failures are categorized by modality, fault type, pipeline stage, recoverability, evidence status, target leakage, provider, paper, and severity. The final report must include representative failures, not only aggregate metrics.

---

# 21. Reproducibility requirements

A release is complete only if a third party can:

1. acquire the source through the manifest;
2. verify its hash;
3. create the pinned environment;
4. run the clean benchmark;
5. run a specified fault;
6. reproduce deterministic outputs;
7. reproduce the verdict;
8. inspect every consumed claim's source;
9. verify the builder read set;
10. regenerate the notebook and report.

Required artifacts:

- `uv.lock`;
- container digest;
- model and parser IDs;
- prompt hashes;
- seeds;
- source hashes;
- configurations;
- JSONL traces;
- benchmark annotations;
- expected-output manifests;
- hardware and environment metadata;
- CI logs.

Where provider terms permit, cache responses. Distinguish **live reproduction** from **trace replay**.

---

# 22. Pre-registered success thresholds and expected ranges

## 22.1 Success thresholds

| Metric | Threshold |
|---|---:|
| Normalized parameter F1 | ≥ 0.90 |
| Page-level provenance precision and recall | ≥ 0.95 |
| Missing-page detection | 100% |
| Silent missing-page failures | 0 |
| Retryable-failure recovery | ≥ 0.85 |
| Deterministic replay | 100% |
| Matrix relative error | ≤ `1e-6` |
| Eigenvalue error | ≤ `1e-4` |
| Critical-speed error | ≤ `0.05 m/s` |
| Validation-decision accuracy | ≥ 0.95 |
| False-pass rate | ≤ 0.02 |
| Process-firewall forbidden reads | 0 |
| TAR improvement over B0 under mixed faults | ≥ 25 percentage points |

## 22.2 Forecasts, not evidence

**[S] Planning ranges:**

| Metric | B0 forecast | ReproGate forecast |
|---|---:|---:|
| TAR under mixed faults | 35–55% | 70–85% |
| Retryable-failure recovery | 20–50% | 85–95% |
| Page-level provenance | inconsistent or absent | 95–99% |
| Silent-failure rate | 10–25% | 0–5% |
| Process-level target influence | potentially material | 0 |
| Clean-run token use | baseline | 20–40% lower after page targeting |
| Clean-run latency | lower | 20–60% higher |
| Wasted work under faults | higher | lower with checkpoints |

Failure to meet the headline thresholds can still produce useful negative results if the benchmark and taxonomy are rigorous.

---

# 23. Two-week MVP

## Week 1 — assurance core

### Day 1: protocol and gold standard

- freeze research question and endpoint;
- create paper manifest;
- manually annotate parameters, equations, and targets;
- define schemas and tolerances;
- write initial TLA+ model.

### Day 2: deterministic execution

- implement bicycle model from a hand-curated recipe;
- calculate matrices and eigenvalues;
- build validator using held-out implementations;
- create clean golden tests.

### Day 3: page artifacts

- render PDF pages;
- implement primary parser;
- hash page images and text;
- estimate tokens;
- record sections and roles;
- expose partial and terminal state.

### Day 4: recovery

- page checkpoints;
- retry classification;
- deterministic test backoff;
- continuation;
- corrupted-cache detection;
- resumable manifest.

### Day 5: evidence graph

- parameter, equation, and target extraction;
- source spans;
- unit normalization;
- contradiction records;
- unsupported-claim detection.

## Week 2 — firewall and benchmark

### Day 6: target firewall

- separate stores and processes;
- read-set audit;
- target canaries;
- invariance tests;
- TLC checks.

### Day 7: compilation and notebook

- typed recipe compiler;
- deterministic execution;
- Marimo notebook;
- assumptions, provenance, and diagnostics.

### Day 8: V&V gate

- verification checks;
- tolerance validation;
- independence grades;
- four verdict classes.

### Day 9: benchmark

- B0, B1, and B2;
- missing page, malformed equation, conflict, timeout, 429, malformed response, and leakage faults;
- approximately 150 paired runs.

### Day 10: public artifact

- report;
- benchmark card;
- failure taxonomy;
- architecture docs;
- six-to-eight-minute demo;
- tagged reproducible release.

## MVP exit gate

The MVP is not complete until it shows:

1. a clean end-to-end model;
2. explicit failure on a missing page;
3. correct resumption after interruption;
4. an invariant build hash under a target canary;
5. a quantitative baseline comparison;
6. exact replay in a clean environment.

---

# 24. Six-week extension

| Week | Deliverable |
|---:|---|
| 1 | Gold corpus, deterministic bicycle simulator, reference validator |
| 2 | Full MVP and first benchmark release |
| 3 | Secondary papers, multimodal annotations, parser adapters, contradiction handling |
| 4 | Firewall ablations, container isolation, context compressor, model/provider comparisons |
| 5 | 600–1,000 paired runs, statistical analysis, failure taxonomy, adjudication |
| 6 | Paper-style report, public benchmark package, hardened CI, demo, release candidate |

Research additions:

- extra mechanics, controls, or circuit papers;
- figure extraction with resolution uncertainty;
- obligation-preserving context compression;
- reusable failure memory;
- cheap/strong model routing;
- cost-aware retry budget;
- process versus container isolation;
- contamination-resistant held-out cases;
- benchmark versioning.

---

# 25. Compute and cost

## Compute

- 8–16 CPU cores;
- 16–32 GB RAM;
- 20–100 GB storage depending on cached artifacts;
- no GPU required for the primary benchmark;
- optional GPU only for local vision/OCR experiments.

A modern laptop is sufficient for development. Deterministic simulation and a smoke fault suite should run in CI.

## Planning budget

These are envelopes, not vendor quotes.

| Phase | Expected external model/OCR budget |
|---|---:|
| Two-week MVP | approximately `$75–$300` |
| Six-week study | approximately `$300–$1,200` |
| CI, storage, lightweight hosting | generally below `$50` during the project |

Every result reports model calls, pages, tokens, retries, latency, estimated cost, and reused work.

---

# 26. Risks and stop or redirect conditions

| Condition | Response |
|---|---|
| No reproducible bicycle model after two engineering days | Use a hand-verified canonical recipe and isolate extraction as the research variable |
| No Grade B validator is possible | Add or replace the case with one having independent formulation or experimental data |
| Annotation agreement below 0.80 | Revise ontology before large runs |
| No leakage appears in B0 | Retain firewall as a safety invariant but do not claim empirical improvement as the headline |
| Parser dominates all outcomes | Add a second parser and split provider-specific from provider-independent results |
| Fault suite becomes unrealistic | Require every class to map to an observed issue, common defect, or reproducible dependency failure |
| Free-form generation is unstable | Replace with typed IR and deterministic templates |
| False-pass rate exceeds 2% | Stop feature expansion and repair decision logic or evidence requirements |
| Work shifts toward UI polish | Stop UI work and prioritize benchmark, traces, and reproducibility |
| Simulation adds no discriminative signal | Redirect to the Scientific-Agent Context Reliability Layer using the same traces |
| Cost exceeds envelope | Use trace replay and smaller models for ablations |
| Source licensing blocks reproducibility | Store acquisition scripts and hashes or replace the source |

---

# 27. Academic and professional connection map

Strength scale: 5 active direct relationship; 4 evidenced warm one-hop path; 3 institutional or research-community bridge; 2 cold but artifact-relevant; 1 ecosystem adjacency.

| Person | Current role or association | Relevance | Connection chain | Strength | Can validate / advise / introduce | Initial question | Timing |
|---|---|---|---|---:|---|---|---|
| Brian Kulis | BU professor in ECE and computing; metric learning and retrieval | Experimental design, robustness metrics, benchmark validity | Giacomo → direct research supervisor | 5 | Validate: yes; advise: yes; introduce: unknown | Is TAR a defensible composite primary endpoint, or should decision correctness and recovery be co-primary outcomes? | Before prototype |
| Christopher Liao | Contextual-similarity and metric-learning researcher; Kulis coauthor | Corruption severity, retrieval metrics, robustness evaluation | Giacomo → Brian Kulis → Christopher Liao | 4 | Validate: yes; advise: likely; introduce: unknown | How should corruption severity and provenance-retrieval metrics prevent apparent gains from abstention or annotation shortcuts? | Before or during MVP |
| Miloš Popović | BU ECE associate professor in integrated photonics | Photonics simulation and experimental/numerical independence | Giacomo → BU ECE/Photonics Center → Popović | 3 | Validate science: yes; advise: likely; introduce: speculative | Which shared assumptions most often make two photonics simulations appear independent when they are not? | After MVP |
| Frank Schäfer | Axiomatic research scientist; digital-twin coauthor | Scientific modeling, uncertainty, validation independence | Giacomo → public ReproGate artifact → paper author | 2 | Validate: highly relevant; advise: possible | Which independence dimension most often creates a false sense of validation despite a small residual? | After public MVP |
| Austin Letson | Axiomatic formal-methods researcher associated with AxProver, AxDafny, and SorryDB | Dynamic benchmarks, exact environments, real tasks | Giacomo → public benchmark → author | 2 | Validate benchmark design: yes; advise: possible | Which SorryDB properties matter most for avoiding static, saturated benchmarks, and which transfer here? | After quantitative results |
| Flemming Holtorf | Axiomatic researcher associated with digital twins, AgentOptics, and current scientific MCP work | Domain-tool orchestration and scientific state recovery | Giacomo → public artifact → shared technical interest | 2 | Validate orchestration: yes; advise: possible | Which state must survive a failed tool call for recovery to remain scientifically valid? | After MVP |
| Borja Requena Pozo | AxProverBase and AxDafny author | Proposer/compiler/reviewer design and workflow invariants | Giacomo → TLA+ and benchmark artifact → author | 2 | Validate formal workflow: yes; advise: possible | Should validation evidence be modeled as a capability rather than only a separate store? | After results |

## Authorized-account findings

- **[A]** No direct Axiomatic correspondence was found in the authorized Gmail search.
- **[A]** No saved Axiomatic contact was found in Google Contacts.
- **[A]** Giacomo has an active research relationship with Brian Kulis.
- **[A]** Prior correspondence records that Brian discussed Giacomo's current research plan with Christopher Liao and received a positive technical reaction.
- **[N]** No authorized LinkedIn graph was available; first- or second-degree LinkedIn relationships are not asserted.
- **[N]** It is unknown whether any BU contact can or should introduce Giacomo to Axiomatic.

No outreach should begin by asking for an introduction.

---

# 28. Three people to approach first

## 1. Brian Kulis — before implementation is locked

Purpose: validate the study design.

> I am defining the primary result as Trustworthy Artifact Rate: executable, provenance-correct, decision-correct, leakage-free, and exactly replayable. Is that a defensible composite endpoint, or would you separate decision correctness and recovery into co-primary outcomes? I am planning paired fault scenarios with McNemar and bootstrap analysis.

## 2. Christopher Liao — after the benchmark ontology exists

Purpose: test whether corruption evaluation can be gamed.

> I am evaluating paper-to-simulation robustness under missing pages, conflicting values, and target leakage. How would you structure corruption severity and retrieval-style provenance metrics so an agent cannot appear more robust merely by abstaining more often or exploiting repeated annotation patterns?

The path should be through Brian only if Brian considers it appropriate.

## 3. Frank Schäfer — after a public MVP and initial results

Purpose: obtain the first company-specific technical critique.

> I implemented a runtime firewall that prevents model construction from reading sealed validation targets, then grade validation evidence by derivation, solver, and assumption independence. In your digital-twin work, which independence dimension is most likely to produce a false sense of validation even when the numerical residual is small?

Prioritize research engineers and paper authors. Executive outreach is not recommended at this stage.

---

# 29. Company-specific builder narrative

Giacomo should not position himself as someone who built another generic AI scientist.

> Giacomo builds scientific and enterprise agent systems in which generated outputs must survive typed contracts, trace inspection, controlled corruption, and external validation. At Banca Mediolanum he built a production agent platform with governed execution, citation-backed retrieval, evidence review, prompt versioning, evaluation, and end-to-end tracing. In his current research he measures motion-retrieval degradation under noise, occlusion, temporal jitter, and viewpoint shift. In his rowing work he built an executable video-to-biomechanics pipeline, aligned it with instrumented force telemetry, tracked provenance and quality-control metadata, and produced reproducible model bundles and reports. ReproGate applies that operating style to a central scientific-agent problem: turning literature into an executable result without losing the evidence or contaminating the validation.

This narrative is company-specific because it connects Giacomo's evidence to Axiomatic's publicly observable assurance program rather than to a generic agent stack.

---

# 30. Proposed implementation repository

## Name

```text
JJCAPPE/reprogate
```

## Tagline

> Fault-injection benchmark for provenance-gated paper-to-simulation agents.

## Directory structure

```text
reprogate/
├── README.md
├── LICENSE
├── CITATION.cff
├── pyproject.toml
├── uv.lock
├── Dockerfile
├── compose.yaml
├── Makefile
├── configs/
│   ├── default.yaml
│   ├── models/
│   ├── parsers/
│   ├── tolerances/
│   └── benchmark/
├── corpus/
│   ├── manifests/
│   ├── acquisition/
│   └── README.md
├── annotations/
│   ├── schemas/
│   ├── gold/
│   ├── adjudication/
│   └── annotation_guide.md
├── formal/
│   ├── ReproGate.tla
│   ├── ReproGate.cfg
│   └── README.md
├── src/reprogate/
│   ├── cli/
│   ├── schemas/
│   ├── ingest/
│   ├── segment/
│   ├── extract/
│   ├── evidence/
│   ├── firewall/
│   ├── compile/
│   ├── simulate/
│   ├── validate/
│   ├── orchestrate/
│   ├── faults/
│   ├── observe/
│   └── reporting/
├── domains/bicycle/
│   ├── schema.py
│   ├── compiler.py
│   ├── model.py
│   ├── oracle.py
│   ├── targets.py
│   ├── fixtures/
│   └── README.md
├── notebooks/
│   ├── reprogate_demo.py
│   └── analysis.py
├── benchmark/
│   ├── scenarios/
│   ├── baselines/
│   ├── runner.py
│   ├── metrics.py
│   └── statistics.py
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── golden/
│   ├── provenance/
│   ├── firewall/
│   └── faults/
├── reports/
│   ├── technical_report.md
│   ├── benchmark_card.md
│   ├── failure_taxonomy.md
│   └── limitations.md
├── docs/
│   ├── architecture.md
│   ├── provenance.md
│   ├── threat_model.md
│   ├── validation_protocol.md
│   └── reproducibility.md
└── .github/workflows/
    ├── ci.yml
    ├── model-check.yml
    └── benchmark-smoke.yml
```

---

# 31. ReproGate README outline

1. Research question
2. Why executable code is insufficient
3. Non-goals
4. Evidence and epistemic-status conventions
5. Quick start
6. Bicycle benchmark
7. Architecture
8. Recipe–target firewall
9. Formal safety properties
10. Provenance representation
11. V&V protocol
12. Fault scenarios
13. Baselines
14. Trustworthy Artifact Rate
15. Results
16. Reproduction
17. Adding a paper or solver
18. Benchmark versioning and contamination policy
19. Threat model
20. Known limitations
21. Contributing
22. Citation

Quantitative results and failure cases should appear above interface screenshots.

---

# 32. Demo plan

A six-to-eight-minute recording:

1. **Problem:** show that an executable notebook can still contain unsupported values, copied targets, defaults, or unpinned dependencies.
2. **Clean extraction:** inspect page artifacts, claims, equations, source spans, and the split stores.
3. **Information barrier:** replace a sealed target with a canary and show an unchanged build hash plus the read-set certificate.
4. **Recovery:** inject a parser 429 and an interruption, then resume from the last verified page without redoing completed work.
5. **Simulation:** generate matrices, eigenvalues, stability plot, and immutable artifacts.
6. **V&V:** compare held-out targets and show pass, qualified pass, fail, or abstain with an independence grade.
7. **Benchmark:** compare B0 and ReproGate on TAR, false passes, recovery, provenance, latency, and cost.
8. **Incident packet:** inspect the first causal failure and its propagation path.

---

# 33. Paper-style abstract

## ReproGate: Evaluating Provenance, Validation Separation, and Fault Recovery in Paper-to-Simulation Agents

Scientific agents increasingly convert technical literature into executable computational artifacts, but an artifact that runs is not necessarily scientifically trustworthy. Parameters may lose their source attribution, expected results may leak into model construction, parser and provider failures may silently omit evidence, and validation may reuse the same assumptions as the generated model. We introduce **ReproGate**, an open evaluation framework for provenance-gated paper-to-simulation workflows. ReproGate represents extracted claims, equations, assumptions, and targets as typed objects linked to page-level source spans. It places model-construction recipes and quantitative validation targets behind a runtime-enforced information barrier, compiles recipes into deterministic executable models, and assigns validation decisions using pre-registered tolerances and explicit evidence-independence grades. The framework includes checkpointed execution, structured retry semantics, deterministic replay, and a fault-injection suite covering missing pages, malformed equations, conflicting parameters, incomplete figures, transient dependency failures, and oversized documents. We evaluate systems using Trustworthy Artifact Rate, a composite endpoint requiring successful execution, correct provenance, correct validation decisions, absence of target leakage, and exact replay. The initial benchmark reconstructs the canonical linear bicycle-dynamics model from technical literature and validates generated matrices, eigenvalues, and stability transitions against held-out reference implementations. ReproGate is designed as a reproducible benchmark and failure-analysis package rather than a general scientific-assistant interface.

---

# 34. Why the project matters independently of an application

ReproGate would provide:

1. a public benchmark for a failure class rarely measured by end-task success;
2. a reusable provenance schema for paper-derived computational models;
3. a validation-independence taxonomy exposing shared assumptions;
4. a fault corpus grounded in real public issues and common document defects;
5. a machine-checked workflow contract independent of proprietary systems;
6. reusable reliability primitives: checkpoints, read-set certificates, canaries, manifests, retry classes, and incident packets;
7. useful negative results identifying whether failure originates in parsing, evidence typing, compilation, simulation, validation, or orchestration.

The artifact remains scientifically and operationally useful to other research groups even if Giacomo never applies to Axiomatic.

---

# 35. What is not publicly knowable

The following must not be asserted in outreach:

- Lemma's internal prompts, graph, routing, or memory implementation;
- the exact relationship between public MCP code and current production Lemma;
- Axiomatic's internal issue priorities;
- production failure rates, customer data, latency, cost, or SLOs;
- whether public issues have private duplicates or deployed private fixes;
- whether a specific external contribution is desired;
- whether AxDafny or Skill-Synthesizer have private implementation repositories;
- whether a BU contact can make an introduction;
- Giacomo's LinkedIn connection graph.

---

# 36. Source appendix

A structured, audited register is maintained in [`sources.yaml`](./sources.yaml), and claim-level caveats are documented in [`source-audit.md`](./source-audit.md).

## Primary company and research sources

- [Axiomatic home](https://axiomatic-ai.com/)
- [Lemma](https://axiomatic-ai.com/products/lemma/)
- [Axiomatic team](https://axiomatic-ai.com/team/)
- [Grating-coupler digital twin](https://axiomatic-ai.com/blog/grating-coupler-digital-twin)
- [AxDafny](https://axiomatic-ai.com/blog/axdafny/)
- [SorryDB](https://axiomatic-ai.com/blog/sorrydb/)
- [Skill-Synthesizer](https://axiomatic-ai.com/blog/skill-synthesizer/)
- [Axiomatic publications](https://axiomatic-ai.com/research/publications/)
- [AgentOptics](https://arxiv.org/abs/2602.20144)
- [AxDafny paper](https://arxiv.org/abs/2606.32007)
- [AxProverBase repository](https://github.com/Axiomatic-AI/ax-prover-base)
- [AxProver MCP](https://github.com/Axiomatic-AI/ax-prover-base-mcp)
- [SorryDB code](https://github.com/SorryDB/SorryDB)
- [SorryDB data](https://github.com/SorryDB/sorrydb-data)
- [Skill-Synthesizer OpenReview record](https://openreview.net/forum?id=T3WDCimC5K)

## Public software revisions audited

- [`ax-mcp@ef53332`](https://github.com/Axiomatic-AI/ax-mcp/tree/ef53332b866b29b6d5d7a3dc6d77698e42334c24), head dated 21 August 2026 during audit.
- [`ax-prover-base@06dfadc`](https://github.com/Axiomatic-AI/ax-prover-base/tree/06dfadc9ab439755af5efcfe0add95bfef2733c7), head dated 14 August 2026 during audit.

## Candidate evidence

- [`JJCAPPE/cv`](https://github.com/JJCAPPE/cv)
- [`JJCAPPE/pose-embedding`](https://github.com/JJCAPPE/pose-embedding)
- [`JJCAPPE/rowing-dynamics-analysis`](https://github.com/JJCAPPE/rowing-dynamics-analysis)

## Benchmark sources

- [TU Delft publication record](https://research.tudelft.nl/en/publications/linearized-dynamics-equations-for-the-balance-and-steer-of-a-bicy)
- [Benchmark Bicycle](https://arendschwab.com/research/benchmarkbicycle/)
- [BicycleParameters example](https://bicycleparameters.readthedocs.io/stable/gallery/examples/plot_benchmark.html)
- [PyDy Carvallo–Whipple example](https://pydy.readthedocs.io/en/stable/examples/carvallo-whipple.html)

---

# Final recommendation

Build ReproGate around the Meijaard bicycle-dynamics benchmark.

Judge the artifact by three visible properties:

1. every consumed claim resolves to evidence or an explicit assumption;
2. the builder is technically unable to inspect sealed validation targets;
3. the result remains correct, recoverable, and exactly replayable under controlled faults.

A clean demo without the fault benchmark is insufficient. A fault benchmark without a real executable scientific model is also insufficient. The value is the combination.
