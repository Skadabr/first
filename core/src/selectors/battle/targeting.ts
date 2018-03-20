import {getEnemyUnitIds, getUnitById, getAllAvailabilityEffects} from "../index";

export function getAllAvailableForAttackTargetIds(state, sourceId) {
  const targetIds = getEnemyUnitIds(state);

  return targetIds.filter(targetId =>
    isTargetAvailableForAttack(state, sourceId, targetId)
  );

  function isTargetAvailableForAttack(state, sourceId, targetId) {
    const target = getUnitById(state, targetId);
    const effects = getAllAvailabilityEffects(state, sourceId, targetId);
    const rawTarget = applyEffects(effects, target, state);
    return isUnitAvailable(rawTarget);
  }
}

export function isTargetAvailableForAttack(state, sourceId, targetId) {
  return getAllAvailableForAttackTargetIds(state, sourceId).includes(targetId);
}

