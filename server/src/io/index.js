import sio from "socket.io";

import handleChat from "./chat.js";

export default function(opts) {
  const { server, logger } = opts;
  const chat = sio(server);

  chat.on("connection", ws => {
    logger.debug("new ws connection");
    ws.on("disconnect", () => {
      logger.debug("ws connection is closed");
    });

    handleChat(ws, opts);
  });
}
