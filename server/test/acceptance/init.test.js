import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";

import { makePage } from "./helpers";

const { MONGO_URL } = process.env;

before(async function() {
  this.other = {};
  await makePage(this);
  await makePage(this.other);

  this.mongoConn = await MongoClient.connect(MONGO_URL);
  this.db = this.mongoConn.db("test");
});

after(async function() {
  await this.other.browser.close();
  await this.browser.close();
  await this.mongoConn.close();
});
