import { expect } from "chai";
import {
  clearState,
  becomeUser,
  goToPage,
  authUser,
  initGamers
} from "../helpers";
import { challenge, clickOnPawn, clickOnOfficer, turn } from "./helpers";

const { ORIGIN } = process.env;

describe("fighting: kill opponent", function() {
  before(async function() {
    await initGamers(this, this.other);
  });

  context("when hit opponent enough times to kill him", function() {
    it("user should see message about win", async function() {
      await challenge(this.other.page, this.page);
      // me
      await clickOnOfficer(this.page);
      await turn(this.page, this.other.page);
      // he
      await clickOnPawn(this.other.page);
      await turn(this.other.page, this.page);

      for (let i = 0; i < 6; i++) {
        // me
        await turn(this.page, this.other.page);
        // he
        await turn(this.other.page, this.page);
      }

      // me
      await this.page.click("button#turn");

      await this.page.screenshot({ path: "/data/image.png" });
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});

function getWarriorsAmountOnPositions(page) {
  return page.evaluate(
    (my, his) => {
      const myWrsAmount = document.querySelectorAll(my).length;
      const opWrsAmount = document.querySelectorAll(his).length;
      return { myWrsAmount, opWrsAmount };
    },
    "#my_warriors_positions > div:not(:empty)",
    "#opponent_warriors_positions > div:not(:empty)"
  );
}
