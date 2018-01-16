import sio from "socket.io-client";

import handleGame from "./game";

let socket, store, token;

export default function IO(_token, _store) {
  if (socket) return socket;

  token = token || _token;
  store = store || _store;

  if (!token || !store) return;

  return (socket = Socket(token, store));
}

function Socket(token, store) {
  const gameIO = handleGame(
    sio(`http://localhost:3000/game`, { query: { token } }),
    store,
  );

  function close() {
    Object.values(close).forEach(sock => sock.ws.close());
    token = null;
    socket = null;
  }

  return Object.assign(close, {
    gameIO
  });
}
