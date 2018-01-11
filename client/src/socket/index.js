import sio from "socket.io-client";
import _, {createNewMessage, createNewUserOnline, createUserOffline} from "../actions/chat";

export default function Socket(store) {
  const io = sio("http://localhost:3000");

  io.on("chat response", val => {
    const { msg, user, created } = val;
    store.dispatch(createNewMessage(msg, user, created));
  });

  io.on("chat user online", val => {
    store.dispatch(createNewUserOnline(val));
  });

  io.on("chat user offline", val => {
    store.dispatch(createUserOffline(val));
  });

  return {
    sendMessage(msg, user) {
      io.emit("chat message", { user, msg });
    },

    userOnline(user) {
      io.emit("chat add user", user);
    },

    userOffline(user) {
      io.emit("chat remove user", user);
    }
  }
}
