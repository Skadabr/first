import applyEffects from "./effects";

export function createActions(effects, initAction) {
  let actions = [initAction];
  actions = applyEffects(unitEffects, actions);
  actions = applyEffects(targetEffects, actions);
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
