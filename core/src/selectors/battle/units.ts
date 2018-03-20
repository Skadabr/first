import copy from "deep-copy";
import { EffectApplicabilityStage, EffectTargetingScope } from "../../index";
import { getEffectsByApplicabilityScope } from "./effects";
import { UnitSet } from "../../utils";

export const getUnits = state => state.units;

export const getUnitById = (state, id) => {
  const unit = getUnits(state).find(({ _id }) => _id === id);
  return unit;
};

export const getUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId === userId);
  return units;
};

export const getEnemyUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId !== userId);
  return units;
};

export const getUnitIdsByUserId = (state, userId) =>
  getUnitsByUserId(state, userId).map(({ _id }) => _id);

export const getEnemyUnitIdsByUserId = (state, userId) =>
  getEnemyUnitsByUserId(state, userId).map(({ _id }) => _id);

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
  applicabilityScope
) => {
  const effs = getEffectsByApplicabilityScope(state, applicabilityScope);
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
    EffectApplicabilityStage.Attack
  );

  const attack = effs.reduce((attack, eff) => {
    eff.value + attack
  }, unit.attack);

  return attack;


};
