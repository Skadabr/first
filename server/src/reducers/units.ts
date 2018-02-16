import unitReducer from "./unit";

export default function unitsReducer(state, action) {
  return state.map(player => unitReducer(unit, action));
}
