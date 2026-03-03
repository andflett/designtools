import { defineConfig } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = path.join(__dirname, "demos");
const PKG_ROOT = path.join(__dirname, "packages");

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],
  use: {
    isMobile: false,
    viewport: { width: 1600, height: 900 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "studio",
      testMatch: "**/studio-app/**/*.spec.ts",
      use: { baseURL: "http://localhost:4500" },
      webServer: [
        {
          command: `cd ${DEMO_ROOT}/studio-app && PORT=3100 npm run dev`,
          url: "http://localhost:3100",
          timeout: 90_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `cd ${DEMO_ROOT}/studio-app && node ${PKG_ROOT}/surface/dist/cli.js --port 3100 --tool-port 4500 --no-open`,
          url: "http://localhost:4500",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
          env: { PLAYWRIGHT_TEST: "1" },
        },
      ],
    },
    {
      name: "vite",
      testMatch: "**/vite-app/**/*.spec.ts",
      use: { baseURL: "http://localhost:4501" },
      webServer: [
        {
          command: `cd ${DEMO_ROOT}/vite-app && npm run dev -- --port 3101`,
          url: "http://localhost:3101",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `cd ${DEMO_ROOT}/vite-app && node ${PKG_ROOT}/surface/dist/cli.js --port 3101 --tool-port 4501 --no-open`,
          url: "http://localhost:4501",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
          env: { PLAYWRIGHT_TEST: "1" },
        },
      ],
    },
    {
      name: "design-system",
      testMatch: "**/design-system/**/*.spec.ts",
      use: { baseURL: "http://localhost:4502" },
      webServer: [
        {
          command: `cd ${DEMO_ROOT}/design-system && PORT=3102 npm run dev`,
          url: "http://localhost:3102",
          timeout: 90_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `cd ${DEMO_ROOT}/design-system && node ${PKG_ROOT}/surface/dist/cli.js --port 3102 --tool-port 4502 --no-open`,
          url: "http://localhost:4502",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
          env: { PLAYWRIGHT_TEST: "1" },
        },
      ],
    },
    {
      name: "css",
      testMatch: "**/css-app/**/*.spec.ts",
      use: { baseURL: "http://localhost:4503" },
      webServer: [
        {
          command: `cd ${DEMO_ROOT}/css-app && npm run dev -- --port 3103`,
          url: "http://localhost:3103",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `cd ${DEMO_ROOT}/css-app && node ${PKG_ROOT}/surface/dist/cli.js --port 3103 --tool-port 4503 --no-open`,
          url: "http://localhost:4503",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
          env: { PLAYWRIGHT_TEST: "1" },
        },
      ],
    },
    {
      name: "css-modules",
      testMatch: "**/css-modules-app/**/*.spec.ts",
      use: { baseURL: "http://localhost:4504" },
      webServer: [
        {
          command: `cd ${DEMO_ROOT}/css-modules-app && npm run dev -- --port 3104`,
          url: "http://localhost:3104",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `cd ${DEMO_ROOT}/css-modules-app && node ${PKG_ROOT}/surface/dist/cli.js --port 3104 --tool-port 4504 --no-open`,
          url: "http://localhost:4504",
          timeout: 30_000,
          reuseExistingServer: !process.env.CI,
          env: { PLAYWRIGHT_TEST: "1" },
        },
      ],
    },
  ],
});
