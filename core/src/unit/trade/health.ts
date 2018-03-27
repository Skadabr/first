import { EffectImpact } from "../../index";
import { filterEffectsByImpact } from "../../selectors";
import { createCounterEffect } from "./index";
import { Effect } from "../effects";
import { createUniqueArray } from "../../utils";

export function normalizeHealthEffects(
  effects: Effect[],
  counterEffects: Effect[]
): Effect[] {
  const effectOwnerIds = createUniqueArray(effects.map(e => e.ownerId));
  const normalizedEffects = effectOwnerIds
    .map(effectOwnerId => {
      const effs = effects.filter(
        e => e.ownerId === effectOwnerId && e.impact === EffectImpact.Health
      );

      const counterEffectsSum = counterEffects
        .filter(cEff => cEff.ownerId === effectOwnerId)
        .reduce((sum, { value }) => sum + value, 0);

      const effectsSum = effs.reduce((sum, { value }) => sum + value, 0);

      return {
        ...effs[0], // here can be any of effects
        value: effectsSum - counterEffectsSum
      };
    })
    // BTW: by design `counterSum` can't be bigger then `effectsSum`.
    .filter(eff => eff.value > 0);

  return normalizedEffects;
}

export function takeAwayHealthBuffs(
  effects: Effect[],
  attack: number
): { remainderOfAttack: number; additionalCounterEffects: Effect[] } {
  const additionalCounterEffects: Effect[] = [];
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
