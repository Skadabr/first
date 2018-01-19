//const { expect } = require("chai");
//
//const { ORIGIN } = process.env;
//
//describe("Registration", function() {
//  beforeEach(function() {
//    return this.page.goto(ORIGIN);
//  });
//
//  context("submit correct data", function() {
//    beforeEach(function(done) {
//      (async () => {
//        await this.page.focus("form input#signup_email");
//        await this.page.keyboard.type("john@mail.com");
//        await this.page.focus("form input#signup_name");
//        await this.page.keyboard.type("John");
//        await this.page.focus("form input#signup_password");
//        await this.page.keyboard.type("deadbeef");
//        await this.page.click("#signup_submit_btn");
//        this.page.once("response", resp => {
//          this.resp = resp;
//          done();
//        });
//      })();
//    });
//
//    it("receive successfull response", async function() {
//      expect(this.resp.status()).to.be.equal(201);
//    });
//  });
//});
