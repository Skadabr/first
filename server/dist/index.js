"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

var _passport = require("./passport");

var _passport2 = _interopRequireDefault(_passport);

var _router = require("./router");

var _router2 = _interopRequireDefault(_router);

var _io = require("./io");

var _io2 = _interopRequireDefault(_io);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { PORT = 3000 } = process.env;

const models = (0, _models2.default)();
const { logger, morgan } = (0, _logger2.default)();
const passport = (0, _passport2.default)({ logger, models });
const router = (0, _router2.default)({ models, logger, passport });

const app = (0, _app2.default)({ router, morgan, passport });

const server = _http2.default.createServer(app);
(0, _io2.default)(server, { models, logger });

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

exports.default = server;
