"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OFFICER = exports.PAWN = exports.FIGHT = exports.READY = exports.PEACE = undefined;

exports.default = function() {
  const { Schema } = _mongoose2.default;

  const schema = new Schema({
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
    password_hash: {
      type: String,
      required: true,
      validate: [
        function(val) {
          return val && this._password.length > 7;
        },
        "Password to short"
      ]
    },
    socket_id: String,
    status: {
      type: String,
      enum: [PEACE, READY, FIGHT],
      default: PEACE
      //game: {
      //  opponent_id: {
      //    type: Schema.ObjectId,
      //    ref: "User"
      //  },
      //  warriors: {
      //    type: [
      //      {
      //        position: Number,
      //        health: Number,
      //        t: {
      //          type: String,
      //          enum: [PAWN, OFFICER]
      //        }
      //      }
      //    ]
      //  }
      //}
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { name, email, status, socket_id } = this;
      return { name, email, status, socket_id };
    },

    async setPassword(password) {
      this._password = password;
      this.password_hash = await _bcryptjs2.default.hash(password, 8);
    },

    comparePassword(password) {
      return _bcryptjs2.default.compare(password, this.password_hash);
    },

    generateJWT() {
      const { email, name } = this;
      return _jsonwebtoken2.default.sign({ email, name }, JWT_SECRET);
    },

    availableForFight() {
      this.status = READY;
      return this.update({ status: READY }).then(() => this);
    },

    readyToFight() {
      this.status = FIGHT;
      return this.update({ status: FIGHT }).then(() => this);
    }

    //async startGame(opponent) {
    //  await this.update({
    //    game: {
    //      opponent_id: opponent._id,
    //      warriors: []
    //    }
    //  });
    //  await opponent.update({
    //    game: {
    //      opponent_id: this._id,
    //      warriors: []
    //    }
    //  });
    //}
  });

  Object.assign(schema.statics, {
    getOpponent(user) {
      return this.findOneAndUpdate(
        { status: READY, name: { $ne: user.name } },
        { status: FIGHT },
        { new: true }
      ).exec();
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

const PEACE = (exports.PEACE = "PEACE");
const READY = (exports.READY = "READY");
const FIGHT = (exports.FIGHT = "FIGHT");

const PAWN = (exports.PAWN = "PAWN");
const OFFICER = (exports.OFFICER = "OFFICER");

const { JWT_SECRET } = process.env;
