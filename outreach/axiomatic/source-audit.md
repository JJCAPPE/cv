# Source validity and hallucination audit

**Audit date:** 22 August 2026  
**Scope:** all load-bearing claims in the Axiomatic research package  
**Code snapshots:** `ax-mcp@ef53332b866b29b6d5d7a3dc6d77698e42334c24`; `ax-prover-base@06dfadc9ab439755af5efcfe0add95bfef2733c7`

This document records how the brief was checked for stale issues, unsupported architectural claims, private-information leakage, invalid people mappings, and source failures.

---

## 1. Audit rules

1. Prefer first-party company posts, papers, repositories, issue records, and current job descriptions.
2. Pin code-level claims to immutable Git commit revisions.
3. Re-fetch issue state rather than infer it from prior discussion.
4. Treat an open issue as evidence of a report, not proof of current production reproduction.
5. Distinguish current code from issue status and from inferred architectural significance.
6. Do not infer private product architecture from public MCP code.
7. Mark predictions, connection capability, and expected results as inference, speculation, or unknown.
8. Do not publish private email text, addresses, or unrelated account data.
9. Use secondary sources only when a primary source does not cover the claim, and identify the limitation.
10. Remove or qualify a claim when a source could not be validated.

---

## 2. Core program claims

| Claim | Status | Primary support | Audit conclusion |
|---|---|---|---|
| Lemma is positioned as a scientific and engineering co-explorer | Verified | [Axiomatic home](https://axiomatic-ai.com/), [Lemma](https://axiomatic-ai.com/products/lemma/) | Retained |
| Public Lemma materials show persistent workspaces and executable artifacts including Python/Markdown/data/Marimo | Verified | Lemma product materials | Retained; no private orchestration details asserted |
| Axiomatic publicly addresses photonics, electronics, thermal systems, mechanics, and signal analysis | Verified | Axiomatic product/home materials | Retained |
| The grating-coupler example separates construction recipe from validation targets | Verified | [Digital-twin post](https://axiomatic-ai.com/blog/grating-coupler-digital-twin) | Retained as central program evidence |
| The case uses a different solver/method than the source work | Verified | Digital-twin post | Retained with an independence caveat |
| Different solver means fully independent validation | Rejected | Not supported | Explicitly rejected; shared assumptions are disclosed |
| Public MCPs cover documents, equations, plots, fitting, optimization, paper search, knowledge retrieval, photonics, Tidy3D, and PDE work | Verified | [`ax-mcp` README at audited SHA](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/README.md) | Retained |
| AxModelFitter currently executes generated JAX code in a sandbox | Verified | [Immutable model-fitter README](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/modelfitter/README.md) | Retained |
| AxTidy3D has estimate-then-confirm paid execution | Verified | [Immutable AxTidy3D README](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/tidy3d/README.md) | Retained |
| AxPDE verifies PDE solver implementations through manufactured solutions | Verified | audited `ax-mcp` head commit and public server inventory | Retained as recent technical signal |
| AxProverBase implements proposer, builder/compiler, reviewer, memory, and metrics nodes | Verified | [Immutable `agent.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/prover/agent.py) | Retained |
| AxDafny distinguishes formal verification from operational efficiency | Verified | [Axiomatic post](https://axiomatic-ai.com/blog/axdafny/), [paper](https://arxiv.org/abs/2606.32007) | Retained |
| SorryDB is dynamic and preserves real project environments | Verified | [Axiomatic post](https://axiomatic-ai.com/blog/sorrydb/), [code](https://github.com/SorryDB/SorryDB), [data](https://github.com/SorryDB/sorrydb-data) | Retained |
| Skill-Synthesizer performs query-aware skill synthesis with execution-based verification | Verified at public-description level | [Axiomatic post](https://axiomatic-ai.com/blog/skill-synthesizer/), [OpenReview record](https://openreview.net/forum?id=T3WDCimC5K) | Retained; implementation details not asserted |
| A public Axiomatic Skill-Synthesizer implementation exists | Not verified | No repository located | Explicitly marked not publicly knowable |
| AgentOptics provides a tool-oriented optical-engineering benchmark | Verified | [arXiv](https://arxiv.org/abs/2602.20144) | Retained |

---

## 3. Public issue reconciliation

Issue state was re-fetched on the audit date. The current state is reported separately from current code behavior.

## 3.1 `ax-mcp` #108

- **Issue state:** open.
- **Public report:** Mistral-backed PDF parsing returned 401 and downstream tools surfaced a server error.
- **Current audited code:** [`pdf_to_markdown.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/shared/documents/pdf_to_markdown.py) still hardcodes the Mistral method and exposes no parser fallback or page-range interface.
- **Maintainer response:** no comments visible in the issue.
- **Independent live reproduction:** not performed; interacting with Axiomatic systems was outside scope.
- **Conclusion:** the issue and code support a resilience concern, not a claim that the production service was still down on 22 August.

Issue: [#108](https://github.com/Axiomatic-AI/ax-mcp/issues/108)

## 3.2 `ax-mcp` #95

- **Issue state:** open.
- **Report:** large documents can truncate or fail near a reported token limit.
- **Current interface:** whole-file parsing; no public page-range or continuation parameter in the audited code.
- **Unknown:** private backend segmentation.
- **Conclusion:** large-context and continuation remain legitimate public-interface concerns. No exact current failure rate is claimed.

Issue: [#95](https://github.com/Axiomatic-AI/ax-mcp/issues/95)

## 3.3 `ax-mcp` #94

- **Issue state:** open.
- **Report:** intermittent plot extraction failures that often succeed on retry.
- **Current code:** one visible upstream request with no retry; response post-processing uses unseeded `random.sample` when limiting points.
- **Conclusion:** transient-failure handling and deterministic replay are both supported concerns. The reported one-in-five rate is attributed only to the issue reporter, not generalized.

Issue: [#94](https://github.com/Axiomatic-AI/ax-mcp/issues/94)  
Code: [`plots/server.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/plots/server.py)

## 3.4 `ax-mcp` #64

- **Issue state:** open.
- **Report:** upstream 429 exposed as 500.
- **Current shared client:** fixed timeout and `raise_for_status`; no visible retry or status taxonomy.
- **Counter-signal:** the separately generated Axiomatic Python SDK documents retry on 408/429/5xx.
- **Conclusion:** do not claim Axiomatic lacks retry globally. Claim only that public clients exhibit inconsistent visible retry behavior.

Issue: [#64](https://github.com/Axiomatic-AI/ax-mcp/issues/64)  
Client: [`api_client.py`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/shared/api_client.py)  
SDK: [`axiomatic-python-sdk`](https://github.com/Axiomatic-AI/axiomatic-python-sdk)

## 3.5 `ax-mcp` #53

- **Issue state:** open.
- **Original request:** restore AxModelFitter after temporary removal for security reasons.
- **Current code/docs:** model fitter is restored and documented as sandboxed.
- **Conclusion:** issue is stale as a feature request. It is not ranked as a current contribution target.

Issue: [#53](https://github.com/Axiomatic-AI/ax-mcp/issues/53)  
Removal: [PR #26](https://github.com/Axiomatic-AI/ax-mcp/pull/26)  
Restoration: [PR #57](https://github.com/Axiomatic-AI/ax-mcp/pull/57)

## 3.6 `ax-mcp` #40

- **Issue state:** open.
- **Original concern:** no document examples.
- **Current docs:** include a basic example and limitations.
- **Conclusion:** partially addressed, while reliability-focused examples remain absent. It is not represented as wholly unresolved.

Issue: [#40](https://github.com/Axiomatic-AI/ax-mcp/issues/40)  
Docs: [`documents/README.md`](https://github.com/Axiomatic-AI/ax-mcp/blob/ef53332b866b29b6d5d7a3dc6d77698e42334c24/axiomatic_mcp/servers/documents/README.md)

## 3.7 `ax-prover-base` #2

- **Issue state:** open.
- **Original concern:** incomplete Anthropic calls terminated runs.
- **Current code:** retryable LLM wrapper exists and applies retry to structured/tool-bound calls.
- **Current defaults:** very high maximum retry count with bounded jitter.
- **Conclusion:** likely partially addressed; not declared resolved without maintainer confirmation. Residual budget and terminal-state concerns remain inference.

Issue: [#2](https://github.com/Axiomatic-AI/ax-prover-base/issues/2)  
Code: [`utils/llm.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/utils/llm.py), [`config.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/config.py)

## 3.8 `ax-prover-base` #9

- **Issue state:** open.
- **Original concern:** warning output dominated context.
- **Current code:** builder disables warnings and the utility removes common warning/note/trace lines.
- **Residual behavior:** oversized output is compacted by keeping its beginning and end.
- **Conclusion:** immediate warning flooding appears addressed; causal middle-output preservation remains an inferred weakness.

Issue: [#9](https://github.com/Axiomatic-AI/ax-prover-base/issues/9)  
Code: [`utils/build.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/utils/build.py), [`prover/agent.py`](https://github.com/Axiomatic-AI/ax-prover-base/blob/06dfadc9ab439755af5efcfe0add95bfef2733c7/src/ax_prover/prover/agent.py)

---

## 4. People and author validation

| Work or role | Names retained | Validation |
|---|---|---|
| Grating-coupler digital twin | Maosheng Yang, Flemming Holtorf, Frank Schäfer | company post byline |
| AxProverBase | Borja Requena Pozo, Austin Letson, Krystian Nowakowski, Izan Beltran Ferreiro, Leopoldo Sarra | public paper/repository materials |
| AxDafny | Benjamin Breen, Austin Letson, Borja Requena Pozo, Leopoldo Sarra | arXiv record and company post |
| SorryDB | Austin Letson, Leopoldo Sarra, Auguste Poiroux, Oliver Dressler, Paul Lezeau, Dhyan Aranha, Frederick Pu, Aaron Hill, Miguel Corredera Hidalgo, Julian Berman, George Tsoukalas, Lenny Taelman | company publication record/post |
| Skill-Synthesizer | Jacob McCarran, Rajsuryan Singh, Carlos Arribalzaga Jové, Khaled Ahmed, Marco Del Tredici | OpenReview record and company post |
| AgentOptics | full author list in brief | arXiv record |
| Axiomatic leadership/advisors | roles retained only where present on current team page | company team page |

No person is described as owning an internal production component unless public evidence explicitly supports it.

---

## 5. Hiring and funding validation

| Claim | Source | Treatment |
|---|---|---|
| $18M seed announced in March 2026 and $25M publicly disclosed total | [BusinessWire](https://www.businesswire.com/news/home/20260309009285/en/Axiomatic-AI-Raises-%2418M-to-Build-the-Intelligence-Infrastructure-for-Verified-Science-Engineering) | retained as announcement, not independently audited financial data |
| The Engine Ventures led the round | BusinessWire and [The Engine company page](https://engineventures.com/companies/axiomatic-ai) | retained |
| Roles emphasize validation, benchmarking, persistence, fallbacks, observability, and regression evaluation | current/recent Greenhouse descriptions at audit date | retained as hiring signal, not proof of internal priority ranking |

Job pages can change or close. The brief records what was publicly visible at the evidence cutoff, not a promise that a listing remains open later.

---

## 6. Benchmark source validation

The primary benchmark was checked for:

- existence of a recognized canonical model;
- accessible publication metadata;
- public independent implementations;
- CPU feasibility;
- enough inputs and outputs for a recipe/target split;
- suitability for deterministic fault injection.

Sources:

- [TU Delft publication record](https://research.tudelft.nl/en/publications/linearized-dynamics-equations-for-the-balance-and-steer-of-a-bicy)
- [Benchmark Bicycle](https://arendschwab.com/research/benchmarkbicycle/)
- [BicycleParameters](https://bicycleparameters.readthedocs.io/stable/gallery/examples/plot_benchmark.html)
- [PyDy Carvallo–Whipple example](https://pydy.readthedocs.io/en/stable/examples/carvallo-whipple.html)

### Qualification retained

Matching canonical equations and reference implementations is computational verification and benchmark validation. It is not full experimental validation of all physical bicycles.

---

## 7. Candidate evidence audit

Public candidate claims were checked against:

- [`JJCAPPE/cv`](https://github.com/JJCAPPE/cv);
- [`JJCAPPE/pose-embedding`](https://github.com/JJCAPPE/pose-embedding);
- [`JJCAPPE/rowing-dynamics-analysis`](https://github.com/JJCAPPE/rowing-dynamics-analysis);
- the resume supplied in the conversation.

Retained evidence:

- BU Computer Engineering, expected May 2028, 3.97 GPA;
- current robust motion-retrieval research;
- production agent platform with typed contracts, governed execution, retrieval, evaluation, and traces;
- rowing video/pose/modeling pipeline with instrumented telemetry validation;
- broad Python, TypeScript, React, FastAPI, Rust, Tauri, Ruby, and data/ML experience.

No unsupported performance claim was introduced beyond the supplied resume and public repositories.

---

## 8. Connection and privacy audit

### Authorized findings retained

- direct active relationship with Brian Kulis;
- a warm one-hop research path to Christopher Liao supported by prior correspondence;
- no direct Axiomatic Gmail or Contacts match.

### Excluded

- email addresses;
- verbatim email text;
- unrelated messages;
- speculative LinkedIn degrees;
- claims that a professor can introduce Giacomo;
- claims that institutional adjacency is a personal connection.

The public package describes relationship strength and technical relevance without publishing private account content.

---

## 9. Corrections made during final audit

1. **AxModelFitter:** changed from an apparently open restoration opportunity to an open-but-stale issue because the server was restored.
2. **AxProver warnings:** changed from an unresolved raw-warning problem to a mostly addressed issue with a residual causal-compaction problem.
3. **Provider retries:** changed from a blanket claim of no retry to a narrower statement about the audited MCP client and inconsistent public behavior.
4. **Digital-twin independence:** added Grade A/B/C evidence independence and rejected the implication that a different solver alone is fully independent validation.
5. **Skill-Synthesizer:** added an OpenReview access caveat and removed unverified implementation details.
6. **Project naming:** explicitly mapped the original Verified Paper-to-Notebook Reliability Workbench hypothesis to the narrower ReproGate benchmark.
7. **Expected results:** separated pre-registered success thresholds from speculative planning forecasts.
8. **Connections:** removed any assumption that BU or MIT adjacency implies an introduction path.
9. **Axiomatic priorities:** ranked pain points are labeled analyst inference, not company-confirmed priorities.
10. **Production status:** no public issue is treated as proof of a current production outage without independent reproduction.

---

## 10. Remaining uncertainty

The following remains unknown and is labeled as such in the brief:

- Lemma's private architecture;
- production failure rates and SLOs;
- internal issue priorities;
- private fixes or duplicate issues;
- external contribution appetite;
- private AxDafny or Skill-Synthesizer repositories;
- the strength of any BU–Axiomatic personal relationship;
- LinkedIn connection degrees.

---

## 11. Final source-quality assessment

| Category | Assessment |
|---|---|
| Company program reconstruction | strong, based mainly on first-party posts and public artifacts |
| Public issue analysis | strong for issue state and audited code; production reproduction intentionally not claimed |
| Researcher mapping | strong for named paper authors and current public roles |
| Connection mapping | moderate; strongest for Brian/Christopher, lower paths clearly labeled cold or institutional |
| Project selection | inference, but supported by multiple independent signals and candidate evidence |
| Quantitative forecasts | speculative planning values, explicitly separated from evidence |
| Benchmark feasibility | strong for computational feasibility; empirical implementation still required |

**Audit result:** no known fabricated source, invented issue state, unsupported direct connection, or unqualified private-product claim remains in the package.
