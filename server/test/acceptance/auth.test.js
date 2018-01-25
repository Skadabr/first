import jwt from "jsonwebtoken";

import { goToPage, clearState } from "./helpers";

const { expect } = require("chai");

const { ORIGIN, JWT_SECRET } = process.env;

describe("Authentication", function() {
  before(async function() {
    this.page = await goToPage(this.browser, ORIGIN);
  });

  context("submit correct data for signup", function() {
    before(async function() {
      await this.page.focus("form input#signup_email");
      await this.page.keyboard.type("john@mail.com");
      await this.page.focus("form input#signup_name");
      await this.page.keyboard.type("John");
      await this.page.focus("form input#signup_password");
      await this.page.keyboard.type("deadbeef");
      await this.page.click("#signup_submit_btn");
      this.resp = await new Promise(ok => this.page.once("response", ok));
    });

    it("receive successfull response", async function() {
      expect(this.resp.status()).to.be.equal(201);
    });

    context("submit correct data for login", function() {
      before(async function() {
        await this.page.focus("form input#login_email");
        await this.page.keyboard.type("john@mail.com");
        await this.page.focus("form input#login_password");
        await this.page.keyboard.type("deadbeef");
        await this.page.click("form#login button");
        this.resp = await new Promise(ok => this.page.once("response", ok));
      });

      it("receive successfull responce", async function() {
        const body = await this.resp.json();
        expect(() => jwt.verify(body.data.token, JWT_SECRET)).does.not.throw();
        expect(this.resp.status()).to.be.equal(200);
      });

      it("show user info", async function() {
        const userName = await this.page.$("#user_name");
        const name = await this.page.evaluate(
          userName => userName.textContent,
          userName
        );
        expect(name).to.be.equal("John");
      });

      context("click on logout button", function() {
        before(async function() {
          const logout = await this.page.$("#logout");
          await logout.click();
        });

        it("user is logged out", async function() {
          const token = await this.page.evaluate(() =>
            window.localStorage.getItem("user_jwt")
          );
          expect(token).to.be.null;
        });

        it("show login form", async function() {
          const login = await this.page.$("form#login");
          expect(login).to.exist;
        });
      });
    });

    after(async function() {
      await clearState(this.page);
      await this.db.dropDatabase();
    });
  });
});
