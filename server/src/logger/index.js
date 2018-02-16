const Morgan = require("morgan");
const Pino = require("pino");

const { LOG_LEVEL = "info", NODE_ENV = "development" } = process.env;

export const logger = new Pino({
  level: LOG_LEVEL,
  prettyPrint: NODE_ENV !== "production",
  base: null
});

export const morgan = Morgan("dev", {
  stream: {
    write(msg) {
      logger.info(msg.trim());
    }
  }
});

export function log(beforeLogger, afterLogger) {
  return function(target, key, desc) {
    const fn = desc.value;

    const value = function() {
      try {
        beforeLogger && beforeLogger(arguments);
        const res = fn.apply(this, arguments);
        afterLogger && afterLogger(null, res, arguments);
      } catch (err) {
        afterLogger && afterLogger(err, null, arguments);
      }
    };

    return {
      ...desc,
      value
    };
  };
}
