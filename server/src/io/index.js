import sio from "socket.io";

import handleOpponents from "./opponents.js";

export default function(server, opts) {
  const io = sio(server);

  handle(io.of("/opponents"), handleOpponents, opts);
}

//
// ============ helper ============
//

function handle(nsp, handler, opts) {
  const { logger } = opts;
  nsp.on("connection", ws => {
    logger.debug(`new ws connection: ${nsp.name}`);
    ws.on("disconnect", () =>
      logger.debug(`ws connection is closed: ${nsp.name}`)
    );
    handler(ws, opts);
  });
}
