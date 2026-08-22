# GE Vernova Research Brief — Verification Log

**Research cut-off:** 22 August 2026  
**Status:** Final pre-PR audit  
**Files audited:** [`ge-vernova-research-brief.md`](./ge-vernova-research-brief.md) · [`sources.md`](./sources.md) · [`README.md`](./README.md)

## Audit outcome

The package separates public evidence from inference and private unknowns. No unresolved item below is silently converted into a verified claim.

## Material corrections and downgrades

| Item | Risk in the earlier draft | Audited treatment |
|---|---|---|
| **R5049970 dates** | The body and structured header use different start-date language. | The brief reports the structured header, **13 August–30 September 2026**, and preserves the body’s separate 12 August reference as a caveat. |
| **R5049890 dates** | Stale search indexes showed a 21 August closing date. | The live structured header checked on 22 August showed **13 August–30 September 2026**. The stale date is not used as current status. |
| **R5049957 status** | Could be represented as open after its stated end date. | Reported as **closed/removed after closing**; the indexed first-party record supports scope and dates. |
| **R5049865 authorization** | “No sponsorship” could be understated. | The official wording requires authorization without sponsorship **for an unlimited amount of time**; this is treated as materially stricter than temporary CPT. |
| **R5050417 authorization** | Internship-period language could be conflated with indefinite authorization. | The exact role-specific wording is preserved and its CPT interpretation remains an employer question. |
| **Cambridge MCI job ID and dates** | Job-board UUIDs and conflicting mirror dates could be presented as official. | No official `R...` ID is reported. Scope and bachelor’s eligibility are medium confidence; exact dates/ID remain unresolved. |
| **Historical Agentic/TSFM/Sustainability roles** | Removed pages could be treated as live or complete. | Technical scope is reconstructed from named posts/institutional evidence/mirrors and explicitly downgraded. |
| **Cambridge–Niskayuna structure** | Geography could be converted into an invented organization chart. | Joint role locations and required ARC residency are verified. The product/customer versus research/testing division is labeled **Strong inference**. |
| **CHRO wording** | The user’s relationship label could be mapped to an unsupported title. | GE Vernova’s verified senior people leader is Steven Baert, **Chief People Officer**. No personal relationship is asserted. |
| **Head of talent** | A directory listing could be treated as first-party proof. | Jeff Scolnick is retained only as a Tier C public title match; identity and relationship must be independently confirmed. |
| **Reported technology recruiter** | A public recruiter could be substituted for the actual relationship. | Authorized Gmail, Contacts, Drive, repository, and stored-context searches did not identify the person. The exact contact remains **Not publicly knowable**. |
| **Agent scope** | A forecasting/optimization/agent/UI MVP could become superficial. | The agent is explicitly deferred until the deterministic numerical result exists. |
| **Foundation-model superiority** | The project could presume the TSFM wins. | Strong baselines control the comparison, and a negative TSFM result is an explicit valid outcome. |
| **ISO-NE licensing** | Public accessibility could be interpreted as unrestricted redistribution. | The plan publishes adapters, manifests, and permitted fixtures—not bulk raw ISO-NE extracts—until terms are confirmed. |
| **Emissions interpretation** | eGRID average rates could be labeled hourly marginal emissions. | eGRID and AVERT are assigned distinct, disclosed uses; neither is represented as observed hourly marginal emissions. |
| **Datacenter magnitude** | Synthetic 50–200 MW cases could be described as actual forecast projects. | Every scenario contract carries `synthetic=true`; the brief explicitly denies ISO-NE-project or interconnection meaning. |
| **Grid engineering boundary** | Scheduling results could imply power-flow, protection, stability, or converter validation. | The limitations exclude operational control, interconnection, power flow, stability, protection, switching, EMT, thermal, and BMS claims. |
| **CPT conclusion** | “No sponsorship” could be interpreted as automatically accepting CPT. | The brief states what the postings say, what BU CPT requires, and what only the employer can answer. |
| **Recruiting sequence** | Waiting for a finished project could miss already-open roles. | Role/CPT clarification and build work proceed in parallel; technical artifact outreach still waits for measured results. |

## Private-source audit

Authorized searches were read-only and produced no GE Vernova-specific relationship record:

- Gmail: GE Vernova, GE, recruiter, talent, and senior HR terms;
- Google Contacts: GE Vernova and General Electric;
- Google Drive: GE Vernova and General Electric;
- accessible GitHub repositories and candidate materials;
- stored personal context.

This negative result does not prove that the relationships do not exist. It means they cannot be named, scored, or used from the evidence available here.

## Completeness audit

| Required deliverable | Result |
|---|---|
| 1. Executive recommendation, maximum 12 lines | **Pass** — 10 numbered lines |
| 2. Internship and senior-role matrix | **Pass** |
| 3. Cambridge–Niskayuna map | **Pass** |
| 4. Technical-priority map | **Pass** |
| 5. Six or more problem hypotheses | **Pass** — eight |
| 6. Numerical project comparison | **Pass** — leading project plus Alternatives A–D, 15 criteria |
| 7. Selected-project specification | **Pass** |
| 8. Public-data/licensing map | **Pass** |
| 9. Two-week MVP | **Pass** |
| 10. Four-to-six-week extension | **Pass** |
| 11. Quantitative evaluation | **Pass** |
| 12. Repository specification | **Pass** |
| 13. Ten-minute demo | **Pass** |
| 14. Approximately 150-word abstract | **Pass** — 144 words by automated count |
| 15. Network map with at least eight paths | **Pass** |
| 16. Contact order and exact asks | **Pass** |
| 17. Aug 2026–May 2027 calendar | **Pass** |
| 18. Work-authorization findings and recruiter question | **Pass** |
| 19. Builder narrative grounded in candidate evidence | **Pass** |
| 20. Direct-link source appendix | **Pass** — 55 entries |

## Automated structural checks

- Sections `1` through `20` each occur exactly once at level two.
- All four epistemic labels occur in the brief.
- All source keys referenced in the brief exist in the 55-entry registry.
- Project scores contain 15 integers from 0–10; totals equal **126, 111, 118, 94, and 102**.
- Markdown code fences are balanced.
- `TODO`, `TBD`, `PLACEHOLDER`, and fake `R000...` identifiers do not appear.
- The abstract is within the 130–180-word acceptance band.
- The limitation block contains public/synthetic-data, unaffiliated-product, operational-control, interconnection, protection, and confidential-economics boundaries.
- The exact recruiter and BU CPT questions are present.
- Current-role source links use official GE Vernova careers pages.
- Historical mirror identifiers are not represented as official requisition numbers.

## Source-validity checks

Primary pages were re-opened or retrieved for the material claims, including:

- live GE Vernova roles R5049970, R5049890, R5050417, R5049865, R5044308, R5046546, and R5050345;
- the indexed/removed R5049957 record;
- ARC expansion/research and datacenter-power material;
- GridOS Transmission and Distribution;
- EIA, ISO-NE, NOAA, EPA eGRID, and EPA AVERT;
- Chronos-2, TimesFM 2.5, Moirai 2.0, and Granite TSFM primary repositories;
- BU ISSO/ENG CPT guidance;
- BU/IEEE sources for Philip Hart and Masoud Abbaszadeh;
- GE Vernova’s official Steven Baert leadership page.

Historical mirrors are retained only where official pages were unavailable and are marked Tier C.

## Residual unknowns

1. Named hiring manager and recruiter for each requisition.
2. Whether R5049970, R5049890, R5049957, or R5050417 accepts F-1 CPT.
3. Whether Cambridge Market & Customer Insights recurs for Summer 2027.
4. Whether the Agentic Engineering or TSFM internships recur and whether degree requirements change.
5. Exact reporting lines and shared recruiting/code/data relationships across Cambridge, ARC, PCS, and Grid Software.
6. Giacomo’s declared BU concentration and final CPT curricular eligibility.
7. Exact identity and strength of the reported recruiter, head-of-talent, and senior HR relationships.
8. Whether any public technical employee is willing or authorized to review an unsolicited artifact.

These are represented as questions or decision gates, not facts.
