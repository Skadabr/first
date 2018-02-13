"use strict";

import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";
import * as uniqueValidator from "mongoose-unique-validator";
import * as jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

import { StatusKinds } from "../constants";

const { JWT_SECRET } = process.env;

const INIT_MONEY = 1;
const INIT_HEALTH = 10;
const MAX_MONEY = 10;

export interface UserJSON {
  name: string;
  email: string;
  socket_id: string;
  status: StatusKinds;
  rate: number;
}

interface Gamer {
  opponent_id: ObjectId;
  turn: boolean;
  money: number;
  current_money: number;
  health: number;
}

export default function UserModel({logger}) {
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
      enum: [StatusKinds.PEACE, StatusKinds.READY, StatusKinds.FIGHT],
      default: StatusKinds.PEACE
    },
    rate: {
      type: Number,
      default: 10,
      required: true,
      min: [0, "Your rate can't be less than 0"]
    },
    gamer: {
      opponent_id: {
        type: Schema.ObjectId
      },
      turn: Boolean,
      money: {
        type: Number,
        validate: {
          validator: h => h >= 0,
          msg: "Money should be bigger than 0"
        }
      },
      current_money: {
        type: Number,
        validate: {
          validator: h => h >= 0,
          msg: "Current money should be bigger than 0"
        }
      },
      health: {
        type: Number,
        validate: {
          isAsync: false,
          validator: h => h >= 0,
          msg: "Health should be bigger than 0"
        }
      }
    }
  });

  Object.assign(schema.methods, {
    toJSON(): UserJSON {
      const { name, email, status, socket_id, rate } = this;
      return { name, email, status, socket_id, rate };
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

    async initGame(opponent) {
      this.gamer = {
        turn: true,
        opponent_id: opponent._id,
        money: INIT_MONEY,
        current_money: INIT_MONEY,
        health: INIT_HEALTH
      };
      await this.save();
      opponent.gamer = {
        turn: false,
        opponent_id: this._id,
        money: INIT_MONEY,
        current_money: INIT_MONEY,
        health: INIT_HEALTH
      };
      await opponent.save();
    },

    gamerInitData(): {
      name: string;
      gamer: {
        money: number;
        health: number;
      };
    } {
      const { current_money, health, turn } = this.gamer;
      return {
        name: this.name,
        gamer: {
          money: current_money,
          health
        }
      };
    },

    async onDisconnect() {
      this.socket_id = null;
      await this.resetGameData();
    },

    async resetGameData() {
      this.status = StatusKinds.PEACE;
      this.gamer = null;
      await this.save();
      await this.model("Warrior").deleteMany({ owner_id: this._id });
    },

    async winFight() {
      this.rate = this.rate + 1;
      await this.resetGameData();
    },

    async loseFight() {
      this.rate = this.rate - 1;
      await this.resetGameData();
    },

    async increaseMoney() {
      logger.debug(`model:user - increase money for gamer ${this.gamer}`);
      this.gamer.money = this.gamer.money >= MAX_MONEY ? MAX_MONEY : this.gamer.money + 1;
      this.gamer.current_money = this.gamer.money;
      await this.save();
    }

  });

  Object.assign(schema.statics, {
    acquireOpponent(user) {
      return this.findOneAndUpdate(
        { status: StatusKinds.READY, name: { $ne: user.name } },
        { status: StatusKinds.FIGHT },
        { new: true }
      ).exec();
    },

    opponent(user: { gamer: Gamer }) {
      return this.findOne({ _id: user.gamer.opponent_id });
    }
  });

  schema.plugin(uniqueValidator);

  mongoose.model("User", schema);
}
