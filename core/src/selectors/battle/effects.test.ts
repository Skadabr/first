import { baseState, State } from "../../__tests__/fixtures/state-fixture";
import {
  getEffects,
  getEffectsApplicableToUnit,
  getEffectsByImpact,
  getEffectsByUnitId,
  getEffectsByUserId,
  isEffectApplicableToUnit
} from "./effects";
import { EffectImpact, EffectTargetingScope, UnitTypes } from "../../index";
import dcopy from "deep-copy";
import { addTestEffectToUnit, addTestUnit } from "../../__tests__/utils";
import { attack, health } from "../../unit/effects";

describe("Effects selector", () => {
  let state;

  beforeAll(function initState() {
    state = dcopy(baseState);

    addTestUnit(state, "p_unit1", UnitTypes.Pawn, "player");
    addTestUnit(state, "e_unit1", UnitTypes.Pawn, "enemy");
    addTestEffectToUnit(
      state,
      "p_unit1",
      health("p_unit1", EffectTargetingScope.OtherFriendlyMinions, 2)
    );
    addTestEffectToUnit(
      state,
      "p_unit1",
      attack("p_unit1", EffectTargetingScope.OtherFriendlyMinions, 1)
    );
  });

  describe("getEffects", () => {
    it("should return list of effects", () => {
      expect(getEffects(state)).toMatchSnapshot();
    });
  });

  describe("getEffectByUnitId", () => {
    it("should return effects of unit", () => {
      expect(getEffectsByUnitId(state, "p_unit1")).toMatchSnapshot();
    });
  });

  describe("getEffectByUserId", () => {
    it("should return effects of user", () => {
      expect(getEffectsByUserId(state, "player")).toMatchSnapshot();
    });
  });

  describe("getEffectByImpact", () => {
    it("should return effects with `Health` impact", () => {
      expect(getEffectsByImpact(state, EffectImpact.Health)).toMatchSnapshot();
    });
  });

  describe("isEffectApplicableToUnit", () => {
    describe("when we take effect which is targeting only other friendly minions", () => {
      let effect;

      beforeEach(function() {
        effect = getEffectsByUnitId(state, "p_unit1")[0];
      });

      it("should target OtherFriendlyMinions", function() {
        expect(effect.targetingScope).toEqual(
          EffectTargetingScope.OtherFriendlyMinions
        );
      });

      it("should not target on enemy minions", function() {
        const res = isEffectApplicableToUnit(state, effect, "e_unit1");
        expect(res).toBe(false);
      });

      it("should target on other friendly minions", function() {
        const res = isEffectApplicableToUnit(state, effect, "p_unit1");
      });
    });
  });

  describe("getEffectsApplicableToUnit", () => {
    it("should return all effects which can be applicable to unit (impact on its behavior)", function() {
      const effs = getEffectsApplicableToUnit(state, "p_unit1");
      expect(effs).toMatchSnapshot();
    });
  });

  describe.skip("getUniqueListOfTradeEffectTypes", () => {});
});
