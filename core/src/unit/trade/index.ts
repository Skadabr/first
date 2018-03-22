import deepEqual from "fast-deep-equal";
import groupBy from "lodash.groupby";

import {
  getUnitAttackWithAppliedEffects,
  getUnitById
} from "../selectors/battle/units";
import {
  filterEffectsByImpact,
  getUnitCounterEffects,
  getUnitEffects
} from "../selectors";
import { EffectImpact } from "../index";
import {normalizeHealthEffects, takeAwayHealthBuffs} from "./health";

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
  const target = getUnitById(state, targetId);
  applyAttackToTarget(target, attack);
  targetId.receivedDamage += sourceId.attack;
  return targetId;
}

function applyAttackToTarget(
  target,
  attack
): {
  attack: any;
  counterEffects: any;
} {
  const effects = getUnitEffects(target);
  const counterEffects = getUnitCounterEffects(target);
  const normalizedEffects = normalizeEffects(
    effects,
    counterEffects,
    normalizeHealthEffects,
  );
  const remainderOfAttackAndNewCounterEffects = takeAwayHealthBuffs(
    normalizedEffects,
    attack
  );
  return remainderOfAttackAndNewCounterEffects;
}

function normalizeEffects(effects, counterEffects, normalizer) {
  const actualCounterEffects = filterObsoleteCounterEffects(
    effects,
    counterEffects
  );
  const normalizedEffects = normalizer(effects, actualCounterEffects);
  return normalizedEffects;
}

function filterObsoleteCounterEffects(effects, counterEffects) {
  return counterEffects.filter(eff => {
    effects.map(({ ownerId }) => ownerId).includes(eff.ownerId);
  });
}

