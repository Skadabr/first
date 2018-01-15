import sio from "socket.io";

import auth from "./auth";
import handleGame from "./opponents";

export default function(server, opts) {
  const io = sio(server);

  handle(io.of("/game"), handleGame, opts);
}

//
// ============ helper ============
//

function handle(nsp, handler, opts) {
  const { logger, models } = opts;
  nsp.use(auth(opts));

  nsp.on("connection", ws => {
    logger.debug(`new ws connection: ${nsp.name}`);
    ws.on("disconnect", async () => {
      logger.debug(`ws connection is closed: ${nsp.name}`);
    });
    handler(ws, opts);
  });
}
