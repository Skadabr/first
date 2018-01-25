import puppeteer from "puppeteer";
import { MongoClient } from "mongodb";

import { launch } from "./helpers";

const { TESTS_DEBUG, MONGO_URL } = process.env;

before(async function() {
  this.other = {};
  this.browser = await launch();
  this.other.browser = await launch();

  this.mongoConn = await MongoClient.connect(MONGO_URL);
  this.db = this.mongoConn.db("test");
});

after(async function() {
  await this.other.browser.close();
  await this.browser.close();
  await this.mongoConn.close();
});

process.on("unhandledRejection", console.error);
