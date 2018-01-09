"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRoutes;

var _express = require("express");

var _user = require("./controllers/user");

var _user2 = _interopRequireDefault(_user);

var _auth = require("./controllers/auth");

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function setRoutes(opts) {
  const router = new _express.Router();
  const { passport } = opts;

  const user = (0, _user2.default)(opts);
  const auth = (0, _auth2.default)(opts);

  router.post("/api/users/", user.create);
  router.post(
    "/api/auth/local",
    passport.authenticate("local"),
    auth.authSuccess,
    auth.authFailure
  );

  router.use("/api/user", passport.authenticate("jwt"));

  return router;
}
