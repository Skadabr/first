import unitReducer from "./unit";

const EMPTY = {};

//
// ============ reducer ============
//

export default function unitsReducer(state, action) {
  return state.map(unit => unitReducer(unit, action));
}
