import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const ALL_ROUTES = [
  "/",
  "/projects",
  "/projects/move",
  "/projects/deskinator",
  "/projects/inventory-system",
  "/projects/tickit",
  "/projects/ai-notes-or-ocr",
  "/research",
  "/research/contextual-similarity",
  "/research/rowing-biomechanics",
  "/research/biomimetic-ai",
  "/resume",
  "/notes",
  "/notes/estimating-rowing-force-curves",
  "/notes/pose-estimation-pipelines",
  "/notes/good-applied-ml-project",
  "/notes/small-tools-that-get-used",
] as const;

type BrowserFailures = {
  consoleErrors: string[];
  pageErrors: string[];
  responseErrors: string[];
};

function observeFailures(page: Page): BrowserFailures {
  const failures: BrowserFailures = {
    consoleErrors: [],
    pageErrors: [],
    responseErrors: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") failures.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => failures.pageErrors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:3100") &&
      response.status() >= 400
    ) {
      failures.responseErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return failures;
}

async function waitForStablePage(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
}

async function visibleTextOverflow(page: Page) {
  return page.evaluate(() => {
    const selector = "h1,h2,h3,h4,p,dt,dd,li,a,button";
    const viewportWidth = document.documentElement.clientWidth;
    const failures: string[] = [];

    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      const text = element.innerText.trim();

      if (
        !text ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0 ||
        (bounds.width <= 1.5 && bounds.height <= 1.5) ||
        element.closest('[aria-hidden="true"], [inert]')
      ) {
        continue;
      }

      let ancestor: HTMLElement | null = element.parentElement;
      let insideHorizontalScroller = false;
      while (ancestor && ancestor !== document.body) {
        const overflowX = getComputedStyle(ancestor).overflowX;
        if (overflowX === "auto" || overflowX === "scroll") {
          insideHorizontalScroller = true;
          break;
        }
        ancestor = ancestor.parentElement;
      }
      if (insideHorizontalScroller) continue;

      const range = document.createRange();
      range.selectNodeContents(element);
      const textBounds = range.getBoundingClientRect();
      if (textBounds.left < -1 || textBounds.right > viewportWidth + 1) {
        failures.push(
          `${element.tagName.toLowerCase()} "${text.slice(0, 80)}" ` +
            `[${textBounds.left.toFixed(1)}, ${textBounds.right.toFixed(1)}]`,
        );
      }
    }

    return failures;
  });
}

async function paintedMobileOmissions(page: Page) {
  return page
    .locator(
      '[data-mobile-gallery-media="true"], [data-technical-visual="true"]',
    )
    .evaluateAll((elements) =>
      elements.flatMap((element) => {
        const bounds = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const painted =
          element.getClientRects().length > 0 &&
          bounds.width > 1 &&
          bounds.height > 1 &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) !== 0;

        return painted
          ? [
              `${element.tagName.toLowerCase()}.${
                element instanceof HTMLElement ? element.className : ""
              } [${bounds.width.toFixed(1)} x ${bounds.height.toFixed(1)}]`,
            ]
          : [];
      }),
    );
}

async function paintedSvgVisuals(page: Page) {
  return page.locator("main svg, main img").evaluateAll((elements) =>
    elements.flatMap((element) => {
      const bounds = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const painted =
        element.getClientRects().length > 0 &&
        bounds.width > 1 &&
        bounds.height > 1 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0;

      if (!painted) return [];

      if (element instanceof SVGElement) {
        return [`inline svg [${bounds.width.toFixed(1)} x ${bounds.height.toFixed(1)}]`];
      }

      if (element instanceof HTMLImageElement) {
        let source = element.currentSrc || element.src;
        try {
          source = decodeURIComponent(source);
        } catch {
          // Keep the original URL when it contains malformed escaping.
        }

        if (source.toLowerCase().includes(".svg")) {
          return [`svg image ${source}`];
        }
      }

      return [];
    }),
  );
}

async function inspectFullScroll(page: Page) {
  const failures = new Set<string>();
  for (const failure of await visibleTextOverflow(page)) failures.add(failure);

  await page.evaluate(async () => {
    const step = Math.max(Math.floor(innerHeight * 0.8), 320);
    let top = 0;

    while (top < document.documentElement.scrollHeight - innerHeight) {
      window.scrollTo({ top, behavior: "auto" });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      top += step;
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight - innerHeight,
      behavior: "auto",
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });

  for (const failure of await visibleTextOverflow(page)) failures.add(failure);

  return [...failures];
}

async function expectForcedDarkTheme(page: Page) {
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    const palette = await page.evaluate(() => ({
      background: getComputedStyle(document.documentElement).backgroundColor,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      foreground: getComputedStyle(document.body).color,
      metaColorScheme: document
        .querySelector('meta[name="color-scheme"]')
        ?.getAttribute("content"),
      themeColor: document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute("content"),
      viewport: document
        .querySelector('meta[name="viewport"]')
        ?.getAttribute("content"),
    }));

    expect(palette).toEqual({
      background: "rgb(11, 11, 10)",
      colorScheme: "dark",
      foreground: "rgb(241, 239, 232)",
      metaColorScheme: "dark",
      themeColor: "#0b0b0a",
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    });
  }
}

for (const route of ALL_ROUTES) {
  test(`${route} is recruiter-ready on iPhone`, async ({ page }) => {
    const failures = observeFailures(page);
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await waitForStablePage(page);

    await expectForcedDarkTheme(page);
    await expect(page.locator("h1")).toHaveCount(1);

    const headerBounds = await page.locator(".site-header").evaluate((header) => {
      const bounds = header.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right, top: bounds.top };
    });
    expect(headerBounds.left).toBeGreaterThanOrEqual(0);
    expect(headerBounds.right).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
    expect(headerBounds.top).toBe(0);

    expect(await inspectFullScroll(page)).toEqual([]);
    expect(await paintedMobileOmissions(page)).toEqual([]);
    expect(await paintedSvgVisuals(page)).toEqual([]);

    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images
        .filter(
          (image) =>
            image instanceof HTMLImageElement &&
            Boolean(image.currentSrc || image.src) &&
            image.complete &&
            image.naturalWidth === 0,
        )
        .map((image) =>
          image instanceof HTMLImageElement
            ? image.currentSrc || image.src
            : "unknown image",
        ),
    );
    expect(brokenImages).toEqual([]);

    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
    expect(failures).toEqual({
      consoleErrors: [],
      pageErrors: [],
      responseErrors: [],
    });
  });
}

test("mobile archive cards are compact and their titles stay inside each card", async ({
  page,
}) => {
  for (const route of ["/projects", "/research"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForStablePage(page);
    const controls = page.locator('[data-relay-control]');

    for (let index = 0; index < (await controls.count()); index += 1) {
      await controls.nth(index).click();
      const panel = page.locator('[data-relay-panel][data-active="true"]');
      await expect(
        page.locator('[data-relay-panel][data-active="true"]'),
      ).toHaveCount(1);
      await expect(panel).toBeVisible();
      await expect(panel.locator('[data-mobile-gallery-media="true"]')).toBeHidden();
      await expect(
        panel.locator('[data-technical-visual="true"]:visible'),
      ).toHaveCount(0);

      const geometry = await panel.evaluate((element) => {
        const panelBounds = element.getBoundingClientRect();
        const heading = element.querySelector("h2");
        const summary = heading?.nextElementSibling;
        const action = summary?.nextElementSibling;
        const media = element.querySelector<HTMLElement>(
          '[data-mobile-gallery-media="true"]',
        );
        if (!heading) throw new Error("Archive card heading is missing.");

        const contentBounds = [heading, summary, action].map((node) => {
          if (!(node instanceof HTMLElement)) {
            throw new Error("Archive card content is incomplete.");
          }
          const bounds = node.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
          };
        });

        return {
          height: panelBounds.height,
          panelLeft: panelBounds.left,
          panelRight: panelBounds.right,
          panelTop: panelBounds.top,
          panelBottom: panelBounds.bottom,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          mediaHeight: media?.getBoundingClientRect().height ?? -1,
          contentBounds,
        };
      });

      expect(geometry.height).toBeLessThan(
        await page.evaluate(() => innerHeight * (innerWidth > innerHeight ? 1.35 : 1.05)),
      );
      expect(geometry.scrollHeight).toBeLessThanOrEqual(
        geometry.clientHeight + 1,
      );
      expect(geometry.mediaHeight).toBe(0);

      for (const bounds of geometry.contentBounds) {
        expect(bounds.left).toBeGreaterThanOrEqual(geometry.panelLeft - 1);
        expect(bounds.right).toBeLessThanOrEqual(geometry.panelRight + 1);
        expect(bounds.top).toBeGreaterThanOrEqual(geometry.panelTop - 1);
        expect(bounds.bottom).toBeLessThanOrEqual(geometry.panelBottom + 1);
      }

      for (const image of await panel.locator("img:visible").all()) {
        await expect
          .poll(() =>
            image.evaluate((element) =>
              element instanceof HTMLImageElement
                ? element.complete && element.naturalWidth > 0
                : false,
            ),
          )
          .toBe(true);
      }
    }

    const documentWidth = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(documentWidth.scroll).toBe(documentWidth.client);
  }
});

test("homepage experience and gallery cards fit the standard iPhone", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForStablePage(page);

  for (const heading of await page.locator(".experience-panel__body h3").all()) {
    const fits = await heading.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const bounds = range.getBoundingClientRect();
      return bounds.left >= -1 && bounds.right <= innerWidth + 1;
    });
    expect(fits).toBe(true);
  }

  for (const rail of ["#featured-work", "#research"]) {
    const section = page.locator(rail);
    const panels = section.locator("[data-showcase-panel]");
    const next = section.getByRole("button", { name: /Next/ });

    for (let index = 0; index < (await panels.count()); index += 1) {
      if (index > 0) await next.click();

      const panel = panels.nth(index);
      await expect(panel).toHaveAttribute("data-active", "true");
      await expect(panel.locator('[data-mobile-gallery-media="true"]')).toBeHidden();
      await expect(
        panel.locator('[data-technical-visual="true"]:visible'),
      ).toHaveCount(0);

      const geometry = await panel.evaluate((element) => {
        const panelBounds = element.getBoundingClientRect();
        const content = [
          element.querySelector("h3"),
          element.querySelector("h3")?.nextElementSibling,
          element.querySelector("h3")?.nextElementSibling?.nextElementSibling,
        ].map((node) => {
          if (!(node instanceof HTMLElement)) {
            throw new Error("Homepage gallery card content is incomplete.");
          }
          const bounds = node.getBoundingClientRect();
          return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
          };
        });
        const media = element.querySelector<HTMLElement>(
          '[data-mobile-gallery-media="true"]',
        );

        return {
          height: panelBounds.height,
          left: panelBounds.left,
          right: panelBounds.right,
          top: panelBounds.top,
          bottom: panelBounds.bottom,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          mediaHeight: media?.getBoundingClientRect().height ?? -1,
          content,
        };
      });

      expect(geometry.height).toBeLessThan(
        await page.evaluate(() =>
          innerHeight * (innerWidth > innerHeight ? 1.35 : 1.05),
        ),
      );
      expect(geometry.scrollHeight).toBeLessThanOrEqual(
        geometry.clientHeight + 1,
      );
      expect(geometry.mediaHeight).toBe(0);
      for (const bounds of geometry.content) {
        expect(bounds.left).toBeGreaterThanOrEqual(geometry.left - 1);
        expect(bounds.right).toBeLessThanOrEqual(geometry.right + 1);
        expect(bounds.top).toBeGreaterThanOrEqual(geometry.top - 1);
        expect(bounds.bottom).toBeLessThanOrEqual(geometry.bottom + 1);
      }
    }
  }
});

test("desktop technical visuals remain intact", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "iphone-15");

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  try {
    for (const surface of [
      { route: "/", galleryMedia: 8 },
      { route: "/projects", galleryMedia: 5 },
      { route: "/research", galleryMedia: 3 },
    ] as const) {
      const surfaceName = surface.route === "/" ? "home" : surface.route.slice(1);
      await page.goto(`http://127.0.0.1:3100${surface.route}`, {
        waitUntil: "domcontentloaded",
      });
      await waitForStablePage(page);

      const media = page.locator('[data-mobile-gallery-media="true"]');
      await expect(media).toHaveCount(surface.galleryMedia);
      for (const frame of await media.all()) {
        const geometry = await frame.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            display: getComputedStyle(element).display,
            width: bounds.width,
            height: bounds.height,
          };
        });
        expect(geometry.display).not.toBe("none");
        expect(geometry.width).toBeGreaterThan(300);
        expect(geometry.height).toBeGreaterThan(250);

        await frame.scrollIntoViewIfNeeded();
        for (const image of await frame.locator("img").all()) {
          await expect
            .poll(() =>
              image.evaluate((element) =>
                element instanceof HTMLImageElement
                  ? element.complete && element.naturalWidth > 0
                  : false,
              ),
            )
            .toBe(true);
        }
      }

      const screenshotPath = join(
        process.cwd(),
        "mobile-evidence",
        "desktop-webkit",
        `${surfaceName}.png`,
      );
      await mkdir(join(process.cwd(), "mobile-evidence", "desktop-webkit"), {
        recursive: true,
      });
      await page.screenshot({
        animations: "disabled",
        path: screenshotPath,
      });
      await testInfo.attach(`desktop-${surfaceName}`, {
        path: screenshotPath,
        contentType: "image/png",
      });
    }

    for (const surface of [
      { route: "/projects/move", technicalVisuals: 2 },
      { route: "/projects/deskinator", technicalVisuals: 2 },
      { route: "/projects/inventory-system", technicalVisuals: 2 },
      { route: "/projects/tickit", technicalVisuals: 2 },
      { route: "/projects/ai-notes-or-ocr", technicalVisuals: 2 },
      { route: "/research/contextual-similarity", technicalVisuals: 4 },
      { route: "/research/biomimetic-ai", technicalVisuals: 1 },
    ] as const) {
      await page.goto(`http://127.0.0.1:3100${surface.route}`, {
        waitUntil: "domcontentloaded",
      });
      await waitForStablePage(page);
      const visuals = page.locator('[data-technical-visual="true"]');
      await expect(visuals).toHaveCount(surface.technicalVisuals);

      const hidden = await visuals.evaluateAll((elements) =>
        elements.flatMap((element) => {
          const bounds = element.getBoundingClientRect();
          return getComputedStyle(element).display === "none" ||
            bounds.width <= 100 ||
            bounds.height <= 100
            ? [element.className]
            : [];
        }),
      );
      expect(hidden).toEqual([]);
    }
  } finally {
    await context.close();
  }
});

test("resume skill labels stack above their values", async ({ page }) => {
  await page.goto("/resume", { waitUntil: "domcontentloaded" });
  await waitForStablePage(page);

  for (const row of await page.locator(".resume-skill").all()) {
    const geometry = await row.evaluate((element) => {
      const label = element.querySelector("h3")?.getBoundingClientRect();
      const value = element.querySelector("p")?.getBoundingClientRect();
      return label && value
        ? { labelBottom: label.bottom, valueTop: value.top }
        : null;
    });
    expect(geometry).not.toBeNull();
    expect(geometry!.valueTop).toBeGreaterThanOrEqual(geometry!.labelBottom);
  }
});

test("legacy research URLs redirect and the resume PDF is available", async ({
  page,
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== "iphone-15");

  for (const [source, destination] of [
    ["/projects/rowing-biomechanics", "/research/rowing-biomechanics"],
    ["/projects/biomimetic-ai", "/research/biomimetic-ai"],
  ] as const) {
    await page.goto(source, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
  }

  const response = await request.get("/resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).byteLength).toBeGreaterThan(100_000);
});

test("not-found page remains usable on iPhone", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "iphone-15");
  const response = await page.goto("/does-not-exist", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This page left the course." }),
  ).toBeVisible();
  expect(await visibleTextOverflow(page)).toEqual([]);
});

test("capture key recruiter surfaces for visual review", async (
  { page },
  testInfo,
) => {
  const evidenceDir = join(
    process.cwd(),
    "mobile-evidence",
    testInfo.project.name,
  );
  await mkdir(evidenceDir, { recursive: true });

  const surfaces = [
    { name: "home-experience", route: "/", focus: ".experience-panel" },
    {
      name: "home-project-card",
      route: "/",
      focus: "#featured-work [data-showcase-panel]",
    },
    {
      name: "home-research-card",
      route: "/",
      focus: "#research [data-showcase-panel]",
    },
    {
      name: "contextual-research-hero",
      route: "/research/contextual-similarity",
    },
    { name: "resume-skills", route: "/resume", focus: ".resume-skill" },
    {
      name: "note-heading",
      route: "/notes/estimating-rowing-force-curves",
    },
  ] as const;

  for (const surface of surfaces) {
    await page.goto(surface.route, { waitUntil: "domcontentloaded" });
    await waitForStablePage(page);
    if ("focus" in surface) {
      await page.locator(surface.focus).first().scrollIntoViewIfNeeded();
    }

    const screenshotPath = join(evidenceDir, `${surface.name}.png`);
    await page.screenshot({
      animations: "disabled",
      path: screenshotPath,
    });
    await testInfo.attach(surface.name, {
      path: screenshotPath,
      contentType: "image/png",
    });
  }

  for (const archive of [
    {
      route: "/projects",
      names: ["move", "deskinator", "inventory", "tickit", "noteworthy"],
    },
    {
      route: "/research",
      names: ["contextual", "rowing", "biomimetic"],
    },
  ] as const) {
    await page.goto(archive.route, { waitUntil: "domcontentloaded" });
    await waitForStablePage(page);
    const controls = page.locator('[data-relay-control]');
    expect(await controls.count()).toBe(archive.names.length);

    for (let index = 0; index < archive.names.length; index += 1) {
      await controls.nth(index).click();
      const activePanel = page.locator(
        '[data-relay-panel][data-active="true"]',
      );
      await activePanel.scrollIntoViewIfNeeded();
      const name = `${archive.route.slice(1)}-${String(index + 1).padStart(
        2,
        "0",
      )}-${archive.names[index]}`;
      const screenshotPath = join(evidenceDir, `${name}.png`);
      await page.screenshot({
        animations: "disabled",
        path: screenshotPath,
      });
      await testInfo.attach(name, {
        path: screenshotPath,
        contentType: "image/png",
      });
    }
  }
});
