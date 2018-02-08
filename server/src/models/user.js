"use strict";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import uniqueValidator from "mongoose-unique-validator";
import jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

export const PEACE = 0;
export const READY = 1;
export const FIGHT = 2;

export const PAWN = 0;
export const OFFICER = 1;

const { JWT_SECRET } = process.env;

export default function UserModel() {
  const { Schema } = mongoose;

  const schema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        isAsync: false,
        validator: isAlphanumeric,
        msg: "Invalid name"
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
      validate: [{ isAsync: false, validator: isEmail, msg: "Invalid email" }]
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
      type: Number,
      enum: [PEACE, READY, FIGHT],
      default: PEACE
    },
    rate: {
      type: Number,
      default: 10,
      required: true,
      min: [0, "Your rate can't be less than 0"]
    },
    game: {
      opponent_id: {
        type: Schema.ObjectId
      },
      turn: Boolean,
      money: {
        type: Number,
        default: 1,
        validate: {
          validator: h => h > 0,
          msg: "Health should be bigger than 0"
        }
      },
      cur_money: Number,
      health: {
        type: Number,
        validate: {
          isAsync: false,
          validator: h => h > 0,
          msg: "Health should be bigger than 0"
        },
        default: 10
      }
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { name, email, status, socket_id, rate } = this;
      return { name, email, status, socket_id, rate };
    },

    async setPassword(password) {
      this._password = password;
      this.password_hash = await bcrypt.hash(password, 8);
    },

    comparePassword(password) {
      return bcrypt.compare(password, this.password_hash);
    },

    generateJWT() {
      const { email, name } = this;
      return jwt.sign({ email, name }, JWT_SECRET);
    },

    updateStatus(status) {
      this.status = status;
      return this.update({ status }).then(() => this);
    },

    async initGame(opponent) {
      await this.update({
        game: {
          turn: true,
          opponent_id: opponent._id
        }
      });
      await opponent.update({
        game: {
          turn: false,
          opponent_id: this._id
        }
      });
    }
  });

  Object.assign(schema.statics, {
    acquireOpponent(user) {
      return this.findOneAndUpdate(
        { status: READY, name: { $ne: user.name } },
        { status: FIGHT },
        { new: true }
      ).exec();
    },

    opponent(user) {
      return this.find({ _id: user.game.opponent_id });
    }
  });

  schema.plugin(uniqueValidator);

  mongoose.model("User", schema);
}
