import unitReducer from "./unit";
import {UNITS_REMOVE} from "./index";
import {setFlagsFromString} from "v8";

const EMPTY = [];

//
// ============ reducer ============
//

export default function unitsReducer(state: any[] = EMPTY, action) {
  switch (action.type) {
    case UNITS_REMOVE:
      return state.filter(u => u._id !== action.payload)

    default:
      return state.map(unit => unitReducer(unit, action));
  }
}

//
// ============ Actions ============
//

export function unitsRemove(unitId: string) {
  return {
    type: UNITS_REMOVE,
    payload: unitId
  }
}

