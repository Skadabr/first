"use strict";

import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";
import uniqueValidator from "mongoose-unique-validator";
import * as jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

import { UserStatusType } from "core";
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
  socketId: string;
  status: UserStatusType;
  rate: number;
}

export default function UserModel({ logger, mongoose }) {
  const { Schema } = mongoose;

  const UserSchema = getUserSchema(Schema);

  Object.assign(UserSchema.methods, {
    toJSON(): UserJSON {
      const { _id, name, email, status, socketId, rate } = this;
      return { _id: _id.toString(), name, email, status, socketId, rate };
    },

    async setPassword(password) {
      if (password.length < 8) throw new TypeError("Password to short");
      this.passwordHash = await bcrypt.hash(password, 8);
    },

    comparePassword(password) {
      return bcrypt.compare(password, this.passwordHash);
    },

    generateJWT(): string {
      const { email, name } = this;
      return jwt.sign({ email, name }, JWT_SECRET);
    },

    updateStatus(status) {
      this.status = status;
      return this.save();
    },

    async onDisconnect() {
      this.socketId = null;
      await this.save();
    },

    async winFight() {
      this.rate = this.rate + 1;
      return this.updateStatus(UserStatusType.Peace);
    },

    async loseFight() {
      this.rate = this.rate - 1;
      return this.updateStatus(UserStatusType.Peace);
    }
  });

  Object.assign(UserSchema.statics, {
    async createUser({ email, name, password }) {
      const user = new this({ email, name });
      await user.setPassword(password);
      return user.save().then();
    },

    acquireEnemy(user) {
      return this.findOneAndUpdate(
        { status: UserStatusType.Ready, name: { $ne: user.name } },
        { status: UserStatusType.Fight },
        { new: true }
      ).exec();
    },

    getOnlineUsers() {
      return this.find({ socketId: { $ne: null } }).then(users =>
        users.map(({ name, status }) => ({ name, status }))
      );
    }
  });

  UserSchema.plugin(uniqueValidator);

  mongoose.model("User", UserSchema);
}

function getUserSchema(Schema) {
  return Schema({
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
    passwordHash: {
      type: String,
      required: true
    },
    socketId: String,
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
  } as any);
}
