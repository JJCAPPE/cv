# Composition patterns

Choose one master structure that reflects the system, then derive cover arrangements from it. Vary hierarchy and crop, not facts.

## Shared visual grammar

- Use a near-black or subtly tinted background.
- Use warm neutral faces and crisp dark contours for system structure.
- Reserve one project accent for active paths, selected layers, axes, and key evidence.
- Use flat two- or three-tone face shading instead of glass, glow, or photorealistic depth.
- Use sparse coordinate frames, datum ticks, indices, leaders, and monospace technical labels.
- Keep the large silhouette legible without fine text.
- Avoid neon bloom, random circuitry, pseudo-code wallpaper, fake terminal text, and decorative charts.

Default cover geometry:

- canvas: `2400 × 1350`;
- copy-safe region: derive from the real component, commonly the left `38–42%`;
- focal region: commonly center-right, clear of mobile crop edges;
- master detail: readable at full-width case-study scale;
- cover detail: readable at thumbnail scale through form and path, not labels.

## Pattern A: exploded execution stack

Best for application architecture, agent systems, compilers, control software, and multi-stage pipelines.

Arrange semantic planes along one separation axis:

1. input or sense;
2. normalize or stabilize;
3. state or orchestration;
4. infer, plan, or compute;
5. execute, persist, or evidence.

Show the default data spine through the planes. Place background workers, optional tools, or hardware timing below or outside the main axis. Keep layer spacing large enough that arrows cannot be mistaken for membership.

Cover treatment: enlarge the stack in the center-right region and remove most micro-labels. Preserve layer indices and the active spine.

## Pattern B: training / inference split

Best for ML products where offline model creation and online use are distinct.

Build two related paths:

- **offline**: versioned data → transform → train → evaluate → register;
- **online**: request or batch input → preprocess → model artifact → postprocess → product output.

Connect them only at verified artifact boundaries such as a model registry, checkpoint, or packaged model. Use different line patterns plus labels; color alone is insufficient. Place monitoring and feedback where they actually land. Do not imply automatic retraining unless it exists.

Cover treatment: make the shared model artifact the focal object and let both paths converge on it without creating a false closed loop.

## Pattern C: data-to-decision spine

Best for services, analytics, search, RAG, recommendation, and event-driven products.

Use one strong left-to-right or bottom-to-top path with attached modules:

- sources;
- validation and transformation;
- storage or index;
- retrieval or compute;
- decision;
- output and evidence.

Place caches, queues, external APIs, and human review as side branches at their real boundaries. Do not add a generic database cylinder when storage is not part of the system.

Cover treatment: reserve the copy-safe side and let the active spine provide movement across the focal region.

## Pattern D: lifecycle atlas

Best when precision and breadth matter more than cinematic depth.

Combine:

- a compact master system;
- a state or lifecycle rail;
- a small source or dimension ledger;
- one verified output footprint, confusion matrix, latency distribution, or evaluation trace.

Use only measured artifacts. Keep the atlas editorial: fewer panels, stronger grid, more negative space.

Cover treatment: show only the compact system and two or three large evidence marks. Move dense labels to the companion diagram.

## Pattern E: matter / logic hybrid

Best for robotics, embedded systems, scientific instruments, and products with physical and software layers.

Use documented physical geometry as one master and the software stack as another. Join them at real sensor, actuator, protocol, or timing boundaries. Depict undocumented electronics placement as labeled schematic volumes rather than a fabricated assembly.

Cover treatment: let one master dominate and use the other as a restrained trace or intersecting plane. For companion diagrams, separate them again so each remains inspectable.

## Deriving multiple directions

Recommended three-direction set:

- **A — Assembly / Stack:** strongest object or system recognition.
- **B — Flow / Logic:** strongest full-stack or ML story.
- **C — Atlas / Evidence:** strongest editorial precision.

All directions must reuse the same truth ledger and semantic groups. A direction may omit facts; it may not alter them.

## Label and annotation limits

- Use nouns and function names already present in sources.
- Prefer one title plus one qualifier per layer.
- Wrap labels to two lines at most.
- Use leaders only when proximity cannot establish ownership.
- Keep leader endpoints off text and off other leaders.
- Remove an annotation when its target is already obvious.
- Never solve overlap by reducing text below the display's readable size.
