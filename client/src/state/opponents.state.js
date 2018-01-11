export const OPPONENTS_COME = "OPPONENTS_COME";
export const OPPONENTS_GOES = "OPPONENTS_GOES";
export const OPPONENTS_LOAD = "OPPONENTS_LOAD";

//
// ============ Reducer ============
//

export default function (state = [], {type, payload}) {
  switch(type) {
    case OPPONENTS_COME:
      return [...state, action.payload];
    case OPPONENTS_LOAD:
      return action.payload;
    case OPPONENTS_GOES:
      return state.filter(name => name !== action.payload);
    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function userOnline(user) {
  return dispatch => {
    window.IO.userOnline(user);
    dispatch(createNewUserOnline(user));
  };
}

export function loadChatUsers() {
  return async dispatch => {
    const users = await chatApi.loadChatUsers();
    dispatch(createLoadChatUsers(users));
  };
}

export function userOffline(user) {
  return dispatch => {
    window.IO.userOffline(user);
    dispatch(createUserOffline(user));
  };
}

//
// ============ Action creators ============
//

export function createNewUserOnline(user) {
  return {
    type: CHAT_NEW_USER_ONLINE,
    payload: user
  };
}
function createLoadChatUsers(users) {
  return {
    type: CHAT_USERS,
    payload: users
  }
}

export function createUserOffline(user) {
  return {
    type: CHAT_USER_OFFLINE,
    payload: user
  };
}
