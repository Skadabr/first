import sio from "socket.io-client";
import _, {createNewMessage} from "../actions/chat";

export default function Socket(store) {
  const io = sio("http://localhost:3000");

  io.on("chat response", val => {
    const { msg, user, created } = val;
    store.dispatch(createNewMessage(msg, user, created));
  });

  return {
    sendMessage(msg, user) {
      io.emit("chat message", { user, msg });
    }
  }
}
