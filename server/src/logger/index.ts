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

export function log(logger: Function, opts?: any): Function {
  const { isAsync = true } = opts || {};
  return function(
    target: Object,
    key: string | symbol,
    desc: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const fn = desc.value;

    let value;
    if (!isAsync) {
      value = function(...args) {
        try {
          const res = fn.apply(this, args);
          logger.call(this, null, res, ...args);
        } catch (err) {
          logger.call(this, err, null, ...args);
          throw err;
        }
      };
    } else {
      value = function(...args) {
        if (fnReceiveCallback(args)) {
          const cb = args.pop();
          args.push((...cbArgs) => {
            logger.call(this, ...cbArgs);
            cb(...cbArgs);
          });
          fn.call(this, ...args);
          return;
        }
        try {
          const res = fn.apply(this, args);

          if (res && isPromise(res)) {
            return res.then(
              res => {
                logger.call(this, null, res, ...args);
                return res;
              },
              err => {
                logger.call(this, err, null, ...args);
                throw err;
              }
            );
          } else {
            logger.call(this, null, res, ...args);
          }
        } catch (err) {
          logger.call(this, err, null, ...args);
          throw err;
        }
      };
    }

    return {
      ...desc,
      value
    };
  };
}

function isPromise(p) {
  return typeof p.then === "function" && typeof p.catch === "function";
}

function fnReceiveCallback(args) {
  return typeof args[args.length - 1] === "function";
}
