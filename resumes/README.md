# Resume variants

The root `resume-giacomo-cappelletto.tex` is the general one-page master application resume. It intentionally prioritizes recruiter scan speed, measurable engineering impact, standard section names, linear PDF text extraction, and broad SWE/AI relevance.

Targeted variants:

- `resume-swe-infra.tex` — general SWE/backend/platform/infrastructure baseline (currently imports the optimized master).
- `resume-ai-ml.tex` — AI/ML, applied AI, ML engineering, LLM/agent and ML-platform roles.
- `resume-quant-finance-swe.tex` — quant developer, trading technology, financial SWE, systems/data engineering roles; moves Python/C++/Rust and performance/data work forward and de-emphasizes frontend/product details.
- `resume-cv-multimodal.tex` — computer vision, multimodal ML, robotics perception, human-motion and research-engineering roles.

## Tailoring rules

1. Keep submitted undergraduate resumes to one page.
2. Do not add a summary/profile unless a specific application has a clear reason for one.
3. Prefer measured outcomes and scope over lists of implementation details.
4. Keep only skills demonstrated by experience/projects or directly relevant to the target posting.
5. Mirror exact truthful keywords from the job description when selecting the variant and making a final application-specific pass.
6. Never invent metrics. Add Banca Mediolanum usage, evaluation, latency, document, workflow, cost, or stakeholder metrics only when defensible.
7. Use the U.S.-focused header for U.S. applications; do not add the Italian phone/location unless applying in Europe.
8. Preserve `glyphtounicode` and `pdfgentounicode` and test generated PDFs with plain-text extraction after formatting changes.

## Remaining evidence upgrades

The highest-value future improvement is quantitative evidence for the Banca Mediolanum internship: actual users/stakeholders, evaluation-set size, indexed documents, governed prompts/tools, latency, quality improvement, deployment-cycle improvement, cost, or manual time saved. The current text deliberately avoids unsupported numbers.
