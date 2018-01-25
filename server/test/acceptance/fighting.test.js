import puppeteer from "puppeteer";
import axios from "axios";
import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "./helpers";

const { ORIGIN } = process.env;

describe("start game", function() {
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
      await this.page.click("#warriors_list > div:nth-child(1)");
      const text = await this.page.$eval(
        "#my_warriors_positions > div:nth-child(5)",
        el => el.textContent
      );
      expect(text).to.be.empty;
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

    describe("pick a warrior", function() {
      before(function() {
        return clickOnPawn(this.page);
      });

      it("user can see the warrior", async function() {
        const len = await this.page.evaluate(
          sel => document.querySelectorAll(sel).length,
          "#my_warriors_positions div:not(:empty)"
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

      context.skip("when click on turn", function() {
        before(async function() {
          await this.page.click("#turn");
        });

        it("kk");
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
