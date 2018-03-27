import { EffectTargetingScope } from "../../index";
import { state } from "../../__tests__/fixtures/state-fixture";

export const getUnits = state => state.battle.units;

export const getUnitById = (state, id) => {
  const unit = getUnits(state).find(({ _id }) => _id === id);
  return unit;
};

//////////////////////////////////////////////////////////////////

export const getUnitsByUserId = (state, userId) => {
  const units: any[] = getUnits(state).filter(u => u.ownerId === userId);
  return units;
};

export const getMinionsByUserId = (state, userId) => {
  const minions: any[] = getUnitsByUserId(state, userId).filter(
    ({ hero }) => !hero
  );
  return minions;
};

export const getHero = (state, userId) => {
  const hero: any[] = getUnitsByUserId(state, userId).filter(
    ({ hero }) => hero
  );
  if (hero.length > 1) throw Error("There should be only one hero");
  return hero[0];
};

export const getEnemyUnitsByUserId = (state, userId) => {
  const units = getUnits(state).filter(u => u.ownerId !== userId);
  return units;
};

export const getEnemyMinionsByUserId = (state, userId): any[] => {
  const minions: any[] = getEnemyUnitsByUserId(state, userId).filter(
    ({ hero }) => !hero
  );
  return minions;
};

export const getEnemyHero = (state, userId) => {
  const hero: any[] = getEnemyUnitsByUserId(state, userId).filter(
    ({ hero }) => hero
  );
  if (hero.length > 1) throw Error("There should be only one hero");
  return hero[0];
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

export const getUnitFriendlyUnits = (state, unitId) => {
  const unitOwnerId = getUnitById(state, unitId).ownerId;
  return getUnitsByUserId(state, unitOwnerId).filter(
    ({ _id }) => _id !== unitId
  );
};

export const getUnitFriendlyMinions = (state, unitId) => {
  const unitOwnerId = getUnitById(state, unitId).ownerId;
  return getUnitsByUserId(state, unitOwnerId).filter(
    ({ _id, hero }) => _id !== unitId && !hero
  );
};

export const getUnitsByTargetingScope = (
  state,
  sourceId,
  targetingScope
): any[] => {
  const userId = getUnitById(state, sourceId).ownerId;

  switch (targetingScope) {
    case EffectTargetingScope.Local:
      return [getUnitById(state, sourceId)];

    case EffectTargetingScope.AllUnits:
      return getUnits(state);

    case EffectTargetingScope.AllEnemyUnits:
      return getEnemyUnitsByUserId(state, userId);
    case EffectTargetingScope.AllEnemyMinions:
      return getEnemyMinionsByUserId(state, userId);

    case EffectTargetingScope.AllFriendlyUnits:
      return getUnitsByUserId(state, userId);
    case EffectTargetingScope.AllFriendlyMinions:
      return getMinionsByUserId(state, userId);
    case EffectTargetingScope.OtherFriendlyMinions:
      return getUnitFriendlyMinions(state, sourceId);

    default:
      throw new TypeError("targeting scope should have right type");
  }
};

export const getUnitIdsByTargetingScope = (state, sourceId, targetingScope) =>
  getUnitsByTargetingScope(state, sourceId, targetingScope).map(
    ({ _id }) => _id
  );

export const getDeadUnitsIds = state => {
  return getUnits(state)
    .filter(u => u.health <= 0)
    .map(u => u._id);
};
