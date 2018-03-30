import { CLEAN_STATE, UserStatusType } from "core";

const USERS_UPSERT = "USERS_UPSERT";
const USERS_REMOVE = "USERS_REMOVE";
const USERS_LOAD = "USERS_LOAD";

const EMPTY = [];

//
// ============ Reducer ============
//

export type UsersState = {
  name: string;
  status: UserStatusType;
}[];

export default function usersReducer(
  state: UsersState = EMPTY,
  { type, payload }
) {
  switch (type) {
    case USERS_LOAD:
      return payload;
    case USERS_UPSERT:
      const idx = state.findIndex(u => u.name === payload.name);
      if (idx === -1) {
        return [...state, payload];
      } else {
        state = [...state];
        state[idx] = { ...state[idx], ...payload };
        return state;
      }
    case USERS_REMOVE:
      const { name } = payload;
      return state.filter(enemy => enemy.name !== name);

    case CLEAN_STATE:
      return [];
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function loadUsers(val) {
  return dispatch => {
    const { data, error } = val;
    if (error) return console.error(error);
    dispatch(usersLoad(data));
  };
}

export function usersUpsert(enemy) {
  return {
    type: USERS_UPSERT,
    payload: enemy
  };
}

export function usersLoad(enemys: UsersState) {
  return {
    type: USERS_LOAD,
    payload: enemys
  };
}

export function usersRemove(name: string) {
  return {
    type: USERS_REMOVE,
    payload: {
      name
    }
  };
}
