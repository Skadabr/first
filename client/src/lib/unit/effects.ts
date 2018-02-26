import { EffectScope, EffectImpact } from "../../constants";
import { unitActivate, unitNotActivate } from "../../actions/battle/unit";

//
//          [ ]     action     [ ]
//                    |
//           v      \ v /       v
//                   |e|
//    pre: [a,a]     |f|      [a,a] :post
//                   |f|
//           v       |e|        v
//                   |c|
//    pre: [a,a,a,a] |t|      [a,a,a] :post
//                   |s|
//           v        |         v
//                    v
// [ ...preactions, action, ...postactions]
//

export function applyEffects(effects, action) {
  const [preActions, newAction, postActions] = effects.reduce(
    (allActions, eff) => applyEffect(eff, allActions),
    [[], action, []]
  );
  return [...preActions, newAction, ...postActions];
}

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

function toggleActivity(payload, [preActions, action, postActions]) {
  const unit = action.unit;
  return [
    [unitActivate(unit), ...preActions],
    action,
    [...postActions, unitNotActivate(unit)]
  ];
}

//
// ============ Effects ============
//

export function toggleActivityEffect() {
  return {
    type: TOGGLE_ACTIVITY,
    scope: EffectScope.Local,
    impact: EffectImpact.State
  };
}
