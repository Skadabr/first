import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "../helpers";
import {
  challenge,
  clickOnPawn,
  clickOnOfficer,
  startAFightAsChallanged,
  turn
} from "./helpers";

const { ORIGIN } = process.env;

describe("fighting: user click turn button but doesn't pick a warrior", function() {
  before(startAFightAsChallanged);

  before(async function() {
    turn(this.page, this.other.page);

    this.pageData = await this.page.evaluate(() => {
      const health = document.querySelector("#opponent_game_stats").dataset
        .health;
      const warriorsAmount = document.querySelectorAll("warrior_on_field")
        .length;
      return { health, warriorsAmount };
    });

    this.otherPageData = await this.other.page.evaluate(() => {
      const health = document.querySelector("#opponent_game_stats").dataset
        .health;
      const warriorsAmount = document.querySelectorAll("warrior_on_field")
        .length;
      return { health, warriorsAmount };
    });
  });

  it("other user don't receive a damage", async function() {
    expect(this.pageData.health).is.equal("30");
    expect(this.otherPageData.health).is.equal("30");
  });

  it("there is no warriors on his positions", function() {
    expect(this.pageData.warriorsAmount).is.equal(0);
    expect(this.otherPageData.warriorsAmount).is.equal(0);
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
