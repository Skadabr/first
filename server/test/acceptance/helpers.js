import puppeteer from "puppeteer";
import axios from "axios";

const { ORIGIN } = process.env;

export function createUser(name, email, password) {
  return axios.post(ORIGIN + "/api/users", { email, name, password });
}

export function loginUser(email, password) {
  return axios
    .post(ORIGIN + "/api/auth/local", { email, password })
    .then(r => r.data.data.token);
}

export async function authUser(name, email, password) {
  await axios.post(ORIGIN + "/api/users", { email, name, password });
  return axios
    .post(ORIGIN + "/api/auth/local", { email, password })
    .then(r => r.data.data.token);
}

export function launch() {
  return puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
}

export async function goToPage(browser, url, opts) {
  const page = await browser.newPage();
  await page.goto(url, opts);
  return page;
}

export async function becomeUser(page, name, email, password) {
  const token = await authUser(name, email, password);

  await page.goto(ORIGIN);
  await setToken(page, token);
  await page.reload();
}

export async function clearState(page) {
  await page.evaluate(() => localStorage.clear());
  await page.close();
}

export async function initGamers(ctx, otherCtx) {
  ctx.page = await goToPage(ctx.browser, ORIGIN);
  otherCtx.page = await goToPage(otherCtx.browser, ORIGIN);
  await becomeUser(ctx.page, "John", "john@mail.com", "deadbeef");
  await becomeUser(otherCtx.page, "Other", "other@mail.com", "deadbeef");
}

async function setToken(page, token) {
  await page.evaluate(t => {
    localStorage.user_jwt = t;
  }, token);
}
