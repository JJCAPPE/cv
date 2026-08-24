#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_ROOT="${ROOT_DIR}/.resume-build"

RESUMES=(
  "resume-master"
  "resume-giacomo-cappelletto"
  "resume-swe-infrastructure"
  "resume-ai-ml"
  "resume-quant-finance"
  "resume-data-systems"
  "resume-cv-multimodal"
  "resume-devtools-agents"
)

export TZ=UTC
export SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-0}"
export FORCE_SOURCE_DATE=1

rm -rf "${BUILD_ROOT}"
mkdir -p "${BUILD_ROOT}"

for resume in "${RESUMES[@]}"; do
  out_dir="${BUILD_ROOT}/${resume}"
  mkdir -p "${out_dir}"

  latexmk \
    -pdf \
    -interaction=nonstopmode \
    -halt-on-error \
    -file-line-error \
    -outdir="${out_dir}" \
    "${ROOT_DIR}/${resume}.tex"

  cp "${out_dir}/${resume}.pdf" "${ROOT_DIR}/${resume}.pdf"
  echo "Built ${resume}.pdf"
done

cp "${ROOT_DIR}/resume-master.pdf" "${ROOT_DIR}/site/public/resume.pdf"
python3 "${ROOT_DIR}/scripts/validate-resumes.py"

echo "All resume PDFs compiled and passed evidence, ATS, link, and layout gates."
