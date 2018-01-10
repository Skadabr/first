"use strict";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

const { JWT_SECRET } = process.env;

export default function() {
  const schema = new mongoose.Schema({
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

  mongoose.model("Message", schema);
}
