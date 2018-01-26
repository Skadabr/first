import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "../helpers";
import { challenge, clickOnPawn, clickOnOfficer } from "./helpers";

const { ORIGIN } = process.env;

describe("fighting: when user was challenged", function() {
  before(async function() {
    this.page = await goToPage(this.browser, ORIGIN);
    this.other.page = await goToPage(this.other.browser, ORIGIN);
    await becomeUser(this.page, "John", "john@mail.com", "deadbeef");
    await becomeUser(this.other.page, "Other", "other@mail.com", "deadbeef");

    // when user was challenged
    await challenge(this.other.page, this.page);
  });

  it("all warriors positions is empty", async function() {
    const len = await this.page.evaluate(() => {
      const len1 = document.querySelectorAll(
        "#my_warriors_positions > div:not(:empty)"
      ).length;
      const len2 = document.querySelectorAll(
        "#opponent_warriors_positions > div:not(:empty)"
      ).length;
      return len1 + len2;
    });
    expect(len).to.be.equal(0);
  });

  it("both gamers have 30 points of health", async function() {
    const [my, his] = await this.page.evaluate(() => {
      const my = document.querySelector("#opponent_game_stats").dataset.health;
      const his = document.querySelector("#my_game_stats").dataset.health;
      return [my, his];
    });
    expect(my).to.equal("30");
    expect(his).to.equal("30");
  });

  describe("picking a warrior", function() {
    before(function() {
      return clickOnPawn(this.page);
    });

    it("user can see the warrior", async function() {
      const len = await this.page.evaluate(
        () =>
          document.querySelectorAll("#my_warriors_positions div:not(:empty)")
            .length
      );
      expect(len).to.be.equal(1);
    });

    context("when user click on another warrior in warriors list", function() {
      before(function() {
        return clickOnOfficer(this.page);
      });

      it("replace currently picked warrior on another", async function() {
        const text = await this.page.$eval(
          "#my_warriors_positions > div:nth-child(5)",
          el => el.textContent
        );
        expect(text).to.match(/officer/);
      });
    });

    context("when click on turn", function() {
      before(async function() {
        await this.page.click("button#turn");
        await this.other.page.waitForSelector("button#turn:not([disabled])");
      });

      it("user see that opponent receive damage", async function() {
        const health = await this.page.$eval(
          "#opponent_game_stats",
          el => el.dataset.health
        );
        expect(health).to.be.equal("28");
      });

      it("opponent see that he receive damage", async function() {
        const health = await this.other.page.$eval(
          "#my_game_stats",
          el => el.dataset.health
        );
        expect(health).to.be.equal("28");
      });

      it("user can't pick new warrior until next turn", async function() {
        await clickOnPawn(this.page);
        const len = await this.page.evaluate(
          () =>
            document.querySelectorAll(
              "#my_warriors_positions > div:not(:empty)"
            ).length
        );
        expect(len).to.be.equal(1);
      });

      it("user can't click turn button again until next turn", async function() {
        const button = await this.page.$("button#turn[disabled]");
        expect(button).is.exist;
      });
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
