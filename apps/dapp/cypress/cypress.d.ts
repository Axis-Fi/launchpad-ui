/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    shouldNotRenderErrorPage(): Chainable<void>;
  }
}
