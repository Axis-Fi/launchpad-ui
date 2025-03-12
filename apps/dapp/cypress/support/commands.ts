/// <reference types="cypress" />
import { URLS, COMPONENTS, TIME } from "../constants";

Cypress.Commands.add("shouldNotRenderErrorPage", () => {
  // Timeout required because the error page might not appear until the whole page has rendered
  cy.wait(500).get("#__AXIS_ORIGIN_ERROR_PAGE__").should("not.exist");
});

// Generally a test will run faster looking for an expected ID rather than waiting for an error page
Cypress.Commands.add("shouldRenderPageWithId", (id: string) => {
  cy.get(`#${id}`, { timeout: 10000 }).should("exist");
});

Cypress.Commands.add("connectWallet", () => {
  cy.get("[data-testid='connect-wallet']").click();
  cy.get("[data-testid='rk-wallet-option-injected']").click();
});

Cypress.Commands.add("deployToken", (symbol: string, name: string) => {
  const { DEPLOY } = COMPONENTS;

  cy.visit(URLS.DEPLOY);
  cy.get(DEPLOY.TOKEN_NAME_FIELD).clear().type(name);
  cy.get(DEPLOY.TOKEN_SYMBOL_FIELD).clear().type(symbol);
  cy.get(DEPLOY.DEPLOY_BUTTON).click();
  cy.get(DEPLOY.SUCCESS_MESSAGE, { timeout: TIME.TRANSACTION_TIMEOUT }).should(
    "be.visible",
  );

  return cy
    .get(COMPONENTS.BLOCK_EXPLORER_LINK)
    .invoke("attr", "data-token-address")
    .then((tokenAddress) => tokenAddress);
});

Cypress.Commands.add(
  "deployTokenAndMint",
  (symbol: string, name: string, amount: string = "100000") => {
    const { DEPLOY, MINT } = COMPONENTS;

    cy.visit(URLS.DEPLOY);
    cy.get(DEPLOY.TOKEN_NAME_FIELD).clear().type(name);
    cy.get(DEPLOY.TOKEN_SYMBOL_FIELD).clear().type(symbol);
    cy.get(DEPLOY.DEPLOY_BUTTON).click();
    cy.get(DEPLOY.SUCCESS_MESSAGE, {
      timeout: TIME.TRANSACTION_TIMEOUT,
    }).should("be.visible");

    cy.get(MINT.AMOUNT_FIELD).clear().type(amount);
    cy.get(MINT.MINT_BUTTON).click();
    cy.get(MINT.SUCCESS_MESSAGE, { timeout: TIME.TRANSACTION_TIMEOUT }).should(
      "be.visible",
    );

    return cy
      .get(COMPONENTS.BLOCK_EXPLORER_LINK)
      .invoke("attr", "data-token-address")
      .then((tokenAddress) => tokenAddress);
  },
);
