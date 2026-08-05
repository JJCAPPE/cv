import { expect, test, type Page } from "@playwright/test";

const HERO_VIDEO_PATTERN = /rowing-signal-loop-(desktop|mobile)-v1\.mp4/;
const EXPECTED_RESEARCH = [
  {
    title: "Contextual Similarity",
    href: "/research/contextual-similarity",
  },
  {
    title: "Rowing Biomechanics Pipeline",
    href: "/research/rowing-biomechanics",
  },
  { title: "Forging Adaptability", href: "/research/biomimetic-ai" },
] as const;
const EXPECTED_PROJECTS = [
  { title: "MOVE", href: "/projects/move" },
  { title: "Deskinator", href: "/projects/deskinator" },
  { title: "Inventory System Rebuild", href: "/projects/inventory-system" },
  { title: "TickIT", href: "/projects/tickit" },
  { title: "NoteWorthy", href: "/projects/ai-notes-or-ocr" },
] as const;

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
    "[data-project-viewport]",
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

test("homepage rails keep project and research collections distinct", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 700 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const projectPanels = page.locator("#featured-work [data-project-panel]");
  await expect(projectPanels).toHaveCount(5);
  await expect(
    projectPanels.locator('a[href="/projects/rowing-biomechanics"]'),
  ).toHaveCount(0);
  await expect(projectPanels.locator("img")).toHaveCount(
    EXPECTED_PROJECTS.length,
  );
  await expect(projectPanels.locator("[data-showcase-media]")).toHaveCount(0);

  for (const image of await projectPanels.locator("img").all()) {
    await expect(image).toHaveCSS("object-fit", "contain");
  }

  const researchPanels = page.locator("#research [data-research-panel]");
  await expect(researchPanels).toHaveCount(EXPECTED_RESEARCH.length);

  for (const [index, item] of EXPECTED_RESEARCH.entries()) {
    await expect(
      researchPanels
        .nth(index)
        .getByRole("link", { name: item.title, exact: true }),
    ).toHaveAttribute("href", item.href);
  }

  await expect(researchPanels.locator("img")).toHaveCount(2);
  for (const image of await researchPanels.locator("img").all()) {
    await expect(image).toHaveCSS("object-fit", "contain");
  }
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
  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );

  await page.setViewportSize({ width: 960, height: 818 });
  await page.goto("/#research", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#featured-work")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );
  await expect(page.locator("#research")).not.toHaveAttribute(
    "data-enhanced",
    /.+/,
  );

  await page.setViewportSize({ width: 961, height: 818 });
  await page.goto("/#research", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#featured-work")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
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

test("research activity pauses behind inactive relay files", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const overview = page.locator("[data-visibility-paused]").first();
  await overview.scrollIntoViewIfNeeded();
  await expect(overview).toHaveAttribute("data-visibility-paused", "false");
  await page
    .getByRole("button", { name: "Show Forging Adaptability" })
    .click();
  await expect(overview).toHaveAttribute("data-visibility-paused", "true");
});

test("project relay presents every project and keeps the fifth panel aligned", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  const relay = page.locator("#projects-relay");
  const panels = relay.locator("[data-relay-panel]");

  await expect(relay).toHaveAttribute("data-enhanced", "true");
  await expect(panels).toHaveCount(EXPECTED_PROJECTS.length);
  await expect(
    relay.getByRole("group", { name: "Choose project" }),
  ).toBeVisible();
  await expect(
    relay.getByRole("group", { name: "Project navigation" }),
  ).toBeVisible();

  for (const [index, project] of EXPECTED_PROJECTS.entries()) {
    await expect(
      panels.nth(index).locator("h2 a"),
    ).toHaveAttribute("href", project.href);
    await expect(panels.nth(index).locator("img")).toHaveCSS(
      "object-fit",
      "contain",
    );
  }

  const relayOffsetsMatch = async (revealedThrough: number) => {
    const geometry = await relay.evaluate((element) => {
      const relayPanels = Array.from(
        element.querySelectorAll<HTMLElement>("[data-relay-panel]"),
      );
      const stage = relayPanels[0]?.parentElement;
      const spine = relayPanels[0]?.querySelector<HTMLElement>(
        "[data-relay-spine]",
      );

      if (!stage || !spine) {
        throw new Error("Project relay parking geometry is unavailable.");
      }

      const stageBounds = stage.getBoundingClientRect();

      return {
        panelOffsets: relayPanels.map(
          (panel) => panel.getBoundingClientRect().left - stageBounds.left,
        ),
        spineWidth: spine.getBoundingClientRect().width,
        stageWidth: stageBounds.width,
      };
    });

    return geometry.panelOffsets.every((offset, index, offsets) => {
      const expectedOffset =
        index <= revealedThrough
          ? index * geometry.spineWidth
          : geometry.stageWidth -
            (offsets.length - index) * geometry.spineWidth;

      return Math.abs(offset - expectedOffset) <= 1;
    });
  };

  await expect.poll(() => relayOffsetsMatch(0)).toBe(true);
  await page.setViewportSize({ width: 1600, height: 818 });
  await expect.poll(() => relayOffsetsMatch(0)).toBe(true);

  const middleControl = relay.getByRole("button", {
    name: `Show ${EXPECTED_PROJECTS[2].title}`,
  });
  await middleControl.click();
  await expect(middleControl).toHaveAttribute("aria-pressed", "true");
  await page.setViewportSize({ width: 1400, height: 818 });
  await expect.poll(() => relayOffsetsMatch(2)).toBe(true);

  const lastProject = EXPECTED_PROJECTS[EXPECTED_PROJECTS.length - 1];
  const lastControl = relay.getByRole("button", {
    name: `Show ${lastProject.title}`,
  });
  await lastControl.click();
  await expect(lastControl).toHaveAttribute("aria-pressed", "true");

  const lastPanel = panels.last();
  const lastLink = lastPanel.getByRole("link", {
    name: lastProject.title,
    exact: true,
  });
  await lastLink.focus();
  await expect(lastLink).toBeFocused();

  const geometry = await relay.evaluate((element) => {
    const relayPanels = Array.from(
      element.querySelectorAll<HTMLElement>("[data-relay-panel]"),
    );
    const last = relayPanels.at(-1);
    const stage = last?.parentElement;
    const spine = relayPanels[0]?.querySelector<HTMLElement>(
      "[data-relay-spine]",
    );

    if (!stage || !last || !spine) {
      throw new Error("Project relay geometry is unavailable.");
    }

    const stageBounds = stage.getBoundingClientRect();
    const panelBounds = last.getBoundingClientRect();

    return {
      documentWidth: document.documentElement.scrollWidth,
      panelLeft: panelBounds.left,
      panelOffsets: relayPanels.map(
        (panel) => panel.getBoundingClientRect().left - stageBounds.left,
      ),
      panelRight: panelBounds.right,
      panelWidth: panelBounds.width,
      spineWidth: spine.getBoundingClientRect().width,
      stageLeft: stageBounds.left,
      stageRight: stageBounds.right,
      viewportWidth: document.documentElement.clientWidth,
    };
  });

  expect(geometry.panelLeft).toBeGreaterThanOrEqual(geometry.stageLeft - 1);
  expect(geometry.panelRight).toBeLessThanOrEqual(geometry.stageRight + 1);
  expect(geometry.panelWidth).toBeGreaterThan(0);
  geometry.panelOffsets.forEach((offset, index) => {
    expect(offset).toBeCloseTo(index * geometry.spineWidth, 0);
  });
  expect(geometry.documentWidth).toBe(geometry.viewportWidth);
});

test("research relay presents three ordered files with direct navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 700 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const relay = page.locator(
    'section[aria-labelledby="research-relay-heading"]',
  );
  const panels = relay.locator("[data-relay-panel]");
  await expect(panels).toHaveCount(EXPECTED_RESEARCH.length);

  for (const [index, item] of EXPECTED_RESEARCH.entries()) {
    const titleLink = panels
      .nth(index)
      .getByRole("link", { name: item.title, exact: true });
    await expect(titleLink).toHaveAttribute("href", item.href);
    await titleLink.click();
    await expect(page).toHaveURL(new RegExp(`${item.href}/?$`));

    if (item.href === "/research/contextual-similarity") {
      await expect(
        page.getByRole("heading", {
          level: 1,
          name: "Can motion embeddings survive bad poses?",
        }),
      ).toBeVisible();
    }

    if (index < EXPECTED_RESEARCH.length - 1) {
      await page.goto("/research", { waitUntil: "domcontentloaded" });
    }
  }
});

test("research relay enhances on desktop and keeps its reduced-motion fallback native", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");
  await page.setViewportSize({ width: 961, height: 818 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const relay = page.locator(
    'section[aria-labelledby="research-relay-heading"]',
  );
  await expect(relay).toHaveAttribute("data-enhanced", "true");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const nativePanels = relay.locator("[data-relay-panel]");
  await expect(relay).not.toHaveAttribute("data-enhanced", /.+/);
  await expect(nativePanels).toHaveCount(3);
  expect(
    await nativePanels.evaluateAll((panels) =>
      panels.every(
        (panel) =>
          !panel.hasAttribute("inert") && !panel.hasAttribute("aria-hidden"),
      ),
    ),
  ).toBe(true);
  await expect
    .poll(() =>
      nativePanels.first().evaluate((panel) => {
        const viewport = panel.parentElement?.parentElement;
        return viewport ? getComputedStyle(viewport).overflowX : null;
      }),
    )
    .toBe("auto");
});

test("project relay shares the research capability thresholds and native fallback", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");

  for (const viewport of [
    { width: 960, height: 818 },
    { width: 1200, height: 699 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/projects", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#projects-relay")).not.toHaveAttribute(
      "data-enhanced",
      /.+/,
    );
  }

  await page.setViewportSize({ width: 961, height: 818 });
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#projects-relay")).toHaveAttribute(
    "data-enhanced",
    "true",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/projects", { waitUntil: "domcontentloaded" });

  const relay = page.locator("#projects-relay");
  const panels = relay.locator("[data-relay-panel]");
  await expect(relay).not.toHaveAttribute("data-enhanced", /.+/);
  await expect(panels).toHaveCount(EXPECTED_PROJECTS.length);
  expect(
    await panels.evaluateAll((items) =>
      items.every(
        (item) =>
          !item.hasAttribute("inert") && !item.hasAttribute("aria-hidden"),
      ),
    ),
  ).toBe(true);
  await expect
    .poll(() =>
      panels.first().evaluate((panel) => {
        const viewport = panel.parentElement?.parentElement;
        return viewport ? getComputedStyle(viewport).overflowX : null;
      }),
    )
    .toBe("auto");
});

test("research relay moves focus before hiding an inactive file", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "chromium");
  await page.setViewportSize({ width: 1200, height: 818 });
  await page.goto("/research", { waitUntil: "domcontentloaded" });

  const relay = page.locator(
    'section[aria-labelledby="research-relay-heading"]',
  );
  await relay.scrollIntoViewIfNeeded();
  await expect(relay).toHaveAttribute("data-enhanced", "true");

  const firstLink = relay
    .locator("[data-relay-panel]")
    .first()
    .getByRole("link", { name: "Contextual Similarity", exact: true });
  await firstLink.focus();
  await expect(firstLink).toBeFocused();

  const relayStart = await relay.evaluate((element) => {
    const spacer = element.parentElement;

    if (!spacer?.classList.contains("pin-spacer")) {
      throw new Error("Research relay pin spacer is unavailable.");
    }

    return scrollY + spacer.getBoundingClientRect().top;
  });
  await scrollInstantly(page, relayStart + 900);

  const secondControl = relay.locator('[data-relay-control="1"]');
  await expect(secondControl).toHaveAttribute("aria-pressed", "true");
  await expect(secondControl).toBeFocused();
  expect(
    await page.evaluate(() => document.activeElement?.closest("[inert]") !== null),
  ).toBe(false);
});

test("rowing redirects into research and the proposal route loads", async ({
  page,
}) => {
  await page.goto("/projects/rowing-biomechanics", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/research\/rowing-biomechanics\/?$/);

  await page.goto("/research/contextual-similarity", {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/research\/contextual-similarity\/?$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Can motion embeddings survive bad poses?",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "All research", exact: true }),
  ).toHaveAttribute("href", "/research");
  await expect(page.getByText("Research 01 / 03", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Next research item" }).getByRole(
      "link",
      { name: "Rowing Biomechanics Pipeline", exact: true },
    ),
  ).toHaveAttribute("href", "/research/rowing-biomechanics");
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
