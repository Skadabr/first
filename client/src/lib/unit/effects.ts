import { generateID } from "../../utils/common";
import { EffectScope, EffectImpact } from "../../constants";
//
// actions
//
import {
  PLAYER_ADD_UNIT,
  UNIT_ACTIVATE,
  UNIT_DISACTIVATE,
  ATTACK
} from "../../actions/battle";
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
  getOpponentUnits,
  getPlayerUnitIds,
  getPlayerUnits,
  isUnitFriend,
  isUnitHasEffect
} from "../../selectors/battle/index";
//import { } from "../../selectors/battle/effects";

///
///                  action     [ ]
///                    |
///                  \ v /       v
///                   |e|
///                   |f|      [a,a] :post
///                   |f|
///                   |e|        v
///                   |c|
///                   |t|      [a,a,a] :post
///                   |s|
///                    |         v
///                    v
/// [                action, ...postactions]
///
///
/// - every effect has `unit_id` parameter, which is set in "unit/fabric".
///

export function applyEffects(effects, target, state) {
  return effects.reduce(applyEffect.bind(state), target);
}

const TAUNT = "TAUNT";
const TAUNT_DISABLER = "TAUNT_DISABLER";
const INCREASE_MOVES = "INCREASE_MOVES";
const INCREASE_ATTACK_TO_FRIENDS = "INCREASE_ATTACK_TO_FRIENDS";
const INCREASE_HEALTH_TO_FRIENDS = "INCREASE_HEALTH_TO_FRIENDS";

//
// ============ reducer ============
//

export function applyEffect(target, effect) {
  const state = effect.scope === EffectScope.Global ? this : undefined;

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

export function sortEffectsByPriority(effects) {
  return effects.sort((a, b) => a.priority - b.priority);
}

//
// ============ Effects ============
//

// ============ increseAttackHandler ============

function increseAttackHandler(effect, target) {
  //if (action.type === ATTACK) {
  //  action.payload.damage += effect.payload.damage;
  //}
}

// ============ tauntHandler ============

function tauntHandler(effect, target, state) {
  if (effect.unit_id === target._id) {
    return { ...target, availability: 1 };
  }
  if (
    isUnitFriend(state, { unit_id: effect.unit_id, target_id: target._id }) &&
    !isUnitHasEffect(state, target._id, effect.type)
  ) {
    return { ...target, availability: 0 };
  }
  return target;
}

function tauntDisablerHandler(effect, target, state) {
  if (
    !isUnitFriend(state, { unit_id: effect.unit_id, target_id: target._id })
  ) {
    return { ...target, availability: 1 };
  }
  return target;
}

// ============ increaseMovesHandler ============

function increaseMovesHandler(effect, actions, state) {}

//
// ============ Effects creators ============
//

export const taunt = () => ({
  _id: generateID(),
  type: TAUNT,
  scope: EffectScope.Global,
  impact: EffectImpact.Availability,
  priority: 5
});

export const tauntDisabler = () => ({
  _id: generateID(),
  type: TAUNT_DISABLER,
  scope: EffectScope.Global,
  impact: EffectImpact.Availability,
  priority: 6
});

export const increaseMoves = amount => ({
  _id: generateID(),
  type: INCREASE_MOVES,
  scope: EffectScope.Local,
  impact: EffectImpact.Move,
  priority: 5
});

export const increaseAttackToFrieands = damage => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.Attack,
  priority: 5,
  payload: { damage }
});

export const increaseHealthToFriends = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.Attack,
  priority: 5,
  payload: { health }
});
