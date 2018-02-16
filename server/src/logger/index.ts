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

export function log(beforeLogger: any, afterLogger: any): any {
  return function(target, key, desc) {
    console.log(target[key], desc);
    const fn = desc.value;

    const value = function(...args) {
      try {
        beforeLogger && beforeLogger(args);
        const res = fn.apply(this, args);
        afterLogger && afterLogger(null, res, args);
      } catch (err) {
        afterLogger && afterLogger(err, null, args);
      }
    };

    return {
      ...desc,
      value
    };
  };
}
