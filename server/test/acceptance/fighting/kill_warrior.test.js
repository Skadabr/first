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

describe("fighting: kill warrior", function() {
  before(async function() {
    await initGamers(this, this.other);
  });

  describe("one to one fighting", function() {
    it("my warrior should disapper", async function() {
      await challenge(this.other.page, this.page);
      // me
      await clickOnOfficer(this.page);
      await turn(this.page, this.other.page);
      // he
      await clickOnOfficer(this.other.page);
      await turn(this.other.page, this.page);
      // me
      await turn(this.page, this.other.page);
      // he
      await turn(this.other.page, this.page);
      const notEmptyPosition = await this.page.$(
        "#my_warriors_positions > div:not(:empty)"
      );
      expect(notEmptyPosition).is.null;
    });
  });

  context("1 to 3 fight", function() {
    beforeEach(async function() {
      await challenge(this.page, this.other.page);
      // he
      await clickOnPawn(this.other.page);
      await turn(this.other.page, this.page);
      // me
      await clickOnOfficer(this.page);
      await turn(this.page, this.other.page);
      // he
      await clickOnPawn(this.other.page);
      await turn(this.other.page, this.page);
      // me
      await turn(this.page, this.other.page);
      // he
      await clickOnPawn(this.other.page);
      await turn(this.other.page, this.page);
    });

    it("we have 1 to 3 situation (sanity check)", async function() {
      const { myWrsAmount, opWrsAmount } = await getWarriorsAmountOnPositions(
        this.page
      );

      expect(myWrsAmount).is.equal(1);
      expect(opWrsAmount).is.equal(3);
    });

    it("recalculate positions when one opponent warrior die", async function() {
      // me
      await turn(this.page, this.other.page);
      // he
      await turn(this.other.page, this.page);
      {
        const { myWrsAmount, opWrsAmount } = await getWarriorsAmountOnPositions(
          this.page
        );

        expect(myWrsAmount).is.equal(0);
        expect(opWrsAmount).is.equal(3);
      }

      // me
      await clickOnOfficer(this.page);
      await turn(this.page, this.other.page);

      expect(
        await this.page.evaluate(his => {
          const len = [
            document.querySelector(
              "#opponent_warriors_positions > div:nth-child(3)"
            ),
            document.querySelector(
              "#opponent_warriors_positions > div:nth-child(5)"
            )
          ].filter(Boolean).length;

          return len === 2;
        })
      ).is.true;
    });

    it("2 opponent warriors on each side hit user");
  });

  afterEach(async function() {
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.other.page.reload({ waitUntil: "domcontentloaded" });
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
