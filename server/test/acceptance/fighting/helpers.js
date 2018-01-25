export function clickOnPawn(page) {
  return page.click("#warriors_list > div:nth-child(1)");
}

export function clickOnOfficer(page) {
  return page.click("#warriors_list > div:nth-child(2)");
}

export async function challenge(pageFrom, pageTo) {
  await pageFrom.click("#user_status_badge");
  await pageFrom.waitFor(100); // make sure user is challenger (become ready first)
  await pageTo.click("#user_status_badge");
  await pageTo.waitForSelector("#game_board"); // wait for ws response
}
