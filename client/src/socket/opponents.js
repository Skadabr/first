import _, {
  createNewMessage,
  createNewUserOnline,
  createUserOffline
} from "../actions/chat";

const OPPONENT_ADD = "USER_ADD";
const OPPONENT_REMOVE = "USER_REMOVE";

export default function Opponents(ws, store) {
  ws.on("chat user online", val => {
    store.dispatch(createNewUserOnline(val));
  });

  ws.on("chat user offline", val => {
    store.dispatch(createUserOffline(val));
  });

  return {
    userOnline(user) {
      io.emit(OPPONENT_ADD, user);
    },

    userOffline(user) {
      io.emit(OPPONENT_REMOVE, user);
    }
  };
}
