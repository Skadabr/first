"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const schema = new _mongoose2.default.Schema({
    user: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true
    },
    created: {
      type: Date
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { msg, user, created } = this;
      return { msg, user, created };
    }
  });

  _mongoose2.default.model("Message", schema);
};

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require("mongoose-unique-validator");

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { JWT_SECRET } = process.env;