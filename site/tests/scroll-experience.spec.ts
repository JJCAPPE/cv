import { expect, test } from "@playwright/test";

async function scrollInstantly(page: import("@playwright/test").Page, top: number) {
  await page.evaluate((nextTop) => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: nextTop, behavior: "auto" });
    root.style.scrollBehavior = previousBehavior;
  }, top);
}

test("desktop scrolling stays responsive and pauses offscreen video", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#featured-work")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expect(page.locator("#research")).toHaveAttribute(
    "data-enhanced",
    "true",
  );

  const progress = page.locator(".page-progress");
  await expect(progress).toHaveCSS("position", "fixed");
  const initialScale = await progress.evaluate(
    (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
  );

  const quarterPage = await page.evaluate(
    () => (document.documentElement.scrollHeight - innerHeight) * 0.25,
  );
  await scrollInstantly(page, quarterPage);

  await expect
    .poll(() =>
      progress.evaluate(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
      ),
    )
    .toBeGreaterThan(initialScale + 0.05);
  await expect
    .poll(() =>
      page.locator("[data-hero-video]").evaluate(
        (element) => (element as HTMLVideoElement).paused,
      ),
    )
    .toBe(true);
});

test("reduced motion keeps native layout and disables ambient motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator(".page-progress")).toBeHidden();
  await expect
    .poll(() =>
      page.locator("[data-hero-video]").evaluate(
        (element) => (element as HTMLVideoElement).paused,
      ),
    )
    .toBe(true);
});

test("research animation only runs while it is near the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const overview = page.locator('[data-visibility-paused]').first();
  await expect(overview).toHaveAttribute("data-visibility-paused", "false");

  const bottom = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  await scrollInstantly(page, bottom);
  await expect(overview).toHaveAttribute("data-visibility-paused", "true");
});

test("project gallery enhances on motion-capable desktops", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects", { waitUntil: "domcontentloaded" });

  await expect(page.locator(".project-gallery")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
});
