#!/usr/bin/env python3
"""Validate deterministic, accessible, self-contained SVG visual sets."""

from __future__ import annotations

import argparse
import hashlib
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


SVG_NAMESPACE = "http://www.w3.org/2000/svg"
UNSAFE_ELEMENTS = {"foreignObject", "iframe", "object", "script"}
EXTERNAL_REFERENCE = re.compile(r"^(?:https?:|//|data:|javascript:)", re.IGNORECASE)


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def svg_files(output_dir: Path) -> list[Path]:
    return sorted(path for path in output_dir.rglob("*.svg") if path.is_file())


def hashes(files: list[Path], root: Path) -> dict[str, str]:
    return {
        str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in files
    }


def generator_command(generator: Path, arguments: list[str]) -> list[str]:
    suffix = generator.suffix.lower()
    if suffix in {".js", ".mjs", ".cjs"}:
        return ["node", str(generator), *arguments]
    if suffix == ".py":
        return [sys.executable, str(generator), *arguments]
    return [str(generator), *arguments]


def run_generator(
    generator: Path,
    arguments: list[str],
    working_dir: Path,
) -> None:
    completed = subprocess.run(
        generator_command(generator, arguments),
        cwd=working_dir,
        check=False,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        output = "\n".join(
            part.strip() for part in (completed.stdout, completed.stderr) if part.strip()
        )
        raise RuntimeError(f"Generator failed with exit code {completed.returncode}:\n{output}")


def validate_svg(path: Path) -> list[str]:
    errors: list[str] = []

    try:
        tree = ET.parse(path)
    except ET.ParseError as error:
        return [f"invalid XML: {error}"]

    root = tree.getroot()
    if local_name(root.tag) != "svg":
        return ["root element is not svg"]
    if not root.tag.startswith(f"{{{SVG_NAMESPACE}}}"):
        errors.append("svg root is missing the standard SVG namespace")

    view_box = root.attrib.get("viewBox", "").split()
    if len(view_box) != 4:
        errors.append("viewBox must contain four numbers")
    else:
        try:
            _, _, width, height = (float(value) for value in view_box)
            if width <= 0 or height <= 0:
                errors.append("viewBox width and height must be positive")
        except ValueError:
            errors.append("viewBox contains a non-numeric value")

    if root.attrib.get("role") != "img":
        errors.append('root must declare role="img"')

    ids: dict[str, str] = {}
    title_ids: list[str] = []
    description_ids: list[str] = []

    for element in root.iter():
        name = local_name(element.tag)
        element_id = element.attrib.get("id")

        if element_id:
            if element_id in ids:
                errors.append(f'duplicate id "{element_id}"')
            ids[element_id] = name

        if name == "title" and "".join(element.itertext()).strip():
            if element_id:
                title_ids.append(element_id)
        if name == "desc" and "".join(element.itertext()).strip():
            if element_id:
                description_ids.append(element_id)
        if name in UNSAFE_ELEMENTS:
            errors.append(f"unsafe embedded element <{name}>")
        if name == "text" and not "".join(element.itertext()).strip():
            errors.append("empty <text> element")

        for attribute, value in element.attrib.items():
            attribute_name = local_name(attribute)
            normalized = value.strip()
            if attribute_name in {"href", "src"} and EXTERNAL_REFERENCE.match(normalized):
                errors.append(f'external reference in {attribute_name}="{normalized}"')
            if "url(" in normalized:
                for reference in re.findall(r"url\(([^)]+)\)", normalized):
                    reference = reference.strip(" \"'")
                    if reference and not reference.startswith("#"):
                        errors.append(f'external URL reference "{reference}"')

    if not title_ids:
        errors.append("missing non-empty <title id=...>")
    if not description_ids:
        errors.append("missing non-empty <desc id=...>")

    labelled_by = root.attrib.get("aria-labelledby", "").split()
    if not labelled_by:
        errors.append("root is missing aria-labelledby")
    else:
        missing = [reference for reference in labelled_by if reference not in ids]
        if missing:
            errors.append(
                "aria-labelledby references missing IDs: " + ", ".join(missing)
            )
        if title_ids and title_ids[0] not in labelled_by:
            errors.append("aria-labelledby does not include the title ID")
        if description_ids and description_ids[0] not in labelled_by:
            errors.append("aria-labelledby does not include the description ID")

    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Validate SVG XML, accessibility metadata, self-containment, and "
            "byte-identical output across two generator runs."
        )
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        required=True,
        help="Directory containing the generated SVG files.",
    )
    parser.add_argument(
        "--generator",
        type=Path,
        help="Optional generator to run twice before validation.",
    )
    parser.add_argument(
        "--generator-arg",
        action="append",
        default=[],
        help="Argument passed to the generator. Repeat for multiple arguments.",
    )
    parser.add_argument(
        "--generator-cwd",
        type=Path,
        help="Generator working directory. Defaults to the generator's parent.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = args.output_dir.expanduser().resolve()

    if args.generator:
        generator = args.generator.expanduser().resolve()
        if not generator.is_file():
            print(f"Generator does not exist: {generator}", file=sys.stderr)
            return 1

        working_dir = (
            args.generator_cwd.expanduser().resolve()
            if args.generator_cwd
            else generator.parent
        )

        try:
            run_generator(generator, args.generator_arg, working_dir)
            first_files = svg_files(output_dir)
            if not first_files:
                print(f"No SVG files found in {output_dir}", file=sys.stderr)
                return 1
            first_hashes = hashes(first_files, output_dir)

            run_generator(generator, args.generator_arg, working_dir)
            second_files = svg_files(output_dir)
            second_hashes = hashes(second_files, output_dir)
        except (OSError, RuntimeError) as error:
            print(error, file=sys.stderr)
            return 1

        if first_hashes != second_hashes:
            first_names = set(first_hashes)
            second_names = set(second_hashes)
            changed = sorted(
                name
                for name in first_names & second_names
                if first_hashes[name] != second_hashes[name]
            )
            added = sorted(second_names - first_names)
            removed = sorted(first_names - second_names)
            print("Generator output is not deterministic.", file=sys.stderr)
            if changed:
                print("Changed: " + ", ".join(changed), file=sys.stderr)
            if added:
                print("Added: " + ", ".join(added), file=sys.stderr)
            if removed:
                print("Removed: " + ", ".join(removed), file=sys.stderr)
            return 1

    files = svg_files(output_dir)
    if not files:
        print(f"No SVG files found in {output_dir}", file=sys.stderr)
        return 1

    failures = 0
    for path in files:
        errors = validate_svg(path)
        relative = path.relative_to(output_dir)
        if errors:
            failures += 1
            print(f"FAIL {relative}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {relative}")

    if failures:
        print(f"{failures} of {len(files)} SVG files failed validation.")
        return 1

    determinism = " and deterministic" if args.generator else ""
    print(f"Validated {len(files)} accessible, self-contained{determinism} SVG files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
