import { state } from "../../../fixtures/state-fixture";
import { getEffects } from "./effects";

describe("getEffects", () => {
  it("should return list of effects", () => {
    expect(getEffects(state)).toMatchObject([
      {
        impact: 2,
        targetingScope: 6,
        type: "HEALTH",
        value: 2
      }
    ]);
  });
});

describe("getEffectByUnitId", () => {
  it("should return effects of `player`", () => {
    expect(getEffects(state, 'enemy')).toMatchObject([
      {
        impact: 2,
        targetingScope: 6,
        type: "HEALTH",
        value: 2
      }
    ]);
  })
})
