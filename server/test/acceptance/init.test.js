import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";

const { MONGO_URL } = process.env;

before(async function() {
  this.browser = await puppeteer.launch({
    //executablePath: "/usr/bin/chromium-browser"
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  this.page = await this.browser.newPage();
  this.conn = await MongoClient.connect(MONGO_URL);
  this.db = conn.db("test");
});

after(async function() {
  await this.browser.close();
  await this.conn.close();
});
