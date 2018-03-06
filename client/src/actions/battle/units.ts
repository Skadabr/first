import unitReducer, { unitDecreaseAvailability } from "./unit";
import { UNITS_REMOVE } from ".";

const EMPTY = {};

//
// ============ reducer ============
//

export default function unitsReducer(state, action) {
  switch (action.type) {
    case UNITS_REMOVE: {
      return state.filter(unit => unit._id !== action.payload);
    }

    default:
      return state.map(unit => unitReducer(unit, action));
  }
}

//
// ============ Actions ============
//

