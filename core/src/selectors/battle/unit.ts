import { EffectImpact } from "../../index";
import { normalizeAttackEffects } from "../../unit/trade/attack";
import { getUnitById } from "./units";
import {
  normalizeHealthEffects,
  takeAwayHealthBuffs
} from "../../unit/trade/health";
import { getEffectsApplicableToUnit } from "./effects";
import { filterEffectsByImpact } from "../../unit/effects";
import { getUnitCounterEffects } from "../../unit/methods";
import { normalizeEffects } from "../../unit/trade";

export const getUnitAttackWithAppliedEffects = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const normalizedEffects = getNormalizedEffectsApplicableToUnit(
    state,
    unit,
    EffectImpact.Attack,
    normalizeAttackEffects
  );
  const attack = sumEffectsValue(normalizedEffects, unit.attack);
  return attack;

  // === where ===

  function sumEffectsValue(effs, base) {
    return effs.reduce((sum, eff) => eff.value + sum, base);
  }
};

export const getUnitHealthWithAppliedEffects = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const normalizedEffects = getNormalizedEffectsApplicableToUnit(
    state,
    unit,
    EffectImpact.Health,
    normalizeHealthEffects
  );

  const health = sumEffectsValue(normalizedEffects, unit.health);
  return health;

  // === where ===

  function sumEffectsValue(effs, base) {
    return effs.reduce((sum, eff) => eff.value + sum, base);
  }
};

export const getUnitHealthAfterAttack = (state, unitId, attack) => {
  const unit = getUnitById(state, unitId);
  const normalizedEffects = getNormalizedEffectsApplicableToUnit(
    state,
    unit,
    EffectImpact.Health,
    normalizeHealthEffects
  );
  const { additionalCounterEffects, remainderOfAttack } = takeAwayHealthBuffs(
    normalizedEffects,
    attack
  );

  return {
    health: unit.health - remainderOfAttack,
    additionalCounterEffects
  };
};

function getNormalizedEffectsApplicableToUnit(state, unit, impact, normalizer) {
  const effs = getEffectsApplicableToUnit(state, unit._id);
  const effects = filterEffectsByImpact(effs, impact);
  const counterEffects = filterEffectsByImpact(
    getUnitCounterEffects(unit),
    impact
  );
  const normalizedEffects = normalizeEffects(
    effects,
    counterEffects,
    normalizer
  );
  return {
    normalizedEffects,
    counterEffects
  };
}
