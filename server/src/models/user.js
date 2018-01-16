"use strict";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import uniqueValidator from "mongoose-unique-validator";
import jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

const { JWT_SECRET } = process.env;

export const PEACE = "PEACE";
export const READY = "READY";
export const FIGHT = "FIGHT";

export default function() {
  const schema = new mongoose.Schema({
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
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { name, email, status, socket_id } = this;
      return { name, email, status, socket_id };
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
    }
  });

  schema.plugin(uniqueValidator);

  mongoose.model("User", schema);
}
