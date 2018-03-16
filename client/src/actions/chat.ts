import IO from "../socket";

import { CLEAN_STATE } from "../constants";

const CHAT_ADD_MESSAGE = "CHAT_ADD_MESSAGE";
const CHAT_CLEAN_MESSAGES = "CHACHAT_CLEAN_MESSAGES";

const EMPTY = [];

//
// ============ Reducer ============
//

interface Message {
  date: Date;
  msg: string;
  name: string;
}

export type ChatState = Message[];

export default function gameChat(
  state: ChatState = EMPTY,
  { type, payload }
) {
  switch (type) {
    case CHAT_ADD_MESSAGE:
      return [...state, payload];
    case CLEAN_STATE:
      return EMPTY;
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function chatAddMessage(msg: string, name: string, date: Date) {
  return {
    type: CHAT_ADD_MESSAGE,
    payload: { msg, name, date }
  };
}

export function sendMessage(msg, name) {
  return dispatch => {
    const date = new Date();
    IO().gameIO.sendMessage(msg, name, date);
    dispatch(chatAddMessage(msg, name, date));
  };
}
