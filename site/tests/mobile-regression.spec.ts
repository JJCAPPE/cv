import { expect, test, type Page } from "@playwright/test";

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

const CORE_ROUTES = new Set([
  "/",
  "/projects",
  "/projects/move",
  "/research",
  "/research/contextual-similarity",
  "/resume",
  "/notes",
]);

const FULL_CRAWL_PROJECTS = new Set(["iphone-15", "iphone-15-landscape"]);

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
        bounds.bottom <= 0 ||
        bounds.top >= innerHeight ||
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

async function inspectFullScroll(page: Page) {
  const failures = new Set<string>();
  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );

  for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "auto" }),
      maxScroll * ratio,
    );
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    for (const failure of await visibleTextOverflow(page)) failures.add(failure);
  }

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
    }));

    expect(palette).toEqual({
      background: "rgb(11, 11, 10)",
      colorScheme: "dark",
      foreground: "rgb(241, 239, 232)",
      metaColorScheme: "dark",
      themeColor: "#0b0b0a",
    });
  }
}

for (const route of ALL_ROUTES) {
  test(`${route} is recruiter-ready on iPhone`, async ({ page }, testInfo) => {
    test.skip(
      !FULL_CRAWL_PROJECTS.has(testInfo.project.name) &&
        !CORE_ROUTES.has(route),
      "Standard portrait and landscape iPhones crawl every route; edge sizes cover core routes.",
    );

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

    const visibleImages = page.locator("img:visible");
    for (const image of await visibleImages.all()) {
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
}, testInfo) => {
  test.skip(testInfo.project.name !== "iphone-15");

  for (const route of ["/projects", "/research"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForStablePage(page);
    const controls = page.locator('[data-relay-control]');

    for (let index = 0; index < (await controls.count()); index += 1) {
      await controls.nth(index).click();
      const panel = page.locator('[data-relay-panel][data-active="true"]');
      await expect(panel).toBeVisible();
      const geometry = await panel.evaluate((element) => {
        const panelBounds = element.getBoundingClientRect();
        const heading = element.querySelector("h2");
        if (!heading) throw new Error("Archive card heading is missing.");
        const range = document.createRange();
        range.selectNodeContents(heading);
        const titleBounds = range.getBoundingClientRect();
        return {
          height: panelBounds.height,
          titleLeft: titleBounds.left,
          titleRight: titleBounds.right,
          panelLeft: panelBounds.left,
          panelRight: panelBounds.right,
        };
      });

      expect(geometry.height).toBeLessThan(
        (await page.evaluate(() => innerHeight)) * 1.2,
      );
      expect(geometry.titleLeft).toBeGreaterThanOrEqual(geometry.panelLeft - 1);
      expect(geometry.titleRight).toBeLessThanOrEqual(geometry.panelRight + 1);
    }
  }
});

test("homepage experience and gallery cards fit the standard iPhone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "iphone-15");
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
    const panels = page.locator(`${rail} [data-showcase-panel]`);
    for (let index = 0; index < (await panels.count()); index += 1) {
      const panelHeight = await panels.nth(index).evaluate(
        (element) => element.getBoundingClientRect().height,
      );
      expect(panelHeight).toBeLessThan(
        (await page.evaluate(() => innerHeight)) * 1.2,
      );
    }
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
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  expect(await visibleTextOverflow(page)).toEqual([]);
});
