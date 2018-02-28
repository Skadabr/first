import { EffectScope, EffectImpact } from "../../constants";
import { unitActivate, unitNotActivate } from "../../actions/battle/unit";

//
//                  action     [ ]
//                    |
//                  \ v /       v
//                   |e|
//                   |f|      [a,a] :post
//                   |f|
//                   |e|        v
//                   |c|
//                   |t|      [a,a,a] :post
//                   |s|
//                    |         v
//                    v
// [                action, ...postactions]
//

export function applyEffects(effects, action) {
  return effects.reduce((allActions, eff) => applyEffect(eff, allActions), [
    action
  ]);
}

function applyEffectsToUnit(effects, unit) {}

const TOGGLE_ACTIVITY = "TOGGLE_ACTIVITY";

//
// ============ reducer ============
//

export function applyEffect(effect, allActions) {
  switch (effect.type) {
    case TOGGLE_ACTIVITY:
      return toggleActivity(effect.payload, allActions);
  }
}

//
// ============ Effects ============
//

function increseAttack(effect, actions) {
  const [action, ...postActions] = actions;

  if (action.type === "ATTACK") {
    action.payload.damage += effect.payload.damage;
  }

  return [action, ...postActions];
}

//
// ============ Effects creators ============
//

export const increaseAttackToFrieandsEffect = damage => ({
  _id: generateID(),
  type: INCREASE_ATTACK_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.State,
  payload: {
    damage
  }
});

export const increaseHealthToFriendsEffect = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH_TO_FRIENDS,
  scope: EffectScope.Global,
  impact: EffectImpact.State,
  payload: {
    health
  }
});

export const increaseHealthEffect = health => ({
  _id: generateID(),
  type: INCREASE_HEALTH,
  scope: EffectScope.Local,
  scope: EffectImpact.State,
  payload: {
    health
  }
});
