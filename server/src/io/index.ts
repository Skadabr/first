import * as sio from "socket.io";

import auth from "./middlewares/auth";
import notify from "./middlewares/notify";
import battle from "./middlewares/battle";

import handleGame from "./game";

export default function(server, opts) {
  const io = sio(server);

  handle(io.of("/game"), handleGame, [auth, notify, battle], opts);
}

//
// ============ helper ============
//

function handle(nsp, handler, middlewares, opts) {
  const { logger, models } = opts;

  for (const mw of middlewares) nsp.use(mw(opts));

  nsp.on("connection", ws => {
    logger.debug(`io:ws - new connection: ${nsp.name}`);
    ws.on("disconnect", () => {
      logger.debug(`io:ws - connection is closed: ${nsp.name}`);
    });
    handler(ws, opts);
  });
}
