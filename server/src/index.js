import http from "http";
import initApp from "./app";

const { PORT = 3000 } = process.env;

import Models from "./models";
import Loggers from "./logger";
import Passport from "./passport";
import Router from "./router";
import IO from "./io";

const models = Models();
const { logger, morgan } = Loggers();
const passport = Passport({ logger, models });
const router = Router({ models, logger, passport });

const app = initApp({ router, morgan, passport });

const server = http.createServer(app);
IO({ server, models, logger });

server.listen(PORT);

server.on("error", onError);
server.on("listening", onListening);

process.on("unhandledRejection", e => {
  logger.debug("unhandledRejection", e.stack);
  process.exit(1);
});

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.debug(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.debug(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  logger.debug("Listening on " + bind);
}

export default server;
