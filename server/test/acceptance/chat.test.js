import puppeteer from "puppeteer";
import axios from "axios";
import { expect } from "chai";
import { becomeUser, goToPage, clearState } from "./helpers";

const { ORIGIN, JWT_SECRET } = process.env;
const msg = "hello man";

describe("chatting", function() {
  before(async function() {
    this.page = await goToPage(this.browser, ORIGIN);
    this.other.page = await goToPage(this.other.browser, ORIGIN);
    await becomeUser(this.page, "John", "john@mail.com", "deadbeef");
    await becomeUser(this.other.page, "Other", "other@mail.com", "deadbeef");
    await this.page.click("#user_status_badge");
    await this.page.waitFor(200); // wait for ws response
    await this.other.page.click("#user_status_badge");
    await this.other.page.waitFor(200); // wait for ws response
  });

  context("when user type message", function() {
    before(async function() {
      await this.page.focus("#chat_message_input");
      await this.page.keyboard.type(msg);
      await this.page.click("#btn-chat");
      await this.page.waitFor(300);
    });

    it("other user see the message", async function() {
      const { len, text } = await this.other.page.$eval(
        "#chat_messages",
        el => ({ len: el.children.length, text: el.firstChild.textContent })
      );
      expect(len).to.be.equal(1);
      expect(text).to.match(new RegExp(msg));
    });

    it("current user see the message", async function() {
      const { len, text } = await this.page.$eval("#chat_messages", el => ({
        len: el.children.length,
        text: el.firstChild.textContent
      }));
      expect(len).to.be.equal(1);
      expect(text).to.match(new RegExp(msg));
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
