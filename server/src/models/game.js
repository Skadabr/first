"use strict";

import mongoose from "mongoose";

export const PAWN = "PAWN";
export const OFFICER = "OFFICER";

export default function() {
  const schema = new mongoose.Schema({
    challenger: {
      socket_id: String,
      warriors: [
        {
          position: Number,
          health: Number,
          t: {
            type: String,
            enum: [PAWN, OFFICER]
          }
        }
      ]
    },
    challenged: {
      socket_id: String,
      warriors: [
        {
          position: Number,
          health: Number,
          t: {
            type: String,
            enum: [PAWN, OFFICER]
          }
        }
      ]
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { msg, user, created } = this;
      return { msg, user, created };
    }
  });

  Object.assign(schema.statics, {
    async createGame(challenger, challenged) {
      const game = await this.create({
        challenger: {
          socket_id: challenger.socket_id,
          warriors: []
        },
        challenged: {
          socket_id: challenged.socket_id,
          warriors: []
        }
      });
      await challenger.update({ game_id: game.id });
      return challenged.update({ game_id: game.id });
    }
  });

  mongoose.model("Game", schema);
}
