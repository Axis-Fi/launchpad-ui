import { defineConfig } from "cypress";

export default defineConfig({
  retries: {
    openMode: 0,
  },
  e2e: {
    specPattern: [
      "cypress/smoke.cy.ts",
      // "cypress/e2e/**/*.cy.ts",
    ],
  },
});
