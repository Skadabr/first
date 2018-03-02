import { increaseMoves, taunt, tauntDisabler } from "./effects";
import { UnitTypes } from "../../constants";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    damage: 1,
    moves: 0,
    availability: 0,
    effects: [increaseMoves(1)]
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    health: 6,
    damage: 2,
    moves: 0,
    availability: 0,
    effects: [taunt()]
  },

  [UnitTypes.Horse]: {
    type: UnitTypes.Horse,
    name: "Horse",
    cost: 3,
    health: 5,
    damage: 3,
    moves: 0,
    availability: 0,
    effects: [tauntDisabler()]
  }
};
