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

  pages="$(pdfinfo "${ROOT_DIR}/${resume}.pdf" | awk '/^Pages:/ {print $2}')"
  if [[ "${pages}" != "1" ]]; then
    echo "ERROR: ${resume}.pdf has ${pages:-unknown} pages; expected exactly 1." >&2
    exit 1
  fi

  pdftotext -layout "${ROOT_DIR}/${resume}.pdf" "${out_dir}/${resume}.txt"

  grep -Fq "Giacomo Cappelletto" "${out_dir}/${resume}.txt"
  grep -Fq "Boston University" "${out_dir}/${resume}.txt"
  grep -Fq "Expected May 2028" "${out_dir}/${resume}.txt"

  if grep -q $'\uFFFD' "${out_dir}/${resume}.txt"; then
    echo "ERROR: replacement glyph found in extracted text for ${resume}.pdf." >&2
    exit 1
  fi

  echo "Built and validated ${resume}.pdf"
done

master_hash="$(sha256sum "${ROOT_DIR}/resume-master.pdf" | awk '{print $1}')"
canonical_hash="$(sha256sum "${ROOT_DIR}/resume-giacomo-cappelletto.pdf" | awk '{print $1}')"
if [[ "${master_hash}" != "${canonical_hash}" ]]; then
  echo "ERROR: canonical resume PDF must remain identical to resume-master.pdf." >&2
  exit 1
fi

echo "All resume PDFs compiled, parsed, and validated."
