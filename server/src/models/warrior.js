"use strict";

import mongoose from "mongoose";

export const PAWN = 0;
export const OFFICER = 1;

const { JWT_SECRET } = process.env;

const WarriorSamples = {
  [PAWN]: {
    name: "Pawn",
    health: 6
  },

  [OFFICER]: {
    name: "Officer",
    health: 6
  }
};

export default function WarriorModel() {
  const { Schema } = mongoose;

  const schema = new Schema({
    kind: {
      type: Number,
      enum: [PAWN, OFFICER],
      required: true
    },
    owner_id: {
      type: Schema.ObjectId,
      required: true
    },
    health: {
      type: Number,
      required: true,
      validate: [
        {
          isAsync: false,
          validator: h => h > 0,
          msg: "Health should be bigger than 0"
        }
      ]
    },
    position: {
      type: Number,
      required: true,
      validate: {
        validator: val => val > 0 && val < 13,
        msg: "Position is out of range"
      }
    }
  });

  Object.assign(schema.methods, {
    toJSON() {
      const { _id, kind, health, position } = this;
      return { id: _id, kind, health, position };
    }
  });

  Object.assign(schema.statics, {
    of(owner_id) {
      return this.find({ owner_id });
    },

    createWarrior({ kind, owner_id, position }) {
      const { health } = WarriorSamples[parseInt(kind)];

      console.log({ kind, owner_id, position, health });
      return this.create({ kind, owner_id, position, health });
    }
  });

  mongoose.model("Warrior", schema);
}
