import chatApi from "../api/chat.js";
import { MESSAGE_LOAD, MESSAGE_SEND, MESSAGE_NEW } from "../constants";

export function loadMessages() {
  return async dispatch => {
    const msgs = await chatApi.loadMessages();
    msgs.forEach(msg => { msg.created = new Date(msg.created) })
    dispatch(createLoadMessages(msgs));
  };
}

export function sendMessage(msg, user) {
  return dispatch => {
    window.IO.sendMessage(msg, user);
    dispatch(createSendMessage(msg, user, new Date));
  }
}

function createLoadMessages(msgs) {
  return {
    type: MESSAGE_LOAD,
    payload: msgs
  };
}

function createSendMessage(msg, user, created) {
  return {
    type: MESSAGE_SEND,
    payload: {msg, user, created}
  };
}

export function createNewMessage(msg, user, created) {
  return {
    type: MESSAGE_NEW,
    payload: { msg, user, created }
  };
}
