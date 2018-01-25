import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "../helpers";
import { challenge, clickOnPawn, clickOnOfficer } from "./helpers";

const { ORIGIN } = process.env;

describe("fighting: when user was challenger", function() {
  before(async function userIsAuthenticated() {
    this.page = await goToPage(this.browser, ORIGIN);
    this.other.page = await goToPage(this.other.browser, ORIGIN);
    await becomeUser(this.page, "John", "john@mail.com", "deadbeef");
    await becomeUser(this.other.page, "Other", "other@mail.com", "deadbeef");

    // when use was challenger
    await challenge(this.page, this.other.page);
  });

  it("user can't pick a warrior", async function() {
    await clickOnPawn(this.page);
    const len = await this.page.evaluate(
      () =>
        document.querySelectorAll("#my_warriors_positions > div:not(:empty)")
          .length
    );
    expect(len).to.be.equal(0);
  });

  it("user can't click on turn button", async function() {
    const button = await this.page.$("button#turn[disabled]");
    expect(button).is.exist;
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
