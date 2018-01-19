import jwt from "jsonwebtoken";

const { expect } = require("chai");

const { ORIGIN } = process.env;

describe("Authentication", function() {
  before(function() {
    return this.page.goto(ORIGIN);
  });

  context("submit correct data for signup", function() {
    before(function(done) {
      (async () => {
        await this.page.focus("form input#signup_email");
        await this.page.keyboard.type("john@mail.com");
        await this.page.focus("form input#signup_name");
        await this.page.keyboard.type("John");
        await this.page.focus("form input#signup_password");
        await this.page.keyboard.type("deadbeef");
        await this.page.click("#signup_submit_btn");
        this.page.once("response", resp => {
          this.resp = resp;
          done();
        });
      })();
    });

    it("receive successfull response", async function() {
      expect(this.resp.status()).to.be.equal(201);
    });

    context("submit correct data for login", function() {
      before(function(done) {
        (async () => {
          await this.page.focus("form input#login_email");
          await this.page.keyboard.type("john@mail.com");
          await this.page.focus("form input#login_password");
          await this.page.keyboard.type("deadbeef");
          await this.page.click("form#login button");
          this.page.once("response", resp => {
            this.resp = resp;
            done();
          });
        })();
      });

      it("receive successfull responce", async function() {
        const body = await resp.json();
        console.log(body);
        expect(this.resp.status()).to.be.equal(200);
      });
    });
  });
});

//await page.click(USERNAME_SELECTOR);
//await page.keyboard.type(CREDS.username);
//
//await page.click(PASSWORD_SELECTOR);
//await page.keyboard.type(CREDS.password);
//
//await page.click(BUTTON_SELECTOR);
//await page.waitForNavigation();
