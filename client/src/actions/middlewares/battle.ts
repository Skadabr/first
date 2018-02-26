import { applyEffects as applyUnitEffects } from "../../lib/unit/effects";
import { applyEffects as applyCardEffects } from "../../lib/cards/effects";

const TOGGLE_ACTIVITY = "TOGGLE_ACTIVITY";

//
// ============ middleware ============
//

export default function battleMidlewareCreator() {
  return function battleMidleware({ dispatch, getState }) {
    return next => action => {
      const { type, cardEffects, unitEffects, payload } = action;

      if (cardEffects) {
        for (const action of applyCardEffects(cardEffects, { type, payload }))
          dispatch(action);
        return;
      }

      if (unitEffects) {
        for (const action of applyUnitEffects(unitEffects, { type, payload }))
          dispatch(action);
        return;
      }

      return next(action);
    };
  };
}
