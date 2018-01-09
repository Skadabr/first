/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = __webpack_require__(4);

var _http2 = _interopRequireDefault(_http);

var _app = __webpack_require__(5);

var _app2 = _interopRequireDefault(_app);

var _models = __webpack_require__(7);

var _models2 = _interopRequireDefault(_models);

var _logger = __webpack_require__(12);

var _logger2 = _interopRequireDefault(_logger);

var _passport = __webpack_require__(15);

var _passport2 = _interopRequireDefault(_passport);

var _router = __webpack_require__(21);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { PORT = 3000 } = process.env;

const models = (0, _models2.default)();
const { logger, morgan } = (0, _logger2.default)();
const passport = (0, _passport2.default)({ logger, models });
const router = (0, _router2.default)({ models, logger, passport });

const app = (0, _app2.default)({ router, morgan, passport });

const server = _http2.default.createServer(app);

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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _path = __webpack_require__(6);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { NODE_ENV = "development" } = process.env;

function init({ router, morgan, passport }) {
  const app = (0, _express2.default)();

  if (NODE_ENV === "development") app.use(morgan);
  //app.use(express.static(p.join(__dirname, "../client/build")));
  app.use(_express2.default.static("/app/client/build"));
  app.use(_express2.default.json());
  app.use(_express2.default.urlencoded({ extended: false }));
  app.use(passport.initialize());

  app.use(router);

  return app;
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mongo;

var _user = __webpack_require__(8);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { MONGO_URL, NODE_ENV = "development" } = process.env;

function Mongo() {
  const mongoose = __webpack_require__(1);

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    useMongoClient: true,
    autoIndex: NODE_ENV === "development"
  });

  (0, _user2.default)();

  return mongoose;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const schema = new _mongoose2.default.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        isAsync: false,
        validator: _validator.isAlphanumeric,
        msg: "Invalid name"
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
      validate: [{ isAsync: false, validator: _validator.isEmail, msg: "Invalid email" }]
    },
    phash: {
      type: String,
      required: true,
      validate: [function (val) {
        return val && this._password.length > 7;
      }, "Password to short"]
    }
  });

  Object.assign(schema.methods, {
    async setPassword(password) {
      this._password = password;
      this.phash = await _bcryptjs2.default.hash(password, 8);
    },

    generateJWT() {
      const { email, name } = this;
      return _jsonwebtoken2.default.sign({ email, name }, JWT_SECRET);
    }
  });

  schema.plugin(_mongooseUniqueValidator2.default);

  _mongoose2.default.model("User", schema);
};

var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = __webpack_require__(2);

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _mongooseUniqueValidator = __webpack_require__(9);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _jsonwebtoken = __webpack_require__(10);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _validator = __webpack_require__(11);

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { JWT_SECRET } = process.env;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Logger;
const Morgan = __webpack_require__(13);
const Pino = __webpack_require__(14);

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

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("pino");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Passport;

var _local = __webpack_require__(16);

var _local2 = _interopRequireDefault(_local);

var _jwt = __webpack_require__(18);

var _jwt2 = _interopRequireDefault(_jwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passport = __webpack_require__(20);

function Passport({ models, logger }) {
  const User = models.model("User");

  passport.serializeUser((user, cb) => cb(null, user.name));
  passport.deserializeUser((name, cb) => User.findOne({ name }).then(u => cb(null, u)).catch(cb));

  passport.unuse("session");
  passport.use((0, _local2.default)(User, logger));
  passport.use((0, _jwt2.default)(User, logger));

  return passport;
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;

var _passportLocal = __webpack_require__(17);

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _bcryptjs = __webpack_require__(2);

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function local(User, logger) {
  return new _passportLocal.Strategy({ usernameField: "email" }, async (email, pass, done) => {
    logger.debug("email: %s, password: %s", email, pass);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return done({ status: 401, message: "Email/Password is wrong" });
    }

    logger.debug(`user ${user.email} is found`);

    let auth = await _bcryptjs2.default.compare(pass, user.phash);

    if (!auth) {
      return done({ status: 401, message: "Email/Password is wrong" });
    }

    done(null, user);
  });
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Strategy, ExtractJwt } = __webpack_require__(19);
const { JWT_SECRET } = process.env;

module.exports = function jwt(User, logger) {
  return new Strategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, done) => {
    const { email } = payload;
    const user = await User.findOne({ email });

    if (!user) {
      done();
    } else {
      logger.debug("user %s is found", user.email);
      done(null, user);
    }
  });
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRoutes;

var _express = __webpack_require__(0);

var _user = __webpack_require__(22);

var _user2 = _interopRequireDefault(_user);

var _auth = __webpack_require__(23);

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setRoutes(opts) {
  const router = new _express.Router();
  const { passport } = opts;

  const user = (0, _user2.default)(opts);
  const auth = (0, _auth2.default)(opts);

  router.post("/api/users/", user.create);
  router.post("/api/auth/local", passport.authenticate("local"), auth.authSuccess, auth.authFailure);

  router.use("/api/user", passport.authenticate("jwt"));

  return router;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UserController;
function UserController({ logger, models }) {
  const User = models.model("User");

  return {
    async create(req, resp) {
      try {
        const { email, name, password } = req.body;
        const user = new User({ email, name });
        await user.setPassword(password);
        await user.save().then();
        logger.debug(`user ${email} created`, email);
        resp.status(201).send("");
      } catch (err) {
        let message;
        if (err.errors) {
          const key = Object.keys(err.errors)[0];
          message = err.errors[key].message;
        } else {
          message = err.message;
        }
        logger.debug("create user error: ", message);
        resp.status(400).json({ error: { message } });
      }
    }
  };
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function AuthController() {
  return {
    async authSuccess(req, resp) {
      const token = req.user.generateJWT();
      resp.status(200).json({ data: { token } });
    },

    // eslint-disable-next-line
    async authFailure(err, req, resp, _) {
      resp.status(err.status).json({ error: { message: err.message } });
    }
  };
};

/***/ })
/******/ ]);