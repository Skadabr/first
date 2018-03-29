import dcopy from "deep-copy";

import { baseState } from "./fixtures/state-fixture";
import { addTestEffectToUnit, addTestUnit } from "./utils";

import { Battle, EffectTargetingScope, UnitTypes } from "../index";
import { health } from "../unit/effects";

const { OtherFriendlyMinions } = EffectTargetingScope;

describe("Battle buffs", () => {
  let state;

  beforeEach(function initializeBattle() {
    state = dcopy(baseState);

    addTestUnit(state, "p_unit1", UnitTypes.Pawn, "player");
    addTestUnit(state, "p_unit2", UnitTypes.Pawn, "player");
    addTestUnit(state, "e_unit1", UnitTypes.Pawn, "enemy");
  });

  it("attack should take away buffs before hurt health", () => {
    const hEffect = health("p_unit2", OtherFriendlyMinions, 2);
    addTestEffectToUnit(state, "p_unit2", hEffect);

    const battle = new Battle(state.battle, state.user);

    // attack buffed
    battle.attack("e_unit1", "p_unit1");

    const unitState1 = getUnitState(battle);

    expect(unitState1.health).toEqual(7);

    killBuffer(battle);

    const unitState2 = getUnitState(battle);

    expect(unitState2.health).toEqual(6);

    // === where ===

    function killBuffer(battle) {
      for (let i = 0; i < 8; i++) {
        battle.attack("e_unit1", "p_unit2");
      }
    }

    function getUnitState(battle) {
      const unitState = battle.getUnitState("p_unit1");
      if (!unitState) throw Error("Unit is absent");
      return unitState;
    }
  });
});
