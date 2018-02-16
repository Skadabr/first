import unitReducer from "player";

export default function unitsReducer(state, action) {
  return state.map(player => unitReducer(unit, action));
}
