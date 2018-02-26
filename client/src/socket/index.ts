import io from "socket.io-client";

import handleGame from "./game";

let socket, token, store, router;

export default function IO(_token?: string, _store?, _router?) {
  if (socket) return socket;

  token = token || _token;
  store = store || _store;
  router = router || _router;

  if (!token || !store || !router) return;

  return (socket = Socket());
}

function Socket() {
  const gameIO = handleGame(io("/game", { query: { token } }), store, router);

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
