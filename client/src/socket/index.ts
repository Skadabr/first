import * as sio from "socket.io-client";

import handleGame from "./game";

let socket, store, token;

export default function IO(_token?: string, _store?) {
  if (socket) return socket;

  token = token || _token;
  store = store || _store;

  if (!token || !store) return;

  return (socket = Socket());
}

function Socket() {
  const gameIO = handleGame(sio("/game", { query: { token } }), store);

  function close() {
    Object.keys(close).forEach(key => {
      close[key].ws.close();
    });
    token = null;
    socket = null;
  }

  return Object.assign(close, {
    gameIO
  });
}
