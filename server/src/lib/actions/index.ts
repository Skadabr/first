import applyEffects from "../effects";

const ATTACK = "ATTACK";
const ACTIVATE = "ACTIVATE";
const DISACTIVATE = "DISACTIVATE";

//
// ============ Reducer ============
//

export function createActions(initAction, unitEffects, targetEffects) {
  actions = applyEffects([...unitEffects, ...targetEffects], initAction);
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
