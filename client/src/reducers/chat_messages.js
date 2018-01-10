import { MESSAGE_NEW, MESSAGE_LOAD, MESSAGE_SEND } from "../constants";

export default function (state = [], action) {
  switch(action.type) {
    case MESSAGE_NEW:
      return [...state, action.payload];
    case MESSAGE_LOAD:
      return action.payload;
    case MESSAGE_SEND:
      return [...state, action.payload];
    default:
      return state;
  }
}
