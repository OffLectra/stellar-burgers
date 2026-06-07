import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    testMatch: ["**/*.pl.tsx", "**/?(*.)@(spec|test).tsx"],
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:4000",
        trace: "on-first-retry"
    },
    webServer: {
        command: "npm start",
        port: 4000,
        reuseExistingServer: !process.env.CI
    }
});