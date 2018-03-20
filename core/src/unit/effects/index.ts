import { generateID } from "../../utils";
import { EffectTargetingScope, EffectApplicabilityStage } from "../../index";
//
// actions
//
import {
  unitActivate,
  unitDisActivate,
  unitDecreaseAvailability,
  unitIncreaseMoves
} from "../../actions/battle/unit";
//
// selectors
//
import {
  getUnitFriendIds,
  getEnemyUnits,
  getPlayerUnitIds,
  getPlayerUnits,
  isUnitFriend,
  isUnitHasEffect
} from "../../selectors/battle/index";
//import { } from "../../selectors/battle/effects";

export function applyEffects(effects, target, state) {
  return effects.reduce(applyEffect.bind(state), target);
}

export const TAUNT = "TAUNT";
export const TAUNT_DISABLER = "TAUNT_DISABLER";
export const INCREASE_MOVES = "INCREASE_MOVES";
export const INCREASE_ATTACK_TO_FRIENDS = "INCREASE_ATTACK_TO_FRIENDS";
export const INCREASE_HEALTH_TO_FRIENDS = "INCREASE_HEALTH_TO_FRIENDS";

//
//
// ============ Effects reducer ============
//
//

function applyEffect(target, effect) {
  const state = effect.scope === EffectTargetingScope.Global ? this : undefined;

  switch (effect.type) {
    case TAUNT:
      return tauntHandler(effect, target, state);
    case TAUNT_DISABLER:
      return tauntDisablerHandler(effect, target, state);
    case INCREASE_MOVES:
      return increaseMovesHandler(effect, target, state);
    default:
      return target;
  }
}

//
//
// ============ Effects ============
//
//

//
// ============ increseAttackHandler ============
//

function increseAttackHandler(effect, target) { }

//
// ============ tauntHandler ============
//

function tauntHandler(effect, target, state) {
  if (effect.unitId === target._id) {
    return { ...target, availability: 1 };
  }
  if (
    isUnitFriend(state, { unitId: effect.unitId, targetId: target._id }) &&
    !isUnitHasEffect(state, target._id, effect.type)
  ) {
    return { ...target, availability: 0 };
  }
  return target;
}

//
// ============ tauntDisablerHandler ============
//

function tauntDisablerHandler(effect, target, state) {
  if (
    !isUnitFriend(state, { unitId: effect.unitId, targetId: target._id })
  ) {
    return { ...target, availability: 1 };
  }
  return target;
}

//
// ============ increaseMovesHandler ============
//

function increaseMovesHandler(effect, actions, state) {}

