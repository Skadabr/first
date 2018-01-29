"use strict";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import uniqueValidator from "mongoose-unique-validator";
import jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

export const PEACE = "PEACE";
export const READY = "READY";
export const FIGHT = "FIGHT";

export const PAWN = "PAWN";
export const OFFICER = "OFFICER";

const { JWT_SECRET } = process.env;

export default function() {
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
      type: String,
      enum: [PEACE, READY, FIGHT],
      default: PEACE
    },
    money: {
      type: Number,
      default: 50,
      required: true,
      min: [0, "You can't have money amount less than 0"]
    }
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
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { name, email, status, socket_id, money } = this;
      return { name, email, status, socket_id, money };
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

  schema.plugin(uniqueValidator);

  mongoose.model("User", schema);
}
