# QA and integration

Validation has three layers: source audit, file validation, and rendered inspection. All three are required for production integration.

## Source audit

- Compare every visible label, arrow, number, and component against the truth ledger.
- Confirm excluded and historical concepts are absent from the default path.
- Verify training and inference are not conflated.
- Verify optional branches use both a label and a distinct line pattern.
- Check captions for qualifications that cannot fit inside the image.

## Deterministic SVG validation

Run the generator twice and compare the resulting file set and hashes. Then parse every SVG.

Example:

```bash
python3 /path/to/craft-technical-covers/scripts/validate_visuals.py \
  --generator ./scripts/generate-technical-visuals.mjs \
  --generator-arg ./public/media/project \
  --output-dir ./public/media/project
```

The validator checks:

- byte-identical output across two runs;
- valid XML and an SVG root;
- positive `viewBox` dimensions;
- non-empty `title` and `desc`;
- `role="img"` and valid `aria-labelledby`;
- duplicate IDs;
- empty text;
- unsafe embedded elements;
- external links and externally referenced assets.

This utility cannot detect visual overlap, bad crops, or misleading hierarchy.

## Rendered inspection

Inspect each asset at:

1. full source resolution;
2. its largest production container;
3. its smallest meaningful thumbnail;
4. every real responsive crop;
5. high-contrast or alternate theme if supported.

Check:

- accidental overlaps and tangencies;
- clipped labels, leaders, markers, or shadows;
- arrows whose origin or destination is ambiguous;
- inconsistent contour and dimension weights;
- weak contrast or color-only semantics;
- copy overlays obscuring the focal system;
- mobile crops removing the active path;
- fine labels becoming visual noise;
- horizontal page overflow.

Use the actual page with its overlay and `object-fit` behavior. A standalone SVG preview is insufficient.

## Accessibility

- Give each standalone SVG a unique title and description.
- When embedded as an image, write useful HTML alt text even if the SVG has internal metadata.
- Describe the relationship or sequence, not colors or decorative style.
- Keep surrounding prose sufficient for readers who cannot inspect the diagram.
- Do not encode path meaning with color alone.
- Avoid rapid motion, scanning effects, or animation unless requested and reduced-motion behavior is implemented.

## Integration

- Preserve the existing image contract whenever possible.
- Update width, height, aspect ratio, alt text, and caption with the selected asset.
- Keep the selected cover inside existing cover components instead of adding project-specific layout hacks.
- Insert companion diagrams where the narrative first explains their system.
- Keep original evidence artifacts when the new master summarizes rather than replaces them.
- Do not delete unselected candidates unless requested.

## Selection checkpoint

When the user asked for directions:

- show all options at the same scale;
- include the relevant mobile or alternate crop;
- explain one tradeoff per option;
- wait for an explicit selection before changing production metadata.

Skip the checkpoint when the user already selected an option or explicitly asked the agent to choose.

## Completion checks

- Regenerate from a clean process.
- Run the SVG validator.
- Run relevant lint, type, test, and build commands.
- Inspect the homepage or listing surface and the detail page at representative desktop, tablet, and mobile sizes.
- Confirm existing links, focus states, and adjacent content still work.
