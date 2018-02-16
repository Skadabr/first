//"use strict";
//
//import * as mongoose from "mongoose";
//
//import {
//  WarriorKinds,
//  WARRIOR_SAMPLES,
//  MIDDLE_POSITION,
//  MAX_WARRIORS_ON_FIELD
//} from "../constants";
//
//const { JWT_SECRET } = process.env;
//
//export interface WarriorJSON {
//  _id: string;
//  health: number;
//  kind: WarriorKinds;
//  position: number;
//}
//
//export default function WarriorModel({ logger }) {
//  const { Schema } = mongoose;
//
//  const schema = new Schema({
//    kind: {
//      type: Number,
//      enum: [WarriorKinds.PAWN, WarriorKinds.OFFICER],
//      required: true
//    },
//    owner_id: {
//      type: Schema.ObjectId,
//      required: true
//    },
//    health: {
//      type: Number,
//      required: true,
//      validate: [
//        {
//          isAsync: false,
//          validator: h => h > 0,
//          msg: "Health should be bigger than 0"
//        }
//      ]
//    },
//    position: {
//      type: Number,
//      required: true,
//      validate: {
//        validator: val => val > 0 && val < 13,
//        msg: "Position is out of range"
//      }
//    }
//  });
//
//  Object.assign(schema.methods, {
//    toJSON(): WarriorJSON {
//      const { _id, kind, health, position } = this;
//      return { _id, kind, health, position };
//    }
//  });
//
//  Object.assign(schema.statics, {
//    of(owner_id) {
//      return this.find({ owner_id }).then(wrs => wrs.map(w => w.toJSON()));
//    },
//
//    getSample(kind: WarriorKinds) {
//      return WARRIOR_SAMPLES.find(w => w.kind === kind);
//    },
//
//    newWarrior(owner_id, kind: WarriorKinds) {
//      const { health } = this.getSample(kind);
//      return { owner_id, health, kind };
//    },
//
//    async addWarrior(owner_id, kind: WarriorKinds, position: number) {
//      const warriors: WarriorJSON[] = await this.of(owner_id);
//
//      if (warriors.find(w => w.position === position)) {
//        const err = new Error("Position is already occupied") as any;
//        err.reason = "occupied";
//        throw err;
//      }
//
//      const warriorSample = this.newWarrior(owner_id, kind);
//
//      if (warriors.length === 0) {
//        const warrior = await this.create({
//          ...warriorSample,
//          position: MIDDLE_POSITION
//        }).then(w => w.toJSON());
//        warriors.push(warrior);
//        return warriors;
//      }
//
//      if (warriors.length >= MAX_WARRIORS_ON_FIELD) {
//        const err = new Error(
//          "There are too many warriors on positions"
//        ) as any;
//        err.reason = "overflow";
//        throw err;
//      }
//
//      const [newPosition, adjustedWarriors] = adjustWarriors(
//        warriors,
//        warriorSample,
//        position
//      );
//
//      logger.debug(
//        `warrior: - ${this.getSample(kind).name} gonna stay on ${newPosition}`
//      );
//
//      await Promise.all(
//        adjustedWarriors.map(w => {
//          w = { ...w, owner_id };
//          return this.updateOne({ _id: w._id }, w);
//        })
//      );
//
//      const warrior = await this.create({
//        ...warriorSample,
//        position: newPosition,
//        owner_id
//      }).then(w => w.toJSON());
//
//      adjustedWarriors.push(warrior);
//      return adjustedWarriors;
//    },
//
//    async kickWarrior(owner_id, warrior, damage) {
//      logger.debug(`model:warrior - kick warrior with damage = ${damage}, owner_id: ${owner_id}`)
//      warrior.health = warrior.health - damage;
//
//      if (warrior.health > 0) {
//        await this.updateOne({ _id: warrior._id }, { $set: { health: warrior.health } });
//        return false;
//      }
//      this.deleteOne({ _id: warrior._id });
//      const warriors = await this.find({ owner_id }).then();
//      warriors.forEach(async w => {
//        if (w.position > warrior.position) {
//          w.position--;
//          await w.save();
//        } else {
//          w.position++;
//          await w.save();
//        }
//      });
//      return true;
//    }
//  });
//
//  mongoose.model("Warrior", schema);
//}
//
//function adjustWarriors(warriors: WarriorJSON[], warrior, position: number) {
//  if (position > maxPosition(warriors))
//    return adjust(shiftWarriorsToLeft, wrs => maxPosition(wrs) + 2);
//
//  if (position < minPosition(warriors))
//    return adjust(shiftWarriorsToRight, wrs => minPosition(wrs) - 2);
//
//  return adjust(w => separateWarriors(w, position), () => position);
//
//  function adjust(move, calcPos) {
//    warriors = warriors.map(move);
//    return [calcPos(warriors), warriors];
//  }
//
//  function maxPosition(wrs) {
//    return Math.max(...wrs.map(w => w.position));
//  }
//
//  function minPosition(wrs) {
//    return Math.min(...wrs.map(w => w.position));
//  }
//
//  function shiftWarriorsToLeft(w) {
//    return { ...w, position: w.position - 1 };
//  }
//
//  function shiftWarriorsToRight(w) {
//    return { ...w, position: w.position + 1 };
//  }
//
//  function separateWarriors(w, pivot) {
//    return w.position < pivot
//      ? { ...w, position: w.position - 1 }
//      : { ...w, position: w.position + 1 };
//  }
//}
