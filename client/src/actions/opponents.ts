import { CLEAN_STATE, UserStatusType } from "../constants";

const OPPONENTS_UPSERT = "OPPONENTS_UPSERT";
const OPPONENTS_GOES = "OPPONENTS_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";

const EMPTY = [];

//
// ============ Reducer ============
//

interface Opponent {
  name: string;
  status: UserStatusType;
}

export type OpponentsState = Opponent[];

export default function opponentsReducer(
  state: OpponentsState = EMPTY,
  { type, payload }
) {
  switch (type) {
    case OPPONENTS_LOAD:
      return payload;
    case OPPONENTS_UPSERT:
      const idx = state.findIndex(u => u.name === payload.name);
      if (idx === -1) {
        return [...state, payload];
      } else {
        state = [...state];
        state[idx] = { ...state[idx], ...payload };
        return state;
      }
    case OPPONENTS_GOES:
      const { name } = payload;
      return state.filter(opponent => opponent.name !== name);

    case CLEAN_STATE:
      return [];
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function loadOpponents(val) {
  return dispatch => {
    const { data, error } = val;
    if (error) return console.error(error);
    dispatch(opponentsLoad(data));
  };
}

export function opponentsUpsert(opponent: Opponent) {
  return {
    type: OPPONENTS_UPSERT,
    payload: opponent
  };
}

export function opponentsLoad(opponents: OpponentsState) {
  return {
    type: OPPONENTS_LOAD,
    payload: opponents
  };
}

export function opponentGoes(name: string) {
  return {
    type: OPPONENTS_GOES,
    payload: {
      name
    }
  };
}
