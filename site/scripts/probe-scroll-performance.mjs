import { chromium } from "playwright";

const baseURL = process.env.PERF_BASE_URL ?? "http://127.0.0.1:3100";
const viewports = [
  { name: "desktop", width: 1200, height: 818 },
  { name: "mobile", width: 390, height: 844 },
];
const routes = ["/", "/projects"];

function percentile(values, fraction) {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(Math.ceil(sorted.length * fraction) - 1, sorted.length - 1)];
}

async function findScrollTriggerScripts(scriptURLs) {
  const sources = await Promise.all(
    scriptURLs.map(async (url) => {
      const response = await fetch(url);
      return {
        source: response.ok ? await response.text() : "",
        url,
      };
    }),
  );

  return sources
    .filter(
      ({ source }) =>
        source.includes("window.gsap") &&
        source.includes("_scrollers") &&
        source.includes("pinType"),
    )
    .map(({ url }) => url);
}

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const session = await context.newCDPSession(page);

      await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await page.addInitScript(() => {
        window.__scrollProbe = {
          cls: 0,
          inp: 0,
          lcp: 0,
          longTasks: [],
        };

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__scrollProbe.lcp = entry.startTime;
          }
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__scrollProbe.cls += entry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__scrollProbe.inp = Math.max(
              window.__scrollProbe.inp,
              entry.duration,
            );
          }
        }).observe({ type: "event", buffered: true, durationThreshold: 16 });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__scrollProbe.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime,
              scrollY: window.scrollY,
            });
          }
        }).observe({ type: "longtask", buffered: true });
      });

      await page.goto(`${baseURL}${route}`, { waitUntil: "load" });
      await page.waitForTimeout(2_000);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);

      const initialSnapshot = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        const scripts = resources.filter(
          (entry) => entry.initiatorType === "script" || entry.name.endsWith(".js"),
        );

        return {
          cls: window.__scrollProbe.cls,
          inp: window.__scrollProbe.inp,
          lcp: window.__scrollProbe.lcp,
          compressedJavaScript: scripts.reduce(
            (total, entry) => total + entry.transferSize,
            0,
          ),
          totalTransfer: resources.reduce(
            (total, entry) => total + entry.transferSize,
            0,
          ),
          scriptURLs: scripts.map((entry) => entry.name),
          heroVideos: resources
            .filter((entry) => /rowing-signal-loop-.*\.mp4/.test(entry.name))
            .map((entry) => entry.name),
        };
      });
      const traversal = await page.evaluate(async () => {
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        const frameIntervals = [];
        let previousFrame;
        let sampling = true;

        window.__scrollProbe.longTasks = [];
        root.style.scrollBehavior = "auto";

        const sampleFrame = (timestamp) => {
          if (previousFrame !== undefined) {
            frameIntervals.push(timestamp - previousFrame);
          }
          previousFrame = timestamp;
          if (sampling) {
            requestAnimationFrame(sampleFrame);
          }
        };

        requestAnimationFrame(sampleFrame);
        const scrollStep = Math.max(innerHeight / 3, 180);
        let maxScroll = Math.max(root.scrollHeight - innerHeight, 0);
        let targetScroll = 0;

        while (targetScroll < maxScroll) {
          window.scrollTo(0, targetScroll);
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );

          maxScroll = Math.max(maxScroll, root.scrollHeight - innerHeight);
          targetScroll = Math.min(targetScroll + scrollStep, maxScroll);
        }

        let stableBottomFrames = 0;
        while (stableBottomFrames < 4) {
          window.scrollTo(0, maxScroll);
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );

          const nextMaxScroll = Math.max(root.scrollHeight - innerHeight, 0);
          if (nextMaxScroll > maxScroll) {
            maxScroll = nextMaxScroll;
            stableBottomFrames = 0;
          } else {
            stableBottomFrames += 1;
          }
        }

        const steps = Math.max(Math.ceil(maxScroll / scrollStep), 1);
        for (let index = steps; index >= 0; index -= 1) {
          window.scrollTo(0, (maxScroll * index) / steps);
          await new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          );
        }

        sampling = false;
        root.style.scrollBehavior = previousBehavior;

        return {
          frameIntervals,
          longTasks: [...window.__scrollProbe.longTasks],
        };
      });

      const gsapScripts = await findScrollTriggerScripts(
        initialSnapshot.scriptURLs,
      );
      const initial = {
        ...initialSnapshot,
        gsapRequested: gsapScripts.length > 0,
        gsapScripts,
      };
      delete initial.scriptURLs;

      const result = {
        route,
        viewport: viewport.name,
        initial,
        traversal: {
          frameCount: traversal.frameIntervals.length,
          longTasks: traversal.longTasks,
          maxFrameInterval: Number(
            Math.max(0, ...traversal.frameIntervals).toFixed(1),
          ),
          p95FrameInterval: Number(
            percentile(traversal.frameIntervals, 0.95).toFixed(1),
          ),
        },
      };

      results.push(result);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));

const failures = results.flatMap((result) => {
  const messages = [];
  if (
    result.traversal.longTasks.some(({ duration }) => duration >= 50)
  ) {
    messages.push("recorded a task >=50 ms");
  }
  if (result.traversal.p95FrameInterval > 16.7) {
    messages.push(`p95 frame interval was ${result.traversal.p95FrameInterval} ms`);
  }
  if (result.initial.lcp > 2_500) {
    messages.push(`LCP was ${Math.round(result.initial.lcp)} ms`);
  }
  if (result.initial.cls > 0.1) {
    messages.push(`CLS was ${result.initial.cls.toFixed(3)}`);
  }
  if (result.initial.inp > 200) {
    messages.push(`INP was ${Math.round(result.initial.inp)} ms`);
  }
  if (result.route === "/" && result.initial.gsapRequested) {
    messages.push("requested GSAP before a homepage rail approached");
  }
  return messages.map(
    (message) => `${result.viewport} ${result.route}: ${message}`,
  );
});

if (failures.length > 0) {
  console.error(`\nPerformance probe failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
}
