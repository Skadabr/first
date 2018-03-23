import { EffectImpact } from "../../index";
import { filterEffectsByImpact } from "../../selectors";
import { createCounterEffect } from "./index";

export function normalizeHealthEffects(effects, counterEffects) {
  const normalizedEffects = effects.map(eff => {
    if (eff.impact !== EffectImpact.Health) return eff;

    const counterEffectsSum = counterEffects
      // NOTE: there can be potential bug with `casted` effects which all has
      //  the same `ownerId` of the current unit
      .filter(cEff => cEff.ownerId === eff.ownerId)
      .reduce((sum, { value }) => sum + value, 0);

    // by design `counterSum` can't be bigger then `eff.value`,
    // but just in case we take this case into account also.
    if (counterEffectsSum >= eff.value) {
      return null;
    }
    return {
      ...eff,
      value: counterEffectsSum
    };
  });

  return normalizedEffects;
}

export function takeAwayHealthBuffs(effects, attack) {
  const additionalCounterEffects = [];
  effects = filterEffectsByImpact(effects, EffectImpact.Health);

  for (let eff of effects) {
    // NOTE: should here be `value` or maybe `payload.health`
    if (attack <= eff.value) {
      additionalCounterEffects.push(createCounterEffect(eff, attack));
      return {
        remainderOfAttack: 0,
        additionalCounterEffects
      };
    }
    if (attack > eff.value) {
      additionalCounterEffects.push(createCounterEffect(eff, eff.value));
      attack = attack - eff.value;
    }
  }

  return {
    remainderOfAttack: attack,
    additionalCounterEffects
  };
}
