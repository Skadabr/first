"use strict";

import * as mongoose from "mongoose";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcryptjs";
import * as uniqueValidator from "mongoose-unique-validator";
import * as jwt from "jsonwebtoken";
import validator, { isEmail, isAlphanumeric } from "validator";

import { UnitTypes, UserStatusType, POSITIONS } from "../constants";

const { JWT_SECRET } = process.env;

const INIT_MONEY = 1;
const INIT_HEALTH = 10;
const MAX_MONEY = 10;

interface User {
  _id: ObjectId;
  socket_id: string;
  name: string;
}

interface Hero {
  health: number;
}

interface Unit {
  type: number;
  health: number;
  position: number;
}

interface Battle {
  turnOwner: ObjectId;
  players: {
    user: User;
    hero: Hero;
    units: Unit[];
    money: number;
    pocket_size: number;
  }[];
}

export default function BattleModel({ logger }) {
  const { Schema } = mongoose;

  const PlayerSchema = new Schema(
    {
      user: {
        _id: {
          type: Schema.ObjectId,
          index: true,
          unique: true,
          required: true
        },
        socket_id: {
          type: String
          //required: true
        },
        name: {
          type: String,
          required: true,
          validate: {
            isAsync: false,
            validator: isAlphanumeric,
            msg: "Invalid name"
          }
        }
      },
      units: [
        {
          type: {
            type: Number,
            enum: [UnitTypes.Pawn, UnitTypes.Officer],
            required: true
          },
          health: {
            type: Number,
            required: true,
            validate: {
              validator: h => h > 0,
              msg: "Health should be bigger than 0"
            }
          },
          position: {
            type: Number,
            required: true,
            validate: {
              validator: val => val > 0 && val < POSITIONS,
              msg: "Position is out of range"
            }
          }
        }
      ],
      hero: {
        health: {
          type: Number,
          validate: {
            isAsync: false,
            validator: h => h >= 0,
            msg: "Health should be bigger than 0"
          }
        }
      },
      money: {
        type: Number,
        validate: {
          validator: h => h >= 0,
          msg: "Money should be bigger than 0"
        }
      },
      pocket_size: {
        type: Number,
        validate: {
          validator: h => h >= 0,
          msg: "Current money should be bigger than 0"
        }
      }
    },
    { _id: false }
  );

  const BattleSchema = new Schema({
    turnOwner: {
      type: Schema.ObjectId,
      required: true
    },
    players: [PlayerSchema]
  });

  Object.assign(BattleSchema.methods, {
    toJSON() {
      const { turnOwner, players } = this;
      return { turnOwner, players };
    }
  });

  Object.assign(BattleSchema.statics, {
    createBattle(user, opponent) {
      const turnOwner = user._id;
      const players = [
        {
          user: {
            _id: user._id,
            socket_id: user.socket_id,
            name: user.name
          },
          units: [],
          hero: {
            health: INIT_HEALTH
          },
          money: INIT_MONEY,
          pocket_size: INIT_MONEY
        },
        {
          user: {
            _id: opponent._id,
            socket_id: opponent.socket_id,
            name: opponent.name
          },
          units: [],
          hero: {
            health: INIT_HEALTH
          },
          money: INIT_MONEY,
          pocket_size: INIT_MONEY
        }
      ];
      return this.create({ turnOwner, players });
    },

    nextTurnOwner() {
      const { turnOwner } = this;
      return this.players.find(p => p.user._id !== turnOwner)._id;
    }
  });

  BattleSchema.plugin(uniqueValidator);

  mongoose.model("Battle", BattleSchema);
}
