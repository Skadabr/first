"use strict";

import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export default function() {
  const schema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    }
  });

  schema.plugin(uniqueValidator);

  mongoose.model("ChatUsers", schema);
}
