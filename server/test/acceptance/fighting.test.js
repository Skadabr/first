import puppeteer from "puppeteer";
import axios from "axios";
import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "./helpers";

const { ORIGIN } = process.env;

describe("fighting", function() {
  before(async function userIsAuthenticated() {
    this.page = await goToPage(this.browser, ORIGIN);
    this.other.page = await goToPage(this.other.browser, ORIGIN);
    await becomeUser(this.page, "John", "john@mail.com", "deadbeef");
    await becomeUser(this.other.page, "Other", "other@mail.com", "deadbeef");
  });

  context("when user was challanger", function() {
    before(async function() {
      this.page = await goToPage(this.browser, ORIGIN);
      await this.page.click("#user_status_badge");
      await this.page.waitFor(100);
      await this.other.page.click("#user_status_badge");
      await this.other.page.waitForSelector("#game_board"); // wait for ws response
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

    after(function() {
      return this.page.close();
    });
  });

  context("when user was challanged", function() {
    before(async function() {
      this.page = await goToPage(this.browser, ORIGIN);
      await this.other.page.click("#user_status_badge");
      await this.page.click("#user_status_badge");
      await this.page.waitForSelector("#game_board"); // wait for ws response
    });

    it("all warrors positions is empty", async function() {
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
        const my = document.querySelector("#opponent_game_stats").dataset
          .health;
        const his = document.querySelector("#my_game_stats").dataset.health;
        return [my, his];
      });
      expect(my).to.equal("30");
      expect(his).to.equal("30");
    });

    describe("pick a warrior", function() {
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

      context(
        "when user click on another warrior in warriors list",
        function() {
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
        }
      );

      context("when click on turn", function() {
        before(async function() {
          await this.page.click("#turn");
          await this.page.waitFor(200);
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
      });
    });

    after(function() {
      this.page.close();
    });
  });

  after(async function() {
    await clearState(this.page);
    await this.db.dropDatabase();
  });
});

function clickOnPawn(page) {
  return page.click("#warriors_list > div:nth-child(1)");
}

function clickOnOfficer(page) {
  return page.click("#warriors_list > div:nth-child(2)");
}
