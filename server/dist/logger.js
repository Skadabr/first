"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Logger;
const Morgan = require("morgan");
const Pino = require("pino");

const { LOG_LEVEL = "info", NODE_ENV = "development" } = process.env;

function Logger() {
  const logger = new Pino({
    level: LOG_LEVEL,
    prettyPrint: NODE_ENV === "development",
    base: null
  });

  const morgan = Morgan("dev", {
    stream: {
      write(msg) {
        logger.info(msg.trim());
      }
    }
  });

  return { logger, morgan };
}
