#!/usr/bin/env python3
"""Deterministic structural, evidence, ATS, and link validation for resume PDFs."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Iterable

import fitz

ROOT = Path(__file__).resolve().parents[1]
RESUMES = [
    "resume-master",
    "resume-giacomo-cappelletto",
    "resume-swe-infrastructure",
    "resume-ai-ml",
    "resume-quant-finance",
    "resume-data-systems",
    "resume-cv-multimodal",
    "resume-devtools-agents",
]

BASE_LINKS = {
    "mailto:giacomo.cappelletto@icloud.com",
    "tel:+18577530133",
    "https://www.linkedin.com/in/giacomo-cappelletto/",
    "https://github.com/JJCAPPE",
    "https://www.giacomocappelletto.com/",
}

PROJECT_LINKS = {
    "resume-master": {
        "https://rowbook.vercel.app/",
        "https://github.com/JJCAPPE/rowbook",
        "https://noteworthy-giacomo-cappellettos-projects.vercel.app/",
        "https://github.com/JJCAPPE/NoteWorthy",
    },
    "resume-giacomo-cappelletto": {
        "https://rowbook.vercel.app/",
        "https://github.com/JJCAPPE/rowbook",
        "https://noteworthy-giacomo-cappellettos-projects.vercel.app/",
        "https://github.com/JJCAPPE/NoteWorthy",
    },
    "resume-swe-infrastructure": {
        "https://noteworthy-giacomo-cappellettos-projects.vercel.app/",
        "https://github.com/JJCAPPE/NoteWorthy",
        "https://www.giacomocappelletto.com/projects/deskinator",
        "https://github.com/JJCAPPE/deskinator",
    },
    "resume-ai-ml": {
        "https://www.giacomocappelletto.com/research/rowing-biomechanics",
        "https://github.com/JJCAPPE/rowing-dynamics-analysis",
        "https://noteworthy-giacomo-cappellettos-projects.vercel.app/",
        "https://github.com/JJCAPPE/NoteWorthy",
    },
    "resume-quant-finance": {
        "https://github.com/JJCAPPE/arbitrage-model",
        "https://www.giacomocappelletto.com/projects/move",
    },
    "resume-data-systems": {
        "https://www.giacomocappelletto.com/projects/move",
        "https://rowbook.vercel.app/",
        "https://github.com/JJCAPPE/rowbook",
    },
    "resume-cv-multimodal": {
        "https://www.giacomocappelletto.com/research/rowing-biomechanics",
        "https://github.com/JJCAPPE/rowing-dynamics-analysis",
        "https://www.giacomocappelletto.com/projects/deskinator",
        "https://github.com/JJCAPPE/deskinator",
    },
    "resume-devtools-agents": {
        "https://www.giacomocappelletto.com/projects/move",
        "https://noteworthy-giacomo-cappellettos-projects.vercel.app/",
        "https://github.com/JJCAPPE/NoteWorthy",
    },
}

STALE_DOMAINS = ("cv-nu-sage.vercel.app", "giacomo-cappelletto.app")
CRITICAL_TEXT = (
    "Giacomo Cappelletto",
    "Boston University",
    "Expected May 2028",
    "Banca Mediolanum",
    "Software & AI Engineering Intern",
)


def fail(message: str) -> None:
    raise AssertionError(message)


def normalized_tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+(?:[.+/-][a-z0-9]+)*", text.lower()))


def jaccard(a: Iterable[str], b: Iterable[str]) -> float:
    sa, sb = set(a), set(b)
    if not sa and not sb:
        return 1.0
    return len(sa & sb) / len(sa | sb)


def extract_pdftotext(path: Path) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", str(path), "-"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def pdf_integrity_check(path: Path) -> None:
    if shutil.which("qpdf"):
        command = ["qpdf", "--check", str(path)]
    elif shutil.which("gs"):
        command = [
            "gs",
            "-q",
            "-dNOPAUSE",
            "-dBATCH",
            "-sDEVICE=nullpage",
            str(path),
        ]
    else:
        fail("neither qpdf nor Ghostscript is available for PDF integrity checking")
    subprocess.run(
        command,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )


def validate_fonts(doc: fitz.Document, name: str) -> None:
    fonts = doc.get_page_fonts(0, full=True)
    if not fonts:
        fail(f"{name}: no fonts found")
    for font in fonts:
        xref, _ext, _kind, basefont = font[:4]
        if xref <= 0:
            fail(f"{name}: unembedded font detected: {basefont}")
        if "+" not in basefont:
            fail(f"{name}: font is not subsetted: {basefont}")


def validate_ledger() -> None:
    path = ROOT / "resume" / "evidence-ledger.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    claims = data.get("claims")
    if not isinstance(claims, list) or len(claims) < 10:
        fail("evidence ledger must contain at least ten claims")
    seen: set[str] = set()
    for claim in claims:
        claim_id = claim.get("claim_id")
        if not claim_id or claim_id in seen:
            fail(f"invalid or duplicate claim id: {claim_id!r}")
        seen.add(claim_id)
        if claim.get("public_safe") is not True:
            fail(f"claim is not public-safe: {claim_id}")
        if not claim.get("claim") or not claim.get("source_urls"):
            fail(f"claim lacks statement or source: {claim_id}")
        if not claim.get("measurement_context") or not claim.get("allowed_wording"):
            fail(f"claim lacks context or allowed wording: {claim_id}")
        for url in claim["source_urls"]:
            if not url.startswith("https://"):
                fail(f"non-HTTPS evidence URL in {claim_id}: {url}")


def validate_sources() -> None:
    sources = list((ROOT / "resume").rglob("*.tex")) + list(ROOT.glob("resume-*.tex"))
    combined = "\n".join(path.read_text(encoding="utf-8") for path in sources)
    for stale in STALE_DOMAINS:
        if stale in combined:
            fail(f"stale domain remains in resume sources: {stale}")

    obsolete_claims = (
        "79.2\\% faster",
        "122.9-second",
        "1,200+ named agent and interface tests",
    )
    for phrase in obsolete_claims:
        if phrase in combined:
            fail(f"obsolete MOVE audit wording remains in resume sources: {phrase}")

    master = (ROOT / "resume" / "content" / "master.tex").read_text(encoding="utf-8")
    technical_bullets = master.count("\\ResumeItem{") + master.count("\\ProjectEntry")
    if not 12 <= technical_bullets <= 14:
        fail(f"master technical bullet count is {technical_bullets}; expected 12-14")

    required_evidence = (
        "substantially lower end-to-end latency than Databricks Genie",
        "multi-step, multi-domain benchmarks",
        "maintaining identical accuracy",
        "executive meetings across IT, finance, marketing, and advisory functions",
        "cross-department data/resource requirements",
        "video-to-telemetry alignment system",
        "dynamic-programming sequence matching",
        "synchronized pose-force datasets",
        "70\\%",
        "80\\%",
        "60\\%",
        "43\\%",
        "150,000-line",
        "50 BU athletes and coaches",
        "NoteWorthy",
    )
    for phrase in required_evidence:
        if phrase not in master:
            fail(f"master is missing required evidence: {phrase}")


def bottom_clearance_inches(page: fitz.Page) -> float:
    bottoms: list[float] = []
    for block in page.get_text("dict").get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                if span.get("text", "").strip():
                    bottoms.append(float(span["bbox"][3]))
    if not bottoms:
        fail("page contains no text spans")
    return (float(page.rect.height) - max(bottoms)) / 72.0


def validate_pdf(name: str) -> dict[str, object]:
    path = ROOT / f"{name}.pdf"
    if not path.exists():
        fail(f"missing PDF: {path.name}")
    if path.stat().st_size > 250_000:
        fail(f"{name}: file exceeds 250 KB ({path.stat().st_size} bytes)")

    pdf_integrity_check(path)
    doc = fitz.open(path)
    if doc.needs_pass:
        fail(f"{name}: PDF is encrypted")
    if doc.page_count != 1:
        fail(f"{name}: expected one page, found {doc.page_count}")

    page = doc[0]
    pymupdf_text = page.get_text()
    poppler_text = extract_pdftotext(path)
    for expected in CRITICAL_TEXT:
        if expected not in pymupdf_text or expected not in poppler_text:
            fail(f"{name}: missing critical extracted text: {expected}")
    if "\ufffd" in pymupdf_text or "\ufffd" in poppler_text:
        fail(f"{name}: Unicode replacement character found")
    for stale in STALE_DOMAINS:
        if stale in pymupdf_text:
            fail(f"{name}: stale visible domain remains: {stale}")

    parity = jaccard(normalized_tokens(pymupdf_text), normalized_tokens(poppler_text))
    if parity < 0.99:
        fail(f"{name}: parser token parity {parity:.4f} is below 0.99")

    validate_fonts(doc, name)
    actual_links = {link["uri"] for link in page.get_links() if link.get("uri")}
    expected_links = BASE_LINKS | PROJECT_LINKS[name]
    missing_links = expected_links - actual_links
    if missing_links:
        fail(f"{name}: missing PDF links: {sorted(missing_links)}")
    if len(actual_links) != len(expected_links):
        fail(
            f"{name}: found {len(actual_links)} unique links; expected exactly {len(expected_links)}"
        )

    result: dict[str, object] = {
        "name": name,
        "bytes": path.stat().st_size,
        "words": len(re.findall(r"\b[\w+./'-]+\b", pymupdf_text)),
        "bullets": pymupdf_text.count("•"),
        "links": len(actual_links),
        "token_parity": round(parity, 4),
        "bottom_clearance_in": round(bottom_clearance_inches(page), 3),
    }

    if name in {"resume-master", "resume-giacomo-cappelletto"}:
        words = int(result["words"])
        bullets = int(result["bullets"])
        clearance = float(result["bottom_clearance_in"])
        if not 450 <= words <= 525:
            fail(f"{name}: word count {words} is outside 450-525")
        if not 12 <= bullets <= 14:
            fail(f"{name}: bullet count {bullets} is outside 12-14")
        if not 0.7 <= clearance <= 1.3:
            fail(f"{name}: bottom clearance {clearance:.3f} in is outside 0.7-1.3")
        for heading in ("SELECTED PROJECTS", "BU Rowing Training Platform", "NoteWorthy"):
            if heading not in pymupdf_text:
                fail(f"{name}: missing master content: {heading}")

    doc.close()
    return result


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="emit machine-readable results")
    args = parser.parse_args()

    validate_ledger()
    validate_sources()
    results = [validate_pdf(name) for name in RESUMES]

    master = ROOT / "resume-master.pdf"
    canonical = ROOT / "resume-giacomo-cappelletto.pdf"
    site_copy = ROOT / "site" / "public" / "resume.pdf"
    if sha256(master) != sha256(canonical):
        fail("canonical and master PDFs are not byte-identical")
    if not site_copy.exists() or sha256(master) != sha256(site_copy):
        fail("site/public/resume.pdf is not synchronized with resume-master.pdf")

    if args.json:
        print(json.dumps({"status": "pass", "resumes": results}, indent=2))
    else:
        for result in results:
            print(
                "PASS {name}: {words} words, {bullets} bullets, {links} links, "
                "{bytes} bytes, parity={token_parity}, bottom={bottom_clearance_in} in".format(
                    **result
                )
            )
        print("PASS evidence ledger, source gates, PDF integrity, and synchronized copies")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, subprocess.CalledProcessError, fitz.FileDataError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
