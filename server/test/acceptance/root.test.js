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

  it("see login form", async function() {
    const form = await this.page.$("form#login");
    expect(form).not.to.be.null;
  });
});
