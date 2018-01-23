"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Passport;

var _local = require("./local");

var _local2 = _interopRequireDefault(_local);

var _jwt = require("./jwt");

var _jwt2 = _interopRequireDefault(_jwt);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const passport = require("passport");

function Passport({ models, logger }) {
  const User = models.model("User");

  passport.serializeUser((user, cb) => cb(null, user.name));
  passport.deserializeUser((name, cb) =>
    User.findOne({ name })
      .then(u => cb(null, u))
      .catch(cb)
  );

  passport.unuse("session");
  passport.use((0, _local2.default)(User, logger));
  passport.use((0, _jwt2.default)(User, logger));

  return passport;
}
