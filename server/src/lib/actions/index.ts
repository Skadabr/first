import applyEffects from "./effects";

export function createActions(initAction, unitEffects, targetEffects) {
  actions = applyEffects([...unitEffects, targetEffects], actions);
}

//
// ============ actions ============
//

export function createAttackAction(unit, target) {
  return {
    type: ATTACK,
    payload: {
      unit,
      target
    }
  };
}

export function createDisActivateAction(unit) {
  return {
    type: DISACTIVATE,
    payload: { unit }
  };
}

export function createActivateAction(unit) {
  return {
    type: ACTIVATE,
    payload: { unit }
  };
}
