import { CHAT_USERS, CHAT_NEW_USER_ONLINE, CHAT_USER_OFFLINE } from "../constants";

export default function (state = [], action) {
  switch(action.type) {
    case CHAT_NEW_USER_ONLINE:
      return [...state, action.payload];
    case CHAT_USERS:
      return action.payload;
    case CHAT_USER_OFFLINE:
      return state.filter(name => name !== action.payload);
    default:
      return state;
  }
}
