# Axiomatic research package completeness checklist

**Audit date:** 22 August 2026  
**Target branch:** `outreach/axiomatic-research-brief`  
**Target base:** `main`

---

## 1. Required-output coverage

| Requirement | Location | Status |
|---|---|---|
| 1. Axiomatic technical-program map | `axiomatic-research-brief.md` §§2–2.11 | Complete |
| 2. Researcher and engineer map | `axiomatic-research-brief.md` §3 | Complete |
| 3. Ranked public pain points with evidence | §§4–5; `source-audit.md` §3 | Complete |
| 4. Three or four project options with scoring | §6 | Complete — four options |
| 5. Exactly one selected project | executive decision and §6.4 | Complete — ReproGate only |
| 6. Complete experimental and engineering specification | §§7–21; `reprogate-experiment-spec.md` | Complete |
| 7. Recommended paper/benchmark corpus | §8 | Complete |
| 8. Two-week and six-week plans | §§23–24 | Complete |
| 9. Expected quantitative results and thresholds | §22 | Complete; thresholds separated from forecasts |
| 10. Connection map with at least five paths | §27; `connection-map.md` | Complete — eight named paths |
| 11. Three people to approach first | §28; `connection-map.md` §5 | Complete |
| 12. Company-specific builder narrative | §29 | Complete |
| 13. Repository name, structure, README outline, demo, abstract | §§30–33 | Complete |
| 14. Source appendix with dates and citations | §36; `sources.yaml`; `source-audit.md` | Complete |

---

## 2. Requested technical topics

| Topic | Coverage | Status |
|---|---|---|
| Lemma as scientific/engineering co-explorer | §2.2 | Complete |
| Literature-to-computational-model workflow | §2.3 | Complete |
| Recipe versus validation separation | §§2.3, 11 | Complete |
| Simulation V&V gates | §§2.3, 14 | Complete |
| Domain tool orchestration | §2.4 | Complete |
| AxProverBase loop | §2.5 | Complete |
| AxProver MCP/GitHub workflow | §2.6 | Complete |
| AxDafny correctness/efficiency gap | §2.7 | Complete |
| SorryDB dynamic benchmarks | §2.8 | Complete |
| Skill-Synthesizer memory | §2.9 | Complete with public-access caveat |
| SDKs, MCPs, repositories, datasets, benchmarks | §§2.4–2.10 and source register | Complete |
| Hiring and enterprise-deployment signals | §2.11 | Complete |
| Authors for specified recent work | §§2–3 | Complete |

---

## 3. Public issue audit

| Issue | Current state re-fetched | Current code inspected | Staleness reconciled | Status |
|---|---:|---:|---:|---|
| `ax-mcp` #108 | Yes | Yes | Yes | Complete |
| `ax-mcp` #95 | Yes | Yes | Yes | Complete |
| `ax-mcp` #94 | Yes | Yes | Yes | Complete |
| `ax-mcp` #64 | Yes | Yes | Yes | Complete |
| `ax-mcp` #53 | Yes | Yes | Yes — restored implementation identified | Complete |
| `ax-mcp` #40 | Yes | Yes | Yes — basic examples now exist | Complete |
| `ax-prover-base` #2 | Yes | Yes | Yes — retry support now exists | Complete |
| `ax-prover-base` #9 | Yes | Yes | Yes — warnings suppressed, residual compaction issue noted | Complete |

No issue is treated as proof of a current production outage without independent reproduction.

---

## 4. Project-selection audit

| Check | Result |
|---|---|
| Not a generic RAG system | Pass |
| Not a paper summarizer | Pass |
| Not a PDF chatbot | Pass |
| Not a superficial Lean demo | Pass |
| Not a generic AI scientist interface | Pass |
| Not a clone of proprietary Lemma | Pass |
| Uses an open, ordinary scientific solver | Pass — NumPy/SciPy/SymPy primary case |
| Feasible without proprietary Axiomatic access | Pass |
| Has falsifiable research claims | Pass |
| Has deterministic and model-assisted components separated | Pass |
| Has explicit false-pass metric | Pass |
| Has formal workflow invariants | Pass |
| Has a realistic two-week MVP | Pass |
| Has a meaningful six-week extension | Pass |
| Fits candidate evidence | Pass |

---

## 5. ReproGate specification audit

| Component | Status |
|---|---|
| Robust page-level ingestion | Complete |
| Section-aware processing | Complete |
| Parser fallback and retry | Complete |
| Token estimation and explicit failure | Complete |
| Text/equation/table/figure/caption representation | Complete |
| Evidence and provenance graph | Complete |
| Stated/inferred/assumption/default distinctions | Complete |
| Contradiction representation | Complete |
| Recipe/target runtime firewall | Complete |
| Target canary and influence tests | Complete |
| Deterministic executable artifact | Complete |
| Open simulation domain | Complete |
| V&V verdict semantics | Complete |
| Independence grades | Complete |
| Fault-injection suite | Complete |
| Evaluation metrics | Complete |
| Baselines and ablations | Complete |
| Statistical protocol | Complete |
| Error-analysis packets | Complete |
| Reproducibility contract | Complete |
| Compute/cost envelope | Complete |
| Stop and redirect conditions | Complete |

---

## 6. Source-quality audit

| Check | Result |
|---|---|
| First-party sources used for company/product claims | Pass |
| Primary papers used for research claims | Pass |
| Immutable revisions used for code claims | Pass |
| Issue states re-fetched | Pass |
| Current code compared with stale tickets | Pass |
| OpenReview access limitation disclosed | Pass |
| Job-listing temporality disclosed | Pass |
| Funding treated as announcement, not independently audited financial fact | Pass |
| Predictions labeled speculative | Pass |
| Internal company priority ranking labeled inference | Pass |
| Unknown proprietary details explicitly excluded | Pass |
| No invented direct connection | Pass |
| No private email text or address in package | Pass |

Detailed findings are in `source-audit.md`; machine-readable records are in `sources.yaml`.

---

## 7. Privacy and outreach-scope audit

- No email was sent.
- No employee was contacted.
- No introduction was requested.
- No application was submitted.
- No Axiomatic issue or PR was created.
- No Axiomatic API or system was exercised.
- Authorized account data is summarized only at the relationship level.
- No email addresses, message quotations, or unrelated private correspondence are published.

---

## 8. Internal consistency audit

| Check | Result |
|---|---|
| One selected project everywhere | Pass — ReproGate |
| Original workbench hypothesis mapped to ReproGate | Pass |
| Same benchmark paper across documents | Pass |
| Same primary endpoint across documents | Pass — TAR |
| Same thresholds across brief and experiment spec | Pass |
| Same evidence labels across package | Pass |
| Same code revisions across package | Pass |
| Connection strengths consistent | Pass |
| Contact timing consistent | Pass |
| Forecasts separated from measured evidence | Pass |
| “Validation” terminology qualified | Pass |

---

## 9. Remaining validation required during implementation

The research package is complete, but these are implementation-time obligations rather than facts already established:

1. reproduce the canonical bicycle model;
2. verify exact source-document licensing and acquisition workflow;
3. create and adjudicate gold annotations;
4. implement the builder/validator isolation boundary;
5. measure whether target leakage occurs in B0;
6. run paired fault trials;
7. measure actual latency, token use, cost, and memory;
8. obtain domain review before claiming scientific validity;
9. revise thresholds if the pre-registration changes before experiments;
10. publish negative results and limitations.

---

## 10. Final readiness result

**Package status:** ready for review as a research and outreach-planning artifact.

**Not yet claimed:** ReproGate has not been implemented, benchmark results have not been measured, and no Axiomatic engineer has validated the hypothesis.
