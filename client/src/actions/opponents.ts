import { CLEAN_STATE, StatusKinds } from "../constants";

const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENTS_RELEASE = "OPPONENTS_RELEASE";

const EMPTY = [];

//
// ============ Reducer ============
//

interface Opponent {
  name: string;
  status: StatusKinds;
}
export type OpponentsState = Opponent[];

export default function opponentsReducer(
  state: OpponentsState = EMPTY,
  { type, payload }
) {
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

//
// ============ Actions ============
//

export function opponentsUpsert(opponent: Opponent) {
  return {
    type: OPPONENT_UPSERT,
    payload: opponent
  };
}

export function opponentsLoad(opponents: OpponentsState) {
  return {
    type: OPPONENTS_LOAD,
    payload: opponents
  };
}

export function opponentGoes(opponent_name: string) {
  return {
    type: OPPONENT_GOES,
    payload: opponent_name
  };
}
