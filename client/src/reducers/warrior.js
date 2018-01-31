export const USER_ADD = "USER_LOGIN";
export const USER_REMOVE = "USER_LOGOUT";
export const USER_INCREASE_RATE = "USER_INCREASE_RATE";
export const USER_DECREASE_RATE = "USER_DECREASE_RATE";

export default function warriorsReducer(state = EMPTY, { payload, type }) {
  switch (type) {
    case WARRIOR_CREATE:
      return payload;

    case WARRIOR_UPDATE:
      return {...state, ...payload};

    default:
      return state;
  }
}
