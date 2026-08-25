# Resume variants

This directory contains the shared ATS-safe LaTeX template, role-specific content, evidence ledger, and deterministic validation gates used by every resume.

## Outputs

| Source | PDF | Intended use |
|---|---|---|
| `resume-master.tex` | `resume-master.pdf` | General software / AI applications |
| `resume-giacomo-cappelletto.tex` | `resume-giacomo-cappelletto.pdf` | Canonical alias of the master resume |
| `resume-swe-infrastructure.tex` | `resume-swe-infrastructure.pdf` | Backend, platform, systems, and general SWE |
| `resume-ai-ml.tex` | `resume-ai-ml.pdf` | Applied AI, ML engineering, and model evaluation |
| `resume-quant-finance.tex` | `resume-quant-finance.pdf` | Quant development and finance technology |
| `resume-data-systems.tex` | `resume-data-systems.pdf` | Data engineering, data platforms, and analytics infrastructure |
| `resume-cv-multimodal.tex` | `resume-cv-multimodal.pdf` | Computer vision, pose estimation, multimodal, and robotics perception |
| `resume-devtools-agents.tex` | `resume-devtools-agents.pdf` | Developer tools, agent runtimes, and AI workflow systems |

## Architecture

- `template.tex` owns the one-column layout, canonical contact links, section styling, ATS-oriented PDF settings, and shared macros.
- `content/*.tex` contains role-specific ordering, bullets, projects, links, and skills.
- `evidence-ledger.json` records the public source, measurement boundary, permitted wording, and target variants for material claims.
- `reviewer-scorecard.md` operationalizes the ten-second and sixty-second human-review gates that cannot be automated honestly in CI.
- The root `.tex` files are thin wrappers selecting one content file.
- `scripts/compile-resumes.sh` compiles all variants, synchronizes the website copy, and invokes `scripts/validate-resumes.py`.
- Resume feature branches may use either `resume-*` or `resume/**`; CI synchronizes generated PDFs for both naming conventions.

## Build

```bash
make resumes
```

Required local packages:

- `latexmk` and a standard pdfLaTeX distribution;
- `poppler-utils`;
- `qpdf`;
- Python 3 with `PyMuPDF`.

## Completion gates

The build fails unless:

- all eight PDFs compile without LaTeX or qpdf errors;
- every PDF is unencrypted, exactly one page, and no larger than 250 KB;
- fonts are embedded and subsetted;
- Poppler and PyMuPDF extraction have at least 0.99 token-set similarity;
- critical identity, education, graduation, and experience fields extract correctly;
- no Unicode replacement characters or stale portfolio domains remain;
- every variant contains its expected canonical and project links;
- the master and canonical PDFs are byte-identical;
- `site/public/resume.pdf` is byte-identical to the master;
- the master remains between 450 and 525 extracted words, 12 and 14 rendered bullets, and 0.7 to 1.3 inches of bottom clearance;
- the master contains two linked projects and the required quantified or formal-evaluation evidence;
- every evidence-ledger claim has HTTPS sources, a measurement boundary, approved wording, and `public_safe: true`.

The GitHub Actions workflow recompiles every PDF, verifies source/PDF parity on pull requests and `main`, and uploads the validated artifacts. Human-review completion is recorded separately with `reviewer-scorecard.md`; it is not represented as an automated pass.
