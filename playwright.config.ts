import { defineConfig } from "@playwright/test";
import path from "node:path";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  use: { baseURL: "http://localhost:3105", browserName: "chromium" },
  webServer: {
    command: "npm run dev -- --port 3105", url: "http://localhost:3105", reuseExistingServer: false,
    env: { ADMIN_PASSWORD: "local-browser-test-password-only", LEADS_DATA_DIR: path.join(process.cwd(), "test-results", "leads") },
    timeout: 120000,
  },
});
