"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { NODE_ENV = "development" } = process.env;

function init({ router, morgan, passport }) {
  const app = (0, _express2.default)();

  if (NODE_ENV === "development") app.use(morgan);
  app.use(_express2.default.static("/app/server/public"));
  app.use(_express2.default.json());
  app.use(_express2.default.urlencoded({ extended: false }));
  app.use(passport.initialize());

  app.use(router);

  return app;
}
