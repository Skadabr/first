"use strict";

const { MONGO_URL, NODE_ENV = "development" } = process.env;

import user from "./user";
import message from "./message";
import chat_users from "./chat_users";

export default function Mongo() {
  const mongoose = require("mongoose");

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL, {
    useMongoClient: true,
    autoIndex: NODE_ENV === "development"
  });

  user();
  message();
  chat_users();

  return mongoose;
}
