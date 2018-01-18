const puppeteer = require("puppeteer");

before(async function() {
  this.browser = await puppeteer.launch();
  this.page = await this.browser.newPage();
});

after(function() {
  this.browser.close();
});
