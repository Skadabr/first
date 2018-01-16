import IO from "../socket";

export const ADD_MESSAGE = "ADD_MESSAGE";

//
// ============ Reducer ============
//

export default function(state = [], { type, payload }) {
  switch (type) {
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function addMessage(payload) {
  return dispatch => {
    dispatch({ type: ADD_MESSAGE, payload });
  };
}

export function sendMessage(msg, name) {
  return dispatch => {
    IO().gameIO.sendMessage(msg, name);
    addMessage({ msg, name })(dispatch);
  };
}
