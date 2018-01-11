"use strict";

import mongoose from "mongoose";

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
