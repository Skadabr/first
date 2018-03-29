import dcopy from "deep-copy";

import { State, baseState } from "../../__tests__/fixtures/state-fixture";
import {
  getUnitAttackWithAppliedEffects,
  getUnitHealthWithAppliedEffects
} from "./unit";
import { createCounterEffect } from "../../unit/trade";
import { attack, health } from "../../unit/effects";
import { EffectTargetingScope, UnitTypes } from "../../index";
import {
  addTestCounterEffectToUnit,
  addTestEffectToUnit,
  addTestUnit
} from "../../__tests__/utils";

describe("Unit selector", () => {
  let state;

  beforeAll(function initState() {
    state = dcopy(baseState);

    addTestUnit(state, "p_unit1", UnitTypes.Pawn, "player");
    addTestUnit(state, "p_unit2", UnitTypes.Pawn, "player");
    addTestUnit(state, "p_unit3", UnitTypes.Pawn, "player");
    addTestUnit(state, "e_unit1", UnitTypes.Pawn, "enemy");
    addTestEffectToUnit(
      state,
      "p_unit2",
      health("p_unit2", EffectTargetingScope.OtherFriendlyMinions, 2)
    );
    addTestEffectToUnit(
      state,
      "p_unit3",
      attack("p_unit3", EffectTargetingScope.OtherFriendlyMinions, 1)
    );
  });
  describe("getUnitAttackWithAppliedEffects", () => {
    describe("when we take unit which is affected by friendly buffer", () => {
      it("should have attack equal attack+buff", function() {
        const attack = getUnitAttackWithAppliedEffects(state, "p_unit1");
        expect(attack).toEqual(2);
      });
    });

    describe("when we take unit which is NOT affected by friendly buffer", () => {
      it("should have attack equal attack without any buffs", function() {
        const attack = getUnitAttackWithAppliedEffects(state, "p_unit3");
        expect(attack).toEqual(1);
      });
    });
  });

  describe("getUnitHealthWithAppliedEffects", () => {
    describe("when we take unit which is affected by friendly buffer", () => {
      it("should have health equal health+buff", function() {
        const health1 = getUnitHealthWithAppliedEffects(state, "p_unit1");
        expect(health1).toEqual(8);
        const health2 = getUnitHealthWithAppliedEffects(state, "p_unit1");
        expect(health2).toEqual(8);
      });
    });

    describe("when we take unit which is NOT affected by friendly buffer", () => {
      it("should have health equal health without any buffs", function() {
        const health = getUnitHealthWithAppliedEffects(state, "p_unit2");
        expect(health).toEqual(6);
      });
    });

    describe("when unit has counter effects", () => {
      let newState: State;
      let plPawn1, plPawn2;

      beforeEach(function addHealthCounterEffectToUnit() {
        newState = dcopy(state);

        const pUnit2 = newState.battle.units.find(u => u._id === "p_unit2");
        const cEffect = createCounterEffect(pUnit2.effects[0], 1);

        addTestCounterEffectToUnit(newState, "p_unit1", cEffect);
      });

      it("should subtract its value from effect", function() {
        const health = getUnitHealthWithAppliedEffects(newState, "p_unit1");
        expect(health).toEqual(7);
      });
    });

    describe("when unit has counter effect to its own effects", () => {
      let newState: State;

      beforeEach(function addOwnHealthCounterEffectsToUnit() {
        newState = dcopy(state);

        const effect1 = health("p_unit1", EffectTargetingScope.Local, 2);
        const effect2 = health("p_unit1", EffectTargetingScope.Local, 2);
        const cEffect = createCounterEffect(effect1, 1);

        addTestEffectToUnit(newState, "p_unit1", effect1);
        addTestEffectToUnit(newState, "p_unit1", effect2);
        addTestCounterEffectToUnit(newState, "p_unit1", cEffect);
      });

      it("should subtract its value from effect", function() {
        const health = getUnitHealthWithAppliedEffects(newState, "p_unit1");
        expect(health).toEqual(11);
      });
    });
  });
});
