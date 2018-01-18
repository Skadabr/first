const { expect } = require("chai");

const { ORIGIN } = process.env;

describe("RootPage", function() {
  beforeEach(function() {
    return this.page.goto(ORIGIN);
  });

  it("see signup form", async function() {
    const form = await this.page.$("form#signup");
    expect(form).not.to.be.null;
  });
});

// const CREDS = { username: 'balala', password: 'blablabla'}
//
//await page.click(USERNAME_SELECTOR);
//await page.keyboard.type(CREDS.username);
//
//await page.click(PASSWORD_SELECTOR);
//await page.keyboard.type(CREDS.password);
//
//await page.click(BUTTON_SELECTOR);
//
//await page.waitForNavigation();
