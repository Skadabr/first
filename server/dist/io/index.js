"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function(server, opts) {
  const io = (0, _socket2.default)(server);

  handle(io.of("/game"), _game2.default, opts);
};

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _auth = require("./auth");

var _auth2 = _interopRequireDefault(_auth);

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

//
// ============ helper ============
//

function handle(nsp, handler, opts) {
  const { logger, models } = opts;
  nsp.use((0, _auth2.default)(opts));

  nsp.on("connection", ws => {
    logger.debug(`new ws connection: ${nsp.name}`);
    ws.on("disconnect", async () => {
      logger.debug(`ws connection is closed: ${nsp.name}`);
    });
    handler(ws, opts);
  });
}
