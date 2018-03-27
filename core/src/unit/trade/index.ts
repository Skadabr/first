import deepEqual from "fast-deep-equal";

import { getUnitAttackWithAppliedEffects } from "../../selectors/battle/unit";
import { getUnitHealthAfterAttack } from "../../selectors/battle/unit";
import { Effect } from "../effects";

export function getTradingFn(sourceEffects, targetEffects) {
  let tradingFunction = defaultTradingFunction;

  // for (const tradingRule of tradingRules) {
  //   if (
  //     deepEqual(sourceEffects, tradingRule.sourceFeatures) &&
  //     deepEqual(targetEffects, tradingRule.targetFeatures)
  //   ) {
  //     tradingFunction = tradingRule.action;
  //     break;
  //   }
  // }
  return tradingFunction;
}

export function defaultTradingFunction(state, sourceId, targetId) {
  const attack = getUnitAttackWithAppliedEffects(state, sourceId);
  return getUnitHealthAfterAttack(state, targetId, attack);
}

export function normalizeEffects(
  effects: Effect[],
  counterEffects: Effect[],
  normalizer: (effs: Effect[], cEffs: Effect[]) => Effect[]
): Effect[] {
  const actualCounterEffects = filterObsoleteCounterEffects(
    effects,
    counterEffects
  );
  const normalizedEffects = normalizer(effects, actualCounterEffects);
  return normalizedEffects;
}

//
// attempt to guaranty that `counterEffect` has the same `ownerId` as `effect`
//
export function createCounterEffect(effect: Effect, value: any): Effect {
  return {
    ...effect,
    value
  };
}

function filterObsoleteCounterEffects(
  effects: Effect[],
  counterEffects: Effect[]
): Effect[] {
  return counterEffects.filter(cEff => {
    const effIds = effects.map(({ ownerId }) => ownerId);
    return effIds.includes(cEff.ownerId);
  });
}
