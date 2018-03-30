import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "../helpers";
import {
  challenge,
  clickOnPawn,
  clickOnOfficer,
  startAFightAsChallanger,
  turn
} from "./helpers";

const { ORIGIN } = process.env;

describe("battle: when user was challenger", function() {
  before(async function() {
    this.page = await goToPage(this.browser, ORIGIN);
    this.other.page = await goToPage(this.other.browser, ORIGIN);
    await becomeUser(this.page, "John", "john@mail.com", "deadbeef");
    await becomeUser(this.other.page, "Other", "other@mail.com", "deadbeef");
    await challenge(this.page, this.other.page); // when user was challenger
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

  context("when opponent make his step", async function() {
    before(async function() {
      await turn(this.other.page, this.page);
    });

    it("user can pick yet another warrior", async function() {
      await clickOnPawn(this.page);
      const len = await this.page.evaluate(
        () =>
          document.querySelectorAll("#my_warriors_positions #warrior_on_field")
            .length
      );
      expect(len).to.be.equal(1);
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
