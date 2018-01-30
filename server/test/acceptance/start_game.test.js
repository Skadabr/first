import puppeteer from "puppeteer";
import axios from "axios";
import { expect } from "chai";
import {
  clearState,
  becomeUser,
  makePage,
  authUser,
  goToPage
} from "./helpers";

const { ORIGIN, JWT_SECRET } = process.env;

describe("start game", function() {
  before(async function userIsAuthenticated() {
    this.page = await goToPage(this.browser, ORIGIN);
    return becomeUser(this.page, "John", "john@mail.com", "deadbeef");
  });

  it.skip("we are on user page", async function() {
    await this.page.waitForSelector("#user_email");
    expect(this.page.url()).to.be.equal(ORIGIN + "/user");
  });

  it("see user info", async function() {
    const text = await this.page.$eval("#user_email", e => e.textContent);
    expect(text).to.be.equal("Email: john@mail.com");
  });

  context("when click on state badge", function() {
    before(async function() {
      await this.page.click("#user_status_badge.badge-success");
      await this.page.screenshot({ path: "/data/image.png" });
      await this.page.waitForSelector("#user_status_badge.badge-warning"); // wait for ws response
    });

    it("badge become yellow", async function() {
      const color = await this.page.$eval(
        "#user_status_badge",
        sb => getComputedStyle(sb).backgroundColor
      );
      expect(color).to.be.equal("rgb(240, 173, 78)");
    });

    it("badge has `ready` sign", async function() {
      const text = await this.page.$eval(
        "#user_status_badge",
        sb => sb.textContent
      );
      expect(text).to.be.equal("ready");
    });

    context("when another user click on state badge", function() {
      before(async function() {
        this.other.page = await goToPage(this.other.browser, ORIGIN);
        await becomeUser(
          this.other.page,
          "Other",
          "other@mail.com",
          "deadbeef"
        );

        await this.other.page.click("#user_status_badge");
        await this.other.page.waitFor(200); // wait for ws response
      });

      it("badger has `fight` sign", async function() {
        const text = await this.other.page.$eval(
          "#user_status_badge",
          sb => sb.textContent
        );
        expect(text).to.be.equal("fight");
      });
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
