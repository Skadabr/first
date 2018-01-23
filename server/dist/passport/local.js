"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function local(User, logger) {
  return new _passportLocal.Strategy(
    { usernameField: "email" },
    async (email, pass, done) => {
      logger.debug("email: %s, password: %s", email, pass);

      const user = await User.findOne({ email }).exec();

      if (!user) {
        return done({ status: 401, message: "Email/Password is wrong" });
      }

      logger.debug(`user ${user.email} is found`);

      const auth = await user.comparePassword(pass);

      if (!auth) {
        return done({ status: 401, message: "Email/Password is wrong" });
      }

      done(null, user);
    }
  );
}
