import { CLEAN_STATE } from "../constants";

const USER_ADD = "USER_ADD";
const USER_REMOVE = "USER_REMOVE";
const USER_UPDATE = "USER_UPDATE";
const USER_INCREASE_RATE = "USER_INCREASE_RATE";
const USER_DECREASE_RATE = "USER_DECREASE_RATE";

interface UserState {
  name?: string;
  email?: string;
  token?: string;
  rate?: number;
  status?: string;
}

const EMPTY = {};

export default function userReducer(
  state: UserState = EMPTY,
  { payload, type }
) {
  switch (type) {
    case USER_ADD:
      return payload;

    case USER_UPDATE:
      return { ...state, ...payload };

    case USER_INCREASE_RATE:
      return { ...state, rate: state.rate + 1 };

    case USER_DECREASE_RATE:
      return { ...state, rate: state.rate - 1 };

    case CLEAN_STATE:
      return EMPTY;

    default:
      return state;
  }
}

export function userAdd(name, email, token, rate, status = "PEACE") {
  return {
    type: USER_ADD,
    payload: { name, email, token, rate, status }
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

export function userUpdateStatus(status) {
  return {
    type: USER_UPDATE,
    payload: { status }
  };
}
