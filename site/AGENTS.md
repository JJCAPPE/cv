<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repository publishing

The canonical GitHub target for this site is `JJCAPPE/cv`, where this
standalone repository maps to the `site/` directory. For every GitHub delivery:

- create the working branch from `JJCAPPE/cv`'s `main` branch;
- port site paths beneath `site/` without replacing unrelated root content;
- run site checks from `site/`; and
- open the pull request against `JJCAPPE/cv`.

Do not push this standalone repository's unrelated Git history directly to
`JJCAPPE/cv`.
