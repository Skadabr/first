"use strict";

import { ObjectId } from "mongodb";
import uniqueValidator from "mongoose-unique-validator";
import { isEmail, isAlphanumeric } from "validator";

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
    hand: any[];
    money: number;
    pocket_size: number;
  }[];
}

export default function BattleModel({ logger, mongoose }) {
  const Schema = mongoose.Schema;

  const EffectSchema = new Schema(
    {
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
        validate: {
          validator: val => val > 0 && val < POSITIONS,
          msg: "Position is out of range"
        }
      },
      effects: [EffectSchema]
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
        enum: [UnitTypes.Pawn, UnitTypes.Officer],
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
      units: [UnitSchema],
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
    players: [PlayerSchema]
  });

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
      const opponentPlayer =  this.players.find(
        p => p.user._id.toString() !== user_id.toString()
      );
      return this.model("User").findOne({_id: opponentPlayer.user._id});
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
      return new this({ turnOwner, players });
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
