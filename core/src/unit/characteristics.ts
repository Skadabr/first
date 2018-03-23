import { taunt, tauntDisabler } from "./effects/availability_effects";
import { UnitTypes } from "../index";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    attack: 1,
    moves: 0,
    effects: []
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    health: 6,
    attack: 2,
    moves: 0,
    effects: [taunt()]
  },

  [UnitTypes.Horse]: {
    type: UnitTypes.Horse,
    name: "Horse",
    cost: 3,
    health: 5,
    attack: 3,
    moves: 0,
    effects: [tauntDisabler()]
  }
};
