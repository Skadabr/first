import {EffectImpact} from "../../index";
import {filterEffectsByImpact} from "../../selectors";

export function normalizeHealthEffects(effects, counterEffects) {
  const normalizedEffects = effects.map(eff => {
    if (eff.impact !== EffectImpact.Health) return eff;

    const counterSum = counterEffects
      .filter(cEff => cEff.ownerId === eff.ownerId)
      .reduce((sum, { value }) => sum + value, 0);

    // by design `counterSum` can't be bigger then `eff.value`,
    // but just in case we take this case into account also.
    if (counterSum >= eff.value) {
      return null;
    }
    return {
      ...eff,
      value: eff.value - counterSum
    };
  });

  return normalizedEffects;
}

export function takeAwayHealthBuffs(effects, attack) {
  const counterEffects = [];
  effects = filterEffectsByImpact(effects, EffectImpact.Health);

  for (let eff of effects) {
    // NOTE: should here be `value` or maybe `payload.health`
    if (attack < eff.value) {
      counterEffects.push({
        ...eff,
        value: attack
      });
      return {
        attack: 0,
        counterEffects
      };
    }
    if (attack === eff.value) {
      counterEffects.push({
        ...eff,
        value: eff.value
      });
      return {
        attack: 0,
        counterEffects
      };
    }
    if (attack > eff.value) {
      counterEffects.push({
        ...eff,
        value: eff.value
      });
      attack = attack - eff.value;
    }
  }

  return {
    attack,
    counterEffects
  };
}
