import { USER_LOGOUT } from "./user.state";

export const OPPONENT_UPSERT = "OPPONENT_UPSERT";
export const OPPONENT_GOES = "OPPONENT_GOES";
export const OPPONENTS_LOAD = "OPPONENTS_LOAD";

//
// ============ Reducer ============
//

export default function(state = [], { type, payload }) {
  switch (type) {
    case OPPONENTS_LOAD:
      return payload;
    case OPPONENT_UPSERT:
      const idx = state.findIndex(op => op.name === payload.name);
      if (idx === -1) {
        return [...state, payload];
      } else {
        state = [...state];
        state[idx] = { ...state[idx], ...payload };
        return state;
      }
    case OPPONENT_GOES:
      return state.filter(user => user.name !== payload);
    case OPPONENTS_RELEASE:
      return [];
    default:
      return state;
  }
}
//
// ============ Action creators ============
//

function createOpponentUpsert(user) {
  return {
    type: OPPONENT_UPSERT,
    payload: user
  };
}

function createLoadOpponents(users) {
  return {
    type: OPPONENTS_LOAD,
    payload: users
  };
}

function createOpponentGoes(user) {
  return {
    type: OPPONENT_GOES,
    payload: user
  };
}
