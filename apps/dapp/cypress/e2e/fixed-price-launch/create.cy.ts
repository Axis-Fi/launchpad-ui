import { URLS, COMPONENTS, TIME } from "../../constants";

const { CREATE_LAUNCH } = COMPONENTS;

describe("create fixed price launch", () => {
  it("creates a fixed price launch", async () => {
    cy.visit(URLS.HOME);
    cy.connectWallet();

    cy.deployToken("AXIS", "Test payout token").then((payoutTokenAddress) => {
      expect(payoutTokenAddress).to.exist;

      cy.deployToken("USDC", "Test USDC token").then((quoteTokenAddress) => {
        expect(quoteTokenAddress).to.exist;

        cy.visit(URLS.CREATE_LAUNCH);

        cy.get(CREATE_LAUNCH.NAME_FIELD).type("Test Launch");
        cy.get(CREATE_LAUNCH.TAGLINE_FIELD).type("Test tagline");
        cy.get(CREATE_LAUNCH.PROJECT_LOGO_FIELD).type(
          "https://test.com/logo.png",
        );
        cy.get(CREATE_LAUNCH.PROJECT_BANNER_FIELD).type(
          "https://test.com/banner.png",
        );
        cy.get(CREATE_LAUNCH.WEBSITE_FIELD).type("https://test.com");
        cy.get(CREATE_LAUNCH.DISCORD_FIELD).type("https://test.com/discord");
        cy.get(CREATE_LAUNCH.TWITTER_FIELD).type("https://test.com/twitter");
        cy.get(CREATE_LAUNCH.FARCASTER_FIELD).type(
          "https://test.com/farcaster",
        );
        cy.get(CREATE_LAUNCH.DESCRIPTION_FIELD).type("Test description");

        cy.get(CREATE_LAUNCH.PAYOUT_TOKEN_FIELD).click();
        cy.get(COMPONENTS.TOKEN_PICKER.ADDRESS_FIELD).type(payoutTokenAddress);
        cy.get(COMPONENTS.TOKEN_PICKER.LOGO_FIELD).type(
          "http://test.com/logo.png",
        );
        cy.get(COMPONENTS.DIALOG_SUBMIT_BUTTON).click();

        cy.get(CREATE_LAUNCH.QUOTE_TOKEN_FIELD).click();
        cy.get(CREATE_LAUNCH.QUOTE_TOKEN_PICKER("USDC")).click();

        cy.get(CREATE_LAUNCH.CAPACITY_FIELD).type("1000");
        cy.get(CREATE_LAUNCH.PRICE_FIELD).type("1");
        cy.get(CREATE_LAUNCH.START_FIELD).type(
          new Date(Date.now() + TIME.FIVE_MINUTES).toISOString(),
        );
      });
    });
  });
});
