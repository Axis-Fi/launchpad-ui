/// <reference types="cypress" />

import { URLS } from "./constants";

// These tests just ensure that none of the pages have been inadvertently broken by any code changes
describe("smoke tests", () => {
  it("renders home page", () => {
    cy.visit(URLS.HOME);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_HOME_PAGE__");
  });

  it("renders create launch page", () => {
    cy.visit(URLS.CREATE_LAUNCH);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_CREATE_LAUNCH_PAGE__");
  });

  it("renders curator page", () => {
    cy.visit(URLS.CURATOR);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_CURATOR_PAGE__");
  });

  it("renders curators page", () => {
    cy.visit(URLS.CURATORS);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_CURATORS_PAGE__");
  });

  it("renders referral page", () => {
    cy.visit(URLS.REFERRALS);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_REFERRALS_PAGE__");
  });

  it("renders launch page", () => {
    cy.visit(URLS.LAUNCH);
    cy.shouldRenderPageWithId("__AXIS_ORIGIN_LAUNCH_PAGE__");
  });

  if (Cypress.env("VITE_TESTNET") === "true") {
    it("renders faucet page", () => {
      cy.visit(URLS.FAUCET);
      cy.shouldRenderPageWithId("__AXIS_ORIGIN_FAUCET_PAGE__");
    });

    it("renders deploy page", () => {
      cy.visit(URLS.DEPLOY);
      cy.shouldRenderPageWithId("__AXIS_ORIGIN_DEPLOY_PAGE__");
    });
  }
});
