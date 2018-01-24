import puppeteer from "puppeteer";
import axios from "axios";
import { expect } from "chai";
import { clearPage, becomeUser, makePage, authUser, setToken } from "./helpers";

const { ORIGIN, JWT_SECRET } = process.env;

describe("start game", function() {
  before(function userIsAuthenticated() {
    return becomeUser(this, "John", "john@mail.com", "deadbeef");
  });

  it.skip("we are on user page", async function() {
    await this.page.waitForSelector("#user_mail");
    expect(this.page.url()).to.be.equal(ORIGIN + "/user");
  });

  it("see user info", async function() {
    const email = await this.page.$("#user_email");
    const text = await this.page.evaluate(e => e.textContent, email);
    expect(text).to.be.equal("Email: john@mail.com");
  });

  context("when click on state badge", function() {
    before(async function() {
      await this.page.click("#user_status_badge");
      await this.page.waitFor(200); // wait for ws response
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
        await becomeUser(this.other, "Other", "other@mail.com", "deadbeef");

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
    await clearPage(this.page);
    await clearPage(this.other.page);
    await this.db.dropDatabase();
  });
});
