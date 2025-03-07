/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    shouldNotRenderErrorPage(): Chainable<void>;
    shouldRenderPageWithId(id: string): Chainable<void>;
    connectWallet(): Chainable<void>;
    deployToken(symbol: string, name: string): Chainable<string | undefined>;
  }
}
