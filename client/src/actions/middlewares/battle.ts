import { applyEffects } from "../../lib/unit/effects";

const TOGGLE_ACTIVITY = "TOGGLE_ACTIVITY";

//
// ============ middleware ============
//

export default function battleMidlewareCreator() {
  return function battleMidleware({ dispatch, getState }) {
    return next => action => {
      const { type, effects, payload } = action;

      if (effects) {
        const actions = applyEffects(effects, [{ type, payload }], getState());
        for (const action of actions) dispatch(action);
        return;
      } else {
        return next(action);
      }
    };
  };
}
