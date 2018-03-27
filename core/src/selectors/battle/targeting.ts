import {
  getEnemyUnitIds,
  getUnitById,
} from "../index";

export function getAllAvailableForAttackTargetIds(state, sourceId) {
  // const targetIds = getEnemyUnitIds(state);

  // return targetIds.filter(targetId => {
  //   const target = getUnitById(state, targetId);
  //   const effects = getAllAvailabilityEffects(state, sourceId, targetId);
  //   const rawTarget = applyEffects(effects, target, state);
  //   return isUnitAvailable(rawTarget);
  // });

  // // function isTargetAvailableForAttack(state, sourceId, targetId) {
  // // }
}

export function isTargetAvailableForAttack(state, sourceId, targetId) {
  return true;
  //return getAllAvailableForAttackTargetIds(state, sourceId).includes(targetId);
}
