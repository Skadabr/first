"use strict";

import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";
import * as uniqueValidator from "mongoose-unique-validator";
import * as jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

import { UserStatusType } from "../../../client/src/constants";
import { log } from "../logger/index";
import { createUserLog } from "../logger/models/user";

const { JWT_SECRET } = process.env;

const INIT_MONEY = 1;
const INIT_HEALTH = 10;
const MAX_MONEY = 10;

export interface UserJSON {
  _id: string;
  name: string;
  email: string;
  socket_id: string;
  status: UserStatusType;
  rate: number;
}

interface Gamer {
  opponent_id: ObjectId;
  turn: boolean;
  money: number;
  current_money: number;
  health: number;
}

export default function UserModel({ logger }) {
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
      required: true
    },
    socket_id: String,
    status: {
      type: Number,
      enum: [UserStatusType.Peace, UserStatusType.Ready, UserStatusType.Fight],
      default: UserStatusType.Peace
    },
    rate: {
      type: Number,
      default: 10,
      required: true,
      min: [0, "Your rate can't be less than 0"]
    }
  });

  Object.assign(schema.methods, {
    toJSON(): UserJSON {
      const { _id, name, email, status, socket_id, rate } = this;
      return { _id: _id.toString(), name, email, status, socket_id, rate };
    },

    async setPassword(password) {
      if (password.length < 8) throw new TypeError("Password to short");
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
      return this.save();
    },

    async onDisconnect() {
      this.socket_id = null;
      await this.save();
    },

    async winFight() {
      this.rate = this.rate + 1;
      return this.updateStatus(UserStatusType.Peace);
    },

    async loseFight() {
      this.rate = this.rate - 1;
      return this.updateStatus(UserStatusType.Peace);
    },

  });

  Object.assign(schema.statics, {
    async createUser({ email, name, password }) {
      const user = new this({ email, name });
      await user.setPassword(password);
      return user.save().then();
    },

    acquireOpponent(user) {
      return this.findOneAndUpdate(
        { status: UserStatusType.Ready, name: { $ne: user.name } },
        { status: UserStatusType.Fight },
        { new: true }
      ).exec();
    },

    getOnlineUsers() {
      return this.find({ socket_id: { $ne: null } }).then(users =>
        users.map(({ name, status }) => ({ name, status }))
      );
    }
  });

  schema.plugin(uniqueValidator);

  mongoose.model("User", schema);
}
