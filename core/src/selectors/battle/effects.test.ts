import { state } from "../../__tests__/fixtures/state-fixture";
import {
  getEffects,
  getEffectsByImpact,
  getEffectsByUnitId,
  getEffectsByUserId,
  isEffectApplicableToUnit
} from "./effects";
import {EffectImpact, EffectTargetingScope, EffectTypes} from "../../index";

describe("getEffects", () => {
  it("should return list of effects", () => {
    expect(getEffects(state)).toMatchObject([
      {
        impact: EffectImpact.Health,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Health,
        value: 2
      },
      {
        impact: EffectImpact.Attack,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Attack,
        value: 1
      }
    ]);
  });
});

describe("getEffectByUnitId", () => {
  it("should return effects of unit", () => {
    expect(getEffectsByUnitId(state, "pl_pawn2")).toMatchObject([
      {
        impact: EffectImpact.Health,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Health,
        value: 2
      }
    ]);
  });
});

describe("getEffectByUserId", () => {
  it("should return effects of user", () => {
    expect(getEffectsByUserId(state, "player")).toMatchObject([
      {
        impact: EffectImpact.Health,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Health,
        value: 2
      },
      {
        impact: EffectImpact.Attack,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Attack,
        value: 1
      }
    ]);
  });
});

describe("getEffectByImpact", () => {
  it("should return effects with `Health` impact", () => {

    expect(getEffectsByImpact(state, EffectImpact.Health)).toMatchObject([
      {
        impact: EffectImpact.Health,
        targetingScope: EffectTargetingScope.OtherFriendlyMinions,
        type: EffectTypes.Health,
        value: 2
      }
    ]);
  });
});

// describe('isEffectApplicableToUnit', () => {
//   describe('when user has no effects', () => {
//     let effects;
//
//     beforeEach(function () {
//       effects = getEffectsByUnitId(state, 'pl_pawn2');
//     });
//     it.skip('should return false', function () {
//       const res = isEffectApplicableToUnit(state, effects[0], 'e_pawn3');
//       expect(res).toBe(false);
//     });
//   });
// });
