"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mongo;

var _user = require("./user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { MONGO_URL, NODE_ENV = "development" } = process.env;

function Mongo() {
  const mongoose = require("mongoose");

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    useMongoClient: true,
    autoIndex: NODE_ENV === "development"
  });

  (0, _user2.default)();

  return mongoose;
}
