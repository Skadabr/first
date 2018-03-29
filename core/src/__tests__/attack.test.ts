import dcopy from "deep-copy";

import { baseState } from "./fixtures/state-fixture";
import { addTestUnit } from "./utils";

import { Battle, UnitTypes } from "../index";

describe("Battle attack", () => {
  let battle;

  beforeEach(function initializeBattle() {
    const state = dcopy(baseState);

    addTestUnit(state, "p_unit1", UnitTypes.Pawn, "player");
    addTestUnit(state, "e_unit1", UnitTypes.Pawn, "enemy");

    battle = new Battle(state.battle, state.user);
  });

  it("should emit event about setting health", function(done) {

    battle.on("event", ev => {
      expect(ev.type).toEqual("UNIT_SET_HEALTH");
      expect(ev.payload).toMatchObject({ unitId: "p_unit1", value: 5 });
      done();
    });

    battle.attack("e_unit1", "p_unit1");
  });

  describe("attack unit until it become dead", () => {
    it("should emit event about unit death", function(done) {
      battle.on("event", ev => {
        if (ev.type === "UNITS_REMOVE") {
          done();
        }
      });
      for (let i = 0; i < 8; i++) {
        battle.attack("e_unit1", "p_unit1");
      }
    });

    it("should not return unit on `getUnitState`", function() {
      const unitBeforeAttack = battle.getUnitState("p_unit1");
      expect(unitBeforeAttack).not.toEqual(undefined);

      for (let i = 0; i < 8; i++) {
        battle.attack("e_unit1", "p_unit1");
      }

      const unitAfterAttack = battle.getUnitState("p_unit1");
      expect(unitAfterAttack).toEqual(undefined);
    });
  });

});
