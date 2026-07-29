---
name: craft-technical-covers
description: Create source-grounded, deterministic CAD-style technical cover art and companion system diagrams for software, ML, data, robotics, and engineering projects. Use when a user asks for a portfolio or project cover, hero image, exploded software stack, ML pipeline illustration, architecture atlas, hardware/software system visual, multiple cover directions, an SVG visual generator, cover integration, or visual QA. Also use when existing AI-looking technical artwork needs to become precise, truthful, crop-safe, accessible, and consistent with a site's visual system.
---

# Craft Technical Covers

Create technical artwork that is attractive at cover scale and defensible under inspection. Derive every visible system claim from repository evidence, build one reusable visual master, and compose covers from that master.

## Operating contract

- Treat current executable code, configuration, schemas, and measured artifacts as truth.
- Treat reports, diagrams, mockups, and old screenshots as secondary unless confirmed by the current implementation.
- Never invent components, algorithms, topology, concurrency, data lineage, model behavior, metrics, dimensions, or measured results.
- Distinguish default, optional, offline, historical, and proposed paths in both labels and line style.
- Default to deterministic SVG for semantic technical geometry and text.
- Use generated raster imagery only for non-semantic atmosphere or texture, never to fabricate system detail.
- Keep the project-local generator editable. Do not build a general visualization framework inside the target repository.

## Route the request

Choose the smallest route that satisfies the user:

1. **Cover only** — inspect sources, create a compact truth ledger, build one master, and produce the requested cover.
2. **Cover directions** — build one master and derive two or three compositions from it. Stop for selection before production integration unless the user already selected or delegated the choice.
3. **Visual system** — create the master, cover variants, companion diagrams, captions, alt text, integration, and responsive QA.
4. **Polish existing artwork** — recover the editable source or generator first; fix hierarchy, overlaps, labels, crop safety, and factual drift without changing the underlying system story.

State assumptions, the intended deliverables, and verifiable success criteria before editing. Ask only when an unresolved choice would materially change the truth or production integration.

## Workflow

### 1. Inspect before drawing

- Read repository instructions and preserve unrelated work.
- Locate the current runtime entry points, configuration, schemas, model definitions, training and inference paths, evaluation artifacts, design tokens, existing covers, and their display containers.
- Inspect the actual crop and overlay contracts for every target surface.
- Identify stale diagrams and historical architecture explicitly.
- Read [truth-ledger.md](references/truth-ledger.md) and create a project-local ledger before drawing.

### 2. Establish the visual truth

For each visible label, arrow, component, state, number, and optional branch, record:

- the displayed claim;
- the exact source path and symbol, section, or artifact;
- whether it is default, optional, offline, historical, or proposed;
- whether it may appear in the master, cover, companion diagram, or nowhere;
- any ambiguity or exclusion.

Prefer omission over an attractive but unsupported detail. Use surrounding prose and captions for nuance that would overload the image.

### 3. Select a composition

Read [composition-patterns.md](references/composition-patterns.md). Choose a pattern that matches the project:

- exploded execution stack for software architecture;
- training/inference split for ML systems;
- data-to-decision spine for services and pipelines;
- lifecycle atlas for information-dense editorial covers;
- matter/logic hybrid for robotics or embedded systems.

Use a `2400 × 1350` master unless the existing product contract requires another ratio. Reserve the real copy-safe region rather than assuming the image is shown unobstructed.

### 4. Build one master, then derive covers

- Extract palette and typography from the target project.
- Keep semantic groups reusable: layers, nodes, paths, annotations, dimensions, and legends.
- Use short display labels. Put implementation detail in companion diagrams or captions.
- Encode line semantics consistently: solid for the default path, dashed for optional or offline behavior, subdued for historical or contextual information.
- Recompose master groups for different cover directions; do not redraw competing versions with conflicting facts.

For a new project-local generator, copy only the useful files from `assets/technical-cover-starter/` and adapt them. The starter is dependency-free, intentionally small, and refuses placeholder-mode generation unless explicitly allowed. Replace its sample configuration and set `PLACEHOLDER_MODE` to `false` before using generated files in production.

### 5. Review at the actual display sizes

- Render every full cover and each real responsive crop.
- Inspect focal hierarchy, tangencies, clipped text, overlapping leaders, ambiguous arrows, weak contrast, and line-weight drift.
- Confirm the cover still reads when labels become illegible; silhouette, layer order, and active path must carry the story.
- Prefer moving or removing annotations over shrinking them.
- If several directions were requested, present them together with one concise tradeoff each and wait for selection.

### 6. Integrate surgically

- Update only the selected production cover reference.
- Place the master or companion diagram where the surrounding narrative introduces that system.
- Write alt text that explains the system relationship, not decorative styling.
- Write a caption that clarifies scope or provenance rather than repeating nearby prose.
- Keep unselected directions as review artifacts unless the user asks to remove them.

### 7. Verify

Read [qa-and-integration.md](references/qa-and-integration.md). Run:

1. the project-local generator twice;
2. `scripts/validate_visuals.py` against its SVG output;
3. the repository's lint, type, test, and build checks relevant to touched files;
4. browser QA at the actual cover and detail-page breakpoints.

Do not claim visual QA from XML validation alone. Inspect rendered output.

## Definition of done

- Every visible technical claim maps to a source-ledger entry.
- The master and covers share one factual system model.
- Default, optional, offline, and historical paths cannot be confused.
- Output is deterministic, valid, accessible SVG with no external assets or unsafe elements.
- Cover hierarchy survives its real overlays and responsive crops.
- Companion diagrams add understanding instead of duplicating prose.
- Production metadata references only the chosen cover.
- Relevant repository checks pass, and no horizontal overflow or accessibility regression remains.

## Resources

- [truth-ledger.md](references/truth-ledger.md) — source hierarchy, ledger schema, and software/ML truth rules.
- [composition-patterns.md](references/composition-patterns.md) — visual grammar and reusable composition families.
- [qa-and-integration.md](references/qa-and-integration.md) — deterministic validation, browser QA, integration, and accessibility.
- `assets/technical-cover-starter/` — project-local SVG primitives, generator starter, and truth-ledger template.
- `scripts/validate_visuals.py` — XML, accessibility, safety, and determinism validation.
