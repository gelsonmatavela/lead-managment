import { defineConfig } from "cypress";

export default defineConfig({


  e2e: {
    baseUrl: 'http://localhost:3002',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {
      on('task', {
        log(message: string) {
          console.log(message)
          return null
        }
      })
      return config;
    },
    specPattern: [
      'cypress/e2e/**/*.cy.{ts, tsx}',
      'cypress/e2e/**/*.spec.{ts, tsx}'
    ],
    excludeSpecPattern: [
      '**/examples/*',
      '**/node_modules/*'
    ],
    experimentalStudio: true,
    chromeWebSecurity: false
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{ts,tsx}',
    indexHtmlFile: 'cypress/support/component-index.html'
  }
});
