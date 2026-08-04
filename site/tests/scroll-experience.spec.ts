import { expect, test, type Page } from "@playwright/test";

const HERO_VIDEO_PATTERN = /rowing-signal-loop-(desktop|mobile)-v1\.mp4/;

async function scrollInstantly(page: Page, top: number) {
  await page.evaluate((nextTop) => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: nextTop, behavior: "auto" });
    root.style.scrollBehavior = previousBehavior;
  }, top);
}

async function waitForFonts(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
}

async function expectHashAlignment(page: Page, id: string) {
  await expect
    .poll(() =>
      page.evaluate((targetId) => {
        const target = document.getElementById(targetId);
        const header = document.querySelector<HTMLElement>(".site-header");

        if (!target || !header) {
          return false;
        }

        const top = target.getBoundingClientRect().top;
        return top >= header.offsetHeight - 2 && top <= header.offsetHeight + 24;
      }, id),
    )
    .toBe(true);
}

async function expectPinnedRailEnd(
  page: Page,
  railSelector: string,
  trackSelector: string,
  viewportSelector?: string,
) {
  const metrics = await page.locator(railSelector).evaluate(
    (rail, selectors) => {
      const track = rail.querySelector<HTMLElement>(selectors.trackSelector);
      const viewport = selectors.viewportSelector
        ? rail.querySelector<HTMLElement>(selectors.viewportSelector)
        : rail;
      const spacer = rail.parentElement;

      if (!track || !viewport || !spacer?.classList.contains("pin-spacer")) {
        throw new Error("Pinned rail geometry is unavailable.");
      }

      return {
        distance: Math.max(track.scrollWidth - viewport.clientWidth, 0),
        start: scrollY + spacer.getBoundingClientRect().top,
      };
    },
    { trackSelector, viewportSelector },
  );

  await scrollInstantly(page, metrics.start + metrics.distance);
  await expect
    .poll(() =>
      page.locator(trackSelector).evaluate((track) => {
        const transform = getComputedStyle(track).transform;
        return transform === "none" ? 0 : new DOMMatrixReadOnly(transform).e;
      }),
    )
    .toBeCloseTo(-metrics.distance, 0);
}

test("homepage rails defer GSAP until they approach, then stop with native input", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await page.locator("#featured-work").scrollIntoViewIfNeeded();
  await expect(page.locator("#featured-work")).toHaveAttribute(
    "data-enhanced",
    "true",
  );

  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(120);
  const settledScroll = await page.evaluate(() => scrollY);
  await page.waitForTimeout(500);
  expect(Math.abs((await page.evaluate(() => scrollY)) - settledScroll)).toBeLessThan(
    2,
  );

  await expectPinnedRailEnd(
    page,
    "#featured-work",
    "[data-project-track]",
  );

  await page.locator("#research").scrollIntoViewIfNeeded();
  await expect(page.locator("#research")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expectPinnedRailEnd(
    page,
    "#research",
    "[data-research-track]",
    "[data-research-viewport]",
  );
  await expect(
    page.locator("#research [data-research-panel]").last(),
  ).toHaveAttribute("data-active", "true");
  await expect(
    page.locator("#research").getByRole("button", { name: /Next/ }),
  ).toBeDisabled();
  expect(pageErrors).toEqual([]);
});

test("deep links eagerly prepare preceding pins and align below the header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 818 });

  for (const id of ["work", "research", "notes", "contact"]) {
    await page.goto(`/#${id}`, { waitUntil: "domcontentloaded" });
    await waitForFonts(page);
    await expectHashAlignment(page, id);

    if (id !== "work") {
      await expect(page.locator("#featured-work")).toHaveAttribute(
        "data-enhanced",
        "true",
      );
    }
    if (id === "research") {
      await expect(
        page.locator("#research").getByRole("button", { name: /Previous/ }),
      ).toBeDisabled();
      await expect(
        page.locator("#research [data-research-panel]").first(),
      ).toHaveAttribute("data-active", "true");
    }
    if (id === "notes" || id === "contact") {
      await expect(page.locator("#research")).toHaveAttribute(
        "data-enhanced",
        "true",
      );
    }
  }
});

test("skip links move focus to visible content after each pinned story", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/#work", { waitUntil: "domcontentloaded" });

  const skipWork = page.getByRole("link", { name: "Skip featured work" });
  await skipWork.focus();
  await skipWork.press("Enter");
  await expect(page.locator("#research")).toBeFocused();
  await expectHashAlignment(page, "research");

  const skipResearch = page.getByRole("link", {
    name: "Skip research showcase",
  });
  await skipResearch.focus();
  await skipResearch.press("Enter");
  await expect(page.locator("#notes")).toBeFocused();
  await expectHashAlignment(page, "notes");
});

test("reduced motion keeps expanded native layout and requests no hero video", async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (HERO_VIDEO_PATTERN.test(request.url())) {
      videoRequests.push(request.url());
    }
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);

  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator(".page-progress")).toBeHidden();
  await expect(page.locator("[data-hero-video]")).not.toHaveAttribute("src", /.+/);
  expect(videoRequests).toEqual([]);
});

test("Save-Data requests the poster once and never attaches hero video", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.addInitScript(() => {
    const connection = new EventTarget();
    Object.defineProperty(connection, "saveData", { value: true });
    Object.defineProperty(Navigator.prototype, "connection", {
      configurable: true,
      get: () => connection,
    });
  });

  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);

  expect(requests.filter((url) => url.includes("rowing-signal-poster-v1.webp"))).toHaveLength(
    1,
  );
  expect(requests.filter((url) => HERO_VIDEO_PATTERN.test(url))).toEqual([]);
  await expect(page.locator("[data-hero-video]")).not.toHaveAttribute("src", /.+/);
});

test("short and narrow viewports retain native fallbacks", async ({ page }) => {
  test.skip(test.info().project.name !== "chromium");

  for (const viewport of [
    { width: 767, height: 844 },
    { width: 1200, height: 620 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#work", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#featured-work")).not.toHaveAttribute(
      "data-enhanced",
      /.+/,
    );
    await expect(page.locator("#research")).not.toHaveAttribute(
      "data-enhanced",
      /.+/,
    );
    await expect(page.locator("[data-research-viewport]")).toHaveCSS(
      "overflow-x",
      "auto",
    );
  }
});

test("enhancement thresholds match at 768 and 961 CSS pixels", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");

  await page.setViewportSize({ width: 768, height: 700 });
  await page.goto("/#work", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#featured-work")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );

  await page.setViewportSize({ width: 960, height: 818 });
  await page.goto("/#research", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );

  await page.setViewportSize({ width: 961, height: 818 });
  await page.goto("/#research", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#research")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
});

test("resizing below the height capability removes pin spacers", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/#work", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#featured-work")).toHaveAttribute(
    "data-enhanced",
    "true",
  );

  await page.setViewportSize({ width: 1200, height: 620 });
  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect
    .poll(() =>
      page.locator("#featured-work").evaluate(
        (rail) => !rail.parentElement?.classList.contains("pin-spacer"),
      ),
    )
    .toBe(true);
});

test("research activity pauses off-screen and project gallery remains keyboard aligned", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const overview = page.locator("[data-visibility-paused]").first();
  await expect(overview).toHaveAttribute("data-visibility-paused", "false");
  await scrollInstantly(
    page,
    await page.evaluate(() => document.documentElement.scrollHeight - innerHeight),
  );
  await expect(overview).toHaveAttribute("data-visibility-paused", "true");

  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".project-gallery")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await page.waitForTimeout(100);
  const lastLink = page.locator("[data-project-card] a").last();
  await lastLink.focus();
  await expect(lastLink).toBeFocused();
  await expect
    .poll(() =>
      lastLink.evaluate((link) => {
        const bounds = link.getBoundingClientRect();
        return bounds.left < innerWidth && bounds.right > 0;
      }),
    )
    .toBe(true);
});

test("back navigation restores a deep-linked rail below the header", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/#research", { waitUntil: "domcontentloaded" });
  await expectHashAlignment(page, "research");

  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await page.goBack({ waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/#research$/);
  await expectHashAlignment(page, "research");
});

test.describe("native touch scrolling", () => {
  test.use({ hasTouch: true });

  test("a touch swipe advances the document without a custom input layer", async ({
    context,
    page,
  }) => {
    test.skip(test.info().project.name !== "chromium");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const session = await context.newCDPSession(page);

    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 195, y: 700 }],
    });
    for (const y of [600, 500, 400, 300, 200]) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y }],
      });
      await page.waitForTimeout(16);
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });

    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  });
});
