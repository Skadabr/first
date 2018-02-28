import { generateID } from "../../utils/common";
import { EffectScope, EffectImpact } from "../../constants";
import { PLAYER_ADD_UNIT, UNIT_ACTIVATE, ATTACK } from "../../actions/battle";
import {
  unitActivate,
  unitDisActivate,
  unitDecreaseAvailability,
  unitIncreaseMoves,
} from "../../actions/battle/unit";
import { getUnitFriends } from "../../selectors/battle";

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

export function applyEffects(effects, actions, state) {
  return effects.reduce(
    (actions, eff) => applyEffect(eff, actions, state),
    actions,
    state
  );
}

const getMainAction = ([action, ...postActions]) => action;
const getPostActions = ([action, ...postActions]) => postActions;
const combineActions = ({ action, postActions = [] }) => [
  action,
  ...postActions
];

const TAUNT = "TAUNT";
const INCREASE_MOVES = "INCREASE_MOVES";
const INCREASE_ATTACK_TO_FRIENDS = "INCREASE_ATTACK_TO_FRIENDS";
const INCREASE_HEALTH_TO_FRIENDS = "INCREASE_HEALTH_TO_FRIENDS";

//
// ============ reducer ============
//

export function applyEffect(effect, actions, state) {
  switch (effect.type) {
    case TAUNT:
      return tauntHandler(effect, actions, state);
    case INCREASE_MOVES:
      return increaseMovesHandler(effect, actions, state);
    default:
      return actions
  }
}

//
// ============ Effects ============
//

function increseAttackHandler(effect, actions) {
  const action = getMainAction(actions);
  const postActions = getPostActions(actions);

  if (action.type === ATTACK) {
    action.payload.damage += effect.payload.damage;
  }

  return combineActions({ action, postActions });
}

function tauntHandler(effect, actions, state) {
  const action = getMainAction(actions);
  let postActions = getPostActions(actions);

  if (action.type === UNIT_ACTIVATE) {
    postActions = postActions.concat(
      getUnitFriends(state, effect.unit_id)
        .map(unit => unit._id)
        .map(id => unitDecreaseAvailability(id, 1))
    );
  }

  return combineActions({ action, postActions });
}

function increaseMovesHandler(effect, actions, state) {
  const action = getMainAction(actions);
  let postActions = getPostActions(actions);

  if (action.type === PLAYER_ADD_UNIT) {
    postActions = postActions.concat(unitIncreaseMoves(effect.unit_id, 1));
  }

  return combineActions({ action, postActions });
}

//
// ============ Effects creators ============
//

export const taunt = () => ({
  _id: generateID(),
  type: TAUNT,
  scope: EffectScope.Global,
  impact: EffectImpact.Target
});

export const increaseMoves = amount => ({
  _id: generateID(),
  type: INCREASE_MOVES,
  scope: EffectScope.Local,
  impact: EffectImpact.State
});

export const increaseAttackToFrieands = damage => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.State,
  payload: {
    damage
  }
});

export const increaseHealthToFriends = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.State,
  payload: {
    health
  }
});
