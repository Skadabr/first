import { increaseMoves } from "./effects";
import { UnitTypes } from "../../constants";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    damage: 1,
    moves: 0,
    effects: [increaseMoves(1)]
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    health: 6,
    damage: 2,
    moves: 0,
    effects: []
  }
};
