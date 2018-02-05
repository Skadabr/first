import IO from "../socket";
import { CLEAN_STATE } from "../constants";

const CHAT_ADD_MESSAGE = "CHAT_ADD_MESSAGE";
const CHAT_CLEAN_MESSAGES = "CHACHAT_CLEAN_MESSAGES";

//
// ============ Reducer ============
//

export default function gameChat(state = [], { type, payload }) {
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

export function gameChatAddMessage(msg, name, date) {
  return {
    type: CHAT_ADD_MESSAGE,
    payload: { msg, name, date }
  };
}
