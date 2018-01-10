"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  const { server, logger } = opts;
  const chat = (0, _socket2.default)(server);

  chat.on("connection", ws => {
    logger.debug("new ws connection");
    ws.on("disconnect", () => {
      logger.debug("ws connection is closed");
    });

    (0, _chat2.default)(ws, opts);
  });
};

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _chat = require("./chat.js");

var _chat2 = _interopRequireDefault(_chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }