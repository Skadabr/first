import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";

import { makePage } from "./helpers";

const { MONGO_URL } = process.env;

before(async function() {
  await makePage(this);

  this.conn = await MongoClient.connect(MONGO_URL);
  this.db = this.conn.db("test");
});

after(async function() {
  await this.browser.close();
  await this.conn.close();
});

process.on("unhandledRejection", console.error);
