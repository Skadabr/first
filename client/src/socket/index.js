import sio from "socket.io-client";

import handleOpponents from "./opponents";

export default function Socket(store) {
  const io = sio("http://localhost:3000");

  const opponents = handleOpponents(io.socket("/opponents"), store);

  return {
    opponents
  };
}
