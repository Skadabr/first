import copy from "deep-copy";

import { State, state } from "../../__tests__/fixtures/state-fixture";
import {
  getUnitAttackWithAppliedEffects,
  getUnitHealthWithAppliedEffects
} from "./unit";
import { createCounterEffect } from "../../unit/trade";
import {health} from "../../unit/effects";
import {EffectTargetingScope} from "../../index";

describe("getUnitAttackWithAppliedEffects", () => {
  describe("when we take unit which is affected by friendly buffer", () => {
    it("should have attack equal attack+buff", function() {
      const attack = getUnitAttackWithAppliedEffects(state, "pl_pawn1");
      expect(attack).toEqual(2);
    });
  });

  describe("when we take unit which is NOT affected by friendly buffer", () => {
    it("should have attack equal attack without any buffs", function() {
      const attack = getUnitAttackWithAppliedEffects(state, "pl_pawn3");
      expect(attack).toEqual(1);
    });
  });
});

describe("getUnitHealthWithAppliedEffects", () => {
  describe("when we take unit which is affected by friendly buffer", () => {
    it("should have health equal health+buff", function() {
      const health1 = getUnitHealthWithAppliedEffects(state, "pl_pawn1");
      expect(health1).toEqual(8);
      const health2 = getUnitHealthWithAppliedEffects(state, "pl_pawn3");
      expect(health2).toEqual(8);
    });
  });

  describe("when we take unit which is NOT affected by friendly buffer", () => {
    it("should have health equal health without any buffs", function() {
      const health = getUnitHealthWithAppliedEffects(state, "pl_pawn2");
      expect(health).toEqual(6);
    });
  });

  describe("when unit has counter effects", () => {
    let newState: State;
    let plPawn1, plPawn2;

    beforeEach(function addHealthCounterEffectToUnit() {
      newState = copy(state);

      plPawn1 = newState.battle.units.find(u => u._id === "pl_pawn1");
      plPawn2 = newState.battle.units.find(u => u._id === "pl_pawn2");

      plPawn1.counterEffects.push(createCounterEffect(plPawn2.effects[0], 1));
    });

    it("should subtract its value from effect", function() {
      const health = getUnitHealthWithAppliedEffects(newState, "pl_pawn1");
      expect(health).toEqual(7)
    });

    describe("when unit has counter effect to its own effects", () => {
      let newState: State;
      let plPawn1, plPawn2;

      beforeEach(function addOwnHealthCounterEffectsToUnit() {
        newState = copy(state);

        plPawn1 = newState.battle.units.find(u => u._id === "pl_pawn1");

        plPawn1.effects.push(health(plPawn1._id, EffectTargetingScope.Local, 2));
        plPawn1.effects.push(health(plPawn1._id, EffectTargetingScope.Local, 2));
        plPawn1.counterEffects.push(createCounterEffect(plPawn1.effects[0], 1));
      });

      it("should subtract its value from effect", function() {
        const health = getUnitHealthWithAppliedEffects(newState, "pl_pawn1");
        expect(health).toEqual(11)
      });
    });
  });
});
