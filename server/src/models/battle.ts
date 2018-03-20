///<reference path="../../node_modules/core/lib/index.d.ts"/>
"use strict";

import { ObjectId } from "mongodb";
import uniqueValidator from "mongoose-unique-validator";
import { isEmail, isAlphanumeric } from "validator";
import { utils } from "core";

import { UnitTypes, POSITIONS } from "core";

const { JWT_SECRET } = process.env;

const INIT_MONEY = 1;
const INIT_HEALTH = 10;
const MAX_MONEY = 10;

interface User {
  _id: ObjectId;
  socket_id: string;
  name: string;
}

interface Unit {
  _id: string;
  owner_id: string;
  type: number;
  hero: boolean;
  health: number;
  buffed_health: number;
  damage: number;
  position: number;
}

interface Effects {
  _id: string;
  owner_id: string;
  type: string;
  payload: any;
}

interface Battle {
  turnOwner: ObjectId;
  players: {
    user: User;
    hand: any[];
    money: number;
    pocket_size: number;
  }[];
  units: Unit[];
  effects: Effects[];
}

export default function BattleModel({ logger, mongoose }) {
  const Schema = mongoose.Schema;

  const EffectSchema = new Schema(
    {
      _id: String,
      owner_id: String,
      type: String
    },
    {
      _id: false,
      strict: false
    }
  );

  const UnitSchema = new Schema(
    {
      _id: String,
      owner_id: Schema.ObjectId,
      hero: Boolean,
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
      buffed_health: {
        type: Number,
        required: true,
        validate: {
          validator: h => h > 0,
          msg: "Buffered Health should be bigger than 0"
        }
      },
      damage: {
        type: Number,
        required: true,
        validate: {
          validator: h => h > 0,
          msg: "Buffered Health should be bigger than 0"
        }
      },
      position: {
        type: Number,
        validate: {
          validator: val => val > 0 && val < POSITIONS,
          msg: "Position is out of range"
        }
      }
    },
    {
      _id: false,
      strict: false
    }
  );

  const CardSchema = new Schema(
    {
      _id: String,
      owner_id: Schema.ObjectId,
      type: {
        type: Number,
        enum: [UnitTypes.Pawn, UnitTypes.Officer, UnitTypes.Horse],
        required: true
      },
      unit: UnitSchema
    },
    {
      _id: false
    }
  );

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
      },
      hand: [CardSchema]
    },
    { _id: false }
  );

  const BattleSchema = new Schema({
    turnOwner: {
      type: Schema.ObjectId,
      required: true
    },
    players: [PlayerSchema],
    units: [UnitSchema],
    effects: [EffectSchema]
  });

  //
  // ========= methods =========
  //

  Object.assign(BattleSchema.methods, {
    toJSON() {
      let { turnOwner, players } = this;
      players = JSON.parse(JSON.stringify(players));
      return { turnOwner: turnOwner.toString(), players };
    },

    findOpponentByUserId(user_id) {
      const user = this.players.find(
        p => p.user._id.toString() === user_id.toString()
      );
      if (!user)
        throw new Error(
          `User with id: ${user_id} doesn't participate in this battle`
        );
      const opponentPlayer = this.players.find(
        p => p.user._id.toString() !== user_id.toString()
      );
      return this.model("User").findOne({ _id: opponentPlayer.user._id });
    },

    nextTurnOwner() {
      const { turnOwner } = this;
      return this.players.find(p => p.user._id !== turnOwner)._id;
    },

    async updateState(battle) {
      Object.assign(this, battle);
      await this.save();
    }
  });

  //
  // ========= static methods =========
  //

  Object.assign(BattleSchema.statics, {
    newBattle(user, opponent) {
      const turnOwner = user._id;
      const players = [
        {
          user: {
            _id: user._id,
            socket_id: user.socket_id,
            name: user.name
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
          money: INIT_MONEY,
          pocket_size: INIT_MONEY
        }
      ];
      const units = [
        {
          _id: utils.generateID(),
          owner_id: user._id,
          health: INIT_HEALTH,
          damage: 1
        },
        {
          _id: utils.generateID(),
          owner_id: opponent._id,
          health: INIT_HEALTH,
          damage: 1
        }
      ];
      const effects = [];
      return new this({ turnOwner, players, units, effects });
    },

    createBattle(user, opponent) {
      return this.newBattle(user, opponent).save();
    },

    findBattleByUserId(user_id) {
      return this.findOne({ "players.user._id": user_id });
    }
  });

  BattleSchema.plugin(uniqueValidator);

  mongoose.model("Battle", BattleSchema);
}
