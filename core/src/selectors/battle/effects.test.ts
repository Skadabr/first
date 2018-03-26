import { state, State } from "../../__tests__/fixtures/state-fixture";
import {
  getEffects,
  getEffectsApplicableToUnit,
  getEffectsByImpact,
  getEffectsByUnitId,
  getEffectsByUserId,
  isEffectApplicableToUnit
} from "./effects";
import { EffectImpact, EffectTargetingScope } from "../../index";

describe("getEffects", () => {
  it("should return list of effects", () => {
    expect(getEffects(state)).toMatchSnapshot();
  });
});

describe("getEffectByUnitId", () => {
  it("should return effects of unit", () => {
    expect(getEffectsByUnitId(state, "pl_pawn2")).toMatchSnapshot();
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
      effect = getEffectsByUnitId(state, "pl_pawn2")[0];
    });

    it("should target OtherFriendlyMinions", function() {
      expect(effect.targetingScope).toEqual(
        EffectTargetingScope.OtherFriendlyMinions
      );
    });

    it("should not target on enemy minions", function() {
      const res = isEffectApplicableToUnit(state, effect, "e_pawn3");
      expect(res).toBe(false);
    });

    it("should target on other friendly minions", function() {
      const res = isEffectApplicableToUnit(state, effect, "pl_pawn1");
    });
  });
});

describe("getEffectsApplicableToUnit", () => {
  it("should return all effects which can be applicable to unit (impact on its behavior)", function() {
    const effs = getEffectsApplicableToUnit(state, "pl_pawn1");
    expect(effs).toMatchSnapshot();
  });
});

describe.skip("getUniqueListOfTradeEffectTypes", () => {});
