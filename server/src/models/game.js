"use strict";

import mongoose from "mongoose";

export const PAWN = "PAWN";
export const OFFICER = "OFFICER";

export default function() {
  const schema = new mongoose.Schema({
    challenger: {
      id: mongoose.Schema.Types.ObjectId,
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
    snd: {
      id: {
        type: mongoose.Schema.Types.ObjectId
      },
      warriors: [
        {
          position: Number,
          health: Number
        }
      ]
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { msg, user, created } = this;
      return { msg, user, created };
    },

    addWarrior() {}
  });

  mongoose.model("Message", schema);
}
