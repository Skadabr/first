import {
  getEnemyUnitIds,
  getUnitById,
} from "../index";

export function getAllAvailableForAttackTargetIds(state, sourceId) {
  // const targetIds = getEnemyUnitIds(baseState);

  // return targetIds.filter(targetId => {
  //   const target = getUnitById(baseState, targetId);
  //   const effects = getAllAvailabilityEffects(baseState, sourceId, targetId);
  //   const rawTarget = applyEffects(effects, target, baseState);
  //   return isUnitAvailable(rawTarget);
  // });

  // // function isTargetAvailableForAttack(baseState, sourceId, targetId) {
  // // }
}

export function isTargetAvailableForAttack(state, sourceId, targetId) {
  return true;
  //return getAllAvailableForAttackTargetIds(baseState, sourceId).includes(targetId);
}
