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

var _misc = require("./controllers/misc");

var _misc2 = _interopRequireDefault(_misc);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function setRoutes(opts) {
  const router = new _express.Router();
  const { passport } = opts;

  const userController = (0, _user2.default)(opts);
  const authController = (0, _auth2.default)(opts);
  const miscController = (0, _misc2.default)(opts);

  router.post("/api/users/", userController.create);
  router.post(
    "/api/auth/local",
    passport.authenticate("local"),
    authController.authSuccess,
    authController.authFailure
  );

  //
  // api which require authentication
  //
  router.use("/api", passport.authenticate("jwt"));

  router.get("/api/user", userController.user);

  router.get("*", miscController.index);

  return router;
}
