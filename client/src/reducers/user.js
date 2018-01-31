export const USER_ADD = "USER_LOGIN";
export const USER_REMOVE = "USER_LOGOUT";
export const USER_INCREASE_RATE = "USER_INCREASE_RATE";
export const USER_DECREASE_RATE = "USER_DECREASE_RATE";

const EMPTY = {};

export default function userReducer(state = EMPTY, { payload, type }) {
  switch (type) {
    case USER_ADD:
      return payload;

    case USER_REMOVE:
      return EMPTY;

    case USER_INCREASE_RATE:
      return { ...state, rate: state.rate + 1 };

    case USER_DECREASE_RATE:
      return { ...state, rate: state.rate - 1 };

    default:
      return state;
  }
}

export function userAdd(name, email, token, rate) {
  return {
    type: USER_ADD,
    payload: { name, email, token, rate }
  };
}

export function userRemove() {
  return {
    type: USER_REMOVE
  };
}

export function userDecreaseRate() {
  return {
    type: USER_DECREASE_RATE
  };
}

export function userIncreaseRate() {
  return {
    type: USER_INCREASE_RATE
  };
}
