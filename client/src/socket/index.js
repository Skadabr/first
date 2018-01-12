import sio from "socket.io-client";

import handleOpponents from "./opponents";

let socket;

export default function IO(store) {
  return socket || (socket = Socket(store));
}

function Socket(store) {
  const opponentsIO = handleOpponents(sio("http://localhost:3000/opponents"), store);

  return {
    opponentsIO
  };
}
