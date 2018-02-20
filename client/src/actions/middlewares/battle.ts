import { createActivateAction, createDisActivateAction } from "../actions";

const TOGGLE_ACTIVITY = "TOGGLE_ACTIVITY";

//
// unit: {                target: {
//   effects                effects
// }                      }
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

export default function battleMidlewareCreator() {
  return function battleMidleware({ dispatch, getState }) {
    return next => ({type, effects, payload}) => {
      if (!effects) return next(action);

      for (const action of applyEffects(effects, {type, payload}))
        dispatch(action);

      next(action);
    };
  };
}

export default function applyEffects(effects, action) {
  const [preActions, newAction, postActions] = effects.reduce(
    (eff, allActions) => applyEffect(eff, allActions),
    [[], action, []]
  );
  return [...preActions, newAction, ...postActions];
}

export function applyEffect(effect, allActions) {
  switch (effect.type) {
    case TOGGLE_ACTIVITY:
      return toggleActivity(effect.payload, allActions);
  }
}

function toggleActivity(payload, [preActions, action, postActions]) {
  const unit = action.unit;
  return [
    [createActivateAction(unit), ...pre],
    action,
    [...post, createDisActivateAction(unit)]
  ];
}

//
// ============ Effects ============
//

export function createToggleActivityEffect() {
  return {
    type: TOGGLE_ACTIVITY
  };
}
