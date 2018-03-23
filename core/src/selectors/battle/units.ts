import { EffectImpact, EffectTargetingScope } from "../../index";
import { getEffects } from "./effects";
import {
  filterEffectsByImpact,
  filterEffectsInTargetingScope
} from "../../unit/effects";
import { normalizeAttackEffects } from "../../unit/trade/attack";
import { getUnitCounterEffects, getUnitEffects } from "../../unit/methods";
import {
  normalizeHealthEffects,
  takeAwayHealthBuffs
} from "../../unit/trade/health";
import { normalizeEffects } from "../../unit/trade";

export const getUnits = state => state.units;

export const getUnitById = (state, id) => {
  const unit = getUnits(state).find(({ _id }) => _id === id);
  return unit;
};

//////////////////////////////////////////////////////////////////

export const getUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId === userId);
  return units;
};

export const getMinionsByUserId = (state, userId) => {
  const minions = getUnitsByUserId(state, userId).filter(({ hero }) => !hero);
  return minions;
};

export const getHero = (state, userId) => {
  const hero = getUnitsByUserId(state, userId).filter(({ hero }) => hero);
  return hero;
};

export const getEnemyUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId !== userId);
  return units;
};

export const getEnemyMinionsByUserId = (state, userId) => {
  const minions = getEnemyUnitsByUserId(state, userId).filter(
    ({ hero }) => !hero
  );
  return minions;
};

export const getEnemyHero = (state, userId) => {
  const hero = getUnitsByUserId(state, userId).filter(({ hero }) => hero);
  return hero;
};

export const getUnitIdsByUserId = (state, userId) =>
  getUnitsByUserId(state, userId).map(({ _id }) => _id);

export const getEnemyUnitIdsByUserId = (state, userId) =>
  getEnemyUnitsByUserId(state, userId).map(({ _id }) => _id);

//////////////////////////////////////////////////////////////////

export const getPlayerUnits = state => getUnitsByUserId(state, state.user._id);

export const getPlayerUnitIds = state =>
  getPlayerUnits(state).map(({ _id }) => _id);

export const getEnemyUnits = state => {
  const users = getUnits(state).filter(
    ({ ownerId }) => ownerId !== state.user._id
  );
  return users;
};

export const getEnemyUnitIds = state =>
  getEnemyUnits(state).map(({ _id }) => _id);

export const getUnitFriends = (state, unitId) => {
  const unitOwnerId = getUnitById(state, unitId).ownerId;
  return getUnitsByUserId(state, unitOwnerId).filter(
    ({ _id }) => _id !== unitId
  );
};

export const getUnitsByTargetingScope = (state, sourceId, targetingScope) => {
  const userId = getUnitById(state, sourceId).ownerId;

  switch (targetingScope) {
    case EffectTargetingScope.Local:
      return getUnitById(state, sourceId);

    case EffectTargetingScope.AllUnits:
      return getUnits(state);

    case EffectTargetingScope.AllEnemyUnits:
      return getEnemyUnitsByUserId(state, userId);
    case EffectTargetingScope.AllEnemyMinions:
      return getEnemyUnitsByUserId(state, userId).filter(({ hero }) => hero);

    case EffectTargetingScope.AllFriendlyUnits:
      return getUnitsByUserId(state, userId);
    case EffectTargetingScope.AllFriendlyMinions:
      return getUnitsByUserId(state, userId).filter(({ hero }) => hero);
    case EffectTargetingScope.OtherFriendlyMinions:
      return getUnitsByUserId(state, userId).filter(
        ({ hero, _id }) => hero && _id !== sourceId
      );

    default:
      throw new TypeError("targeting scope should have right type");
  }
};

export const getUnitIdsByTargetingScope = (state, sourceId, targetingScope) =>
  getUnitsByTargetingScope(state, sourceId, targetingScope).map(
    ({ _id }) => _id
  );

export const isEffectApplicableToUnit = (state, eff, unitId) => {
  const targetIds = getUnitIdsByTargetingScope(
    state,
    eff.ownerId,
    eff.targetingScope
  );
  return targetIds.includes(unitId);
};

export const getEffectsApplicableToUnit = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const effs = getEffects(state);
  const localUnitEffects = filterEffectsInTargetingScope(
    getUnitEffects(unit),
    EffectTargetingScope.Local
  );
  const acc = [...localUnitEffects];

  for (const eff of effs)
    if (isEffectApplicableToUnit(state, eff, unitId)) acc.push(eff);

  return acc;
};

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

export const getUnitHealthAfterAttack = (
  state,
  unitId,
  attack
) => {
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
