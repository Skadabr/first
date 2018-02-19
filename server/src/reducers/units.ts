import unitReducer from "./unit";

export default function unitsReducer(state, action) {
  return state.map(unit => unitReducer(unit, action));
}
