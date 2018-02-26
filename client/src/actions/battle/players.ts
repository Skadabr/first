import playerReducer from "./player";

const EMPTY = [];

export default function playersReducer(state = EMPTY, action) {
  return state.map(player => playerReducer(player, action));
}
