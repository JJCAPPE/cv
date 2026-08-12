# Resume variants

This directory contains the shared ATS-safe LaTeX template and the content files used by each targeted resume.

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
| `resume-devtools-agents.tex` | `resume-devtools-agents.pdf` | Developer tools, agent runtimes, AI coding/workflow systems |

## Architecture

- `template.tex` owns the one-column layout, contact header, standard section styling, ATS-oriented PDF settings, and shared macros.
- `content/*.tex` contains role-specific ordering, bullets, projects, and skills.
- The root-level `.tex` files are thin wrappers that select a content file.
- `scripts/compile-resumes.sh` compiles all variants and fails unless every PDF:
  - compiles without LaTeX errors;
  - is exactly one page;
  - exposes the candidate name, university, and graduation date through text extraction;
  - contains no Unicode replacement characters.
- The canonical PDF is checked byte-for-byte against the master PDF.

## Build

```bash
make resumes
```

Required local packages:

- `latexmk`
- a standard pdfLaTeX distribution
- `poppler-utils`

The GitHub Actions workflow recompiles every PDF, commits synchronized binaries on `resume-*` feature branches, and verifies source/PDF parity on pull requests and `main`.
