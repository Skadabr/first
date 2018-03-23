import {EffectImpact} from "../../index";

export function normalizeAttackEffects(effects, counterEffects) {
  // stub for now
  const normalizedEffects = effects.map(eff => {
    if (eff.impact !== EffectImpact.Attack) return eff;
    return eff;
  });
  return normalizedEffects;
}
