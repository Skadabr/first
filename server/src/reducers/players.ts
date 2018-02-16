import playerReducer from "player";

export default function playersReducer(state, action) {
  return state.map(player => playerReducer(player, action));
}
