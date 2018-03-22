import { EffectImpact, EffectTargetingScope } from "../../index";
import { getEffectsByImpact } from "./effects";

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
  const minions = getUnitsByUserId(state, userId).filter(({hero}) => !hero);
  return minions;
}

export const getHero = (state, userId) => {
  const hero = getUnitsByUserId(state, userId).filter(({hero}) => hero);
  return hero;
};


export const getEnemyUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId !== userId);
  return units;
};

export const getEnemyMinionsByUserId = (state, userId) => {
  const minions = getEnemyUnitsByUserId(state, userId).filter(({hero}) => !hero);
  return minions;
}

export const getEnemyHero = (state, userId) => {
  const hero = getUnitsByUserId(state, userId).filter(({hero}) => hero);
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
  switch (targetingScope) {
    case EffectTargetingScope.Local:
      return getUnitById(state, sourceId);

    case EffectTargetingScope.AllUnits:
      return getUnits(state);

    case EffectTargetingScope.AllEnemyUnits:
      return getEnemyUnitsByUserId(state, sourceId);
    case EffectTargetingScope.AllEnemyMinions:
      return getEnemyUnitsByUserId(state, sourceId).filter(({ hero }) => hero);

    case EffectTargetingScope.AllFriendlyUnits:
      return getUnitsByUserId(state, sourceId);
    case EffectTargetingScope.AllFriendlyMinions:
      return getUnitsByUserId(state, sourceId).filter(({ hero }) => hero);
    case EffectTargetingScope.OtherFriendlyMinions:
      return getUnitsByUserId(state, sourceId).filter(
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

export const isEffectApplicableToUnit = (state, eff, unit) => {
  if (unit.disabledEffectIds.includes(eff._id)) return false;

  const unitIds = getUnitIdsByTargetingScope(
    state,
    eff.ownerId,
    eff.targetingScope
  );
  return unitIds.includes(unit._id);
};

export const getEffectsApplicableToUnit = (
  state,
  unitId,
  impact
) => {
  const effs = getEffectsByImpact(state, impact);
  const acc = [];

  for (const eff of effs)
    if (isEffectApplicableToUnit(state, eff, unitId)) acc.push(eff);

  return acc;
};

export const getUnitAttackWithAppliedEffects = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const effs = getEffectsApplicableToUnit(
    state,
    unitId,
    EffectImpact.Attack
  );

  const attack = effs.reduce((attack, eff) => {
    eff.value + attack;
  }, unit.attack);

  return attack;
};

export const getUnitHealthWithAppliedEffects = (state, unitId) => {
  const unit = getUnitById(state, unitId);
  const effs = getEffectsApplicableToUnit(
    state,
    unitId,
    EffectImpact.Health
  );
}

