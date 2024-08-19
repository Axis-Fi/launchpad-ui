/// <reference types="cypress" />

import { URLS } from "./constants";

// These tests just ensure that none of the pages have been inadvertently broken by any code changes
describe("smoke tests", () => {
  it("renders home page", () => {
    cy.visit(URLS.HOME);
    cy.shouldNotRenderErrorPage();
  });

  it("renders create launch page", () => {
    cy.visit(URLS.CREATE_LAUNCH);
    cy.shouldNotRenderErrorPage();
  });

  it("renders curator page", () => {
    cy.visit(URLS.CURATOR);
    cy.shouldNotRenderErrorPage();
  });

  it("renders curators page", () => {
    cy.visit(URLS.CURATORS);
    cy.shouldNotRenderErrorPage();
  });

  it("renders referral page", () => {
    cy.visit(URLS.REFER);
    cy.shouldNotRenderErrorPage();
  });

  it("renders launch page", () => {
    cy.visit(URLS.LAUNCH);
    cy.shouldNotRenderErrorPage();
  });

  it("renders faucet page", () => {
    cy.visit(URLS.FAUCET);
    cy.shouldNotRenderErrorPage();
  });

  it("renders deploy page", () => {
    cy.visit(URLS.DEPLOY);
    cy.shouldNotRenderErrorPage();
  });
});
