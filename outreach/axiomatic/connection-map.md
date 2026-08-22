# Axiomatic AI connection map and outreach sequence

**Evidence cutoff:** 22 August 2026  
**Scope:** authorized research and planning only; no contact, introduction request, application, or issue interaction has been performed.

---

## 1. Strength rubric

| Score | Meaning |
|---:|---|
| 5 | active direct relationship |
| 4 | evidenced warm one-hop path |
| 3 | institutional or research-community bridge |
| 2 | cold but strongly artifact-relevant |
| 1 | ecosystem adjacency only |

A high score does not imply that the person can or will make an introduction. That is treated separately.

---

## 2. Authorized-account findings

- **[A] No direct Axiomatic correspondence** was found in the authorized Gmail search.
- **[A] No saved Axiomatic employee contact** was found in Google Contacts.
- **[A] Brian Kulis is an active direct research relationship** for Giacomo.
- **[A] Prior correspondence records that Brian discussed Giacomo's current metric-learning research plan with Christopher Liao**, who gave a positive technical reaction.
- **[N] No authorized LinkedIn connection graph was available.** No LinkedIn degree or mutual connection is asserted.
- **[N] It is unknown whether any BU contact has a sufficiently strong Axiomatic relationship to make an introduction.**

These findings justify a science-first sequence through current academic relationships, not an immediate request for access.

---

## 3. Priority paths

| Person | Current public role or association | Technical relevance | Evidence-backed chain | Strength | Validate problem | Advise science | Introduce | Initial technical question | Timing |
|---|---|---|---|---:|---|---|---|---|---|
| **Brian Kulis** | BU professor in ECE and computing; research in metric learning, retrieval, optimization, and machine learning | Experimental design, robustness metrics, composite endpoints, paired evaluation | Giacomo → direct supervisor | **5** | Yes | Yes | **[N] unknown** | Is Trustworthy Artifact Rate a defensible primary endpoint, or should decision correctness and recovery be co-primary outcomes? | **Before prototype** |
| **Christopher Liao** | Contextual-similarity and metric-learning researcher; coauthor with Brian Kulis | Corruption severity, retrieval metrics, evaluation gaming, annotation shortcuts | Giacomo → Brian Kulis → Christopher Liao | **4** | Yes | Likely | Unknown | How should corruption severity and provenance-retrieval metrics prevent apparent gains from abstention or repeated annotation patterns? | **Before or during MVP** |
| **Miloš Popović** | BU ECE associate professor in integrated photonics | Numerical/experimental independence, photonics assumptions, simulation validation | Giacomo → BU ECE and Photonics Center → Popović | **3** | Yes | Likely | **[S] possible, unsupported** | Which shared assumptions most often make two photonic simulations appear independent when they are actually coupled? | **After MVP** |
| **Frank Schäfer** | Axiomatic research scientist; public grating-coupler digital-twin author | Scientific modeling, uncertainty, executable methods, validation independence | Giacomo → public ReproGate artifact → relevant paper author | **2** | Highly relevant | Possible | Not initially | Which independence dimension most often creates false confidence despite a small numerical residual? | **After public MVP** |
| **Austin Letson** | Publicly associated with AxProver, AxDafny, and SorryDB | Dynamic benchmarks, exact environments, contamination resistance, formal-agent evaluation | Giacomo → public benchmark and quantitative results → author | **2** | Yes | Possible | Not initially | Which SorryDB design properties mattered most for preventing static benchmark saturation, and which transfer to paper-to-simulation evaluation? | **After quantitative results** |
| **Flemming Holtorf** | Axiomatic researcher associated with digital twins, AgentOptics, Tidy3D/PDE and public MCP work | Domain-tool orchestration, simulation state, failure recovery | Giacomo → public artifact → shared technical problem | **2** | Yes | Possible | Not initially | Which workflow state must survive a failed tool call for recovery to remain scientifically valid rather than merely operational? | **After MVP** |
| **Borja Requena Pozo** | AxProverBase and AxDafny author; public Axiomatic contributor | Proposer/compiler/reviewer loops, formal workflow invariants, feedback context | Giacomo → TLA+ firewall and benchmark results → author | **2** | Yes | Possible | Not initially | Should validation evidence be modeled as a capability rather than only as a separate data store? | **After results** |
| **Dirk Englund** | Axiomatic cofounder and chief scientific officer; MIT EECS professor; AgentOptics author | Scientific-agent direction, photonics, and reporter of public MCP failure surfaces | Giacomo → public artifact; possible later route through Boston photonics community | **2** | Yes | Possible | Not applicable | Which assurance failure is hardest to observe before a literature-derived engineering agent reaches a user? | **Only after strong results** |

---

## 4. Supporting institutional paths

### Boston University Photonics Center

**Relevance:** integrated photonics, optical systems, simulation, experimental validation, and technical events.

Potential value:

- validate the distinction between numerical cross-check and experimental validation;
- review a later photonics benchmark case;
- connect Giacomo with local domain experts without beginning with company outreach.

Do not claim that the Photonics Center has a formal Axiomatic partnership unless a current primary source establishes it.

### BU ECE and scientific computing

Potential validators include faculty working in:

- photonics;
- controls and dynamical systems;
- numerical methods;
- formal methods and programming languages;
- machine learning and retrieval.

The first request should be a narrow technical review, not career help.

### MIT engineering, EECS, and photonics communities

Axiomatic has strong public MIT connections through Dirk Englund and its founding network. This is an institutional adjacency, not a personal connection. It becomes relevant only when ReproGate has results specific enough to justify an expert question.

### The Engine Ventures

The Engine publicly backs Axiomatic. Investor outreach is not recommended before technical engagement because Giacomo's objective is a research-engineering opportunity, not fundraising or executive access.

### ICML 2026 and workshops

Conference authors and workshop participants can be useful when their published work directly intersects:

- scientific-agent evaluation;
- verification-guided generation;
- long-term agent memory;
- robust retrieval;
- AI for engineering.

Do not use conference attendance alone as a connection claim. Require a paper, panel, public discussion, or direct prior interaction.

---

## 5. Three people to approach first

No message should be sent until the stated artifact milestone.

## 5.1 Brian Kulis — first

**Timing:** before the implementation protocol is locked.  
**Goal:** validate research design, not obtain an introduction.

Suggested question:

> I am defining the primary result as Trustworthy Artifact Rate: executable, provenance-correct, decision-correct, leakage-free, and exactly replayable. Is that a defensible composite endpoint, or would you separate decision correctness and recovery into co-primary outcomes? I am planning paired fault scenarios with McNemar and bootstrap analysis.

Evidence that must exist before this conversation:

- one-page protocol;
- primary endpoint definition;
- baseline and paired-run design;
- draft fault taxonomy;
- explicit stop conditions.

## 5.2 Christopher Liao — second

**Timing:** after the corruption ontology and annotation protocol exist.  
**Path:** through Brian only if Brian considers it technically useful and appropriate.  
**Goal:** test robustness evaluation for gaming and shortcut behavior.

Suggested question:

> I am evaluating paper-to-simulation robustness under missing pages, conflicting values, and target leakage. How would you structure corruption severity and retrieval-style provenance metrics so an agent cannot appear more robust merely by abstaining more often or exploiting repeated annotation patterns?

Evidence that must exist:

- corruption severity scale;
- annotation guide;
- abstention accounting;
- provenance precision/recall definition;
- several labeled examples.

## 5.3 Frank Schäfer — third

**Timing:** only after a public MVP and initial quantitative results.  
**Goal:** obtain a company-specific technical critique from a relevant research author.

Suggested question:

> I implemented a runtime firewall that prevents model construction from reading sealed validation targets, then grade validation evidence by derivation, solver, and assumption independence. In your digital-twin work, which independence dimension is most likely to produce a false sense of validation even when the numerical residual is small?

Evidence that must exist:

- public repository;
- one clean paper-to-simulation case;
- target-canary invariance result;
- fault-recovery demo;
- quantitative baseline table;
- concise limitations section.

---

## 6. Recommended sequence

### Stage 0 — before prototype

1. Ask Brian Kulis for methodological critique.
2. Revise the endpoint, fault ontology, and statistical design.
3. Ask for a Christopher Liao discussion only when it would materially improve the research.

### Stage 1 — after executable MVP

1. Obtain a mechanics or controls review of the bicycle model.
2. Ask Miloš Popović or another domain expert about validation independence before adding photonics.
3. Publish the repository and reproducibility package.

### Stage 2 — after first results

1. Approach Frank Schäfer with the validation-independence question.
2. Approach Flemming Holtorf with the workflow-resumption question.
3. Approach Austin Letson or Borja Requena with benchmark/formal-invariant questions.

### Stage 3 — after external technical feedback

Only then consider:

- a role-specific conversation;
- an internship or research-opportunity inquiry;
- an introduction request from someone who has independently judged the artifact useful.

Executive outreach remains lower priority than research-author and engineer outreach.

---

## 7. What not to ask initially

Do not lead with:

- “Are you hiring interns?”
- “Can you refer me?”
- “Can you introduce me to the founders?”
- “Can you share how Lemma works internally?”
- “Can I contribute to this open issue?” without current reproduction and a scoped proposal.

Lead with one narrow technical question tied to a public artifact and measured result.

---

## 8. Builder narrative for outreach

> I build scientific and enterprise agent systems in which generated outputs must survive typed contracts, trace inspection, controlled corruption, and external validation. My production agent work included governed execution, citation-backed retrieval, evidence review, versioned prompts, evaluation, and end-to-end tracing. My current research measures motion-retrieval robustness under noise, occlusion, temporal jitter, and viewpoint shift. In prior biomechanics work I aligned video-derived models with instrumented telemetry and built reproducible reports and model bundles. ReproGate applies that operating style to paper-to-simulation agents by measuring provenance, recovery, validation independence, and replay rather than only whether a notebook executes.

This is the company-specific narrative. Avoid generic claims such as “I am passionate about AI for science.”

---

## 9. Evidence sources

- [Brian Kulis](https://people.bu.edu/bkulis/)
- [Christopher Liao, contextual-similarity work](https://proceedings.mlr.press/v202/liao23b.html)
- [Miloš Popović](https://www.bu.edu/eng/profile/milos-popovic/)
- [Frank Schäfer](https://frankschae.github.io/)
- [Austin Letson](https://austinletson.com/)
- [Axiomatic team](https://axiomatic-ai.com/team/)
- [Grating-coupler digital twin](https://axiomatic-ai.com/blog/grating-coupler-digital-twin)
- [AxProverBase](https://github.com/Axiomatic-AI/ax-prover-base)
- [AgentOptics](https://arxiv.org/abs/2602.20144)

Private-account evidence is summarized at a relationship level only. Email addresses, message text, and unrelated correspondence are intentionally excluded from this public package.
