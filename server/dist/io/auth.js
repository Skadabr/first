"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authIO;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { JWT_SECRET } = process.env;

const OPPONENT_UPSERT = "OPPONENT_UPSERT";

const ESCAPE_AUTH = ["OPPONENTS_LIST"];

function authIO({ logger, models }) {
  const User = models.model("User");

  return async (ws, next) => {
    try {
      const { id, handshake } = ws;
      const { name } = _jsonwebtoken2.default.verify(
        handshake.query.token,
        JWT_SECRET
      );
      const user = await User.findOneAndUpdate({ name }, { socket_id: id });
      logger.debug(
        `authenticate new ws connection(${
          ws.nsp.name
        }). User "${name}" is coming`
      );
      ws.use(async ([event_name], next) => {
        if (ESCAPE_AUTH.includes(event_name)) return next();
        try {
          ws.user = await User.findOne({ name, socket_id: id });
          logger.debug(`ws user("${name}") is authenticated`);
          next();
        } catch (err) {
          next(err);
        }
      });
      ws.broadcast.emit(OPPONENT_UPSERT, {
        name: user.name,
        status: user.status
      });
      next();
    } catch (err) {
      logger.error(`fail to authenticate new ws connection: ${err.message}`);
      next(err);
    }
  };
}
