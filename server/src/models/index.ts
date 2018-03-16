"use strict";

const { MONGO_URL, NODE_ENV = "development" } = process.env;

import user from "./user";
import battle from "./battle";

export default function Mongo(opts) {
  const mongoose = require("mongoose");

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    autoIndex: NODE_ENV !== "production"
  });

  user({ ...opts, mongoose });
  battle({ ...opts, mongoose });

  return mongoose;
}
