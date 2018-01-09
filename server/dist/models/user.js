"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function() {
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
      validate: [
        { isAsync: false, validator: _validator.isEmail, msg: "Invalid email" }
      ]
    },
    phash: {
      type: String,
      required: true,
      validate: [
        function(val) {
          return val && this._password.length > 7;
        },
        "Password to short"
      ]
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

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _mongooseUniqueValidator = require("mongoose-unique-validator");

var _mongooseUniqueValidator2 = _interopRequireDefault(
  _mongooseUniqueValidator
);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _validator = require("validator");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const { JWT_SECRET } = process.env;
