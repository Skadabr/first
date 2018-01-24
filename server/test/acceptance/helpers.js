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

export async function setToken(page, token) {
  await page.evaluate(t => {
    localStorage.user_jwt = t;
  }, token);
  await page.reload();
}

export async function makePage(ctx) {
  ctx.browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  ctx.page = await ctx.browser.newPage();
}
