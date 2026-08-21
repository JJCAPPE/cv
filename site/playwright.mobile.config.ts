import { defineConfig, devices } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

const production = process.env.MOBILE_PRODUCTION === "1";
const browserName =
  process.env.MOBILE_BROWSER === "chromium" ? "chromium" : "webkit";

export default defineConfig({
  testDir: "./tests",
  testMatch: "mobile-regression.spec.ts",
  fullyParallel: false,
  outputDir: join(tmpdir(), "cv-site-mobile-playwright"),
  reporter: "line",
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  projects: [
    { name: "iphone-se", use: { ...devices["iPhone SE"] } },
    { name: "iphone-15", use: { ...devices["iPhone 15"] } },
    {
      name: "iphone-15-landscape",
      use: { ...devices["iPhone 15 landscape"] },
    },
    { name: "iphone-15-pro-max", use: { ...devices["iPhone 15 Pro Max"] } },
  ],
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName,
    colorScheme: "light",
    contextOptions: { reducedMotion: "reduce" },
    trace: "retain-on-failure",
  },
  webServer: {
    command: production
      ? "npm run start -- --hostname 127.0.0.1 --port 3100"
      : "npm run dev -- --hostname 127.0.0.1 --port 3100",
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3100",
  },
});
