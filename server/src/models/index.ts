"use strict";

const { MONGO_URL, NODE_ENV = "development" } = process.env;

import user from "./user";

export default function Mongo(opts) {
  const mongoose = require("mongoose");

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    useMongoClient: true,
    autoIndex: NODE_ENV !== "production"
  });

  user(opts);

  return mongoose;
}
