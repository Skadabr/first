import { UserStatusType, CLEAN_STATE } from "../index";

const USER_ADD = "USER_ADD";
const USER_REMOVE = "USER_REMOVE";
const USER_UPDATE = "USER_UPDATE";
const USER_INCREASE_RATE = "USER_INCREASE_RATE";
const USER_DECREASE_RATE = "USER_DECREASE_RATE";

export interface UserState {
  name?: string;
  email?: string;
  token?: string;
  rate?: number;
  status?: UserStatusType;
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

export function userAdd(user) {
  return {
    type: USER_ADD,
    payload: user
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

export function userUpdateStatus(status: UserStatusType) {
  return {
    type: USER_UPDATE,
    payload: { status }
  };
}
