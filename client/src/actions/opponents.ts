import { CLEAN_STATE } from "../constants";

const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENTS_RELEASE = "OPPONENTS_RELEASE";

//
// ============ Reducer ============
//

export default function opponentsReducer(state = [], { type, payload }) {
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

    case CLEAN_STATE:
      return {};
    default:
      return state;
  }
}

export function opponentsUpsert(user) {
  return {
    type: OPPONENT_UPSERT,
    payload: user
  };
}

export function opponentsLoad(users) {
  return {
    type: OPPONENTS_LOAD,
    payload: users
  };
}

export function opponentGoes(user_name) {
  return {
    type: OPPONENT_GOES,
    payload: user_name
  };
}
