//  import { generateID } from "../../utils/common";
//  import { EffectScope, EffectImpact } from "../../constants";
//  import {
//    PLAYER_ADD_UNIT,
//    UNIT_ACTIVATE,
//    UNIT_DISACTIVATE,
//    ATTACK
//  } from "../../actions/battle";
//  import {
//    unitActivate,
//    unitDisActivate,
//    unitDecreaseAvailability,
//    unitIncreaseAvailability,
//    unitIncreaseMoves
//  } from "../../actions/battle/unit";
//  import {
//    getUnitFriendIds,
//    getOpponentUnits,
//    getPlayerUnitIds,
//    getPlayerUnits
//  } from "../../selectors/battle";
//
//  ///
//  ///                  action     [ ]
//  ///                    |
//  ///                  \ v /       v
//  ///                   |e|
//  ///                   |f|      [a,a] :post
//  ///                   |f|
//  ///                   |e|        v
//  ///                   |c|
//  ///                   |t|      [a,a,a] :post
//  ///                   |s|
//  ///                    |         v
//  ///                    v
//  /// [                action, ...postactions]
//  ///
//  ///
//  /// - every effect has `unit_id` parameter, which is set in "unit/fabric".
//  ///
//
//  export function applyEffects(effects, actions, state) {
//    return effects.reduce(
//      (actions, eff) => applyEffect(eff, actions, state),
//      actions,
//      state
//    );
//  }
//
//  const getMainAction = ([action, ...postActions]) => action;
//  const getPostActions = ([action, ...postActions]) => postActions;
//  const combineActions = ({ action, postActions = [] }) => [
//    action,
//    ...postActions
//  ];
//
//  const TAUNT = "TAUNT";
//  const TAUNT_DISABLER = "TAUNT_DISABLER";
//  const INCREASE_MOVES = "INCREASE_MOVES";
//  const INCREASE_ATTACK_TO_FRIENDS = "INCREASE_ATTACK_TO_FRIENDS";
//  const INCREASE_HEALTH_TO_FRIENDS = "INCREASE_HEALTH_TO_FRIENDS";
//
//  //
//  // ============ reducer ============
//  //
//
//  export function applyEffect(effect, actions, state) {
//    switch (effect.type) {
//      case TAUNT:
//        return tauntHandler(effect, actions, state);
//      case TAUNT_DISABLER:
//        return tauntDisablerHandler(effect, actions, state);
//      case INCREASE_MOVES:
//        return increaseMovesHandler(effect, actions, state);
//      default:
//        return actions;
//    }
//  }
//
//  //
//  // ============ Effects ============
//  //
//
//  // ============ increseAttackHandler ============
//
//  function increseAttackHandler(effect, actions) {
//    const action = getMainAction(actions);
//    const postActions = getPostActions(actions);
//
//    if (action.type === ATTACK) {
//      action.payload.damage += effect.payload.damage;
//    }
//
//    return combineActions({ action, postActions });
//  }
//
//  // ============ tauntHandler ============
//
//  function tauntHandler(effect, actions, state) {
//    const action = getMainAction(actions);
//    let postActions = getPostActions(actions);
//
//    const amount = getTauntOpponentUnitIds().length;
//
//    if (action.type === UNIT_ACTIVATE && !activatedIsTauntFriend()) {
//      postActions = [
//        ...postActions,
//        ...getNotTauntOpponentUnitIds().map(id => unitDecreaseAvailability(1, id))
//      ];
//    } else if (action.type === UNIT_DISACTIVATE && !activatedIsTauntFriend()) {
//      postActions = [
//        ...postActions,
//        ...getNotTauntOpponentUnitIds().map(id =>
//          unitIncreaseAvailability(1, id)
//        )
//      ];
//    }
//
//    return combineActions({ action, postActions });
//
//    function activatedIsTauntFriend() {
//      return getPlayerUnitIds(state).includes(effect.unit_id);
//    }
//
//    function getNotTauntOpponentUnitIds() {
//      return getOpponentUnits(state)
//        .filter(unit => !unit.effects.map(eff => eff.type).includes(TAUNT))
//        .map(unit => unit._id);
//    }
//
//    function getTauntOpponentUnitIds() {
//      return getOpponentUnits(state)
//        .filter(unit => unit.effects.map(eff => eff.type).includes(TAUNT))
//        .map(unit => unit._id);
//    }
//  }
//
//  function tauntDisablerHandler(effect, actions, state) {
//    const action = getMainAction(actions);
//    let postActions = getPostActions(actions);
//
//    const amount = getTauntOpponentUnitIds().length;
//
//    if (action.type === UNIT_ACTIVATE && activatedIsTauntDisablerFriend()) {
//      postActions = [
//        ...postActions,
//        ...getNotTauntOpponentUnitIds().map(id =>
//          unitIncreaseAvailability(amount, id)
//        )
//      ];
//    } else if (
//      action.type === UNIT_DISACTIVATE &&
//      activatedIsTauntDisablerFriend()
//    ) {
//      postActions = [
//        ...postActions,
//        ...getNotTauntOpponentUnitIds().map(id =>
//          unitDecreaseAvailability(amount, id)
//        )
//      ];
//    }
//
//    function activatedIsTauntDisablerFriend() {
//      return getPlayerUnitIds(state).includes(effect.unit_id);
//    }
//
//    function getNotTauntOpponentUnitIds() {
//      return getOpponentUnits(state)
//        .filter(unit => !unit.effects.map(eff => eff.type).includes(TAUNT))
//        .map(unit => unit._id);
//    }
//
//    function getTauntOpponentUnitIds() {
//      return getOpponentUnits(state)
//        .filter(unit => unit.effects.map(eff => eff.type).includes(TAUNT))
//        .map(unit => unit._id);
//    }
//
//    return combineActions({ action, postActions });
//  }
//
//  // ============ increaseMovesHandler ============
//
//  function increaseMovesHandler(effect, actions, state) {
//    const action = getMainAction(actions);
//    let postActions = getPostActions(actions);
//
//    if (action.type === PLAYER_ADD_UNIT) {
//      postActions = postActions.concat(unitIncreaseMoves(1, effect.unit_id));
//    }
//
//    return combineActions({ action, postActions });
//  }
//
//  //
//  // ============ Effects creators ============
//  //
//
//  export const taunt = () => ({
//    _id: generateID(),
//    type: TAUNT,
//    scope: EffectScope.Global,
//    impact: EffectImpact.Availability
//  });
//
//  export const tauntDisabler = () => ({
//    _id: generateID(),
//    type: TAUNT_DISABLER,
//    scope: EffectScope.Global,
//    impact: EffectImpact.Availability
//  });
//
//  export const increaseMoves = amount => ({
//    _id: generateID(),
//    type: INCREASE_MOVES,
//    scope: EffectScope.Local,
//    impact: EffectImpact.Moving
//  });
//
//  export const increaseAttackToFrieands = damage => ({
//    _id: generateID(),
//    type: INCREASE_ATTACK_TO_FRIENDS,
//    scope: EffectScope.Global,
//    impact: EffectImpact.Attacking,
//    payload: {
//      damage
//    }
//  });
//
//  export const increaseHealthToFriends = health => ({
//    _id: generateID(),
//    type: INCREASE_HEALTH_TO_FRIENDS,
//    scope: EffectScope.Global,
//    impact: EffectImpact.Attacking,
//    payload: {
//      health
//    }
//  });
