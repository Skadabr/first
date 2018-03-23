import deepEqual from "fast-deep-equal";
import groupBy from "lodash.groupby";

import {
  getUnitAttackWithAppliedEffects,
} from "../../selectors/battle/unit";
import { getUnitHealthAfterAttack } from "../../selectors/battle/unit";

export function getTradingFn(sourceEffects, targetEffects) {
  let tradingFunction = defaultTradingFunction;

  for (const tradingRule of tradingRules) {
    if (
      deepEqual(sourceEffects, tradingRule.sourceFeatures) &&
      deepEqual(targetEffects, tradingRule.targetFeatures)
    ) {
      tradingFunction = tradingRule.action;
      break;
    }
  }
  return tradingFunction;
}

export function defaultTradingFunction(state, sourceId, targetId) {
  const attack = getUnitAttackWithAppliedEffects(state, sourceId);
  return getUnitHealthAfterAttack(state, targetId, attack);
}

export function normalizeEffects(effects, counterEffects, normalizer) {
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
export function createCounterEffect(effect, value) {
  return {
    ...effect,
    value
  };
}

function filterObsoleteCounterEffects(effects, counterEffects) {
  return counterEffects.filter(cEff => {
    effects.map(({ ownerId }) => ownerId).includes(cEff.ownerId);
  });
}

