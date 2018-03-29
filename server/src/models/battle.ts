///<reference path="../../nodeModules/core/lib/index.d.ts"/>
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
  socketId: string;
  name: string;
}

interface Unit {
  _id: string;
  ownerId: string;
  type: number;
  hero: boolean;
  health: number;
  buffedHealth: number;
  attack: number;
  position: number;
}

interface Effects {
  _id: string;
  ownerId: string;
  type: string;
  payload: any;
}

interface Battle {
  turnOwner: ObjectId;
  players: {
    user: User;
    hand: any[];
    money: number;
    pocketSize: number;
  }[];
  units: Unit[];
  effects: Effects[];
}

export default function BattleModel({ logger, mongoose }) {
  const Schema = mongoose.Schema;

  const EffectSchema = getEffectSchema(Schema);
  const UnitSchema = getUnitSchema(Schema, EffectSchema);
  const CardSchema = getCardSchema(Schema, UnitSchema);
  const PlayerSchema = getPlayerSchema(Schema, CardSchema)

  const BattleSchema = new Schema({
    turnOwner: {
      type: Schema.ObjectId,
      required: true
    },
    players: [PlayerSchema],
    units: [UnitSchema],
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

    findEnemyByUserId(userId) {
      checkIfUserIdIsCorrect(this, userId);

      const opponentPlayer = this.players.find(
        p => p.user._id.toString() !== userId.toString()
      );
      return this.model("User").findOne({ _id: opponentPlayer.user._id });

      // === where ===

      function checkIfUserIdIsCorrect(battleModel, userId) {
        const user = this.players.find(
          p => p.user._id.toString() === userId.toString()
        );
        if (!user)
          throw new Error(
            `User with id: ${userId} doesn't participate in this battle`
          );
      }
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
            socketId: user.socketId,
            name: user.name
          },
          money: INIT_MONEY,
          pocketSize: INIT_MONEY
        },
        {
          user: {
            _id: opponent._id,
            socketId: opponent.socketId,
            name: opponent.name
          },
          money: INIT_MONEY,
          pocketSize: INIT_MONEY
        }
      ];
      const units = [
        {
          _id: utils.generateID(),
          ownerId: user._id,
          health: INIT_HEALTH,
          attack: 1
        },
        {
          _id: utils.generateID(),
          ownerId: opponent._id,
          health: INIT_HEALTH,
          attack: 1
        }
      ];
      const effects = [];
      return new this({ turnOwner, players, units, effects });
    },

    createBattle(user, opponent) {
      return this.newBattle(user, opponent).save();
    },

    findBattleByUserId(userId) {
      return this.findOne({ "players.user._id": userId });
    }
  });

  BattleSchema.plugin(uniqueValidator);

  mongoose.model("Battle", BattleSchema);
}

function getEffectSchema(Schema) {
  return new Schema(
    {
      _id: String,
      ownerId: String,
      type: String
    },
    {
      _id: false,
      strict: false
    }
  );
}

function getUnitSchema(Schema, EffectSchema) {
  return new Schema(
    {
      _id: String,
      ownerId: Schema.ObjectId,
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
      attack: {
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
      },
      effects: [EffectSchema],
      counterEffects: [EffectSchema],
    },
    {
      _id: false,
      strict: false
    }
  );
}

function getCardSchema(Schema, UnitSchema) {
  return new Schema(
    {
      _id: String,
      ownerId: Schema.ObjectId,
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
}

function getPlayerSchema(Schema, CardSchema) {
  return new Schema(
    {
      user: {
        _id: {
          type: Schema.ObjectId,
          index: true,
          unique: true,
          required: true
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
      pocketSize: {
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
}
